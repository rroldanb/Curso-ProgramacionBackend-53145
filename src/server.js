//imports

const express = require("express");

const { router: productsRouter } = require("./routes/products.router.js");
const { router: cartsRouter } = require("./routes/carts.router.js");
const { router: viewsRouter } = require("./routes/views.router.js");
const {  sessionsRouter } = require("./routes/sessions.router.js");

const { connectDB } = require("./config/index.js");

// motor de plantilla
const handlebars = require("express-handlebars");

// socket io
const { Server } = require("socket.io");
const Sockets =require ("./sockets");


//cookie - session
const cookieParser = require ("cookie-parser")
const session = require ("express-session")

//session db storage
const MongoStore = require ("connect-mongo")

const app = express();

const PORT = process.env.PORT || 8080;

const httpServer = app.listen(PORT, (error) => {
  if (error) console.log(error);
  console.log(`Server escuchando en el puerto ${PORT}`);
});

const io = new Server(httpServer);
Sockets(io);

app.use((req, res, next) => {
  req.io = io;
  next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));



// sessions con mongo - db
app.use(session({
  store: MongoStore.create({
      mongoUrl: "mongodb+srv://gago:Larrucita2@cluster0.8ltmgp5.mongodb.net/ecommerce?retryWrites=true&w=majority&appName=Cluster0"
      ,
      mongoOptions: {
          // useNewUrlParser: true,
          // useUnifiedTopology: true 
      },
      ttl: 60 * 60 * 1000 * 24
  }),
  secret: 's3cr3etC@d3r',
  resave: true,
  saveUninitialized: true
}))

connectDB()

app.set("views", __dirname + "/views");

const hbs = handlebars.create({
  defaultLayout: "main",
  layoutsDir: (app.get("views")+ "/layouts"),
  partialsDir: (app.get("views")+ "/partials"),
  extname: ".hbs",
});

app.engine(".hbs", hbs.engine );
app.set("view engine", ".hbs");

app.use("/", viewsRouter);
app.use("/sessions", sessionsRouter);

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
