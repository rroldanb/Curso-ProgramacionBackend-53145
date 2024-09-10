const session = require('express-session');
const MongoStore = require('connect-mongo');
const { objectConfig } = require('./config'); 

module.exports = (app) => {
  app.use(session({
    store: MongoStore.create({
      mongoUrl: objectConfig.mongo_url,
      ttl: 60 * 60 * 24 
    }),
    secret: objectConfig.mongo_secret,
    resave: true,
    saveUninitialized: true
  }));
};