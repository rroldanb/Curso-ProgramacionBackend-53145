const { ProductsManager } = require("./ProductManagerSync");
const pathSync = "./productosSync.json";

function testingSync() {
  console.log("***************** INICIA TEST SINCRONICO *********************");
  console.log("***************** INICIA TEST SINCRONICO *********************");
  console.log("***************** INICIA TEST SINCRONICO *********************");

  console.log("Test 00.- Inicializa el Product Manager");
  const productManager = new ProductsManager(pathSync);

  console.log(
    "Test 01.- Lista los productos antes de crearlos (arreglo vacío)"
  );
  console.log(productManager.getProducts());

  console.log("Test 02.- Agrega un producto nuevo");
  const nuevoProducto1 = {
    title: "producto prueba",
    description: "Este es un producto prueba",
    price: 200,
    thumbinal: "Sin imagen",
    code: "abc123",
    stock: 25
  };
  productManager.addProduct(nuevoProducto1);

  console.log("Test 03.- Lista los productos (aparece el recién ingresado):");
  console.log(productManager.getProducts());

  console.log("Test 04.- Intenta agregar el mismo producto");
  productManager.addProduct(nuevoProducto1);

  console.log(
    "Test 05.- Lista los productos (aparece solo el ingresado la primera vez):"
  );
  console.log(productManager.getProducts());

  console.log("Test 06.- Agrega un segundo producto");
  const nuevoProducto2 = {
    title: "producto prueba 2",
    description: "Este es un producto prueba 2",
    price: 2002,
    thumbinal: "Sin imagen2",
    code: "abc1234",
    stock: 252
  };
  productManager.addProduct(nuevoProducto2);

  console.log("Test 07.- Lista los productos (aparecen 2):");
  console.log(productManager.getProducts());

  console.log("Test 08.- Agrega un tercer producto");
  const nuevoProducto3 = {
    title: "producto prueba 3",
    description: "Este es un producto prueba 3",
    price: 2002,
    thumbinal: "Sin imagen3",
    code: "abc1233",
    stock: 252
  };
  productManager.addProduct(nuevoProducto3);

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
  const nuevoProducto4 = {
    title: "producto prueba 4",
    description: "Este es un producto prueba 4",
    price: 44,
    thumbinal: "Sin imagen4",
    code: "abc44",
    stock: 44
  };
  productManager.addProduct(nuevoProducto4);

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

  console.log(
    "***************** FINALIZA TEST SINCRONICO *********************"
  );
  console.log(
    "***************** FINALIZA TEST SINCRONICO *********************"
  );
  console.log(
    "***************** FINALIZA TEST SINCRONICO *********************"
  );
}

module.exports = {
  testingSync,
};
