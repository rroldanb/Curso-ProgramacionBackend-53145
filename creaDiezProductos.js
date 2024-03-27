// const { ProductsManager } = require("./ProductManager");
// const pathSync = "./productosRR.json";

// const productManager = new ProductsManager(pathSync);
// for (let i = 1; i < 11; i++) {
//   let j = i < 10 ? `0${i}` : i;
//   let title = `producto prueba ${i}`;
//   let description = `Este es el producto prueba ${i}`;
//   let price = i * 11;
//   let thumbinal = `imagen ${j}`;
//   let code = `abc${j}`;
//   let stock = i;

//   const nuevoProducto = {
//     title,
//     description,
//     price,
//     thumbinal,
//     code,
//     stock
//   };

//   productManager.addProduct(nuevoProducto);
// }

const { ProductsManager } = require("./ProductManager");
const path = "./productos.json";

async function creaDiezProductos() {
  const productManager = new ProductsManager(path);
  for (let i = 1; i < 11; i++) {
    let j = i < 10 ? `0${i}` : i;
    let title = `producto prueba ${i}`;
    let description = `Este es el producto prueba ${i}`;
    let price = i * 11;
    let thumbinal = `imagen ${j}`;
    let code = `abc${j}`;
    let stock = i;

    const nuevoProducto = {
      title,
      description,
      price,
      thumbinal,
      code,
      stock
    };

    await productManager.addProduct(nuevoProducto);
  }
}

creaDiezProductos()
  .then(() => {
    console.log("Productos agregados exitosamente.");
  })
  .catch((error) => {
    console.error("Error al agregar productos:", error);
  });
