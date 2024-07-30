const renderUtils = require("../../public/js/renderUtils.js");
const ProductsManager = require("../../dao/mongo/products.mongo.js");
const productsManager = new ProductsManager();


  function formatearProductos(products) {
    products.forEach((product) => {
      product.price = renderUtils.toPesos(product.price);
      product.title = renderUtils.toCapital(product.title);
      product.category = renderUtils.toCapital(product.category);
    });
  }
  
  function generatePaginationLinks(pagLinksParams) {
    let { urlParam, totalPages, nextPage, prevPage, hasNextPage, hasPrevPage } =
      pagLinksParams;
    let currentUrl = urlParam;
    let prevLink, nextLink, firstLink, lastLink;
    let urlBase = currentUrl;
    if (currentUrl.includes("?")) {
      const partesUrl = currentUrl.split("?");
      urlBase = partesUrl[0];
      const parametros = partesUrl[1];
      const paresParametros = parametros.split("&");
  
      if (nextPage !== null) {
        const nuevosParametros = paresParametros.map((par) => {
          const [clave, valor] = par.split("=");
          if (clave === "numPage") {
            return `${clave}=${nextPage}`;
          }
          return par;
        });
        nextLink = urlBase + "?" + nuevosParametros.join("&");
      } else {
        nextLink = null;
      }
  
      if (prevPage !== null) {
        const nuevosParametros = paresParametros.map((par) => {
          const [clave, valor] = par.split("=");
          if (clave === "numPage") {
            return `${clave}=${prevPage}`;
          }
          return par;
        });
        prevLink = urlBase + "?" + nuevosParametros.join("&");
      } else {
        prevLink = null;
      }
  
      const primerosParametros = paresParametros.filter(
        (par) => !par.startsWith("numPage=")
      );
      firstLink = urlBase + "?numPage=1&" + primerosParametros.join("&");
  
      const ultimosParametros = paresParametros.filter(
        (par) => !par.startsWith("numPage=")
      );
      lastLink =
        urlBase + "?numPage=" + totalPages + "&" + ultimosParametros.join("&");
    }
  
    if (
      nextLink === undefined ||
      prevLink === undefined ||
      firstLink === undefined ||
      lastLink === undefined
    ) {
      nextLink = hasNextPage ? urlBase + "?numPage=" + nextPage : null;
      prevLink = hasPrevPage ? urlBase + "?numPage=" + prevPage : null;
      firstLink = urlBase + "?numPage=1";
      lastLink = urlBase + "?numPage=" + totalPages;
      // urlBase=urlBase
    }
  
    return { nextLink, prevLink, firstLink, lastLink, urlBase };
  }

class ProductsViewsController {
    constructor() {}

