const ProductsManager = require("../dao/mongo/products.mongo.js");
const CartsManager = require("../dao/mongo/carts.mongo.js");
const TicketsManager = require ('../dao/mongo/tickets.mongo.js')



const {
  isLoggedIn,
  authorization,
} = require("../middlewares/auth.middleware.js");
const productsManager = new ProductsManager();
const cartsManager = new CartsManager();
const ticketsManager = new TicketsManager();

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

router.get("/", authorization(["public"]), isLoggedIn, async (req, res) => {
  let {
    numPage = 1,
    limitParam = 4,
    categoryParam = null,
    availableOnly = null,
    orderBy = null,
  } = req.query;

  availableOnly = availableOnly ? availableOnly === "true" : null;
  numPage = parseInt(numPage);
  limit = parseInt(limitParam);
  orderBy ? (orderBy = parseInt(orderBy)) : (orderBy = null);

  const filter = {};
  if (categoryParam) filter.category = categoryParam;
  if (typeof availableOnly === "boolean") filter.status = availableOnly;
  // if (req.user.role.toLowerCase() === "premium") filter.owner = req.user.email 

// console.log('filter VR L 120', filter) //owner: 'premiumuser@coder.com'

  const options = {
    limit,
    page: numPage,
    lean: true,
    sort: orderBy ? { price: orderBy } : {},
  };

  try {
    let user = req.user;

    const result = await productsManager.getProducts(filter, options);
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
    } = result;
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
      const isPremium = req.user.role.toLowerCase() === "premium"

      res.render("home", {
        cart_id: user.cart_id,
        username: user.email,
        nombre_completo,
        nombre: user.first_name,
        apellido: user.last_name,
        admin: user.admin,
        premium: isPremium,
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
    logger.error(error);
    res.status(500).json({ error: "Error al obtener los productos" });
  }
});

router.get("/products", authorization(["user", "premium", "admin"]), isLoggedIn, async (req, res) => {
    let {
      numPage = 1,
      limitParam = 4,
      categoryParam = null,
      availableOnly = null,
      orderBy = null,
    } = req.query;

    availableOnly = availableOnly ? availableOnly === "true" : null;
    numPage = parseInt(numPage);
    limit = parseInt(limitParam);
    orderBy ? (orderBy = parseInt(orderBy)) : (orderBy = null);

    const filter = {};
    if (categoryParam) filter.category = categoryParam;
    if (typeof availableOnly === "boolean") filter.status = availableOnly;

    const options = {
      limit,
      page: numPage,
      lean: true,
      sort: orderBy ? { price: orderBy } : {},
    };

    try {
      let user = req.user;

      const result = await productsManager.getProducts(filter, options);
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
      } = result;

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
            const isPremium = req.user.role.toLowerCase() === "premium"

        res.render("home", {
          cart_id: user.cart_id,
          username: user.email,
          nombre_completo,
          nombre: user.first_name,
          apellido: user.last_name,
          admin: user.admin,
          premium: isPremium,
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
          user: JSON.stringify(user),
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
      logger.error(error);
      res.status(500).json({ error: "Error al obtener los productos" });
    }
  }
);


router.get("/mockingproducts", authorization(["public"]), isLoggedIn, async (req, res) => {
  const { generateProducts } = require('../utils/generateMocks.js');
  let {
    numPage = 1,
    limitParam = 4,
    categoryParam = null,
    availableOnly = null,
    orderBy = null,
  } = req.query;

  availableOnly = availableOnly ? availableOnly === "true" : null;
  numPage = parseInt(numPage);
  limit = parseInt(limitParam);
  orderBy ? (orderBy = parseInt(orderBy)) : (orderBy = null);

  const filter = {};
  if (categoryParam) filter.category = categoryParam;
  if (typeof availableOnly === "boolean") filter.status = availableOnly;

  try {
    let user = req.user;
    let mockProducts = [];
    let categorySet = new Set();

    for (let i = 0; i < 50; i++) {
      let product = generateProducts();
      mockProducts.push(product);
      categorySet.add(product.category); 
    }

    const categoryArray = Array.from(categorySet);

    let filteredProducts = mockProducts.filter(product => {
      if (filter.category && product.category !== filter.category) return false;
      if (typeof filter.status === "boolean" && product.status !== filter.status) return false;
      return true;
    });

    if (orderBy) {
      filteredProducts.sort((a, b) => orderBy === 1 ? a.price - b.price : b.price - a.price);
    }

    const totalDocs = filteredProducts.length;
    const totalPages = Math.ceil(totalDocs / limit);
    const start = (numPage - 1) * limit;
    const end = start + limit;
    const docs = filteredProducts.slice(start, end);
    const hasPrevPage = numPage > 1;
    const hasNextPage = numPage < totalPages;
    const prevPage = hasPrevPage ? numPage - 1 : null;
    const nextPage = hasNextPage ? numPage + 1 : null;
    const pagingCounter = start + 1;

    const urlParam = req.url;
    const pagLinksParams = {
      urlParam,
      totalPages,
      nextPage,
      prevPage,
      hasNextPage,
      hasPrevPage,
    };

    const { nextLink, prevLink, firstLink, lastLink, urlBase } = generatePaginationLinks(pagLinksParams);

    if (docs.length > 0) {
      formatearProductos(docs);
    }

    if (user) {
      if (user.user) {
        user = user.user;
      }
      const nombre_completo = user.first_name === user.last_name
        ? user.first_name
        : user.first_name + " " + user.last_name;

      res.render("home", {
        cart_id: user.cart_id,
        username: user.email,
        nombre_completo,
        nombre: user.first_name,
        apellido: user.last_name,
        admin: user.admin,
        title: "mercadito || Gago",
        products: docs,
        page: numPage,
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
        user: JSON.stringify(user),
      });
    } else {
      res.render("home", {
        title: "mercadito || Gago",
        products: docs,
        page: numPage,
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
    logger.error(error);
    res.status(500).json({ error: "Error al obtener los productos" });
  }
});




router.get("/realtimeproducts", authorization(["premium", "admin"]), isLoggedIn, async (req, res) => {
    let {
      numPage = 1,
      limitParam = 4,
      categoryParam = null,
      availableOnly = null,
      orderBy = null,
    } = req.query;

    availableOnly = availableOnly ? availableOnly === "true" : null;
    numPage = parseInt(numPage);
    limit = parseInt(limitParam);
    orderBy ? (orderBy = parseInt(orderBy)) : (orderBy = null);

    const filter = {};
    if (categoryParam) filter.category = categoryParam;
    if (typeof availableOnly === "boolean") filter.status = availableOnly;
    if (req.user.role.toLowerCase()==="premium") filter.owner = req.user.email

    console.log('VR L511 filter', filter)

    const options = {
      limit,
      page: numPage,
      lean: true,
      sort: orderBy ? { price: orderBy } : {},
    };

    try {
      let user = req.user;
      const result = await productsManager.getProducts(filter, options);
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
      } = result;

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

        req.io.on("connection", async (socket) => {
          // socket.username = user.email;
          req.io.emit("Server:loadProducts", docs);
        });
        const isPremium = req.user.role.toLowerCase() === "premium"
        res.render("realTimeProducts", {
          username: user.mail,
          renderPage: "/realTimeProducts/",
          nombre: user.first_name,
          apellido: user.last_name,
          admin: user.admin,
          premium: isPremium,
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
          user: JSON.stringify(user),
          username: user.email,
        });
      }
      else {
        req.io.on("connection", async (socket) => {
          // socket.username = user.email;
          req.io.emit("Server:loadProducts", docs);
        });
        const isPremium = req.user.role.toLowerCase() === "premium"

        res.render("realTimeProducts", {
          username: user.mail,
          renderPage: "/realTimeProducts/",
          nombre: user.first_name,
          apellido: user.last_name,
          admin: user.admin,
          premium: isPremium,
          title: "Edit mercadito || Gago",
          products: [],
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
          user: JSON.stringify(user),
          username: user.email,
        });
      }
    } catch (error) {
      logger.error(error);
      res.status(500).json({ error: "Error al obtener los productos" });
    }
  }
);

router.get("/chat", authorization(["user, premium"]), isLoggedIn, async (req, res) => {
  const user = req.user;

  res.render("chat", {
    title: "Chat mercadito || Gago",
    styles: "chat.css",
    user: JSON.stringify(user),
    username: user.email,
  });
});

router.get("/carts", authorization(["user, premium"]), isLoggedIn, async (req, res) => {
  try {
    let user = req.user;

    if (user.user) {
      user = user.user;
    }
    // const nombre_completo = (user.first_name === user.last_name)? user.first_name: (user.first_name + ' ' + user.last_name)

    const existingCart = await cartsManager.getCartById(user.cart_id);

    if (!existingCart) {
      const newCart = await cartsManager.createCartForUser(user._id);
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

router.get("/carts/:cid", authorization(["user, premium"]), isLoggedIn, async (req, res) => {
    const cid = req.params.cid;
    const user = req.user;

    try {
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
      logger.error(error);
      res.status(500).json({ error: "Error al obtener los productos" });
    }
  }
);

router.get("/carts/:cid/purchase", authorization(["user, premium"]), async (req, res) => {
  try {
    const { cid } = req.params;
    const cart = await cartsManager.getCartById(cid);

    if (!cart) {
      return res.status(404).json({ error: "Cart not found" });
    }
 
    let totalAmount = 0;
    const purchasedProducts = [];
    const failedProducts = [];
    const code = `TCK-${Date.now()}`
    for (const item of cart.products) {
      const product = await productsManager.getProductById(item.pid);

      if (product.stock >= item.quantity) {
        product.stock -= item.quantity;
        await productsManager.updateProduct(product._id, product); 
        totalAmount += product.price * item.quantity;
        purchasedProducts.push({
          ...item,
          product
        });
      } else {
        failedProducts.push({
          ...item,
          product
        });
      }
    }


    if (purchasedProducts.length > 0) {
        const newTicket = {
        code, 
        purchase: purchasedProducts,
        amount: totalAmount,
        purchaser: req.session.user.email
      };

      await ticketsManager.createTicket(newTicket);
      await cartsManager.emptyCart(cid)
      await cartsManager.addProductsToCart(cid,failedProducts)

    }

      res.render("purchase", {
        purchasedProducts,
        failedProducts,
        totalAmount,
        email: req.session.user.email,
        cid,
        code,
        title: "carrito || Gago",
        styles: "homeStyles.css",
      
    })
  } catch (error) {
    console.error("Error processing purchase:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/carts/:cid/cancel/:tCode", authorization(["user, premium"]), async (req, res) => {
  const { cid, tCode } = req.params;
  try {
    const cart = await cartsManager.getCartById(cid);
    const ticket = await ticketsManager.getTicketBy({ code: tCode });

    if (!cart) {
      return res.status(404).json({ error: "Cart not found" });
    }
    
    if (!ticket) {
      return res.status(404).json({ error: "Ticket not found" });
    }

    for (const item of ticket.purchase) {
      const product = await productsManager.getProductById(item.pid);
      product.stock += item.quantity;
      await productsManager.updateProduct(product._id, product);
    }

    const updatedCart = [...cart.products, ...ticket.purchase];

    await cartsManager.emptyCart(cid);
    await cartsManager.addProductsToCart(cid, updatedCart);

    await ticketsManager.delete(ticket._id);

    return res.json({ success: true });
  } catch (error) {
    console.error("Error processing cancel:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});



router.get("/carts/:cid/tickets", authorization(["user, premium"]),  async (req,res) =>{
  try {
    const cid = req.params.cid;
    const user = req.user;
    if (user.user) {
      user = user.user;
      
    }
    const tickets = await ticketsManager.getTicketsByEmail( user.email)

    res.render("ticket",{
      tickets,
      cid,
      title: "carrito || Gago",
      username: user.email,
      nombre: user.first_name,
      apellido: user.last_name,
      admin: user.admin,
      styles: "homeStyles.css",
    })
  } catch (error) {
    logger.error(error)
  }
});


router.get('/reset-password', async (req, res) => {
  const { token } = req.query;

  if (!token) {
    return res.status(400).render('error', {
      title: 'Error',
      message: 'Token de restablecimiento no proporcionado. Por favor, verifica el enlace en tu correo.'
    });
  }

  try {
    const UsersManager = require("../dao/mongo/users.mongo.js");
    const usersManager = new UsersManager();
    const user = await usersManager.getUserByResetToken(token);

    if (!user) {
      return res.status(400).render('error', {
        title: 'Error',
        message: 'Token de restablecimiento inválido o expirado. Por favor, solicita uno nuevo.'
      });
    }

    res.render('reset-password', {
      title: 'Restablecer Contraseña',
      styles: "homeStyles.css",
      token: token 
    });
  } catch (error) {
    console.error('Error while fetching user by reset token:', error);
    res.status(500).render('error', {
      title: 'Error del servidor',
      message: 'Ocurrió un error al intentar restablecer la contraseña. Por favor, intenta nuevamente más tarde.'
    });
  }
});


const {currentUser} = require("../controllers/sessions.controller");
const { logger } = require("../utils/loggers.js");
router.get("/current", authorization(['user', 'admin']), currentUser);


router.get("/login", authorization(["public"]), (req, res) => {
  res.render("login");
});
router.get("/register", authorization(["public"]), (req, res) => {
  res.render("register");
});

module.exports = {
  router,
};
