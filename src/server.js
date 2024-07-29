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
const handleErrors = require("./middlewares/error");
const { addLogger, logger } = require("./utils/loggers");

// Configuración de entorno

// Inicialización de la aplicación Express
const app = express();
dotenv.config();
app.use(addLogger)
const port = objectConfig.port;
// Configura CORS
app.use(cors());



// Conexión a la base de datos
// connectDB(); //ahora va en Factory

// Configuración del servidor HTTP y Socket.IO
const httpServer = app.listen(port, (error) => {
  if (error) logger.fatal(error);
  logger.info(`Server escuchando en el puerto ${port}`);
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
app.use(passport.session()); 

// Configuración de vistas y motor de plantillas
app.set("views", path.join(__dirname, "views"));
const hbs = configureHandlebars(app);
app.engine(".hbs", hbs.engine);
app.set("view engine", ".hbs");

// Rutas
app.use(routerApp);
app.use(handleErrors())

module.exports = app;
