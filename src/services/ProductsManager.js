const fs = require("fs");
// import * as fs from 'fs';

class ProductsManager {
  #products;
  #contadorId;
  #archivoLeido;
  #path;

  constructor(path) {
    this.#path = path;
    this.#products = [];
    this.#contadorId = 0;
    this.#archivoLeido = false;
    this.#readFile();
  }

  async validaCode(code) {
    return this.#products.some((product) => product.code === code);
  }

  #prodIndex(id) {
    return this.#products.findIndex((product) => product.id === id);
  }

  async #readFile() {
    try {
      const data = await fs.promises.readFile(this.#path, "utf-8");
      const [products, contadorId] = JSON.parse(data);
      this.#products = products;
      this.#contadorId = Number(contadorId);
      this.#archivoLeido = true;
      // console.log("Archivo leído correctamente.");
    } catch (err) {
      if (!this.#archivoLeido) {
        console.log("No se pudo leer el archivo, creando uno nuevo.");
        await this.#saveToFile();
      } else {
        console.log("error al leer el archivo", err);
        return;
      }
    }
  }

  async #saveToFile() {
    try {
      await fs.promises.writeFile(
        this.#path,
        JSON.stringify([this.#products, this.#contadorId], null, "\t"),
        "utf-8"
      );

      this.#archivoLeido = true;
      const message =
        this.#products.length > 0
          ? "Archivo guardado correctamente."
          : "No se pudo leer el archivo, creando uno nuevo.";

      console.log(message);
    } catch (err) {
      console.log("Error al guardar el archivo:", err);
      this.#archivoLeido = false;
    }
  }

  async getProducts() {
    await this.#readFile();
    if (this.#products) {
      return this.#products;
    } else {
      console.log(
        "No se ha leído el archivo aún, ejecute el archivo nuevamente"
      );
      return [];
    }
  }

  async getProductById(id) {
    await this.#readFile();

    if (!this.#archivoLeido) {
      console.log(
        "No se ha leído el archivo aún, ejecute el archivo nuevamente"
      );
      return;
    }
    const index = this.#prodIndex(id);

    if (index === -1) {
      console.log("Error: No existe un producto con id:", id);
    }



    const product = this.#products.find((product) => product.id === id);
    const errNF = `Producto con ID ${id} no encontrado`;

    return product ? product : errNF;
  }
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
    await this.#readFile();
    if (!this.#archivoLeido) {
      console.log(
        "No se ha leído el archivo aún, ejecute el archivo nuevamente"
      );
      return;
    }

    if (await this.validaCode(nuevoProducto.code)) {
      // console.log("Error: El código del producto ya existe");
      return true;
    }

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

    this.#contadorId++;

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
      id: this.#contadorId,
      title: nuevoProducto.title,
      description: nuevoProducto.description,
      code: nuevoProducto.code,
      price: nuevoProducto.price,
      status: nuevoProducto.status,
      stock: nuevoProducto.stock,
      category: nuevoProducto.category,
      thumbnails: thumbnailsArray,
    };

    this.#products.push(product);
    await this.#saveToFile();
  }

  async updateProduct(id, updatedFields) {
    await this.#readFile();

    if (!this.#archivoLeido) {
      console.log(
        "No se ha leído el archivo aún, ejecute el archivo nuevamente"
      );
      return;
    }

    const index = this.#prodIndex(id);

    if (index === -1) {
      return false;
    }

    const product = this.#products[index];
    for (const key in updatedFields) {
      if (
        Object.hasOwnProperty.call(updatedFields, key) &&
        product.hasOwnProperty(key)
      ) {
        product[key] = updatedFields[key];
      } else {
        console.log(
          `La propiedad '${key}' no es una propiedad válida y será omitida.`
        );
      }
    }

    await this.#saveToFile();
    return product;
  }

  async deleteProduct(id) {
    await this.#readFile();

    if (!this.#archivoLeido) {
      console.log(
        "No se ha leído el archivo aún, ejecute el archivo nuevamente"
      );
      return;
    }

    const index = this.#prodIndex(id);
    if (index === -1) {
      return false;
    }
    this.#products.splice(index, 1);
    await this.#saveToFile();
    return true;
  }


}

module.exports = ProductsManager;

// export default { ProductsManager };
