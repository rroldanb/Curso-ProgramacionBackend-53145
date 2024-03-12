class ProductManager {
  #products;
  #contadorId;

  constructor() {
    this.#products = [];
    this.#contadorId = 0;
  }

  getProducts() {
    return this.#products;
  }

  /**
   *
   * @param {string} title
   * @param {string} description
   * @param {number} price
   * @param {string} thumbinal
   * @param {string} code
   * @param {number} stock
   */
  addProduct(title, description, price, thumbinal, code, stock) {
    if (!this.#validaCode(code)) {
      const product = {
        id: this.#getNewId(),
        title,
        description,
        price,
        thumbinal,
        code,
        stock,
      };
      this.#products.push(product);
    //   console.log("Producto agregado correctamente");
    } else {
      console.log("Error: El código del producto ya existe");
    }
  }

  #validaCode(code) {
    return this.#products.some((product) => product.code === code);
  }

  #getNewId() {
    return ++this.#contadorId;
  }

  getProductById(id) {
    const product = this.#existeProdId(id);
    if (!this.#existeProdId(id)) {
      console.log("Not found");
    } else {
      const product = this.#products.find((product) => product.id === id);
      return product;
    }
  }

  #existeProdId(id) {
    return this.#products.some((product) => product.id === id);
  }
}

//Inicializa
const productManager = new ProductManager();

console.log("Lista los productos antes de crearlos (arreglo vacío)");
console.log(productManager.getProducts());

console.log("Agrega un producto nuevo");
productManager.addProduct(
  "producto prueba",
  "Este es un producto prueba",
  200,
  "Sin imagen",
  "abc123",
  25
);

console.log("Lista los productos (aparece el recién ingresado)");
console.log(productManager.getProducts());

console.log("Intenta agregar un producto con un código existente");
productManager.addProduct(
  "producto prueba",
  "Este es un producto prueba",
  200,
  "Sin imagen",
  "abc123",
  25
);

console.log("Busca 1 producto con id válido");
console.log(productManager.getProductById(1));

console.log("Busca 1 producto con id no válido");
console.log(productManager.getProductById(0));
