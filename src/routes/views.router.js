const ProductsManager = require("../dao/mongo/products.mongo.js");
const CartsManager = require("../dao/mongo/carts.mongo.js");
const TicketsManager = require("../dao/mongo/tickets.mongo.js");

const UsersViewsController = require("../controllers/views/users.views.controller.js");
const ProductsViewsController = require("../controllers/views/products.views.controller.js");
const { isLoggedIn,authorization } = require("../middlewares/auth.middleware.js");

const usersviewsController = new UsersViewsController();
const productsViewsController = new ProductsViewsController();
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


router.get("/", authorization(["public"]), isLoggedIn, productsViewsController.renderHome);

router.get("/products", authorization(["user", "premium", "admin"]),isLoggedIn,productsViewsController.renderProducts);

router.get("/mockingproducts", authorization(["public"]), isLoggedIn, productsViewsController.mockingProducts);

router.get("/realtimeproducts", authorization(["premium", "admin"]), isLoggedIn,productsViewsController.realTimeProducts);

router.get("/chat", authorization(["user, premium"]), isLoggedIn,
  async (req, res) => {
    const user = req.user;

    res.render("chat", {
      title: "Chat mercadito || Gago",
      styles: "chat.css",
      user: JSON.stringify(user),
      username: user.email,
    });
  }
);

router.get("/carts",
  authorization(["user, premium"]),
  isLoggedIn,
  async (req, res) => {
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
  }
);

router.get("/carts/:cid",
  authorization(["user, premium"]),
  isLoggedIn,
  async (req, res) => {
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

router.get("/carts/:cid/purchase",
  authorization(["user, premium"]),
  async (req, res) => {
    try {
      const { cid } = req.params;
      const cart = await cartsManager.getCartById(cid);

      if (!cart) {
        return res.status(404).json({ error: "Cart not found" });
      }

      let totalAmount = 0;
      const purchasedProducts = [];
      const failedProducts = [];
      const code = `TCK-${Date.now()}`;
      for (const item of cart.products) {
        const product = await productsManager.getProductById(item.pid);

        if (product.stock >= item.quantity) {
          product.stock -= item.quantity;
          await productsManager.updateProduct(product._id, product);
          totalAmount += product.price * item.quantity;
          purchasedProducts.push({
            ...item,
            product,
          });
        } else {
          failedProducts.push({
            ...item,
            product,
          });
        }
      }

      if (purchasedProducts.length > 0) {
        const newTicket = {
          code,
          purchase: purchasedProducts,
          amount: totalAmount,
          purchaser: req.session.user.email,
        };

        await ticketsManager.createTicket(newTicket);
        await cartsManager.emptyCart(cid);
        await cartsManager.addProductsToCart(cid, failedProducts);
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
      });
    } catch (error) {
      console.error("Error processing purchase:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }
);

router.get("/carts/:cid/cancel/:tCode",
  authorization(["user, premium"]),
  async (req, res) => {
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
  }
);

router.get("/carts/:cid/tickets",
  authorization(["user, premium"]),
  async (req, res) => {
    try {
      const cid = req.params.cid;
      const user = req.user;
      if (user.user) {
        user = user.user;
      }
      const tickets = await ticketsManager.getTicketsByEmail(user.email);

      res.render("ticket", {
        tickets,
        cid,
        title: "carrito || Gago",
        username: user.email,
        nombre: user.first_name,
        apellido: user.last_name,
        admin: user.admin,
        styles: "homeStyles.css",
      });
    } catch (error) {
      logger.error(error);
    }
  }
);

router.get("/reset-password", authorization(["public"]), usersviewsController.resetPassword);

const { currentUser } = require("../controllers/sessions.controller");
const { logger } = require("../utils/loggers.js");

router.get("/current", authorization(["user", "admin"]), currentUser);

router.get("/login", authorization(["public"]), (req, res) => {res.render("login");});
router.get("/register", authorization(["public"]), (req, res) => {res.render("register");});

module.exports = {
  router,
};
