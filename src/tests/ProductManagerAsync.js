const fs = require("fs");

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

  async #readFile() {
    try {
      const data = await fs.promises.readFile(this.#path, "utf-8");
      const [products, contadorId] = JSON.parse(data);
      this.#products = products;
      this.#contadorId = Number(contadorId);
      this.#archivoLeido = true;
      console.log("Archivo leído correctamente.");
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
        JSON.stringify(
          [this.#products, this.#contadorId, this.#path],
          null,
          "\t"
        ),
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

/**
   * @param {object} nuevoProducto - Objeto que contiene la información del nuevo producto.
   * @param {string} nuevoProducto.title - Título del producto.
   * @param {string} nuevoProducto.description - Descripción del producto.
   * @param {number} nuevoProducto.price - Precio del producto.
   * @param {string} nuevoProducto.thumbinal - Imagen del producto.
   * @param {string} nuevoProducto.code - Código del producto.
   * @param {number} nuevoProducto.stock - Stock del producto.
   */
async addProduct(nuevoProducto) {
  await this.#readFile();
  if (!this.#archivoLeido) {
      console.log("No se ha leído el archivo aún, ejecute el archivo nuevamente");
      return;
  }

  if (this.#validateCode(nuevoProducto.code)) {
      console.log("Error: El código del producto ya existe");
      return;
  }

  this.#contadorId++;
  const product = {
      id: this.#contadorId,
      title: nuevoProducto.title,
      description: nuevoProducto.description,
      price: nuevoProducto.price,
      thumbinal: nuevoProducto.thumbinal,
      code: nuevoProducto.code,
      stock: nuevoProducto.stock,
  };

  this.#products.push(product);
  await this.#saveToFile();
}


  #validateCode(code) {
    return this.#products.some((product) => product.code === code);
  }

  #prodIndex(id) {
    return this.#products.findIndex((product) => product.id === id);
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
      console.log("No existe un producto con id:", id);
      return;
    }
    this.#products.splice(index, 1);
    await this.#saveToFile();
    console.log("Se eliminó el producto con id:", id);
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
      console.log("No existe un producto con id:", id);
      return;
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

  async getProductById(id) {
    await this.#readFile();

    if (!this.#archivoLeido) {
      console.log(
        "No se ha leído el archivo aún, ejecute el archivo nuevamente"
      );
      return;
    }
    const product = this.#products.find((product) => product.id === id);
    return product ? product : "Not Found";
  }
}


module.exports={
  ProductsManager 
 
 }