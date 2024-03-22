const fs = require("fs");
const path = "./productosAsync.json";

class ProductManager {
  #products;
  #contadorId;
  #archivoLeido;
  #path;
  constructor() {
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
   *
   * @param {string} title
   * @param {string} description
   * @param {number} price
   * @param {string} thumbinal
   * @param {string} code
   * @param {number} stock
   */
  async addProduct(title, description, price, thumbinal, code, stock) {
    await this.#readFile();
    if (!this.#archivoLeido) {
      console.log(
        "No se ha leído el archivo aún, ejecute el archivo nuevamente"
      );
      return;
    }

    if (this.#validaCode(code)) {
      console.log("Error: El código del producto ya existe");
      return;
    }
    this.#contadorId++;
    const product = {
      id: this.#contadorId,
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

const initProductManager = async () => {
  console.log("***************** INICIA TEST *********************");
  console.log("***************** INICIA TEST *********************");
  console.log("***************** INICIA TEST *********************");

  const productManager = new ProductManager();

  console.log(
    "Test 01.- Lista los productos antes de crearlos (arreglo vacío)"
  );
  console.log(await productManager.getProducts());

  console.log("Test 02.- Agrega un producto nuevo");
  await productManager.addProduct(
    "producto prueba",
    "Este es un producto prueba",
    200,
    "Sin imagen",
    "abc123",
    25
  );

  console.log("Test 03.- Lista los productos (aparece el recién ingresado):");
  console.log(await productManager.getProducts());

  console.log("Test 04.- Intenta agregar el mismo producto");
  await productManager.addProduct(
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
  console.log(await productManager.getProducts());

  console.log("Test 06.- Agrega un segundo producto");
  await productManager.addProduct(
    "producto prueba 2",
    "Este es un producto prueba 2",
    2002,
    "Sin imagen2",
    "abc1234",
    252
  );

  console.log("Test 07.- Lista los productos (aparecen 2):");
  console.log(await productManager.getProducts());

  console.log("Test 08.- Agrega un tercer producto");
  await productManager.addProduct(
    "producto prueba 3",
    "Este es un producto prueba 3",
    2002,
    "Sin imagen3",
    "abc1233",
    252
  );

  console.log("Test 09.- Lista los productos (aparecen 3):");
  console.log(await productManager.getProducts());

  console.log("Test 10.- Busca 1 producto con id válido:");
  console.log(await productManager.getProductById(1));

  console.log("Test 11.- Busca 1 producto con id no válido:");
  console.log(await productManager.getProductById(0));

  console.log("Test 12.- Intenta eliminar un producto que no existe");
  await productManager.deleteProduct(777);

  console.log("Test 13.- Intenta eliminar un producto que si existe");
  await productManager.deleteProduct(2);

  console.log("Test 14.- Agregar un producto nuevo 4");
  await productManager.addProduct(
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
  console.log(await productManager.getProductById(4));

  await productManager.updateProduct(4, {
    //se puede editar el campo que se requiera indicandole la propiedad a editar
    title: "producto 4 modificado",
    description:
      "Este es el producto modificado 4, precio, thumbinal y code no se modifican",
    // price:4444,
    // thumbinal:"Sin imagen 4",
    // code: "abc4444",
    stock: 4444,
    nuevaPropiedad: "nuevo valor",
  });

  console.log("Test 16.- Despliega el producto 4 después de modificar");
  console.log(await productManager.getProductById(4));

  console.log("***************** FINALIZA TEST *********************");
  console.log("***************** FINALIZA TEST *********************");
  console.log("***************** FINALIZA TEST *********************");
};
initProductManager();
