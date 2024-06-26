const {
  CartsService,
  UsersService,
} = require("../service/index");

class CartsController {
  constructor() {
    this.cartsService = new CartsService();
    this.usersService = new UsersService();
  }

  getCartByEmail = async (email) => {
    try {
      const user = await this.usersService.getUserBy({ email });
      if (!user) {
        throw new Error("Usuario no encontrado");
      }

      const cart = await this.cartsService.findOne({ userId: user._id }).lean();
      return cart;
    } catch (error) {
      console.error("Error al obtener el carrito por email:", error);
      throw new Error("Error al obtener el carrito por email");
    }
  };

  getCart = async (req, res) => {
    const { cid } = req.params;
    try {
      const carrito = await this.cartsService.getCartById(cid);
      if (carrito) {
        res.send({ status: "success", payload: carrito });
        // res.json(carrito);
      } else {
        res.status(404).json({ error: `Carrito con ID ${cid} no encontrado` });
      }
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "Error al obtener el carrito" });
    }
  };

  createCart = async (req, res) => {
    try {
      const cartNumber = await this.cartsService.createCart();
      if (cartNumber) {
        res.json(`Carrito con id ${cartNumber} creado exitosamente`);
      }
    } catch (error) {
      console.log(error)
      res.status(500).json({ error: "Error al inicializar el carrito" });
    }
  }

  addProductToCart = async (req, res) => {
    const { cid, pid } = req.params;
  
    try {
      const result = await this.cartsService.addProductToCart(
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
  }

  emptyCart = async (req,res) =>{
    const { cid } = req.params;
    try {
      const result = await this.cartsService.emptyCart(cid);
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
  }

  deleteProductFromCart = async (req,res) => {
    const { cid, pid } = req.params;
  
    try {
      const result = await this.cartsService.deleteProductFromCart(
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
  }

  addProductsToCart = async (req,res) =>{
    const { cid } = req.params;
    const newProducts = req.body;
  
    try {
      const result = await this.cartsService.addProductsToCart(
        cid,  newProducts
      );
  
  
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
  }

  updateProductQuantity = async (req,res) =>{
    const { cid, pid } = req.params;
    const newQuantity = req.body.newQuantity;
  
  
    try {
      const result = await this.cartsService.updateProductQuantity(
        cid, pid, newQuantity
      );
  
        if (result && result.modifiedCount >0 ) {
          // res.send({status: 'success', payload: result})
          res
        .status(200)
        .json({status: 200, productName: result.productName , message: `Cantidad del producto con pid ${pid} actualizado a ${newQuantity}.` });
        } else {
          res.status(404).json({ error: `Carrito con ID ${cid} no existe o Producto ${pid} no encontrado en el carrito` });
        }
  
    } catch (error) {
      console.log(error)
      res.status(500).json({ error: "Error al actualizar la cantidad del producto en el carrito." });
    }
  
  }

}

module.exports={CartsController}
