const path = require("path");
const fs = require("fs");
const ProductsManager = require("./ProductsManager.js");
const productsPath = path.join(__dirname, "..", "data", "productos.json");

class CartsManager {
  #carts;
  #contadorId;
  #archivoLeido;
  #path;

  constructor(path) {
    this.#path = path;
    this.#carts = [];
    this.#contadorId = 0;
    this.#archivoLeido = false;
    this.#readFile();
  }

  #cartIndex(cid) {
    return this.#carts.findIndex((cart) => cart.id === cid);
  }
  async #readFile() {
    try {
      const data = await fs.promises.readFile(this.#path, "utf-8");
      const [carts, contadorId] = JSON.parse(data);
      this.#carts = carts;
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
        JSON.stringify([this.#carts, this.#contadorId], null, "\t"),
        "utf-8"
      );

      this.#archivoLeido = true;
      const message =
        this.#carts.length > 0
          ? "Archivo guardado correctamente."
          : "No se pudo leer el archivo, creando uno nuevo.";

      console.log(message);
    } catch (err) {
      console.log("Error al guardar el archivo:", err);
      this.#archivoLeido = false;
    }
  }


  // async getCarts() {
  //   await this.#readFile();
  //   if (this.#carts) {
  //     return this.#carts;
  //   } else {
  //     console.log(
  //       "No se ha leído el archivo aún, ejecute el archivo nuevamente"
  //     );
  //     return [];
  //   }
  // }

  async getCartById(cid) {
    await this.#readFile();

    if (!this.#archivoLeido) {
      console.log(
        "No se ha leído el archivo aún, ejecute el archivo nuevamente"
      );
      return;
    }
    const index = this.#cartIndex(cid);
    if (index === -1) {
      console.log("Error: No existe un carrito con id:", cid);
    }

    const cart = this.#carts.find((cart) => cart.id === cid);
    const errNF = `Carrito con ID ${cid} no encontrado`;
    return cart ? cart.products : errNF;
  }

  async createCart () {
    await this.#readFile();
    if (!this.#archivoLeido) {
      console.log(
        "No se ha leído el archivo aún, ejecute el archivo nuevamente"
      );
      return;
    }

    this.#contadorId++;

    const cart = {
    id: this.#contadorId,
    products:[]
    }
    this.#carts.push(cart);
    await this.#saveToFile();
    return this.#contadorId;
  }


  async addProductToCart(cid, pid) {
const productsManager = new ProductsManager(productsPath);
await this.#readFile();
    if (!this.#archivoLeido) {
        console.log(
            "No se ha leído el archivo aún, ejecute el archivo nuevamente"
        );
        return;
    }

    const product = await productsManager.getProductById(parseInt(pid));

    if (!product?.id) {
        return `Producto con ID ${pid} no encontrado`;
    }

    const cartIndex = this.#carts.findIndex((cart) => cart.id === cid);

    if (cartIndex === -1) {
        console.log("Error: No existe un carrito con id:", cid);
        return `Carrito con ID ${cid} no encontrado`;
    }



    const existingProductIndex = this.#carts[cartIndex].products.findIndex(
        (cartProduct) => cartProduct.pid === pid
    );

    if (existingProductIndex !== -1) {
        this.#carts[cartIndex].products[existingProductIndex].quantity++;
    } else {
        this.#carts[cartIndex].products.push({ pid: pid, quantity: 1 });
    }

    await this.#saveToFile();
    console.log("Producto agregado al carrito correctamente.");
    return true;
}

  

}

module.exports = CartsManager