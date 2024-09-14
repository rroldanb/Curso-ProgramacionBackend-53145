class CartRepository {
  constructor(CartDao) {
    this.cartDao =  CartDao;
  }


  getCartByEmail = async (email) =>{
    return await this.cartDao.getCartByEmail(email);
  }

  createCartForUser = async (userId) =>{
    return await this.cartDao.createCartForUser(userId);
  }

  getCartById = async (cid) =>{
    return await this.cartDao.getCartById(cid);
  }

  createCart = async () =>{
    return await this.cartDao.createCart();
  }

  updateCartWithUserId = async (cartId, userId) =>{
    return await this.cartDao.updateCartWithUserId(cartId, userId);
  }

  addProductToCart = async (cid, productId, quantity) =>{
    return await this.cartDao.addProductToCart(cid, productId, quantity);
  }

  pushProductToCart = async (cid, pid) =>{
    return await this.cartDao.pushProductToCart(cid, pid);
  }

  emptyCart = async (cid) =>{
    return await this.cartDao.emptyCart(cid);
  }

  deleteProductFromCart = async (cid, pid) =>{
    return await this.cartDao.deleteProductFromCart(cid, pid);
  }

  addProductsToCart = async (cid, newProducts) =>{
    return await this.cartDao.addProductsToCart(cid, newProducts);
  }

  updateProductQuantity = async (cid, pid, newQuantity) =>{
    return await this.cartDao.updateProductQuantity(cid, pid, newQuantity);
  }


}

module.exports = CartRepository;
