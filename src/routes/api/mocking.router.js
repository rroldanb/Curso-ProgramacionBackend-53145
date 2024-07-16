const { Router } = require("express");
const { authorization } = require("../../middlewares/auth.middleware");
const {
  generateUsers,
  generateProducts,
} = require("../../utils/generateMocks");

const mockingRouter = Router();

mockingRouter.get("/products", authorization(["admin"]), async (req, res) => {
  let products = [];
  try {
    for (let i = 0; i < 10; i++) {
      products.push(generateProducts());
    }

    res.status(200).send({ status: "success", payload: products });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error al crear los productos Mocking");
  }

  mockingRouter.get("/users", authorization(["admin"]), async (req, res) => {
    let users = [];
    try {
      for (let i = 0; i < 10; i++) {
        users.push(generateUsers());
      }
      res.status(200).send({ status: "success", payload: users });
    } catch (error) {
      console.error(error);
      res.status(500).send("Error al crear los usuarios Mocking");
    }
  });
});

module.exports = mockingRouter;
