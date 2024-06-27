const { cartsModel } = require("./models/carts.model.js");

class CartsManager {
  constructor() {
    this.model = cartsModel;
  }

  async getCartByEmail(email) {
    console.log('userId CMM L 9', email)
    return await this.model.findOne({ email }).lean();
  }

  async createCartForUser(userId) {
    return await this.model.create({ userId });
  }

  async getCartById(cid) {
    return await this.model.findById(cid).lean();
  }

  async createCart() {
    return await this.model.create({ products: [] });
  }

  async updateCartWithUserId(cartId, userId) {
    return await this.model.findByIdAndUpdate(cartId, { userId }, { new: true });
  }

  async addProductToCart(cid, productId, quantity) {
    return await this.model.updateOne(
      { _id: cid, "products.pid": productId },
      { $inc: { "products.$.quantity": quantity } }
    );
  }

  async pushProductToCart(cid, pid) {
    return await this.model.updateOne(
      { _id: cid },
      { $push: { products: { pid, quantity: 1 } } }
    );
  }

  async emptyCart(cid) {
    return await this.model.updateOne({ _id: cid }, { $set: { products: [] } });
  }

  async deleteProductFromCart(cid, pid) {
    return await this.model.updateOne(
      { _id: cid },
      { $pull: { products: { pid } } }
    );
  }

  async addProductsToCart(cid, newProducts) {
    return await this.model.updateOne(
      { _id: cid },
      { $set: { products: newProducts } }
    );
  }

  async updateProductQuantity(cid, pid, newQuantity) {


 
    return await this.model.updateOne(
      { _id: cid, "products.pid": pid },
      { $set: { "products.$.quantity": newQuantity } }
    );
  }
}

module.exports = CartsManager;
