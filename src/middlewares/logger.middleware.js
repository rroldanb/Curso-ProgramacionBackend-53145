const { logger } = require("../config/logger.config");

const loggerMiddleware = (req, res, next) => {
  req.logger = logger;
  req.logger.http(
    `${req.method} en ${req.url} - ${new Date().toLocaleString()}`
  );
  next();
};

module.exports = { loggerMiddleware };
