const express = require("express");
const dotenv = require('dotenv');
const path = require('path');
const { Server } = require("socket.io");
const passport = require("passport");
const { connectDB, objectConfig } = require("./config/config");
const configureHandlebars = require('./config/handlebarsConfig');
const configureSession = require('./config/sessionConfig');
const initializePassport = require("./config/passport.config").initializePassport;
const { router: routerApp } = require("./routes/index");
const Sockets = require("./sockets");
const cors = require('cors');

// Configuración de entorno
dotenv.config();

// Inicialización de la aplicación Express
const app = express();
const port = objectConfig.port;
// Configura CORS
app.use(cors());

// Conexión a la base de datos
// connectDB(); //ahora va en Factory

// Configuración del servidor HTTP y Socket.IO
const httpServer = app.listen(port, (error) => {
  if (error) console.log(error);
  console.log(`Server escuchando en el puerto ${port}`);
});
const io = new Server(httpServer);
Sockets(io);

// Middleware para compartir io con las rutas
app.use((req, res, next) => {
  req.io = io;
  next();
});

// Configuración de middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

// Configuración de sesiones
configureSession(app);

// Inicialización de Passport
initializePassport();
app.use(passport.initialize());
app.use(passport.session()); // Uso de sesiones de Passport

// Configuración de vistas y motor de plantillas
app.set("views", path.join(__dirname, "views"));
const hbs = configureHandlebars(app);
app.engine(".hbs", hbs.engine);
app.set("view engine", ".hbs");

// Rutas
app.use(routerApp);

module.exports = app;
