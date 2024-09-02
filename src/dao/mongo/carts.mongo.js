const { cartsModel } = require("./models/carts.model.js");

class CartsDaoMongo {
  constructor() {
    this.cartsModel = cartsModel;
  }

  getCartByEmail = async (email) =>{
    return await this.cartsModel.findOne({ email }).lean();
  }

  createCartForUser = async (userId) =>{
    return await this.cartsModel.create({ userId });
  }

  getCartById = async (cid) =>{
    return await this.cartsModel.findById(cid).lean();
  }

  createCart = async () =>{
    return await this.cartsModel.create({ products: [] });
  }

  updateCartWithUserId = async (cartId, userId) =>{
    return await this.cartsModel.findByIdAndUpdate(
      cartId,
      { userId },
      { new: true }
    );
  }

  addProductToCart = async (cid, productId, quantity) =>{
    return await this.cartsModel.updateOne(
      { _id: cid, "products.pid": productId },
      { $inc: { "products.$.quantity": quantity } }
    );
  }

  pushProductToCart = async (cid, pid) =>{
    return await this.cartsModel.updateOne(
      { _id: cid },
      { $push: { products: { pid, quantity: 1 } } }
    );
  }

  emptyCart = async (cid) =>{
    return await this.cartsModel.updateOne({ _id: cid }, { $set: { products: [] } });
  }

  deleteProductFromCart = async (cid, pid) =>{
    return await this.cartsModel.updateOne(
      { _id: cid },
      { $pull: { products: { pid } } }
    );
  }

  addProductsToCart = async (cid, newProducts) =>{
    return await this.cartsModel.updateOne(
      { _id: cid },
      { $set: { products: newProducts } }
    );
  }

  updateProductQuantity = async (cid, pid, newQuantity) =>{
    return await this.cartsModel.updateOne(
      { _id: cid, "products.pid": pid },
      { $set: { "products.$.quantity": newQuantity } }
    );
  }
}

module.exports = CartsDaoMongo;