    renderHome = async (req, res) => {
        let {
          numPage = 1,
          limitParam = 4,
          categoryParam = null,
          availableOnly = null,
          orderBy = null,
        } = req.query;
      
        availableOnly = availableOnly ? availableOnly === "true" : null;
        numPage = parseInt(numPage);
        let limit = parseInt(limitParam);
        orderBy ? (orderBy = parseInt(orderBy)) : (orderBy = null);
      
        const filter = {};
        if (categoryParam) filter.category = categoryParam;
        if (typeof availableOnly === "boolean") filter.status = availableOnly;
        // if (req.user.role.toLowerCase() === "premium") filter.owner = req.user.email
      
        // console.log('filter VR L 120', filter) //owner: 'premiumuser@coder.com'
      
        const options = {
          limit,
          page: numPage,
          lean: true,
          sort: orderBy ? { price: orderBy } : {},
        };
      
        try {
          let user = req.user;
      
          const result = await productsManager.getProducts(filter, options);
          const {
            docs,
            page,
            hasPrevPage,
            hasNextPage,
            prevPage,
            nextPage,
            totalPages,
            totalDocs,
            pagingCounter,
            limit,
          } = result;
          const categoryArray = await productsManager.getCategories();
      
          const urlParam = req.url;
          const pagLinksParams = {
            urlParam,
            totalPages,
            nextPage,
            prevPage,
            hasNextPage,
            hasPrevPage,
          };
      
          const { nextLink, prevLink, firstLink, lastLink, urlBase } =
            generatePaginationLinks(pagLinksParams);
      
          if (docs.length > 0) {
            formatearProductos(docs);
          }
      
          if (user) {
            if (user.user) {
              user = user.user;
            }
            const nombre_completo =
              user.first_name === user.last_name
                ? user.first_name
                : user.first_name + " " + user.last_name;
            const isPremium = req.user.role.toLowerCase() === "premium";
      
            res.render("home", {
              cart_id: user.cart_id,
              username: user.email,
              nombre_completo,
              nombre: user.first_name,
              apellido: user.last_name,
              admin: user.admin,
              premium: isPremium,
              title: "mercadito || Gago",
              products: docs,
              page,
              hasPrevPage,
              hasNextPage,
              prevPage,
              nextPage,
              totalPages,
              totalDocs,
              pagingCounter,
              limit,
              categoryArray,
              nextLink,
              prevLink,
              firstLink,
              lastLink,
              urlBase,
              styles: "homeStyles.css",
            });
          } else {
            res.render("home", {
              title: "mercadito || Gago",
              products: docs,
              page,
              hasPrevPage,
              hasNextPage,
              prevPage,
              nextPage,
              totalPages,
              totalDocs,
              pagingCounter,
              limit,
              categoryArray,
              nextLink,
              prevLink,
              firstLink,
              lastLink,
              urlBase,
              styles: "homeStyles.css",
            });
          }
        } catch (error) {
          console.error(error);
          res.status(500).json({ error: "Error al obtener los productos" });
        }
      }

    renderProducts =   async (req, res) => {
        let {
          numPage = 1,
          limitParam = 4,
          categoryParam = null,
          availableOnly = null,
          orderBy = null,
        } = req.query;
    
        availableOnly = availableOnly ? availableOnly === "true" : null;
        numPage = parseInt(numPage);
        let limit = parseInt(limitParam);
        orderBy ? (orderBy = parseInt(orderBy)) : (orderBy = null);
    
        const filter = {};
        if (categoryParam) filter.category = categoryParam;
        if (typeof availableOnly === "boolean") filter.status = availableOnly;
    
        const options = {
          limit,
          page: numPage,
          lean: true,
          sort: orderBy ? { price: orderBy } : {},
        };
    
        try {
          let user = req.user;
    
          const result = await productsManager.getProducts(filter, options);
          const {
            docs,
            page,
            hasPrevPage,
            hasNextPage,
            prevPage,
            nextPage,
            totalPages,
            totalDocs,
            pagingCounter,
            limit,
          } = result;
    
          const categoryArray = await productsManager.getCategories();
    
          const urlParam = req.url;
          const pagLinksParams = {
            urlParam,
            totalPages,
            nextPage,
            prevPage,
            hasNextPage,
            hasPrevPage,
          };
    
          const { nextLink, prevLink, firstLink, lastLink, urlBase } =
            generatePaginationLinks(pagLinksParams);
    
          if (docs.length > 0) {
            formatearProductos(docs);
          }
          if (user) {
            if (user.user) {
              user = user.user;
            }
            const nombre_completo =
              user.first_name === user.last_name
                ? user.first_name
                : user.first_name + " " + user.last_name;
            const isPremium = req.user.role.toLowerCase() === "premium";
    
            res.render("home", {
              cart_id: user.cart_id,
              username: user.email,
              nombre_completo,
              nombre: user.first_name,
              apellido: user.last_name,
              admin: user.admin,
              premium: isPremium,
              title: "mercadito || Gago",
              products: docs,
              page,
              hasPrevPage,
              hasNextPage,
              prevPage,
              nextPage,
              totalPages,
              totalDocs,
              pagingCounter,
              limit,
              categoryArray,
              nextLink,
              prevLink,
              firstLink,
              lastLink,
              urlBase,
              styles: "homeStyles.css",
              user: JSON.stringify(user),
            });
          } else {
            res.render("home", {
              title: "mercadito || Gago",
              products: docs,
              page,
              hasPrevPage,
              hasNextPage,
              prevPage,
              nextPage,
              totalPages,
              totalDocs,
              pagingCounter,
              limit,
              categoryArray,
              nextLink,
              prevLink,
              firstLink,
              lastLink,
              urlBase,
              styles: "homeStyles.css",
            });
          }
        } catch (error) {
          console.error(error);
          res.status(500).json({ error: "Error al obtener los productos" });
        }
      }

