
const { connect } = require('mongoose');
const dotenv = require('dotenv');
const { program } = require('../utils/commander');
const { mode } = program.opts();

dotenv.config({
  path: mode === 'production' ? './.env.production' : './.env.development'
});

exports.objectConfig = {
  port: process.env.PORT || 8080,
  mongo_url: process.env.MONGO_URL,
  mongo_secret: process.env.MONGO_SECRET
};

exports.connectDB = () => {
  connect(process.env.MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("Base de datos conectada"))
    .catch((err) => console.error("Error conectando a la base de datos", err));
};
