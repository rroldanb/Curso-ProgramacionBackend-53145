const { cartsModel } = require("./models/carts.model.js");

class CartsManager {
  constructor() {
    this.model = cartsModel;
  }

  getCartByEmail = async (email) =>{
    return await this.model.findOne({ email }).lean();
  }

  createCartForUser = async (userId) =>{
    return await this.model.create({ userId });
  }

  getCartById = async (cid) =>{
    return await this.model.findById(cid).lean();
  }

  createCart = async () =>{
    return await this.model.create({ products: [] });
  }

  updateCartWithUserId = async (cartId, userId) =>{
    return await this.model.findByIdAndUpdate(
      cartId,
      { userId },
      { new: true }
    );
  }

  addProductToCart = async (cid, productId, quantity) =>{
    return await this.model.updateOne(
      { _id: cid, "products.pid": productId },
      { $inc: { "products.$.quantity": quantity } }
    );
  }

  pushProductToCart = async (cid, pid) =>{
    return await this.model.updateOne(
      { _id: cid },
      { $push: { products: { pid, quantity: 1 } } }
    );
  }

  emptyCart = async (cid) =>{
    return await this.model.updateOne({ _id: cid }, { $set: { products: [] } });
  }

  deleteProductFromCart = async (cid, pid) =>{
    return await this.model.updateOne(
      { _id: cid },
      { $pull: { products: { pid } } }
    );
  }

  addProductsToCart = async (cid, newProducts) =>{
    return await this.model.updateOne(
      { _id: cid },
      { $set: { products: newProducts } }
    );
  }

  updateProductQuantity = async (cid, pid, newQuantity) =>{
    return await this.model.updateOne(
      { _id: cid, "products.pid": pid },
      { $set: { "products.$.quantity": newQuantity } }
    );
  }
}

module.exports = CartsManager;
