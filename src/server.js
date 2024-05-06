const express = require("express");

const { router: productsRouter } = require("./routes/products.router.js");
const { router: cartsRouter } = require("./routes/carts.router.js");
const { router: viewsRouter } = require("./routes/views.router.js");


const handlebars = require("express-handlebars");

const { Server } = require("socket.io");

const { connectDB } = require("./config/index.js");

const app = express();

const PORT = process.env.PORT || 8080;

const httpServer = app.listen(PORT, (error) => {
  if (error) console.log(error);
  console.log(`Server escuchando en el puerto ${PORT}`);
});

const Sockets =require ("./sockets");
const io = new Server(httpServer);
Sockets(io);

app.use((req, res, next) => {
  req.io = io;
  next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));


connectDB()

app.engine(
  "hbs",
  handlebars.engine({
    extname: ".hbs",
  })
);
app.set("views", __dirname + "/views");
app.set("view engine", "hbs");

app.use("/", viewsRouter);

app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);

app.use((req, res, next) => {
  res.status(404).send(`La ruta ${req.url} no está definida para este método`);
});

app.use((error, req, res, next) => {
  console.log(error);
  res.status(500).send("Error 500 en el server");
});

module.exports = app;
