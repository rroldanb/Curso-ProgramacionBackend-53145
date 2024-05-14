const {productsModel} = require ('./models/products.model.js')

class ProductsManager {

  constructor () {
    this.productsModel = productsModel
  }

  async validaCode(code) {
        const product = await this.productsModel.findOne({ code: code });
        return !!product;
  }
  async validaId(pid) {
        const product = await this.productsModel.findById( pid );
        return !!product;
  }

  async getCategories(){
    const categories = await this.productsModel.distinct("category");
    const categoryArray = Array.from(categories);
    return categoryArray
  }

// FIND ALL ******

  async getProducts(
    findParams = {}) {

      const categoryParam=findParams.categoryParam?findParams.categoryParam:null
      const availableOnly=findParams.availableOnly?findParams.availableOnly:null
      const limitParam=findParams.limitParam?findParams.limitParam:10
      const numPage=findParams.numPage?findParams.numPage:1
      const orderBy=findParams.orderBy?findParams.orderBy:null

    // numPage = parseInt(numPage);
    // limitParam = parseInt(limitParam);

  // console.log("numPage aca", numPage)
  // console.log("limit aca", limitParam)


  const filter = {};
  if (categoryParam !== null) {
      filter.category = categoryParam;
  }

  if (typeof availableOnly === 'boolean') {
      filter.status = availableOnly;
  }

  let sortOptions = {};
  if (orderBy) {
      sortOptions = { price: orderBy === 'asc' ? 1 : -1 };
  }

  const result = await this.productsModel.paginate(filter, {
      limit: limitParam,
      page: numPage,
      lean: true,
      sort: sortOptions
  });
    // console.log("products aca", result);
    const categories = await this.productsModel.distinct("category", filter);
// console.log(categories)
    return result ;
  }

  // FIND ONE
  async getProductById(pid) {
    const product = await this.productsModel.findOne({_id: pid})
    const errNF = `Producto con ID ${pid} no encontrado`;
    return product ? product : errNF;
  }

  //AGREGA PRODUCTO

  /**
   * @param {object} nuevoProducto - Objeto que contiene la información del nuevo producto.
   * @param {string} nuevoProducto.title - Título del producto.
   * @param {string} nuevoProducto.description - Descripción del producto.
   * @param {string} nuevoProducto.code - Código del producto.
   * @param {number} nuevoProducto.price - Precio del producto.
   * @param {boolean} nuevoProducto.status - Stock del producto.
   * @param {number} nuevoProducto.stock - Stock del producto.
   * @param {string} nuevoProducto.category - Código del producto.
   * @param {array} nuevoProducto.thumbnails - Ruta(s) Imagenes del producto.
   */
  async addProduct(nuevoProducto) {
    
    const camposObligatorios = [
      "title",
      "description",
      "code",
      "price",
      "stock",
      "category",
    ];
    for (const campo of camposObligatorios) {
      if (!nuevoProducto[campo]) {
        console.log(`Error: El campo '${campo}' es obligatorio.`);
        return;
      }
    }

    if (typeof nuevoProducto.status !== "boolean") {
      nuevoProducto.status = true;
    }

    let thumbnailsArray = [];
    if (typeof nuevoProducto.thumbnails === "string") {
      thumbnailsArray = [nuevoProducto.thumbnails];
    } else if (Array.isArray(nuevoProducto.thumbnails)) {
      thumbnailsArray = nuevoProducto.thumbnails;
    } else {
      console.log(
        "Error: El campo 'thumbnails' debe ser un string o un array de strings."
      );
      return;
    }

    const invalidThumbnails = thumbnailsArray.filter(
      (thumbnail) => typeof thumbnail !== "string"
    );
    if (invalidThumbnails.length > 0) {
      console.log(
        "Error: Algunos elementos de 'thumbnails' no son cadenas de texto válidas."
      );
      return;
    }

    const product = {
      title: nuevoProducto.title,
      description: nuevoProducto.description,
      code: nuevoProducto.code,
      price: nuevoProducto.price,
      status: nuevoProducto.status,
      stock: nuevoProducto.stock,
      category: nuevoProducto.category,
      thumbnails: thumbnailsArray,
    };

    const result = await this.productsModel.create(product)
    return result
  }

  async updateProduct(pid, updatedFields) {
    let result= await this.productsModel.updateOne({_id:pid}, updatedFields)
    // console.log(result)
    return result;
  }

  async deleteProduct(pid) {
    const result = await this.productsModel.deleteOne({_id:pid})
    return (result)
  }


}

module.exports = ProductsManager;

// export default { ProductsManager };
