const CartsDaoMongo = require("../../dao/mongo/carts.mongo.js");
const ProductsManager = require("../../dao/mongo/products.mongo.js");
const TicketsManager = require("../../dao/mongo/tickets.mongo.js");

const cartsManager = new CartsDaoMongo();
const productsManager = new ProductsManager();
const ticketsManager = new TicketsManager();

const { purchaseSuccessEmailUser, purchaseSuccessEmailOwner } = require("../../config/sendMail.config");
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
          title: "carrito || RR-ecommerce",
          products,
          styles: "homeStyles.css",
        });
      } else {
        res.render("cart", {
          cid,
          title: "carrito || RR-ecommerce",
          products,
          styles: "homeStyles.css",
        });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Error al obtener los productos" });
    }
  };

  purchase = async (req, res) => {
    try {
      const { cid } = req.params;
      const cart = await cartsManager.getCartById(cid);
      const userEmail = req.session.user.email;
      
      if (!cart) {
        return res.status(404).json({ error: "Carrito no encontrado" });
      }
  
      let totalAmount = 0;
      const purchasedProducts = [];
      const failedProducts = [];
      const code = `TCK-${Date.now()}`;
      
      const ownersSet = new Set(); // Para mantener una lista única de dueños
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
  
          if (product.owner !== 'admin') {
            ownersSet.add(product.owner); 
          }
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
          purchaser: userEmail,
        };
        const ticket = await ticketsManager.createTicket(newTicket);
        await cartsManager.emptyCart(cid);
        await cartsManager.addProductsToCart(cid, failedProducts);
  
        // Enviar correos
        await purchaseSuccessEmailUser(userEmail, newTicket);
        for (const ownerEmail of ownersSet) {
          await purchaseSuccessEmailOwner(ownerEmail, newTicket);
        }
        res.render("ticket", {
          purchasedProducts,
          failedProducts,
          totalAmount,
          email: userEmail,
          cid,
          code,
          title: "Comprobante de compra || RR-ecommerce",
          styles: "homeStyles.css",
          date: ticket.purchase_datetime,

        });
      }
    } catch (error) {
      console.error("Error procesando la compra:", error);
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
        title: "carrito || RR-ecommerce",
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
