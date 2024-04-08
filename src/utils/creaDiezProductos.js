const { ProductsManager } = require("../services/ProductsManager").default;
const path = require("path");
const destPath = "../data/productos.json";

async function creaDiezProductos() {
  const productManager = new ProductsManager(destPath);

  for (let i = 1; i < 11; i++) {
    let j = i < 10 ? `0${i}` : i;
    let title = `producto prueba ${i}`;
    let description = `Este es el producto prueba ${i}`;
    let code = `abc${j}`;
    let price = i * 11;
    let status = true;
    let stock = i;
    let category = i % 2 === 0 ? "Categoría Par" : "Categoría impar";

    let numImages = Math.floor(Math.random() * 3) + 1;
    let thumbnails = [];
    for (let k = 1; k <= numImages; k++) {
      thumbnails.push(`/images/producto-prueba_${j}_imagen_${k}`);
    }

    const nuevoProducto = {
      title,
      description,
      code,
      price,
      status,
      stock,
      category,
      thumbnails,
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
