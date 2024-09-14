const express = require("express");
const dotenv = require("dotenv");
const path = require("path");
const { Server } = require("socket.io");
const passport = require("passport");
const { objectConfig } = require("./config/config");
const configureHandlebars = require("./config/handlebars.config");
const configureSession = require("./config/session.config");
const initializePassport = require("./config/passport.config").initializePassport;
const { router: routerApp } = require("./routes/index");
const Sockets = require("./sockets");
const cors = require("cors");
const handleErrors = require("./middlewares/error");
const { logger } = require("./config/logger.config");
const { loggerMiddleware } = require("./middlewares/logger.middleware");


// Inicialización de la aplicación Express
const app = express();
dotenv.config();

//inicializa el logger
app.use(loggerMiddleware);

//inicializa el puerto de la aplicación
const port = objectConfig.port;

// Configura CORS
app.use(cors());

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
app.use(handleErrors());

module.exports = app;
