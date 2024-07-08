const {
  CartsService,
  TicketsService,
  UsersService,
  ProductsService,
} = require("../services/index");

class TicketsController {
  constructor() {
    this.ticketsService = TicketsService;
  }

  purchaseCart = async (req, res) => {
    const { cid } = req.params;
    const cart = await CartsService.getCartById(cid);

    if (!cart) {
      return res.status(404).json({ error: "Cart not found" });
    }

    let totalAmount = 0;
    const purchasedProducts = [];
    const failedProducts = [];

    for (const item of cart.products) {
      const product = await ProductsService.getProductById(item.pid);

      if (product.stock >= item.quantity) {
        product.stock -= item.quantity;
        await ProductsService.updateProduct(product._id, product);
        totalAmount += product.price * item.quantity;
        purchasedProducts.push(item);
      } else {
        failedProducts.push(item.pid);
      }
    }

    const ticket = {
      amount: totalAmount,
      purchaser: req.session.user.email,
    };

    await this.ticketsService.createTicket(ticket);

    if (failedProducts.length > 0) {
      cart.products = cart.products.filter((item) =>
        failedProducts.includes(item.pid)
      );
      await CartsService.updateCart(cart._id, cart);
      return res.status(400).json({
        error: "Some products could not be purchased",
        failedProducts,
      });
    } else {
      await CartsService.emptyCart(cart._id);
      return res
        .status(200)
        .json({ message: "Purchase completed successfully", ticket });
    }
  };

  getUserTickets = async (req, res) => {
    const email = req.session.user.email;

    const tickets = await this.ticketsService.getTickesByEmail(email);
  };
}
module.exports = { TicketsController };
