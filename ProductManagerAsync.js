const fs = require("fs").promises;
const path = "./productos.json";

class ProductManager {
  #products;
  #archivoLeido;
  #path;

  constructor() {
    this.#path = path;
    this.#products = [];
    this.#readFile();
    this.#archivoLeido = false;

  }

  async #readFile() {
    try {
      const data = await fs.readFile(this.#path, "utf-8");
      const [products, contadorId] = JSON.parse(data);
      this.#products = products;
      this.contadorId = Number(contadorId);
      console.log("Archivo leído correctamente.");
      this.#archivoLeido = true;
    } catch (err) {
      console.log("No se pudo leer el archivo, creando uno nuevo");
      await this.#saveToFile();
    }
  }

  async #saveToFile() {
    try {
      await fs.writeFile(this.#path, JSON.stringify([this.#products, this.contadorId], null, "\t"), "utf-8");
      const message = this.#archivoLeido ? "Archivo guardado correctamente." : "Archivo creado correctamente.";
      console.log(message);
      this.#archivoLeido = true;
    } catch (err) {
      console.log("Error al guardar el archivo:", err);
      this.#archivoLeido = false;
    }
  }

  async getProducts() {
      await this.#readFile()
      console.log("leyo?", this.#archivoLeido)
      if (this.#archivoLeido) {
        
      return this.#products;
    } else {
      console.log("No se ha leído el archivo aún, ejecute el archivo nuevamente");
      return [];
    }
  }

  async addProduct(title, description, price, thumbinal, code, stock) {
    if (!this.#archivoLeido) {
      console.log("No se ha leído el archivo aún, ejecute el archivo nuevamente");
      return;
    }

    if (this.#validaCode(code)) {
      console.log("Error: El código del producto ya existe");
      return;
    }

    const product = {
      id: ++this.contadorId,
      title,
      description,
      price,
      thumbinal,
      code,
      stock,
    };

    this.#products.push(product);
    await this.#saveToFile();
  }

  #validaCode(code) {
    return this.#products.some(product => product.code === code);
  }

  async deleteProduct(id) {
    if (!this.#archivoLeido) {
      console.log("No se ha leído el archivo aún, ejecute el archivo nuevamente");
      return;
    }

    const index = this.#products.findIndex(product => product.id === id);
    if (index === -1) {
      console.log("No existe un producto con id:", id);
      return;
    }

    this.#products.splice(index, 1);
    await this.#saveToFile();
    console.log("Se eliminó el producto con id:", id);
  }

  async updateProduct(id, updatedFields) {
    if (!this.#archivoLeido) {
      console.log("No se ha leído el archivo aún, ejecute el archivo nuevamente");
      return;
    }

    const index = this.#products.findIndex(product => product.id === id);
    if (index === -1) {
      console.log("No existe un producto con id:", id);
      return;
    }

    const product = this.#products[index];
    for (const key in updatedFields) {
      if (Object.hasOwnProperty.call(updatedFields, key) && product.hasOwnProperty(key)) {
        product[key] = updatedFields[key];
      } else {
        console.log(`La propiedad '${key}' no es una propiedad válida y será omitida.`);
      }
    }

    await this.#saveToFile();
    return product;
  }

  getProductById(id) {
    const product = this.#products.find(product => product.id === id);
    return product ? product : "Not Found";
  }
}

//Inicializa el Product Manager
// const productManager = new ProductManager();


//Inicializa el Product Manager dentro de una función async
const initProductManager = async () => {
    // Crea una nueva instancia de ProductManager
    const productManager = new ProductManager();


// (( *** TESTING ***))
console.log("Lista los productos antes de crearlos (arreglo vacío)");
console.log(await productManager.getProducts());

console.log("Agrega un producto nuevo");
productManager.addProduct(
  "producto prueba",
  "Este es un producto prueba",
  200,
  "Sin imagen",
  "abc123",
  25
);

console.log("Lista los productos (aparece el recién ingresado):");
console.log(await productManager.getProducts());



console.log("Intenta agregar el mismo producto");
productManager.addProduct(
  "producto prueba",
  "Este es un producto prueba",
  200,
  "Sin imagen",
  "abc123",
  25
);

console.log("Lista los productos (aparece solo el ingresado la primera vez):");
console.log(await productManager.getProducts());


console.log("Agrega un producto nuevo");
productManager.addProduct(
  "producto prueba 2",
  "Este es un producto prueba 2",
  2002,
  "Sin imagen2",
  "abc1234",
  252
);

console.log("Lista los productos (aparecen 2):");
console.log(await productManager.getProducts());

console.log("Intenta eliminar un producto que no existe");
productManager.deleteProduct(777);

console.log("Intenta eliminar un producto que si existe");
productManager.deleteProduct(2);

// console.log("Agregar un producto nuevo 4");
// productManager.addProduct(
//   "producto prueba 4",
//   "Este es un producto prueba 4",
//   44,
//   "Sin imagen4",
//   "abc44",
//   44
// );

// console.log("Despliega el producto 4 antes de modificar");
// console.log(productManager.getProductById(4));

// productManager.updateProduct(4, {
//   title: "producto 4 modificado",
//   description: "Este es el producto modificado 4, precio stock y code no se modifican",
//   stock: 4444,
//   nuevaPropiedad: "nuevo valor"
// });

// console.log("Despliega el producto 4 después de modificar");
// console.log(productManager.getProductById(4));
}
initProductManager()