const fs = require("fs");

class ProductsManager {
  #products;
  #contadorId;
  #path;
  #archivoLeido;

  constructor(path) {
    this.#path = path;
    this.#readFile();
  }

  #readFile() {
    try {
      const data = fs.readFileSync(this.#path, "utf-8");
      const [products, contadorId] = JSON.parse(data);
      this.#products = products;
      this.#contadorId = Number(contadorId);
      console.log("Archivo leído correctamente.");
      this.#archivoLeido = true;
    } catch (err) {
      this.#products = [];
      this.#contadorId = 0;
      console.log("No se pudo leer el archivo, creando uno nuevo");
      this.#saveToFile();
    }
  }

  #saveToFile() {
    const dataToSave = [this.#products, this.#contadorId, this.#path];
    const lenghtProductos = this.#products.length;
    try {
      const jsonData = JSON.stringify(dataToSave, null, "\t");
      fs.writeFileSync(this.#path, jsonData, "utf-8");
      const message =
        lenghtProductos > 0
          ? "Archivo guardado correctamente."
          : "Archivo creado correctamente.";
      console.log(message);
      this.#archivoLeido = true;
    } catch (err) {
      console.log("Error al guardar el archivo:", err);
    }
  }

  getProducts() {
    if (this.#archivoLeido) {
      return this.#products;
    } else {
      console.log(
        "No se ha leído el archivo aún, ejecute el archivo nuevamente"
      );
    }
  }

/**
   * @param {object} nuevoProducto - Objeto que contiene la información del nuevo producto.
   * @param {string} nuevoProducto.title - Título del producto.
   * @param {string} nuevoProducto.description - Descripción del producto.
   * @param {number} nuevoProducto.price - Precio del producto.
   * @param {string} nuevoProducto.thumbinal - Imagen del producto.
   * @param {string} nuevoProducto.code - Código del producto.
   * @param {number} nuevoProducto.stock - Stock del producto.
   */
addProduct(nuevoProducto) {
  if (this.#archivoLeido) {
      if (!this.#validateCode(nuevoProducto.code)) {
          const product = {
              id: this.#getNewId(),
              title: nuevoProducto.title,
              description: nuevoProducto.description,
              price: nuevoProducto.price,
              thumbinal: nuevoProducto.thumbinal,
              code: nuevoProducto.code,
              stock: nuevoProducto.stock,
          };
          this.#products.push(product);
          this.#saveToFile();
      } else {
          console.log("Error: El código del producto ya existe");
      }
  }
}


  #validateCode(code) {
    return this.#products.some((product) => product.code === code);
  }

  #getNewId() {
    return ++this.#contadorId;
  }

  getProductById(id) {
    if (!this.#existeProdId(id)) {
      //   console.log("Not found");
      return "Not Found";
    } else {
      const product = this.#products.find((product) => product.id === id);
      return product;
    }
  }

  #existeProdId(id) {
    return this.#products.some((product) => product.id === id);
  }

  #prodIndex(id) {
    return this.#products.findIndex((product) => product.id === id);
  }

  deleteProduct(id) {
    const product = this.#existeProdId(id);
    if (!this.#existeProdId(id)) {
      return console.log("No existe un producto con id: ", id);
    } else {
      const pos = this.#prodIndex(id);
      const deletedProduct = this.#products.splice(pos, 1);
      console.log("Se eliminó el producto con id:", id);
      this.#saveToFile();
    }
  }

  updateProduct(id, updatedFields) {
    if (!this.#existeProdId(id)) {
      console.log("No existe un producto con id:", id);
      return;
    }
    const allowedProperties = [
      "title",
      "description",
      "price",
      "thumbinal",
      "code",
      "stock",
    ];

    const productIndex = this.#prodIndex(id);
    const product = this.getProductById(id);

    for (const key in updatedFields) {
      if (
        Object.hasOwnProperty.call(updatedFields, key) &&
        allowedProperties.includes(key)
      ) {
        product[key] = updatedFields[key];
      } else {
        console.log(
          `La propiedad '${key}' no es una propiedad válida y será omitida.`
        );
      }
    }

    this.#products[productIndex] = product;

    this.#saveToFile();
    return product;
  }
}


module.exports={
 ProductsManager 

}
