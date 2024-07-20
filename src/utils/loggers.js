const winston = require("winston");
const { objectConfig } = require("../config/config");

const execMode = objectConfig.execMode;

const customLevelOptions = {
  levels: {
    fatal: 0,
    error: 1,
    warning: 2,
    info: 3,
    http: 4,
    debug: 5,
  },
  colors: {
    fatal: "red",
    error: "magenta",
    warning: "yellow",
    info: "green",
    http: "cyan",
    debug: "blue",
  },
};

let logger;
if (execMode === "development") {
  logger = winston.createLogger({
    levels: customLevelOptions.levels,
    transports: [
      new winston.transports.Console({
        level: "debug",
        format: winston.format.combine(
          winston.format.colorize({ colors: customLevelOptions.colors }),
          winston.format.simple()
        ),
      }),
    ],
  });
} else {
  logger = winston.createLogger({
    levels: customLevelOptions.levels,
    transports: [
      new winston.transports.Console({
        level: "info",
        format: winston.format.combine(
          winston.format.colorize({ colors: customLevelOptions.colors }),
          winston.format.simple()
        ),
      }),
      new winston.transports.File({
        filename: "./errors.log",
        level: "error",
        format: winston.format.simple(),
      }),
    ],
  });
}


// middleware
const addLogger = (req, res, next) => {
  req.logger = logger;
  req.logger.http(
    `${req.method} en ${req.url} - ${new Date().toLocaleString()}`
  );
  next();
};

module.exports = { logger, addLogger };
