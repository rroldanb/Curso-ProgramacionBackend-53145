class CartRepository {
  constructor(CartDao) {
    this.cartsManager =  CartDao;
  }


  async getCartByEmail(email) {
    return await this.cartsManager.getCartByEmail(email);
  }

  async createCartForUser(userId) {
    return await this.cartsManager.createCartForUser(userId);
  }

  async getCartById(cid) {
    return await this.cartsManager.getCartById(cid);
  }

  async createCart() {
    return await this.cartsManager.createCart();
  }

  async updateCartWithUserId(cartId, userId) {
    return await this.cartsManager.updateCartWithUserId(cartId, userId);
  }

  async addProductToCart(cid, productId, quantity) {
    return await this.cartsManager.addProductToCart(cid, productId, quantity);
  }

  async pushProductToCart(cid, pid) {
    return await this.cartsManager.pushProductToCart(cid, pid);
  }

  async emptyCart(cid) {
    return await this.cartsManager.emptyCart(cid);
  }

  async deleteProductFromCart(cid, pid) {
    return await this.cartsManager.deleteProductFromCart(cid, pid);
  }

  async addProductsToCart(cid, newProducts) {
    return await this.cartsManager.addProductsToCart(cid, newProducts);
  }

  async updateProductQuantity(cid, pid, newQuantity) {
    return await this.cartsManager.updateProductQuantity(cid, pid, newQuantity);
  }
}

module.exports = CartRepository;
