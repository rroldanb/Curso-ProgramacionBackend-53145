const  {ProductsService}  = require("../services/index");
// const ProductsService = require("../services/productsService");
const CustomError = require("../utils/errors/CustomErrors");
const { generateProductsErrorInfo } = require("../utils/errors/info");
const EErrors = require("../utils/errors/enums");

function generatePaginationLinks(pagLinksParams) {
  let { urlParam, totalPages, nextPage, prevPage, hasNextPage, hasPrevPage } =
    pagLinksParams;
  let currentUrl = urlParam;
  let prevLink, nextLink, firstLink, lastLink;
  let urlBase = currentUrl;

  if (currentUrl.includes("?")) {
    const partesUrl = currentUrl.split("?");
    urlBase = partesUrl[0];
    const parametros = partesUrl[1];
    const paresParametros = parametros.split("&");

    if (nextPage !== null) {
      const nuevosParametros = paresParametros.map((par) => {
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
      const nuevosParametros = paresParametros.map((par) => {
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

    const primerosParametros = paresParametros.filter(
      (par) => !par.startsWith("numPage=")
    );
    firstLink = urlBase + "?numPage=1&" + primerosParametros.join("&");

    const ultimosParametros = paresParametros.filter(
      (par) => !par.startsWith("numPage=")
    );
    lastLink =
      urlBase + "?numPage=" + totalPages + "&" + ultimosParametros.join("&");
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

class ProductsController {
  constructor() {
    this.productsService =  ProductsService;
  }

  getProducts = async (req, res) => {
    let {
      numPage = 1,
      limit = 10,
      category = null,
      availableOnly = null,
      orderByPrice = null,
      urlParam = "/",
    } = req;

    availableOnly = availableOnly ? availableOnly === "true" : null;
    numPage = parseInt(numPage);
    limit = parseInt(limit);
    let orderBy = null;
    if (orderByPrice === "asc") {
      orderBy = 1;
    } else if (orderByPrice === "desc") {
      orderBy = -1;
    }

    const filter = {};
    if (category) filter.category = category;
    if (typeof availableOnly === "boolean") filter.status = availableOnly;

    const options = {
      limit,
      page: numPage,
      lean: true,
      sort: orderBy ? { price: orderBy } : {},
    };

    try {
      const result = await this.productsService.getProducts(filter, options);
      // const urlParam = req.originalUrl;

      const pagLinksParams = {
        urlParam,
        totalPages: result.totalPages,
        nextPage: result.nextPage,
        prevPage: result.prevPage,
        hasNextPage: result.hasNextPage,
        hasPrevPage: result.hasPrevPage,
      };
      const { nextLink, prevLink } = generatePaginationLinks(pagLinksParams);

      res.send({
        status: "success",
        payload: result.docs,
        totalPages: result.totalPages,
        prevPage: result.prevPage,
        nextPage: result.nextPage,
        page: result.page,
        hasPrevPage: result.hasPrevPage,
        hasNextPage: result.hasNextPage,
        nextLink,
        prevLink,
        totalDocs: result.totalDocs,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "Error al obtener los productos" });
    }
  };

  getProduct = async (req, res) => {
    const { pid } = req.params;
    try {
      const producto = await this.productsService.getProductById(pid);
      if (producto) {
        res.json(producto);
      } else {
        res.status(404).json({ error: `Producto con ID ${pid} no encontrado` });
      }
    } catch (error) {
      console.log(error);
      res
        .status(400)
        .json({ error: "Error al obtener el producto, pid no válido" });
    }
  };

  createProduct = async (req, res, next) => {
    try {
        const nuevoProducto = req.body;
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
                CustomError.createError({
                    name: "MissingFieldsError",
                    cause: `El campo '${campo}' es obligatorio`,
                    message: "Faltan campos obligatorios",
                    code: EErrors.INVALID_TYPES_ERROR,
                });
            }
        }

        if (isNaN(nuevoProducto.price)) {
            CustomError.createError({
                name: "InvalidTypeError",
                cause: `El campo price debe ser numérico, pero se recibió ${nuevoProducto.price}`,
                message: "Tipo de dato incorrecto para el campo price",
                code: EErrors.INVALID_TYPES_ERROR,
            });
        }

        if (isNaN(nuevoProducto.stock)) {
            CustomError.createError({
                name: "InvalidTypeError",
                cause: `El campo stock debe ser numérico, pero se recibió ${nuevoProducto.stock}`,
                message: "Tipo de dato incorrecto para el campo stock",
                code: EErrors.INVALID_TYPES_ERROR,
            });
        }

        if (await this.productsService.validateCode(nuevoProducto.code)) {
            CustomError.createError({
                name: "DuplicateCodeError",
                cause: `El código del producto ${nuevoProducto.code} ya existe`,
                message: "Código de producto duplicado",
                code: EErrors.INVALID_TYPES_ERROR,
            });
        }

        if (!nuevoProducto.thumbnails) {
            nuevoProducto.thumbnails = [];
        } else if (typeof nuevoProducto.thumbnails === "string") {
            nuevoProducto.thumbnails = [nuevoProducto.thumbnails];
        } else if (!Array.isArray(nuevoProducto.thumbnails)) {
            CustomError.createError({
                name: "InvalidTypeError",
                cause: "El campo 'thumbnails' debe ser un string o un array de strings",
                message: "Tipo de dato incorrecto para el campo thumbnails",
                code: EErrors.INVALID_TYPES_ERROR,
            });
        } else {
            const invalidThumbnails = nuevoProducto.thumbnails.filter(
                (thumbnail) => typeof thumbnail !== "string"
            );
            if (invalidThumbnails.length > 0) {
                CustomError.createError({
                    name: "InvalidTypeError",
                    cause: "Algunos elementos de 'thumbnails' no son cadenas de texto válidas.",
                    message: "Tipo de dato incorrecto en thumbnails",
                    code: EErrors.INVALID_TYPES_ERROR,
                });
            }
        }

        if (typeof nuevoProducto.status !== "boolean") {
            nuevoProducto.status = true;
        }

        const result = await this.productsService.addProduct(nuevoProducto);
        const stringLastID = result._id.toString();

        req.io.emit("Server:addProduct", { ...nuevoProducto, _id: stringLastID });

        res.status(201).json({ mensaje: "Producto agregado correctamente" });
    } catch (error) {
        next(error);
    }
};


updateProduct = async (req, res, next) => {
    const { pid } = req.params;
    const updatedFields = req.body;

    try {
        const product = await this.productsService.getProductById(pid);
        if (!product) {
            return res.status(404).json({ error: `No existe un producto con ID: ${pid}` });
        }

        if (updatedFields.code && await this.productsService.validateCode(updatedFields.code)) {
            delete updatedFields.code;
        }

        if (updatedFields.price && isNaN(updatedFields.price)) {
            delete updatedFields.price;
        }

        if (updatedFields.stock && isNaN(updatedFields.stock)) {
            delete updatedFields.stock;
        }

        if (updatedFields.thumbnails && !Array.isArray(updatedFields.thumbnails)) {
            updatedFields.thumbnails = [updatedFields.thumbnails];
        }

        const result = await this.productsService.updateProduct(pid, updatedFields);
        req.io.emit("Server:productUpdate", result);
        res.status(200).json({ status: 'success', payload: result });
    } catch (error) {
        next(error);
    }
};

deleteProduct = async (req, res, next) => {
    const { pid } = req.params;

    try {
        const result = await this.productsService.deleteProduct(pid);
        req.io.emit("Server:loadProducts", await this.productsService.getProducts({}, { lean: true }));
        res.status(200).json({ status: 'success', payload: result });
    } catch (error) {
        next(error);
    }
};
}

module.exports = { ProductsController };
