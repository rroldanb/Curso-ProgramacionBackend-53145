const { Router } = require("express");
const router = Router();

const { CartsController } = require("../../controllers/carts.controller");
const { authorization } = require("../../middlewares/auth.middleware");
const { TicketsController } = require("../../controllers/tickets.controller");
const ticketscontroller = new TicketsController()
const {
  getCart,
  createCart,
  deleteProductFromCart,
  emptyCart,
  addProductToCart,
  addProductsToCart,
  updateProductQuantity,
} = new CartsController();

router.get("/:cid", authorization(["user", "premium"]), getCart);
router.post("/:cid/product/:pid",authorization(["user", "premium"]),addProductToCart);
router.delete("/:cid", authorization(["user", "premium"]), emptyCart);
router.delete("/:cid/product/:pid",authorization(["user", "premium"]),deleteProductFromCart);
router.put("/:cid", authorization(["user", "premium"]), addProductsToCart);
router.put("/:cid/product/:pid",authorization(["user", "premium"]),updateProductQuantity);

// router.post("/",authorization(['user', 'premium']),  createCart);
router.post("/:cid/purchase",authorization(['user']),  ticketscontroller.purchaseCart)


module.exports = {
  router,
};
 