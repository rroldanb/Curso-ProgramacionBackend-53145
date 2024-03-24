
const pathAsync = "./productosAsync.json";
const {ProductsManager} = require ("./ProductManagerAsync")


const testingAsync = async () => {
    console.log("***************** INICIA TEST ASINCRONICO*********************");
    console.log("***************** INICIA TEST ASINCRONICO*********************");
    console.log("***************** INICIA TEST ASINCRONICO*********************");
  
    console.log("Test 00.- Inicializa el Product Manager");
    const productManager = new ProductsManager(pathAsync);
  
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
  
    console.log("***************** FINALIZA TEST ASINCRONICO*********************");
    console.log("***************** FINALIZA TEST ASINCRONICO*********************");
    console.log("***************** FINALIZA TEST ASINCRONICO*********************");
  };

  
  module.exports={
    testingAsync 
   
   }