const renderUtils = require("../../public/js/renderUtils.js");
const ProductsManager = require("../../dao/mongo/products.mongo.js");
const productsManager = new ProductsManager();

function formatearProductos(products) {
  products.forEach((product) => {
    product.price = renderUtils.toPesos(product.price);
    product.title = renderUtils.toCapital(product.title);
    product.category = renderUtils.toCapital(product.category);
  });
}

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

async function RenderView(req, res, urlFrom) {
  try {
    let {
      numPage = 1,
      limitParam = 8,
      categoryParam = null,
      availableOnly = null,
      orderBy = null,
    } = req.query;

    availableOnly = availableOnly ? availableOnly === "true" : null;
    numPage = parseInt(numPage);
    let limit = parseInt(limitParam);
    orderBy ? (orderBy = parseInt(orderBy)) : (orderBy = null);

    const filter = {};
    if (categoryParam) filter.category = categoryParam;
    if (typeof availableOnly === "boolean") filter.status = availableOnly;
    if (
      urlFrom === "realtimeproducts" &&
      req.user.role.toLowerCase() === "premium"
    ) {
      filter.owner = req.user.email;
    }

    let user = req.user;
    let docs,
      page,
      hasPrevPage,
      hasNextPage,
      prevPage,
      nextPage,
      totalPages,
      totalDocs,
      pagingCounter;
    let categoryArray = [];
    let notMocking = true;

    if (urlFrom === "mockingproducts") {
      urlFrom = "home";
      const { generateProducts } = require("../../utils/generateMocks");
      let mockProducts = [];
      let categorySet = new Set();
      notMocking = false;

      for (let i = 0; i < 50; i++) {
        let product = generateProducts();
        mockProducts.push(product);
        categorySet.add(product.category);
      }

      categoryArray = Array.from(categorySet);

      let filteredProducts = mockProducts.filter((product) => {
        if (filter.category && product.category !== filter.category)
          return false;
        if (
          typeof filter.status === "boolean" &&
          product.status !== filter.status
        )
          return false;
        return true;
      });

      if (orderBy) {
        filteredProducts.sort((a, b) =>
          orderBy === 1 ? a.price - b.price : b.price - a.price
        );
      }

      totalDocs = filteredProducts.length;
      totalPages = Math.ceil(totalDocs / limit);
      const start = (numPage - 1) * limit;
      const end = start + limit;
      docs = filteredProducts.slice(start, end);
      hasPrevPage = numPage > 1;
      hasNextPage = numPage < totalPages;
      prevPage = hasPrevPage ? numPage - 1 : null;
      nextPage = hasNextPage ? numPage + 1 : null;
      pagingCounter = start + 1;
    } else {
      const options = {
        limit,
        page: numPage,
        lean: true,
        sort: orderBy ? { price: orderBy } : {},
      };
      const result = await productsManager.getProducts(filter, options);
      ({
        docs,
        page,
        hasPrevPage,
        hasNextPage,
        prevPage,
        nextPage,
        totalPages,
        totalDocs,
        pagingCounter,
        limit,
      } = result);

      categoryArray = await productsManager.getCategories();
    }

    const urlParam = req.url;
    const pagLinksParams = {
      urlParam,
      totalPages,
      nextPage,
      prevPage,
      hasNextPage,
      hasPrevPage,
    };
    const { nextLink, prevLink, firstLink, lastLink, urlBase } =
      generatePaginationLinks(pagLinksParams);
    let title = "Mercadito || Gago";
    let styles = "homeStyles.css";

    let renderPage = "/";

    if (docs.length > 0) {
      formatearProductos(docs);
    } else docs = [];
    if (urlFrom === "realtimeproducts") {
      req.io.on("connection", async (socket) => {
        req.io.emit("Server:loadProducts", docs);
        (title = "Edit mercadito || Gago"), (renderPage = "/realTimeProducts/");
      });
    }

    if (user) {
      if (user.user) {
        user = user.user;
      }
      const nombre_completo =
        user.first_name === user.last_name
          ? user.first_name
          : user.first_name + " " + user.last_name;
      const isPremium = req.user.role.toLowerCase() === "premium";

      
      res.render(`${urlFrom}`, {
        user: JSON.stringify(user),
        uid: user.uid,
        cart_id: user.cart_id,
        username: user.email,
        nombre_completo,
        nombre: user.first_name,
        apellido: user.last_name,
        admin: user.admin,
        premium: isPremium,
        title,
        renderPage,
        products: docs,
        page,
        hasPrevPage,
        hasNextPage,
        prevPage,
        nextPage,
        totalPages,
        totalDocs,
        pagingCounter,
        limit,
        categoryArray,
        nextLink,
        prevLink,
        firstLink,
        lastLink,
        urlBase,
        styles,
        notMocking,
      });
    } else {
      res.render(`${urlFrom}`, {
        title,
        products: docs,
        page,
        hasPrevPage,
        hasNextPage,
        prevPage,
        nextPage,
        totalPages,
        totalDocs,
        pagingCounter,
        limit,
        categoryArray,
        nextLink,
        prevLink,
        firstLink,
        lastLink,
        urlBase,
        styles,
        notMocking,
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener los productos" });
  }
}

class ProductsViewsController {
  constructor() {}

  renderHome = async (req, res) => {
    await RenderView(req, res, "home");
  };

  renderProducts = async (req, res) => {
    await RenderView(req, res, "home");
  };

  renderProduct = async (req, res) => {
    const pid=req.params.pid
    const user=req.session.user
    const producto = await productsManager.getProductById(pid)
    let greeting =  'Bienvenido a la tienda, registrate con tu cuenta para tener acceso a tu carro' ;
    const message = 'Explora los detalles del producto';
    let cart_id = "";
    let username = ""
    let loggedUser = false
    if (user){
      loggedUser = true
      cart_id =  user.cart_id
      greeting = `Bienvenido a la tienda ${user.email}`
      username = user.email
    }
    res.render('productDetail', {
      cart_id,
      loggedUser,
      username,
      producto,
      greeting,
      message,
      isAdded: false, 
      cantidad: 1, 
      styles: "homeStyles.css",
    });
  };

  mockingProducts = async (req, res) => {
    await RenderView(req, res, "mockingproducts");
  };

  realTimeProducts = async (req, res) => {
    await RenderView(req, res, "realtimeproducts");
  };
}

module.exports = ProductsViewsController;
