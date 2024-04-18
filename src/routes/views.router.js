const path = require("path");
const ProductsManager = require("../services/ProductsManager.js");
const productsPath = path.join(__dirname, "..", "data", "productos.json");
const productsManager = new ProductsManager(productsPath);

const { Router } = require("express");
const renderUtils = require("../public/js/renderUtils.js");
const Swal = require("sweetalert2");

const router = Router();

const userAdmin = {
  username: "Gago",
  nombre: "Ruben",
  apellido: "Roldan",
  role: "admin",
};
const userUser = {
  username: "Gago_user",
  nombre: "Ruben",
  apellido: "Roldan",
  role: "user",
};

function formatearProductos(products) {
  products.forEach((product) => {
    product.price = renderUtils.toPesos(product.price);
    product.title = renderUtils.toCapital(product.title);
    product.category = renderUtils.toCapital(product.category);
  });
}

// endpoint en ruta raíz
router.get("/", async (req, res) => {
  try {
    // const user=userAdmin
    const user = userUser;
    const products = await productsManager.getProducts();
    if (products.length > 0) {
      formatearProductos(products);
    }
    res.render("home", {
      username: user.username,
      nombre: user.nombre,
      apellido: user.apellido,
      admin: user.role === "admin",
      title: "mercadito || Gago",
      products,
      styles: "homeStyles.css",
    });
  } catch (error) {
    res.status(500).json({ error: "Error al obtener los productos" });
  }
});

router.get("/chat", (req, res) => {
  res.render("chat", {
    title: "Chat mercadito || Gago",
    styles: "homeStyles.css",
  });
});

// endpoint para edicion de productos
router.get("/realtimeroducts", async (req, res) => {
  
  try {
    const user = userAdmin;
    // const user=userUser
    const products = await productsManager.getProducts();
    if (products.length > 0) {
      formatearProductos(products);
      

      req.io.on('connection', (socket)=>{
        req.io.emit('load_server_products', products)  
        socket.on('addProduct', data =>{
          console.log('tenemos nuevo prod',data)
          req.io.emit('server_product', {...data, id:9999})  
        })
      })

      //"/images/producto-prueba_01_imagen_1.jpg"
      //"/images/producto-prueba_01_imagen_1"
   

    }
    res.render("realTimeProducts", {
      username: user.username,
      nombre: user.nombre,
      apellido: user.apellido,
      admin: user.role === "admin",
      title: "Edit mercadito || Gago",
      products,
      styles: "homeStyles.css",
    });
  } catch (error) {
    res.status(500).json({ error: "Error al obtener los productos" });
  }
});

module.exports = {
  router,
};
