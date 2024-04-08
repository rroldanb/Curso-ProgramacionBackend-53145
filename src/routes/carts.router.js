const path = require("path");
const CartsManager = require("../services/CartsManager.js");
const cartsPath = path.join(__dirname, "..", "data", "carrito.json");
const cartsManager = new CartsManager(cartsPath);

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
      res.status(500).json({ error: "Error al obtener los carritos" });
    }
  });

router.get("/:cid", async (req, res) => {
    const { cid } = req.params;
    try {
      const carrito = await cartsManager.getCartById(parseInt(cid));
      if (carrito) {
        // res.send({status: 'success', payload: carrito})
        res.json(carrito);
      } else {
        res.status(404).json({ error: `Carrito con ID ${cid} no encontrado` });
      }
    } catch (error) {
      res.status(500).json({ error: "Error al obtener el carrito" });
    }
  });


router.post("/", async (req, res) => {
    try{
      const cartNumber = await cartsManager.createCart();
        if (cartNumber){
        res.json(`Carrito con id ${cartNumber} creado exitosamente`);

        }

    }catch (error) {

        res.status(500).json({ error: "Error al inicializar el carrito" });

    }
})

router.post("/:cid/product/:pid", async (req, res) => {
    const { cid, pid } = req.params;
  
    // VALIDA VALORES NUMERICOS
    if (isNaN(cid)) {
        return res
          .status(400)
          .json({ error: `El cid debe ser numérico` });
      }
    if (isNaN(pid)) {
        return res
          .status(400)
          .json({ error: `El pid debe ser numérico` });
      }

    try {
        const result = await cartsManager.addProductToCart(parseInt(cid), parseInt(pid));
      if (typeof result === 'string') {
        return res.status(404).json({ error: result });
    }
      res.status(200).json({ message: `Producto con pid ${pid} agregado con éxito al carrito ${cid} `});
    } catch (error) {
      res.status(500).json({ error: "Error al agregar producto al carrito." });
    }
  });
  

module.exports = {
    router,
  };
  


/*
La ruta GET /:cid deberá listar los productos que pertenezcan al carrito con el parámetro cid proporcionados.
La ruta raíz POST / deberá crear un nuevo carrito con la siguiente estructura:
- Id:Number/String (A tu elección, de igual manera como con los productos, debes asegurar que nunca se dupliquen los ids y que este se autogenere).
- products: Array que contendrá objetos que representen cada producto
✓ La ruta POST /:cid/product/:pid deberá agregar el producto al arreglo “products” del carrito seleccionado, agregándose como un objeto bajo el siguiente formato:
- product: SÓLO DEBE CONTENER EL ID DEL PRODUCTO (Es crucial que no agregues el producto completo)
- quantity: debe contener el número de ejemplares de dicho producto. El producto, de momento, se agregará de uno en uno.
Además, si un producto ya existente intenta agregarse al producto, incrementar el campo quantity de dicho producto.
*/