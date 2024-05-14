const path = require("path");
const cartsPath = path.join(__dirname, "..", "data", "carrito.json");
const CartsManager = require("../dao/CartsMongo.manager.js");
const cartsManager = new CartsManager();

const { Router } = require("express");

const router = Router();

router.get("/", async (req, res) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit) : undefined;
      if (limit && (!Number.isInteger(limit) || limit <= 0)) {
        return res.status(400).json({
          error: 'El parámetro "limit" debe ser un número entero positivo',
        });
      }
      let carts = await cartsManager.getCarts();
      if (limit !== undefined) {
        carts = carts.slice(0, limit);
      }
      res.json(carts);
    } catch (error) {
    console.log(error)
    res.status(500).json({ error: "Error al obtener los carritos" });
    }
  });

router.get("/:cid", async (req, res) => {
  const { cid } = req.params;
  try {
    const carrito = await cartsManager.getCartById(cid);
    if (carrito) {
      // res.send({status: 'success', payload: carrito})
      res.json(carrito);
    } else {
      res.status(404).json({ error: `Carrito con ID ${cid} no encontrado` });
    }
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: "Error al obtener el carrito" });
  }
});

router.post("/", async (req, res) => {
  try {
    const cartNumber = await cartsManager.createCart();
    if (cartNumber) {
      res.json(`Carrito con id ${cartNumber} creado exitosamente`);
    }
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: "Error al inicializar el carrito" });
  }
});

router.post("/:cid/product/:pid", async (req, res) => {
  const { cid, pid } = req.params;

  try {
    const result = await cartsManager.addProductToCart(
      cid, pid
    );
    if (typeof result === "string") {
      return res.status(404).json({ error: result });
    }
    res
      .status(200)
      .json({
        message: `Producto con pid ${pid} agregado con éxito al carrito ${cid} `,
      });
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: "Error al agregar producto al carrito." });
  }
});

router.delete("/:cid", async (req,res) =>{
  const { cid } = req.params;
  try {
    const result = await cartsManager.emptyCart(cid);
    if (result && result.modifiedCount >0 ) {
      // res.send({status: 'success', payload: result})
      res.json({ message: "Carrito vaciado correctamente" });
    } else {
      res.status(404).json({ error: `Carrito con ID ${cid} no encontrado` });
    }
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: "Error al vaciar el carrito" });
  }
})

router.delete("/:cid/product/:pid", async (req,res) => {
  const { cid, pid } = req.params;

  try {
    const result = await cartsManager.deleteProductFromCart(
      cid, pid
    );

      if (result && result.modifiedCount >0 ) {
        // res.send({status: 'success', payload: result})
        res
      .status(200)
      .json({ message: `Producto con pid ${pid} eliminado del carrito ${cid}.` });
      } else {
        res.status(404).json({ error: `Carrito con ID ${cid} no existe o Producto ${pid} no encontrado en el carrito` });
      }

  } catch (error) {
    console.log(error)
    res.status(500).json({ error: "Error al eliminar producto del carrito." });
  }
})

router.put("/:cid", async (req,res) =>{
  const { cid } = req.params;
  const newProducts = req.body;

  // console.log("cid", cid)
  // console.log("newProducts", newProducts)

  try {
    const result = await cartsManager.addProductsToCart(
      cid,  newProducts
    );

// console.log("result", result)

      if (result && result.modifiedCount >0 ) {
        // res.send({status: 'success', payload: result})
        res
      .status(200)
      .json({ message: `Carrito con ID ${cid} actualizado` });
      } else {
        res.status(404).json({ error: `Carrito con ID ${cid} no existe` });
      }

  } catch (error) {
    console.log(error)
    res.status(500).json({ error: "Error al actualizar el carrito." });
  }
})

router.put("/:cid/product/:pid", async (req,res) =>{
  const { cid, pid } = req.params;
  const newQuantity = req.body.newQuantity;

  // console.log("cid", cid)
  // console.log("pid", pid)

  try {
    const result = await cartsManager.updateProductQuantity(
      cid, pid, newQuantity
    );
      if (result && result.modifiedCount >0 ) {
        // res.send({status: 'success', payload: result})
        res
      .status(200)
      .json({ message: `Cantidad del producto con pid ${pid} actualizado a ${newQuantity}.` });
      } else {
        res.status(404).json({ error: `Carrito con ID ${cid} no existe o Producto ${pid} no encontrado en el carrito` });
      }

  } catch (error) {
    console.log(error)
    res.status(500).json({ error: "Error al actualizar la cantidad del producto en el carrito." });
  }

})

module.exports = {
  router,
};
