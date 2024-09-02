const { ProductsModel } = require("./models/products.model.js");

class ProductDaoMongo {
  constructor() {
    this.productsModel = ProductsModel;
  }

  validateCode = async (code) => {
    const product = await this.productsModel.findOne({ code: code });
    return !!product;
  }

  validateId = async (pid) => {
    const product = await this.productsModel.findById(pid);
    return !!product;
  }

  getCategories = async () => {
    return await this.productsModel.distinct("category");
  }

  getProducts = async (filter, options) => {
    return await this.productsModel.paginate(filter, options);
  }

  getProductById = async (pid) => {
    return await this.productsModel.findById(pid);
  }

  addProduct = async (product) => {
    return await this.productsModel.create(product);
  }

  updateProduct = async (pid, updatedFields) => {
    return await this.productsModel.updateOne({ _id: pid }, updatedFields);
  }

  deleteProduct = async (pid) => {
    return await this.productsModel.deleteOne({ _id: pid });
  }
}


module.exports = ProductDaoMongo;
