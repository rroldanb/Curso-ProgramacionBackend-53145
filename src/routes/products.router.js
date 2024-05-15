const ProductsManager = require("../dao/ProductsMongo.manager.js");
const productsManager = new ProductsManager();

const { Router } = require("express");
const router = Router();

function generatePaginationLinks(pagLinksParams) {
  let {urlParam, totalPages, nextPage, prevPage, hasNextPage, hasPrevPage}=pagLinksParams
  let currentUrl = urlParam;
  let prevLink, nextLink, firstLink, lastLink;
  let urlBase = currentUrl;
  if (currentUrl.includes("?")) {
      const partesUrl = currentUrl.split("?");
      urlBase = partesUrl[0];
      const parametros = partesUrl[1];
      const paresParametros = parametros.split("&");

      if (nextPage !== null) {
          const nuevosParametros = paresParametros.map(par => {
              const [clave, valor] = par.split("="); 
              if (clave === "numPage") {
                  return `${clave}=${nextPage}`;
              }
              return par;
          });
          nextLink = urlBase + "?" + nuevosParametros.join("&");
      } else {
          nextLink = null;
      }

      if (prevPage !== null) {
          const nuevosParametros = paresParametros.map(par => {
              const [clave, valor] = par.split("="); 
              if (clave === "numPage") {
                  return `${clave}=${prevPage}`;
              }
              return par;
          });
          prevLink = urlBase + "?" + nuevosParametros.join("&");
      } else {
          prevLink = null;
      }

      const primerosParametros = paresParametros.filter(par => !par.startsWith("numPage="));
      firstLink = urlBase + "?numPage=1&" + primerosParametros.join("&");

      const ultimosParametros = paresParametros.filter(par => !par.startsWith("numPage="));
      lastLink = urlBase + "?numPage=" + totalPages + "&" + ultimosParametros.join("&");
  }

  if (
      nextLink === undefined ||
      prevLink === undefined ||
      firstLink === undefined ||
      lastLink === undefined
  ) {
      nextLink = hasNextPage ? urlBase + "?numPage=" + nextPage : null;
      prevLink = hasPrevPage ? urlBase + "?numPage=" + prevPage : null;
      firstLink = urlBase + "?numPage=1";
      lastLink = urlBase + "?numPage=" + totalPages;
      // urlBase=urlBase
  }

  return { nextLink, prevLink, firstLink, lastLink, urlBase };
}

router.get("/oldget", async (req, res) => {
  let products;
  try {
    const limit = req.query.limit ? parseInt(req.query.limit) : undefined;
    if (limit && (!Number.isInteger(limit) || limit <= 0)) {
      return res.status(400).json({
        error: 'El parámetro "limit" debe ser un número entero positivo',
      });
    }

    if (limit !== undefined) {
      products = await productsManager.getProducts(limit);
    } else {
      products = await productsManager.getProducts();
    }
    // res.json(products);
    res.send({status:"success", payload: products});
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error al obtener los productos" });
  }
});

router.get("/", async (req, res) => {

  let {numPage=1, limit = 10, category = null, 
    availableOnly = null, orderByPrice = null } = req.query;
  
    availableOnly = availableOnly?availableOnly === 'true':null
    numPage = parseInt(numPage);
    limitParam = parseInt(limit);
    let categoryParam = category
    orderByPrice
    let orderBy = null
    if (orderByPrice === "asc"){orderBy=1}else{if (orderByPrice==="desc"){orderBy=-1}}

 console.log("numPage aca", numPage)
  console.log("limit aca", limit)
  console.log("limitParam aca", limitParam)
  console.log('categoryParam:', categoryParam);
  console.log('availableOnly:', typeof(availableOnly));
  console.log('orderBy:', orderBy);


  const findParams = {
    categoryParam,availableOnly, 
        limitParam, numPage, orderBy
  }
  


  try {
  
      const {docs, page, hasPrevPage, hasNextPage, prevPage, 
        nextPage, totalPages, totalDocs} = 
      await productsManager.getProducts(findParams);
  

  const urlParam="http://localhost:8080/api/products"

  const pagLinksParams = {urlParam, totalPages, nextPage, prevPage, hasNextPage, hasPrevPage}
  
  const { nextLink, prevLink } = 
  generatePaginationLinks(pagLinksParams);
  
res.send  ({status:"success", payload:docs, totalPages, prevPage, 
nextPage, page, hasPrevPage, hasNextPage, nextLink, prevLink, totalDocs })



  // res.send({response});
  
      
     
    } catch (error) {
      console.log(error)
      res.status(500).json({ error: "Error al obtener los productos" });
    }
  });


