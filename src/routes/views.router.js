const ProductsManager = require("../dao/ProductsMongo.manager.js");
const CartsManager = require("../dao/CartsMongo.manager.js");
const { isLoggedIn, auth } = require("../middlewares/auth.middleware.js");
const productsManager = new ProductsManager();
const cartsManager = new CartsManager();

const renderUtils = require("../public/js/renderUtils.js");

const { Router } = require("express");
const router = Router();

function formatearProductosAnidados(products) {
  products.forEach((product) => {
    product.pid.price = renderUtils.toPesos(product.pid.price);
    product.pid.title = renderUtils.toCapital(product.pid.title);
    product.pid.category = renderUtils.toCapital(product.pid.category);
  });
}
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

router.get("/", isLoggedIn, async (req, res) => {
  let {
    numPage = 1,
    limitParam = 4,
    categoryParam = null,
    availableOnly = null,
    orderBy = null,
  } = req.query;

  const findParams = {
    categoryParam,
    availableOnly,
    limitParam,
    numPage,
    orderBy,
  };

  try {
    let user = req.user;

    const {
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
    } = await productsManager.getProducts(findParams);

    const categoryArray = await productsManager.getCategories();

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

    if (docs.length > 0) {
      formatearProductos(docs);
    }

    if (user) {
      if (user.user) {
        user = user.user;
      }
      const nombre_completo =
        user.first_name === user.last_name
          ? user.first_name
          : user.first_name + " " + user.last_name;
      //     let cart_id = await cartsManager.getCartByEmail(user.email)
      //     if (!cart_id) {
      // await cartsManager.createCartForUser(user.email)
      // cart_id = await cartsManager.getCartByEmail(user.email)
      //     }

      res.render("home", {
        cart_id: user.cart_id,
        username: user.email,
        nombre_completo,
        nombre: user.first_name,
        apellido: user.last_name,
        admin: user.admin,
        title: "mercadito || Gago",
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
        styles: "homeStyles.css",
      });
    } else {
      res.render("home", {
        title: "mercadito || Gago",
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
        styles: "homeStyles.css",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error al obtener los productos" });
  }
});

// endpoint productos
router.get("/products", isLoggedIn, async (req, res) => {
  let {
    numPage = 1,
    limitParam = 4,
    categoryParam = null,
    availableOnly = null,
    orderBy = null,
  } = req.query;

  const findParams = {
    categoryParam,
    availableOnly,
    limitParam,
    numPage,
    orderBy,
  };

  try {
    let user = req.user;

    const {
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
    } = await productsManager.getProducts(findParams);

    const categoryArray = await productsManager.getCategories();

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

    if (docs.length > 0) {
      formatearProductos(docs);
    }
    if (user) {
      if (user.user) {
        user = user.user;
      }
      const nombre_completo =
        user.first_name === user.last_name
          ? user.first_name
          : user.first_name + " " + user.last_name;
      //     let cart_id = await cartsManager.getCartByEmail(user.email)
      //     if (!cart_id) {
      // await cartsManager.createCartForUser(user.email)
      // cart_id = await cartsManager.getCartByEmail(user.email)
      //     }


      res.render("home", {
        cart_id: user.cart_id,
        username: user.email,
        nombre_completo,
        nombre: user.first_name,
        apellido: user.last_name,
        admin: user.admin,
        title: "mercadito || Gago",
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
        styles: "homeStyles.css",
      });
    } else {
      res.render("home", {
        title: "mercadito || Gago",
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
        styles: "homeStyles.css",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error al obtener los productos" });
  }
});

router.get("/realtimeproducts", isLoggedIn, auth, async (req, res) => {
  let {
    numPage = 1,
    limitParam = 4,
    categoryParam = null,
    availableOnly = null,
    orderBy = null,
  } = req.query;

  const findParams = {
    categoryParam,
    availableOnly,
    limitParam,
    numPage,
    orderBy,
  };

  try {
    const user = req.user;
    // const user=userUser
    const {
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
    } = await productsManager.getProducts(findParams);

    const categoryArray = await productsManager.getCategories();

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

    if (docs.length > 0) {
      formatearProductos(docs);

      req.io.on("connection", (socket) => {
        req.io.emit("Server:loadProducts", docs);
      });

      res.render("realTimeProducts", {
        username: user.mail,
        renderPage: "/realTimeProducts/",
        nombre: user.first_name,
        apellido: user.last_name,
        admin: user.admin,
        title: "Edit mercadito || Gago",
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
        styles: "homeStyles.css",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error al obtener los productos" });
  }
});

router.get("/chat", async (req, res) => {
  res.render("chat", {
    title: "Chat mercadito || Gago",
    styles: "chat.css",
  });
});

router.get("/carts", isLoggedIn, async (req, res) => {
  try {
    let user = req.user;

    if (user.user) {
      user = user.user;
    }
    // const nombre_completo = (user.first_name === user.last_name)? user.first_name: (user.first_name + ' ' + user.last_name)

    const existingCart = await cartsManager.getCartByEmail(user.email);

    if (!existingCart) {
      const newCart = await cartsManager.createCartForUser(user.email);
      if (!newCart) {
        throw new Error("Error al crear el carrito para el usuario");
      }
      return res.status(200).json({ cartId: newCart._id });
    }

    return res.status(200).json({ cartId: existingCart._id });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error interno del servidor");
  }
});

router.get("/carts/:cid", isLoggedIn, async (req, res) => {
  const cid = req.params.cid;

  try {
    // const user=userAdmin
    // const user = userUser;
    const user = req.user;
    const cart = await cartsManager.getCartById(cid);
    const products = cart.products;
    if (products.length > 0) {
      formatearProductosAnidados(products);
    }

    if (user) {
      res.render("cart", {
        username: user.email,
        nombre: user.first_name,
        apellido: user.last_name,
        admin: user.admin,
        cid,
        title: "carrito || Gago",
        products,
        styles: "homeStyles.css",
      });
    } else {
      res.render("cart", {
        cid,
        title: "carrito || Gago",
        products,
        styles: "homeStyles.css",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error al obtener los productos" });
  }
});

router.get("/login", (req, res) => {
  res.render("login");
});
router.get("/register", (req, res) => {
  res.render("register");
});

module.exports = {
  router,
};
