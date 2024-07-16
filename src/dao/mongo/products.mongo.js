const { productsModel } = require("./models/products.model.js");

class ProductDaoMongo {
  constructor() {
    this.productsModel = productsModel;
  }
 
  async validateCode(code) {
    const product = await this.productsModel.findOne({ code: code });
    return !!product;
  }

  async validateId(pid) {
    const product = await this.productsModel.findById(pid);
    return !!product;
  }

  async getCategories() {
    return await this.productsModel.distinct("category");
  }

  async getProducts(filter, options) {
    return await this.productsModel.paginate(filter, options);
  }

  async getProductById(pid) {
    return await this.productsModel.findById(pid);
  }

  async addProduct(product) {
    return await this.productsModel.create(product);
  }

  async updateProduct(pid, updatedFields) {
    return await this.productsModel.updateOne({ _id: pid }, updatedFields);
  }

  async deleteProduct(pid) {
    return await this.productsModel.deleteOne({ _id: pid });
  }
}

module.exports = ProductDaoMongo;
