const {CartsService,TicketsService,ProductsService} = require("../services/index");

class TicketsController {
  constructor() {
    this.ticketsService = TicketsService;
  }

  purchaseCart = async (req, res) => {
    console.log('ticker controller params', req.params.cid)
    const { cid } = req.params;
    const cart = await CartsService.getCartById(cid);

    if (!cart) {
      return res.status(404).json({ error: "Cart not found" });
    }

    let totalAmount = 0;
    const purchasedProducts = [];
    const failedProducts = [];
    const code = `TCK-${Date.now()}`

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
      code, 
      purchase: purchasedProducts,
      amount: totalAmount,
      purchaser: req.session.user.email
    };

    await this.ticketsService.createTicket(ticket);

    if (failedProducts.length > 0) {
      cart.products = cart.products.filter((item) =>
        failedProducts.includes(item.pid)
      );
      await CartsService.updateCart(cart._id, cart);
      return res.status(400).json({
        error: "Algunos productos no pudieron ser comprados",
        failedProducts,
      });
    } else {
      await CartsService.emptyCart(cart._id);
      return res
        .status(200)
        .json({ message: "Compra exitosa", ticket });
    }
  };

  getUserTickets = async (req, res) => {
    const email = req.session.user.email;
try {
  
  const tickets = await this.ticketsService.getTicketsBy({purchaser: email});
  res.send({
    status: "success",
    payload: tickets
  });
} catch (error) {
  console.error("Error al obtener los tickets del usuario:", error);
  res.status(500).json({ error: "Error al obtener los tickets del usuario." });
}

  };
}
module.exports = { TicketsController };
