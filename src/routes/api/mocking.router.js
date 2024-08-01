const { Router } = require("express");
const { authorization } = require("../../middlewares/auth.middleware");

const { ProductsController } = require("../../controllers/products.controller");

const productsController = new ProductsController()
const mockingRouter = Router();

mockingRouter.get("/products", authorization(["admin"]), productsController.getMockingProducts);
// mockingRouter.get("/users", authorization(["admin"]), usersController.getMockingUsers);

module.exports = mockingRouter;
