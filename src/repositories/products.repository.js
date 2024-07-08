class ProductRepository {
    constructor(ProductDao) {
        this.productDao = ProductDao
    }
  
    async validateCode(code) {
      return await this.productDao.validateCode(code);
    }
  
    async validateId(pid) {
      return await this.productDao.validateId(pid);
    }
  
    async getCategories() {
      return await this.productDao.getCategories();
    }
  
    async getProducts(filter, options) {
      return await this.productDao.getProducts(filter, options);
    }
  
    async getProductById(pid) {
      return await this.productDao.getProductById(pid);
    }
  
    async addProduct(product) {
      return await this.productDao.addProduct(product);
    }
  
    async updateProduct(pid, updatedFields) {
      return await this.productDao.updateProduct(pid, updatedFields);
    }
  
    async deleteProduct(pid) {
      return await this.productDao.deleteProduct(pid);
    }
  }
  
  module.exports = ProductRepository;