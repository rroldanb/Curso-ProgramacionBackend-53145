const { Router } = require("express");
const router = Router();

const  {CartsController}  = require("../../controllers/carts.controller");
const { authorization } = require('../../middlewares/auth.middleware');
const { purchaseCart } = require("../../controllers/tickets.controller");

const { getCart, createCart, deleteProductFromCart, emptyCart, addProductToCart, 
  addProductsToCart, updateProductQuantity} = new CartsController()

router.get("/:cid",authorization(['user']), getCart);
router.post("/",authorization(['user']),  createCart);
router.post("/:cid/product/:pid",authorization(['user']),  addProductToCart);
router.delete("/:cid",authorization(['user']),  emptyCart);
router.delete("/:cid/product/:pid",authorization(['user']),  deleteProductFromCart);
router.put("/:cid",authorization(['user']),  addProductsToCart);
router.put("/:cid/product/:pid",authorization(['user']),  updateProductQuantity)

// router.post("/:cid/purchase",authorization(['user']),  purchaseTicket)



module.exports = {
  router,
};
