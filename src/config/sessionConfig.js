// sessionConfig.js
const session = require('express-session');
const MongoStore = require('connect-mongo');
const { objectConfig } = require('./index'); 

module.exports = (app) => {
  app.use(session({
    store: MongoStore.create({
      mongoUrl: objectConfig.mongo_url,
      mongoOptions: {
        useNewUrlParser: true,
        useUnifiedTopology: true 
      },
      ttl: 60 * 60 * 1000 * 24
    }),
    secret: objectConfig.mongo_secret,
    resave: true,
    saveUninitialized: true
  }));
};
