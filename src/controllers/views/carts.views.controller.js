const CartsDaoMongo = require("../../dao/mongo/carts.mongo.js");
const ProductsManager = require("../../dao/mongo/products.mongo.js");
const TicketsManager = require("../../dao/mongo/tickets.mongo.js");

const cartsManager = new CartsDaoMongo();
const productsManager = new ProductsManager();
const ticketsManager = new TicketsManager();

const renderUtils = require("../../public/js/renderUtils.js");

function formatearProductosAnidados(products) {
  products.forEach((product) => {
    product.pid.price = renderUtils.toPesos(product.pid.price);
    product.pid.title = renderUtils.toCapital(product.pid.title);
    product.pid.category = renderUtils.toCapital(product.pid.category);
  });
}

class CartsViewsController {
  constructor() {}

  renderCarts = async (req, res) => {
    try {
      let user = req.user;

      if (user.user) {
        user = user.user;
      }

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
  };

  renderCart = async (req, res) => {
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
  };

  purchase = async (req, res) => {
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
      console.error("Error procesando la compra:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  };

  cancelPurchase = async (req, res) => {
    const { cid, tCode } = req.params;
    try {
      const cart = await cartsManager.getCartById(cid);
      const ticket = await ticketsManager.getTicketBy({ code: tCode });

      if (!cart) {
        return res.status(404).json({ error: "Carrito no encontrado" });
      }

      if (!ticket) {
        return res.status(404).json({ error: "Ticket no encontrado" });
      }

      for (const item of ticket.purchase) {
        const product = await productsManager.getProductById(item.pid);
        product.stock += item.quantity;
        await productsManager.updateProduct(product._id, product);
      }

      const updatedCart = [...cart.products, ...ticket.purchase];

      await cartsManager.emptyCart(cid);
      await cartsManager.addProductsToCart(cid, updatedCart);

      await ticketsManager.deleteTicket(ticket._id);

      return res.json({ success: true });
    } catch (error) {
      console.error("Error al cancelar:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  };

  renderTickets = async (req, res) => {
    try {
      const cid = req.params.cid;
      const user = req.user;
      if (user.user) {
        user = user.user;
      }
      const tickets = await ticketsManager.getTicketsBy({purchaser: user.email});

      res.render("ticketsHistory", {
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
      console.error(error);
    }
  };
}


module.exports = CartsViewsController;