router.get("/:pid", async (req, res) => {
  const { pid } = req.params;
  try {
    const producto = await productsManager.getProductById(pid);
    if (producto) {
      res.json(producto);
      // res.send({status: 'success', payload: producto})
    } else {
      res.status(404).json({ error: `Producto con ID ${pid} no encontrado` });
    }
  } catch (error) {
    console.log(error);
    res
      .status(400)
      .json({ error: "Error al obtener el producto, pid no válido" });
  }
});

router.post("/", async (req, res) => {
  try {
    const nuevoProducto = req.body;
    //  VALIDACIONES
    // CAMPOS
    const camposObligatorios = [
      "title",
      "description",
      "code",
      "price",
      "stock",
      "category",
    ];
    for (const campo of camposObligatorios) {
      if (!nuevoProducto[campo]) {
        return res
          .status(400)
          .json({ error: `El campo '${campo}' es obligatorio` });
      }
    }
    // VALORES NUMERICOS
    if (isNaN(nuevoProducto.price)) {
      return res
        .status(400)
        .json({ error: `El campo price debe ser numérico` });
    }

    if (isNaN(nuevoProducto.stock)) {
      return res
        .status(400)
        .json({ error: `El campo stock debe ser numérico` });
    }

    // PRODUCT CODE
    if (await productsManager.validaCode(nuevoProducto.code)) {
      console.log(
        `Error: El código del producto ${nuevoProducto.code} ya existe`
      );
      return res
        .status(400)
        .json({
          error: `El código del producto ${nuevoProducto.code} ya existe`,
        });
    }

    // THUMBNAILS
    if (!nuevoProducto.thumbnails) {
      nuevoProducto.thumbnails = [];
    } else if (typeof nuevoProducto.thumbnails === "string") {
      nuevoProducto.thumbnails = [nuevoProducto.thumbnails];
    } else if (!Array.isArray(nuevoProducto.thumbnails)) {
      return res.status(400).json({
        error: "El campo 'thumbnails' debe ser un string o un array de strings",
      });
    } else {
      const invalidThumbnails = nuevoProducto.thumbnails.filter(
        (thumbnail) => typeof thumbnail !== "string"
      );
      if (invalidThumbnails.length > 0) {
        return res.status(400).json({
          error:
            "Algunos elementos de 'thumbnails' no son cadenas de texto válidas.",
        });
      }
    }

    // DEFAULT STATUS
    if (typeof nuevoProducto.status !== "boolean") {
      nuevoProducto.status = true;
    }

    //  FIN VALIDACIONES

    const lastProductId = await productsManager.addProduct(nuevoProducto);
    const stringLastID = lastProductId._id.toString()
      console.log("Se agregó el producto con id: ",stringLastID );
      req.io.emit("Server:addProduct", { ...nuevoProducto, _id: stringLastID });


    res.status(201).json({ mensaje: "Producto agregado correctamente" });
  } catch (error) {
    let mensaje = error.errmsg;
    console.error("Error al agregar el producto:", mensaje);
    res.status(400).json({ error: "Error al agregar el producto", mensaje });
  }
});

