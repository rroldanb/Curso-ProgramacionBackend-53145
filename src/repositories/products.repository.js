class ProductRepository {
    constructor(ProductDao) {
        this.productDao = ProductDao
    }
  
    validateCode = async (code) => {
      const product = await this.productDao.findOne({ code: code });
      return !!product;
    }
  
    validateId = async (pid) => {
      const product = await this.productDao.findById(pid);
      return !!product;
    }
  
    getCategories = async () => {
      return await this.productDao.distinct("category");
    }
  
    getProducts = async (filter, options) => {
      return await this.productDao.paginate(filter, options);
    }
  
    getProductById = async (pid) => {
      return await this.productDao.findById(pid);
    }
  
    addProduct = async (product) => {
      return await this.productDao.create(product);
    }
  
    updateProduct = async (pid, updatedFields) => {
      return await this.productDao.updateOne({ _id: pid }, updatedFields);
    }
  
    deleteProduct = async (pid) => {
      return await this.productDao.deleteOne({ _id: pid });
    }
  }
  
  module.exports = ProductRepository;