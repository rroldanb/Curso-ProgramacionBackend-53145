const { CartsService, UsersService, ProductsService } = require("../services/index");

class CartsController {
  constructor() {
    this.cartsService =  CartsService;
    this.usersService =  UsersService;
    this.productsService =  ProductsService;
  }

  getCartByEmail = async (req, res) => {
    const { email } = req.params;
    try {
      const user = await this.usersService.getUserBy({ email });
      if (!user) {
        return res.status(404).json({ error: "Usuario no encontrado" });
      }
      // const cart = await this.cartsService.getCartByEmail({userId: user._id});
      res.json(cart);
    } catch (error) {
      console.error("Error al obtener el carrito por email:", error);
      res.status(500).json({ error: "Error al obtener el carrito por email" });
    }
  };

  createCartForUser = async (req, res) => {
    const { email } = req.params;
    try {
      const user = await this.usersService.getUserBy({ email });
      if (!user) {
        return res.status(404).json({ error: "Usuario no encontrado" });
      }

      const newCart = await this.cartsService.createCartForUser(user._id);
      res.json(newCart);
    } catch (error) {
      console.error("Error al crear el carrito para el usuario:", error);
      res.status(500).json({ error: "Error al crear el carrito para el usuario" });
    }
  };

  getCart = async (req, res) => {
    const { cid } = req.params;
    try {
      const cart = await this.cartsService.getCartById(cid);
      if (cart) {
        res.json(cart);
      } else {
        res.status(404).json({ error: `Carrito con ID ${cid} no encontrado` });
      }
    } catch (error) {
      console.error("Error al obtener el carrito:", error);
      res.status(500).json({ error: "Error al obtener el carrito" });
    }
  };

  createCart = async (req, res) => {
    try {
      const cart = await this.cartsService.createCart();
      res.json(cart);
    } catch (error) {
      console.error("Error al crear el carrito:", error);
      res.status(500).json({ error: "Error al crear el carrito" });
    }
  };

  updateCartWithUserId = async (req, res) => {
    const { cartId, userId } = req.body;
    try {
      const updatedCart = await this.cartsService.updateCartWithUserId(cartId, userId);
      if (!updatedCart) {
        return res.status(404).json({ error: 'Cart not found' });
      }
      res.json(updatedCart);
    } catch (error) {
      console.error(`Error updating cart with user ID: ${error.message}`);
      res.status(500).json({ error: `Error updating cart with user ID: ${error.message}` });
    }
  };

  addProductToCart = async (req, res) => {
    const { cid, pid } = req.params;

    try {
      
      const validPid = await this.productsService.validateId(pid);
      if (!validPid) {
        return res.status(404).json({ error: `Producto con ID ${pid} no encontrado` });
      }

      const cart = await this.cartsService.getCartById(cid);
      if (!cart) {
        return res.status(404).json({ error: `Carrito con ID ${cid} no encontrado` });
      }

      const existingProductIndex = cart.products.findIndex(
        (cartProduct) => cartProduct.pid._id.toString() === pid
      );

      let result;
      if (existingProductIndex !== -1) {
        result = await this.cartsService.addProductToCart(cid, pid, 1);
      } else {
        result = await this.cartsService.pushProductToCart(cid, pid);
      }

      res.status(200).json({
        message: `Producto con pid ${pid} agregado con éxito al carrito ${cid}`,
      });
    } catch (error) {
      console.error("Error al agregar producto al carrito:", error);
      res.status(500).json({ error: "Error al agregar producto al carrito." });
    }
  };

  emptyCart = async (req, res) => {
    const { cid } = req.params;
    try {
      const result = await this.cartsService.emptyCart(cid);
      if (result && result.modifiedCount > 0) {
        res.json({ message: "Carrito vaciado correctamente" });
      } else {
        res.status(404).json({ error: `Carrito con ID ${cid} no encontrado` });
      }
    } catch (error) {
      console.error("Error al vaciar el carrito:", error);
      res.status(500).json({ error: "Error al vaciar el carrito" });
    }
  };

  deleteProductFromCart = async (req, res) => {
    const { cid, pid } = req.params;

    try {
      const result = await this.cartsService.deleteProductFromCart(cid, pid);
      if (result && result.modifiedCount > 0) {
        res.status(200).json({
          message: `Producto con pid ${pid} eliminado del carrito ${cid}.`,
        });
      } else {
        res.status(404).json({
          error: `Carrito con ID ${cid} no existe o Producto ${pid} no encontrado en el carrito`,
        });
      }
    } catch (error) {
      console.error("Error al eliminar producto del carrito:", error);
      res.status(500).json({ error: "Error al eliminar producto del carrito." });
    }
  };

  addProductsToCart = async (req, res) => {
    const { cid } = req.params;
    const newProducts = req.body;

    try {
      const result = await this.cartsService.addProductsToCart(cid, newProducts);
      if (result && result.modifiedCount > 0) {
        res.status(200).json({ message: `Carrito con ID ${cid} actualizado` });
      } else {
        res.status(404).json({ error: `Carrito con ID ${cid} no existe` });
      }
    } catch (error) {
      console.error("Error al actualizar el carrito:", error);
      res.status(500).json({ error: "Error al actualizar el carrito." });
    }
  };

  updateProductQuantity = async (req, res) => {
    const { cid, pid } = req.params;
    const { newQuantity } = req.body;

    try {
      const result = await this.cartsService.updateProductQuantity(cid, pid, newQuantity);
      if (result && result.modifiedCount > 0) {

        res.send({
          status: "success",
          payload: result.docs,
        
          message: `Cantidad del producto con pid ${pid} actualizado a ${newQuantity}.`,
        });
      } else {
        res.status(404).json({
          error: `Carrito con ID ${cid} no existe o Producto ${pid} no encontrado en el carrito`,
        });
      }
    } catch (error) {
      console.error("Error al actualizar la cantidad del producto en el carrito:", error);
      res.status(500).json({ error: "Error al actualizar la cantidad del producto en el carrito." });
    }
  };
}

module.exports = { CartsController };