    mockingProducts = async (req, res) => {
        const { generateProducts } = require("../../utils/generateMocks");
        let {
          numPage = 1,
          limitParam = 4,
          categoryParam = null,
          availableOnly = null,
          orderBy = null,
        } = req.query;
    
        availableOnly = availableOnly ? availableOnly === "true" : null;
        numPage = parseInt(numPage);
        let limit = parseInt(limitParam);
        orderBy ? (orderBy = parseInt(orderBy)) : (orderBy = null);
    
        const filter = {};
        if (categoryParam) filter.category = categoryParam;
        if (typeof availableOnly === "boolean") filter.status = availableOnly;
    
        try {
          let user = req.user;
          let mockProducts = [];
          let categorySet = new Set();
    
          for (let i = 0; i < 50; i++) {
            let product = generateProducts();
            mockProducts.push(product);
            categorySet.add(product.category);
          }
    
          const categoryArray = Array.from(categorySet);
    
          let filteredProducts = mockProducts.filter((product) => {
            if (filter.category && product.category !== filter.category)
              return false;
            if (
              typeof filter.status === "boolean" &&
              product.status !== filter.status
            )
              return false;
            return true;
          });
    
          if (orderBy) {
            filteredProducts.sort((a, b) =>
              orderBy === 1 ? a.price - b.price : b.price - a.price
            );
          }
    
          const totalDocs = filteredProducts.length;
          const totalPages = Math.ceil(totalDocs / limit);
          const start = (numPage - 1) * limit;
          const end = start + limit;
          const docs = filteredProducts.slice(start, end);
          const hasPrevPage = numPage > 1;
          const hasNextPage = numPage < totalPages;
          const prevPage = hasPrevPage ? numPage - 1 : null;
          const nextPage = hasNextPage ? numPage + 1 : null;
          const pagingCounter = start + 1;
    
          const urlParam = req.url;
          const pagLinksParams = {
            urlParam,
            totalPages,
            nextPage,
            prevPage,
            hasNextPage,
            hasPrevPage,
          };
    
          const { nextLink, prevLink, firstLink, lastLink, urlBase } =
            generatePaginationLinks(pagLinksParams);
    
          if (docs.length > 0) {
            formatearProductos(docs);
          }
    
          if (user) {
            if (user.user) {
              user = user.user;
            }
            const nombre_completo =
              user.first_name === user.last_name
                ? user.first_name
                : user.first_name + " " + user.last_name;
    
            res.render("home", {
              cart_id: user.cart_id,
              username: user.email,
              nombre_completo,
              nombre: user.first_name,
              apellido: user.last_name,
              admin: user.admin,
              title: "mercadito || Gago",
              products: docs,
              page: numPage,
              hasPrevPage,
              hasNextPage,
              prevPage,
              nextPage,
              totalPages,
              totalDocs,
              pagingCounter,
              limit,
              categoryArray,
              nextLink,
              prevLink,
              firstLink,
              lastLink,
              urlBase,
              styles: "homeStyles.css",
              user: JSON.stringify(user),
            });
          } else {
            res.render("home", {
              title: "mercadito || Gago",
              products: docs,
              page: numPage,
              hasPrevPage,
              hasNextPage,
              prevPage,
              nextPage,
              totalPages,
              totalDocs,
              pagingCounter,
              limit,
              categoryArray,
              nextLink,
              prevLink,
              firstLink,
              lastLink,
              urlBase,
              styles: "homeStyles.css",
            });
          }
        } catch (error) {
          console.error(error);
          res.status(500).json({ error: "Error al obtener los productos" });
        }
      }

