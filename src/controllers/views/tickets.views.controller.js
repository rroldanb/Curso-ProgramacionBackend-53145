const TicketsManager = require("../../dao/mongo/tickets.mongo.js");
const ProductsManager = require("../../dao/mongo/products.mongo.js");

class TicketsViewsController {
    constructor() {
        this.ticketsManager = new TicketsManager();
        this.productsManager = new ProductsManager();
    }
    renderTickets = async (req, res) => {
        try {
          const cid = req.params.cid;
          const user = req.user;
          if (user.user) {
            user = user.user;
          }
          const tickets = await this.ticketsManager.getTicketsBy({purchaser: user.email});
    
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
    
    
      renderTicket = async (req, res) => {
        try {
          const tid = req.params.tid;
          let user = req.user;
          const purchasedProducts = [];
      
          if (user && user.user) {
            user = user.user;
          }
      
          const ticket = await this.ticketsManager.getTicketBy({ _id: tid });
      
          if (ticket && Array.isArray(ticket.purchase)) {
            for (const item of ticket.purchase) {
              const product = item.pid;
              const quantity = item.quantity
      
              if (product) {
                purchasedProducts.push({
                  ...item,   
                  product,   
                  quantity,
                });
              }
            }
          } else {
            console.error("El ticket no contiene una propiedad 'purchase' válida o no es un arreglo.");
            return res.status(400).json({ message: "Error en la estructura del ticket" });
          }
      
          res.render("ticket", {
            purchasedProducts,
            totalAmount: ticket.amount,
            email: ticket.purchaser,
            code: ticket.code,
            title: "Comprobante de compra || RR-ecommerce",
            styles: "homeStyles.css",
            date: ticket.purchase_datetime,
          });
        } catch (error) {
          console.error("Error al renderizar el ticket:", error);
          res.status(500).send("Hubo un problema al procesar el ticket.");
        }
      };
      
      
      
      
      
      
}




module.exports = TicketsViewsController;
