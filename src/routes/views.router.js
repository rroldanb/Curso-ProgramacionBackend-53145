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

router.get("/products", authorization(["public"]), isLoggedIn, async (req, res) => {
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
      console.log(error);
      res.status(500).json({ error: "Error al obtener los productos" });
    }
  }
);

router.get("/realtimeproducts", authorization(["admin"]), isLoggedIn, async (req, res) => {
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

        req.io.on("connection", async (socket) => {
          // socket.username = user.email;
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
          user: JSON.stringify(user),
          username: user.email,
        });
      }
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "Error al obtener los productos" });
    }
  }
);

router.get("/chat", authorization(["user"]), isLoggedIn, async (req, res) => {
  const user = req.user;

  res.render("chat", {
    title: "Chat mercadito || Gago",
    styles: "chat.css",
    user: JSON.stringify(user),
    username: user.email,
  });
});

router.get("/carts", authorization(["user"]), isLoggedIn, async (req, res) => {
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

router.get("/carts/:cid", authorization(["user"]), isLoggedIn, async (req, res) => {
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
      console.log(error);
      res.status(500).json({ error: "Error al obtener los productos" });
    }
  }
);

router.get("/carts/:cid/purchase", authorization(["user"]), async (req, res) => {
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

router.get("/carts/:cid/cancel/:tCode", authorization(["user"]), async (req, res) => {
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



router.get("/carts/:cid/tickets", authorization(["user"]),  async (req,res) =>{
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
    console.log(error)
  }
});


const {currentUser} = require("../controllers/sessions.controller");
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
