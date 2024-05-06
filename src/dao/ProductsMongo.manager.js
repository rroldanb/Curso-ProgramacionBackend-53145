const {productsModel} = require ('./models/products.model.js')

class ProductsManager {

  async validaCode(code) {
        const product = await productsModel.findOne({ code: code });
        return !!product;
  }
  async validaId(pid) {
        const product = await productsModel.findById( pid );
        return !!product;
  }


// FIND ALL ******

  async getProducts(limit) {
    let products
    if (limit !== undefined) {
      products = await productsModel.find({}).limit(limit);
   }else{
      products = await productsModel.find({}).lean();
   }
    return( products)
  }

  // FIND ONE
  async getProductById(pid) {
    const product = await productsModel.findOne({_id: pid})
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

    const result = await productsModel.create(product)
    return result
  }

  async updateProduct(pid, updatedFields) {
    let result= await productsModel.updateOne({_id:pid}, updatedFields)
    // console.log(result)
    return result;
  }

  async deleteProduct(pid) {
    const result = await productsModel.deleteOne({_id:pid})
    return (result)
  }


}

module.exports = ProductsManager;

// export default { ProductsManager };
