
const ProductsManager = require("../dao/ProductsMongo.manager.js");
const CartsManager = require("../dao/CartsMongo.manager.js");

const productsManager = new ProductsManager();
const cartsManager = new CartsManager();

const renderUtils = require("../public/js/renderUtils.js");

const { Router } = require("express");
const router = Router();

const userAdmin = {
  username: "Gago_Admin",
  nombre: "Ruben",
  apellido: "Roldan",
  role: "admin",
};
const userUser = {
  username: "Gago_User",
  nombre: "Ruben",
  apellido: "Roldan",
  role: "user",
};

function formatearProductosAnidados(products) {

  products.forEach((product) => {  
    product.pid.price = renderUtils.toPesos(product.pid.price);
    product.pid.title = renderUtils.toCapital(product.pid.title);
    product.pid.category = renderUtils.toCapital(product.pid.category);
  });
}
function formatearProductos(products) {

  products.forEach((product) => {  
    product.price = renderUtils.toPesos(product.price);
    product.title = renderUtils.toCapital(product.title);
    product.category = renderUtils.toCapital(product.category);
  });
}


router.post("/", async (req,res) =>{
  
})

// endpoint en ruta raíz
router.get("/", async (req, res) => {

let  {numPage} = req.query
if (!numPage) {
  numPage=1
}
let { limitParam = 4, categoryParam = null, availableOnly = null, orderBy = null } = req.query;


const findParams = {
  categoryParam,availableOnly, 
      limitParam, numPage, orderBy
}
  // console.log("numPage aqui", numPage)
  // console.log("limit aqui", limit)
try {
  // const user=userAdmin
    const user = userUser;
    const {docs, page, hasPrevPage, hasNextPage, prevPage, nextPage, totalPages,totalDocs, pagingCounter, limit } = 
    await productsManager.getProducts(findParams);

const categoryArray = await productsManager.getCategories()



let currentUrl = req.url;
let prevLink, nextLink, firstLink, lastLink;

if (currentUrl.includes("?")) {
    const partesUrl = currentUrl.split("?");
    const urlBase = partesUrl[0];
    const parametros = partesUrl[1];
    const paresParametros = parametros.split("&");

    if (nextPage !== null) {
        const nuevosParametros = paresParametros.map(par => {
            const [clave, valor] = par.split("="); 
            if (clave === "numPage") {
                return `${clave}=${nextPage}`;
            }
            return par;
        });
        nextLink = urlBase + "?" + nuevosParametros.join("&");
    } else{nextLink=null}

    if (prevPage !== null) {
        const nuevosParametros = paresParametros.map(par => {
            const [clave, valor] = par.split("="); 
            if (clave === "numPage") {
                return `${clave}=${prevPage}`;
            }
            return par;
        });
        prevLink = urlBase + "?" + nuevosParametros.join("&");
    } else{prevLink=null}

    const primerosParametros = paresParametros.filter(par => !par.startsWith("numPage="));
    firstLink = urlBase + "?numPage=1&" + primerosParametros.join("&");

    const ultimosParametros = paresParametros.filter(par => !par.startsWith("numPage="));
    lastLink = urlBase + "?numPage=" + totalPages + "&" + ultimosParametros.join("&");
}

console.log("nextLink:", nextLink);
console.log("prevLink:", prevLink);
console.log("firstLink:", firstLink);
console.log("lastLink:", lastLink);



    if (docs.length > 0) {
      formatearProductos(docs);
    }
    res.render("home", {
      renderPage:"/",
      username: user.username,
      nombre: user.nombre,
      apellido: user.apellido,
      admin: user.role === "admin",
      title: "mercadito || Gago",
      products:docs, 
      page, hasPrevPage, hasNextPage, 
      prevPage, nextPage, totalPages, 
      totalDocs, pagingCounter, limit,
      categoryArray,nextLink, prevLink,
      firstLink, lastLink,
      styles: "homeStyles.css"
    });
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: "Error al obtener los productos" });
  }
});

router.get("/realtimeproducts", async (req, res) => {
  let  {numPage} = req.query
  if (!numPage) {
    numPage=1
  }
  
  const limitParam = 40
  const categoryParam = null
  const availableOnly = null
  const orderBy = null
  
  const findParams = {
    categoryParam,availableOnly, 
        limitParam, numPage, orderBy
  }
try {
    const user = userAdmin;
    // const user=userUser
    const {docs, page, hasPrevPage, hasNextPage, prevPage, nextPage, totalPages} = 
    await productsManager.getProducts(findParams);
    
    if (docs.length > 0) {
      formatearProductos(docs);

      req.io.on("connection", (socket) => {
        req.io.emit("Server:loadProducts", docs);
      });

      res.render("realTimeProducts", {
        username: user.username,renderPage:"/realTimeProducts/",
        nombre: user.nombre,
        apellido: user.apellido,
        admin: user.role === "admin",
        title: "Edit mercadito || Gago",
        products:docs,
      page, hasPrevPage, hasNextPage, prevPage, nextPage, totalPages,
      styles: "homeStyles.css",
      });
    }
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: "Error al obtener los productos" });
  }
});

router.get("/chat", async (req, res) => {
  res.render("chat", {
    title: "Chat mercadito || Gago",
    styles: "chat.css",
  });
});

router.get("/carts/:cid", async (req, res) =>{
  const cid = req.params.cid
  try {
    // const user=userAdmin
    const user = userUser;
    const cart = await cartsManager.getCartById(cid);
    const products = cart.products
    if (products.length > 0) {
      formatearProductosAnidados(products);
    }
    res.render("cart", {
      cid,
      username: user.username,
      nombre: user.nombre,
      apellido: user.apellido,
      admin: user.role === "admin",
      title: "carrito || Gago",
      products,
      styles: "homeStyles.css",
    });
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: "Error al obtener los productos" });
  }
});


module.exports = {
  router,
};
