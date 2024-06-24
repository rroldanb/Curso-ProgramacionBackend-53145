
const { Router } = require("express");
const { ProductsController } = require("../../controllers/products.controller");

const router = Router();

const {getProducts, getProduct, createProduct, updateProduct, deleteProduct} = new ProductsController()

router.get("/", getProducts)
router.get("/:pid", getProduct)
router.post("/", createProduct)
router.put("/:pid", updateProduct)
router.delete("/:pid", deleteProduct)

module.exports = {
  router,
};
