const Stripe = require("stripe");
const { objectConfig } = require("../config/config");
const {CartsService,ProductsService} = require("../services/index");

class PaymentController {
  constructor() {
    this.stripe = new Stripe(objectConfig.stripe_secret_key);
  }


  createSession  = async (req, res) => {
    const cartId = req.body.cartId;
    const cart = await CartsService.getCartById(cartId);
    if (!cart) {
      return res.status(404).json({ error: "Carito no encontrado" });
    }
  
    const purchasedProducts = [];
    for (const item of cart.products) {
      const product = await ProductsService.getProductById(item.pid._id);
      if (product.stock >= item.quantity) {
        purchasedProducts.push({
          ...item,
          title: product.title,
          price: product.price, 
        });
      } 
    }
    try {
      if (purchasedProducts.length > 0) {
        let purchase_items = [];
  
        purchasedProducts.forEach((product) => {

          purchase_items.push({
            price_data: {
              product_data: {
                name: product.title,  
              },
              currency: "clp",         
              unit_amount: product.price 
            },
            quantity: product.quantity,  
          });
        });
        const session = await this.stripe.checkout.sessions.create({
          line_items: purchase_items,
          mode: "payment",
          success_url: `${objectConfig.app_url}/carts/${cartId}/purchase`,
          cancel_url: `${objectConfig.app_url}/carts/${cartId}`,
        });
  
        return res.json({ url: session.url });
      } else {
        return res.status(400).json({ error: "No hay articulos pare gestionar un pago" });
      }
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  };
  


}

module.exports =  {PaymentController}; 
