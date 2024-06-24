const express = require("express");
const dotenv = require('dotenv')
const app = express();
dotenv.config()


const {router: routerApp} = require ("./routes/index.js")
const { connectDB, objectConfig } = require("./config/index.js");

// socket io
const { Server } = require("socket.io");
const Sockets = require ("./sockets");

//cookie - session
const session = require ("express-session")


//passport
const passport = require("passport");
const { initializePassport } = require("./config/passport.config.js");

const port = objectConfig.port

const httpServer = app.listen(port, (error) => {
  if (error) console.log(error);
  console.log(`Server escuchando en el puerto ${port}`);
});

//mongo DB
connectDB()

//socket
const io = new Server(httpServer);
Sockets(io);

app.use((req, res, next) => {
  req.io = io;
  next();
});


//json
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));

// sessions con mongo - db
const configureSession = require('./config/sessionConfig.js');
configureSession(app);

//passsport
initializePassport()

app.use(passport.initialize())
app.use(session())


//views
app.set("views", __dirname + "/views");


// motor de plantilla
const hbs = require('./config/handlebarsConfig.js')(app);


app.engine(".hbs", hbs.engine );
app.set("view engine", ".hbs");

app.use(routerApp)


module.exports = app;
