const {dirname} = require('path')
exports.swaggerOptions = {
    definition: {
      openapi: "3.0.1",
      info: {
        title: "Documentación de App e-commerce",
        description:
          "API para el estudio del desarrollo de e-commerce en CoderHouse",
      },
    },
    apis: [`${dirname(__dirname)}/docs/**/*.yaml`],
  };