    realTimeProducts =  async (req, res) => {
        let {
          numPage = 1,
          limitParam = 4,
          categoryParam = null,
          availableOnly = null,
          orderBy = null,
        } = req.query;
    
        availableOnly = availableOnly ? availableOnly === "true" : null;
        numPage = parseInt(numPage);
        let limit = parseInt(limitParam);
        orderBy ? (orderBy = parseInt(orderBy)) : (orderBy = null);
    
        const filter = {};
        if (categoryParam) filter.category = categoryParam;
        if (typeof availableOnly === "boolean") filter.status = availableOnly;
        if (req.user.role.toLowerCase() === "premium")
          filter.owner = req.user.email;
    
        const options = {
          limit,
          page: numPage,
          lean: true,
          sort: orderBy ? { price: orderBy } : {},
        };
    
        try {
          let user = req.user;
          const result = await productsManager.getProducts(filter, options);
          const {
            docs,
            page,
            hasPrevPage,
            hasNextPage,
            prevPage,
            nextPage,
            totalPages,
            totalDocs,
            pagingCounter,
            limit,
          } = result;
    
          const categoryArray = await productsManager.getCategories();
    
          const urlParam = req.url;
          const pagLinksParams = {
            urlParam,
            totalPages,
            nextPage,
            prevPage,
            hasNextPage,
            hasPrevPage,
          };
    
          const { nextLink, prevLink, firstLink, lastLink, urlBase } =
            generatePaginationLinks(pagLinksParams);
    
          if (docs.length > 0) {
            formatearProductos(docs);
    
            req.io.on("connection", async (socket) => {
              // socket.username = user.email;
              req.io.emit("Server:loadProducts", docs);
            });
            const isPremium = req.user.role.toLowerCase() === "premium";
            res.render("realTimeProducts", {
              username: user.mail,
              renderPage: "/realTimeProducts/",
              nombre: user.first_name,
              apellido: user.last_name,
              admin: user.admin,
              premium: isPremium,
              title: "Edit mercadito || Gago",
              products: docs,
              page,
              hasPrevPage,
              hasNextPage,
              prevPage,
              nextPage,
              totalPages,
              totalDocs,
              pagingCounter,
              limit,
              categoryArray,
              nextLink,
              prevLink,
              firstLink,
              lastLink,
              urlBase,
              styles: "homeStyles.css",
              user: JSON.stringify(user),
              username: user.email,
            });
          } else {
            req.io.on("connection", async (socket) => {
              // socket.username = user.email;
              req.io.emit("Server:loadProducts", docs);
            });
            const isPremium = req.user.role.toLowerCase() === "premium";
    
            res.render("realTimeProducts", {
              username: user.mail,
              renderPage: "/realTimeProducts/",
              nombre: user.first_name,
              apellido: user.last_name,
              admin: user.admin,
              premium: isPremium,
              title: "Edit mercadito || Gago",
              products: [],
              page,
              hasPrevPage,
              hasNextPage,
              prevPage,
              nextPage,
              totalPages,
              totalDocs,
              pagingCounter,
              limit,
              categoryArray,
              nextLink,
              prevLink,
              firstLink,
              lastLink,
              urlBase,
              styles: "homeStyles.css",
              user: JSON.stringify(user),
              username: user.email,
            });
          }
        } catch (error) {
          console.error(error);
          res.status(500).json({ error: "Error al obtener los productos" });
        }
      }
}

module.exports = ProductsViewsController;  