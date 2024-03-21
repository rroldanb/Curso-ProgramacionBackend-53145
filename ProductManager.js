const fs = require("fs");


class ProductManager {
  #products;
  contadorId;
  #path;
  #archivoLeido;

  constructor() {
    this.#path = "./productos.json";
    this.#readFile();
  }

  #readFile() {
    try {
      const data = fs.readFileSync(this.#path, "utf-8");
      const [products, contadorId] = JSON.parse(data);
      this.#products = products;
      this.contadorId = Number(contadorId);
      console.log("Archivo leído correctamente.");
      this.#archivoLeido = true;
    } catch (err) {
      this.#products = [];
      this.contadorId = 0;
      console.log("No se pudo leer el archivo, creando uno nuevo");
      this.#saveToFile();
    }
  }

  #saveToFile() {
    const dataToSave = [this.#products, this.contadorId, this.#path];
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

  // getProducts() {
  //   return new Promise((resolve, reject) => {
  //     setTimeout(() => {
  //       if (this.#archivoLeido) {
  //         resolve(this.#products);
  //       } else {
  //         reject(new Error("No se ha leído el archivo aún, ejecute el archivo nuevamente"));
  //       }
  //     }, 2000);
  //   })
  //   .then(products => {
  //     return this.#products //console.log("Productos obtenidos correctamente:", products);
  //   })
  //   .catch(error => {
  //     console.error("Error al obtener productos:", error.message);
  //     throw error;
  //   });
  // }

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
    return ++this.contadorId;
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

    // Verificar que solo se actualicen propiedades permitidas
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

    this.#products[productIndex] = product; // Actualizar el producto en el arreglo de productos

    this.#saveToFile();
    return product;
  }
}

//Inicializa el Product Manager
const productManager = new ProductManager();

// (( *** TESTING ***))

//// Despliega el contenido inicial, si no existe el archivo, lo crea

console.log("Lista los productos antes de crearlos (arreglo vacío)");
console.log(productManager.getProducts());

//// Crea el primer producto
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
console.log(productManager.getProducts());

////intenta volver a crear el mismo producto

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
console.log(productManager.getProducts());

////Agrega un nuevo producto

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
console.log(productManager.getProducts());

////Agrega otro nuevo producto

// console.log("Intenta agregar un producto nuevo3");
// productManager.addProduct(
//   "producto prueba 3",
//   "Este es un producto prueba 3",
//   2002,
//   "Sin imagen3",
//   "abc1233",
//   252
// );

// console.log("Lista los productos (aparecen 3):");
// console.log(productManager.getProducts());

// console.log("Busca 1 producto con id válido:");
// console.log(productManager.getProductById(1));

// console.log("Busca 1 producto con id no válido:");
// console.log(productManager.getProductById(0));

// // intenta eliminar un producto que no existe
// console.log("Intenta eliminar un producto que no existe");
// productManager.deleteProduct(777);

// // intenta eliminar un producto que no existe
// console.log("Intenta eliminar un producto que si existe");
// productManager.deleteProduct(3);

/* 
console.log("Agregar un producto nuevo 4");
productManager.addProduct(
  "producto prueba 4",
  "Este es un producto prueba 4",
  44,
  "Sin imagen4",
  "abc44",
  44
);

console.log("despliega el producto 4 antes de modificar");

console.log(productManager.getProductById(4));

productManager.updateProduct(4, {
  //se puede editar el campo que se requiera indicandole la propiedad a editar
  title: "producto 4 modificado",
  description:
    "Este es el producto modificado 4, precio stock y code no se modifican",
  // price:4444,
  // thumbinal:"Sin imagen 4",
  // code: "abc4444",
  stock: 4444,
  NuevaPropiedad: "nuevo valor", //se valida que la propiedad exista
});
console.log("despliega el producto 4 después de modificar");

console.log(productManager.getProductById(4));
 */
