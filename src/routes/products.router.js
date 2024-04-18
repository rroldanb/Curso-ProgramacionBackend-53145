// import { ProductsManager } from "../ProductsManager.js";
const path = require("path");
const ProductsManager = require("../services/ProductsManager.js");
const productsPath = path.join(__dirname, "..", "data", "productos.json");

const productsManager = new ProductsManager(productsPath);

const { Router } = require("express");

const router = Router();


router.get("/", async (req, res) => {
  try {
    const limit = req.query.limit ? parseInt(req.query.limit) : undefined;
    if (limit && (!Number.isInteger(limit) || limit <= 0)) {
      return res.status(400).json({
        error: 'El parámetro "limit" debe ser un número entero positivo',
      });
    }
    let productos = await productsManager.getProducts();
    if (limit !== undefined) {
      productos = productos.slice(0, limit);
    }
    res.json(productos);
    // res.send({status:"success", payload: productos});
  } catch (error) {
    res.status(500).json({ error: "Error al obtener los productos" });
  }
});

router.get("/:pid", async (req, res) => {
  const { pid } = req.params;
  try {
    const producto = await productsManager.getProductById(parseInt(pid));
    if (producto) {
      res.json(producto);
      // res.send({status: 'success', payload: producto})

    } else {
      res.status(404).json({ error: `Producto con ID ${pid} no encontrado` });
    }
  } catch (error) {
    res.status(500).json({ error: "Error al obtener el producto" });
  }
});



router.post("/", async (req, res) => {
  const io = req.io; // Acceder al objeto io adjuntado a la solicitud
//io.emit('addProduct', { product: nuevoProducto }); // Emitir evento 'addProduct' a través de Socket.IO

// const io = require('socket.io')(server); // 'server' es tu instancia de servidor de Express

io.on('connection', (socket) => {
  console.log('Un cliente se ha conectado');
  io.on('addProduct', data =>{
    console.log(data)
  })

socket.emit('serverLoadProducts', products)
  // socket.on('addProduct', async ({ product }) => {
  //   try {
  //     await productsManager.addProduct(product);
  //     console.log('Producto agregado:', product);
  //   } catch (error) {
  //     console.error('Error al agregar el producto:', error);
  //   }
  // });
});
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
    if (await productsManager.addProduct(nuevoProducto)) {
      console.log("Error: El código del producto ya existe");
      return res
        .status(400)
        .json({ error: "El código del producto ya existe" });
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
      const invalidThumbnails = thumbnailsArray.filter(
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

 

    await productsManager.addProduct(nuevoProducto);



    res.status(201).json({ mensaje: "Producto agregado correctamente" });
  } catch (error) {
    console.error("Error al agregar el producto:", error);
    res.status(500).json({ error: "Error al agregar el producto" });
  }
});



router.put("/:pid", async (req, res) => {
  // console.log(req.body)



  const updatedFields = req.body;
  try {
    const pid = parseInt(req.params.pid);
    const updateable = await productsManager.updateProduct(pid);

    //  VALIDACIONES
    //  PID EXISTE
    if (!updateable) {
      console.log("No existe un producto con id:", pid);
      return res
        .status(400)
        .json({ error: `No existe un producto con id: ${pid}` });
    }

    // EXISTE CODE
    existeCode = await productsManager.validaCode(updatedFields.code);
    if (existeCode) {
      console.log(
        `El código '${updatedFields.code}' ya existe y no se actualizará.`
      );
      delete updatedFields.code;
    }

    // THUMBNAILS
    //   let thumbnailsArray = [];
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

    // DEFAULT STATUS
    if (typeof updatedFields.status !== "boolean") {
      updatedFields.status = true;
    }

    // VALORES NUMERICOS
    if (isNaN(updatedFields.price)) {
      console.log("El valor del campo price debe ser numérico");
      console.log("El campo 'price' no se actualizará");
      delete updatedFields.price;
    }

    if (isNaN(updatedFields.stock)) {
      console.log("El valor del campo stock debe ser numérico");
      console.log("El campo 'stock' no se actualizará");
      delete updatedFields.stock;
    }

    // FILTRA CAMPOS VALIDOS
    const product = await productsManager.getProductById(pid);
    for (const key in updatedFields) {
      if (
        Object.hasOwnProperty.call(updatedFields, key) &&
        key != "id" &&
        // && (key != "code")
        product.hasOwnProperty(key)
      ) {
        product[key] = updatedFields[key];
      } else {
        console.log(
          `La propiedad '${key}' no es una propiedad válida y no se actualizará.`
        );
      }
    }

    await productsManager.updateProduct(pid, product);

    console.log("Se actualizó el producto con id:", pid);
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
    const pid = parseInt(req.params.pid);
    const deleted = await productsManager.deleteProduct(pid);
    if (!deleted) {
      console.log("No existe un producto con id:", pid);
      return res
        .status(400)
        .json({ error: `No existe un producto con id: ${pid}` });
    }

    console.log("Se eliminó el producto con id:", pid);
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
