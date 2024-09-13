class ProductRepository {
    constructor(ProductDao) {
        this.productDao = ProductDao
    }
  
    validateCode = async (code) => {
      return await this.productDao.validateCode(code);
    }
  
    validateId = async (pid) => {
      return await this.productDao.validateId(pid);
    }
  
    getCategories = async () => {
      return await this.productDao.getCategories();
    }
  
    getProducts = async (filter, options) => {
      return await this.productDao.getProducts(filter, options);
    }
  
    getProductById = async (pid) => {
      return await this.productDao.getProductById(pid);
    }
  
    addProduct = async (product) => {
      return await this.productDao.addProduct(product);
    }
  
    updateProduct = async (pid, updatedFields) => {
      return await this.productDao.updateProduct(pid, updatedFields);
    }
  
    deleteProduct = async (pid) => {
      return await this.productDao.deleteProduct(pid);
    }
  }
   
  module.exports = ProductRepository;