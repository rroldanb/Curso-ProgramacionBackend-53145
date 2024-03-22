const fs = require("fs");
const path = "./productosSync.json";

class ProductManager {
  #products;
  #contadorId;
  #path;
  #archivoLeido;

  constructor() {
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
   *
   * @param {string} title
   * @param {string} description
   * @param {number} price
   * @param {string} thumbinal
   * @param {string} code
   * @param {number} stock
   */
  addProduct(title, description, price, thumbinal, code, stock) {
    if (this.#archivoLeido) {
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
        this.#saveToFile();
      } else {
        console.log("Error: El código del producto ya existe");
      }
    }
  }

  #validaCode(code) {
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

console.log("***************** INICIA TEST *********************");
console.log("***************** INICIA TEST *********************");
console.log("***************** INICIA TEST *********************");

const productManager = new ProductManager();

console.log("Test 01.- Lista los productos antes de crearlos (arreglo vacío)");
console.log(productManager.getProducts());

console.log("Test 02.- Agrega un producto nuevo");
productManager.addProduct(
  "producto prueba",
  "Este es un producto prueba",
  200,
  "Sin imagen",
  "abc123",
  25
);

console.log("Test 03.- Lista los productos (aparece el recién ingresado):");
console.log(productManager.getProducts());

console.log("Test 04.- Intenta agregar el mismo producto");
productManager.addProduct(
  "producto prueba",
  "Este es un producto prueba",
  200,
  "Sin imagen",
  "abc123",
  25
);

console.log(
  "Test 05.- Lista los productos (aparece solo el ingresado la primera vez):"
);
console.log(productManager.getProducts());

console.log("Test 06.- Agrega un segundo producto");
productManager.addProduct(
  "producto prueba 2",
  "Este es un producto prueba 2",
  2002,
  "Sin imagen2",
  "abc1234",
  252
);

console.log("Test 07.- Lista los productos (aparecen 2):");
console.log(productManager.getProducts());

console.log("Test 08.- Agrega un tercer producto");
productManager.addProduct(
  "producto prueba 3",
  "Este es un producto prueba 3",
  2002,
  "Sin imagen3",
  "abc1233",
  252
);

console.log("Test 09.- Lista los productos (aparecen 3):");
console.log(productManager.getProducts());

console.log("Test 10.- Busca 1 producto con id válido:");
console.log(productManager.getProductById(1));

console.log("Test 11.- Busca 1 producto con id no válido:");
console.log(productManager.getProductById(0));

console.log("Test 12.- Intenta eliminar un producto que no existe");
productManager.deleteProduct(777);

console.log("Test 13.- Intenta eliminar un producto que si existe");
productManager.deleteProduct(2);

console.log("Test 14.- Agregar un producto nuevo 4");
productManager.addProduct(
  "producto prueba 4",
  "Este es un producto prueba 4",
  44,
  "Sin imagen4",
  "abc44",
  44
);

console.log(
  "Test 15.- Despliega el producto 4 y luego lo modifica intentando pasar una propiedad que no existe"
);
console.log(productManager.getProductById(4));

productManager.updateProduct(4, {
  //se puede editar el campo que se requiera indicandole la propiedad a editar
  title: "producto 4 modificado",
  description:
    "Este es el producto modificado 4, precio, thumbinal y code no se modifican",
  // price:4444,
  // thumbinal:"Sin imagen 4",
  // code: "abc4444",
  stock: 4444,
  NuevaPropiedad: "nuevo valor", //se valida que la propiedad exista
});

console.log("Test 16.- Despliega el producto 4 después de modificar");
console.log("despliega el producto 4 después de modificar");

console.log(productManager.getProductById(4));

console.log("***************** FINALIZA TEST *********************");
console.log("***************** FINALIZA TEST *********************");
console.log("***************** FINALIZA TEST *********************");
