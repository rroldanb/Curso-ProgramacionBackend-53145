// const path = require("path");
// const fs = require("fs");
// const ProductsManager = require("./ProductsFSManager.js");
// const productsPath = path.join(__dirname, "..", "data", "productos.json");
const ProductsManager = require("../dao/ProductsMongo.manager.js");
const { cartsModel } = require("./models/carts.model.js");

class CartsManager {
  #carts;

  constructor() {
    this.#carts = [];
  }

  // async getCarts() {
  //   await this.#readFile();
  //   if (this.#carts) {
  //     return this.#carts;
  //   } else {
  //     console.log(
  //       "No se ha leído el archivo aún, ejecute el archivo nuevamente"
  //     );
  //     return [];
  //   }
  // }

  async getCartById(cid) {
    try {
      const cart = await cartsModel.findById( cid );
      // const cart = await cartsModel.find()

      const errNF = `Carrito con ID ${cid} no encontrado`;
      return cart ? cart : errNF;
    } catch (error) {
      console.log(error);
    }
  }

  async createCart() {
    const products = [];
    const result = await cartsModel.create({ products });
    const cartId = result._id.toString();

    console.log("Carrito creado con ID:", cartId);
    return cartId;
  }

  async addProductToCart(cid, pid) {
    const productsManager = new ProductsManager();

    const validPid = await productsManager.validaId(pid);
    if (!validPid ){
      console.log(`Producto con ID ${pid} no encontrado` )
      return `Producto con ID ${pid} no encontrado`;
    }
    

    const cart = await cartsModel.findById(cid);

    if (!cart) {
      console.log("Error: No existe un carrito con id:", cid);
      return `Carrito con ID ${cid} no encontrado`;
    }

    const existingProductIndex = cart.products.findIndex(
      (cartProduct) => cartProduct.pid.toString() === pid
    );


    if (existingProductIndex !== -1) {
      const updateResult = await cartsModel.updateOne(
          { _id: cid, "products.pid": pid },
          { $inc: { "products.$.quantity": 1 } }
      );
      console.log("Cantidad del producto actualizado en el carrito correctamente.");
      return updateResult;
  } else {
      const updateResult = await cartsModel.updateOne(
          { _id: cid },
          { $push: { products: { pid: pid, quantity: 1 } } }
      );
      console.log("Producto agregado al carrito correctamente.");
      return updateResult;



    // if (existingProductIndex !== -1) {
    //   cart.products[existingProductIndex].quantity += 1;
    // } else {
    //   cart.products.push({ pid: pid, quantity: 1 });
    // }

    // const result = await cart.save();

    // console.log("Producto agregado al carrito correctamente.");
    // return result;
  }
}
}

module.exports = CartsManager;
