const Stripe = require("stripe");
const { objectConfig } = require("../config/config");

class PaymentController {
  constructor() {
    this.stripe = new Stripe(objectConfig.stripe_secret_key);
  }

  createSession = async (req, res) => {
    console.log('llegando al session controler de stripe')
    try {
      const session = await this.stripe.checkout.sessions.create({
        line_items: [
          {
            price_data: {
              product_data: {
                name: "Laptop",
              },
              currency: "clp",
              unit_amount: 2000,
            },
            quantity: 1,
          },
          {
            price_data: {
              product_data: {
                name: "TV",
              },
              currency: "clp",
              unit_amount: 1000,
            },
            quantity: 2,
          },
        ],
        mode: "payment",
        success_url: `${objectConfig.app_url}/success.html`,
        cancel_url: `${objectConfig.app_url}/cancel.html`,
      });

      console.log(session);
      return res.json({ url: session.url });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  };
}

module.exports =  {PaymentController}; 
