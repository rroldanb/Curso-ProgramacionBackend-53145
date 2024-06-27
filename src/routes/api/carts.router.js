const { Router } = require("express");
const router = Router();

const  {CartsController}  = require("../../controllers/carts.controller");

const { getCart, createCart, deleteProductFromCart, emptyCart, addProductToCart, 
  addProductsToCart, updateProductQuantity} = new CartsController()

router.get("/:cid", getCart);
router.post("/", createCart);
router.post("/:cid/product/:pid", addProductToCart);
router.delete("/:cid", emptyCart);
router.delete("/:cid/product/:pid", deleteProductFromCart);
router.put("/:cid", addProductsToCart);
router.put("/:cid/product/:pid", updateProductQuantity)

module.exports = {
  router,
};