router.put("/:pid", async (req, res) => {
  const pid = req.params.pid;
  const updatedFields = req.body;
  try {
    const updateable = await productsManager.validaId(pid);
    //  VALIDACIONES
    //  PID EXISTE
    if (!updateable) {
      console.log("No existe un producto con id:", pid);
      return res
        .status(400)
        .json({ error: `No existe un producto con id: ${pid}` });
    }

    // EXISTE CODE
    if (!!updatedFields.code){
      existeCode = await productsManager.validaCode(updatedFields.code);
      if (existeCode) {
        console.log(
          `El código '${updatedFields.code}' ya existe y no se actualizará.`
        );
        delete updatedFields.code;
      }
    }

    // THUMBNAILS

    if (!!updatedFields.thumbnails){

      if (typeof updatedFields.thumbnails === "string") {
        updatedFields.thumbnails = [updatedFields.thumbnails];
      } else if (!Array.isArray(updatedFields.thumbnails)) {
        console.log(
          "El campo 'thumbnails' debe ser un string o un array de strings"
        );
        console.log("El campo 'thumbnails' no se actualizará");
        delete updatedFields.thumbnails;
      } else {
        const invalidThumbnails = updatedFields.thumbnails.filter(
          (thumbnail) => typeof thumbnail !== "string"
        );
        if (invalidThumbnails.length > 0) {
          console.log(
            "Algunos elementos de 'thumbnails' no son cadenas de texto válidas."
          );
          console.log("El campo 'thumbnails' no se actualizará");
          delete updatedFields.thumbnails;
        }
      }
    }

    // DEFAULT STATUS
    if (!!updatedFields.status && typeof updatedFields.status !== "boolean") {
      updatedFields.status = true;
    }

    // VALORES NUMERICOS
    if (!!updatedFields.price && isNaN(updatedFields.price)) {
      console.log("El valor del campo price debe ser numérico");
      console.log("El campo 'price' no se actualizará");
      delete updatedFields.price;
    }

    if (!!updatedFields.stock && isNaN(updatedFields.stock)) {
      console.log("El valor del campo stock debe ser numérico");
      console.log("El campo 'stock' no se actualizará");
      delete updatedFields.stock;
    }

    // FILTRA CAMPOS VALIDOS
    let product = await productsManager.getProductById(pid);
    const docKeys = Object.keys(product._doc);
    let updatedProduct = {}
    for (const key in updatedFields) {
      if (
        Object.hasOwnProperty.call(updatedFields, key) &&
        key != "_id" &&
        // && (key != "code")
        docKeys.includes(key)
      ) {
        updatedProduct[key] = updatedFields[key];
      } else {
        console.log(
          `La propiedad '${key}' no es una propiedad válida y no se actualizará.`
        );
      }
    }

    await productsManager.updateProduct(pid, updatedProduct);
    product = await productsManager.getProductById(pid)
    req.io.emit("Server:productUpdate", product);
    res
      .status(200)
      .json({ mensaje: `Producto con ID ${pid} actualizado correctamente` });
  } catch (error) {
    console.error("Error al actualizar el producto:", error);
    res.status(500).json({ error: "Error al actualizar el producto" });
  }
});

router.delete("/:pid", async (req, res) => {
  try {
    const pid = req.params.pid;
    const existeId = await productsManager.validaId(pid);
    if (!existeId) {
      console.log("No existe un producto con id:", pid);
      return res
        .status(400)
        .json({ error: `No existe un producto con id: ${pid}` });
    }

    await productsManager.deleteProduct(pid);

    console.log("Se eliminó el producto con id:", pid);

    let products = await productsManager.getProducts();
    req.io.emit("Server:loadProducts", products);
    res
      .status(200)
      .json({ mensaje: `Producto con ID ${pid} eliminado correctamente` });
  } catch (error) {
    console.error("Error al eliminar el producto:", error);
    res.status(500).json({ error: "Error al eliminar el producto" });
  }
});

module.exports = {
  router,
};
