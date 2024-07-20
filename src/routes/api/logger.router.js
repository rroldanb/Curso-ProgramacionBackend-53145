const { Router } = require('express');

const { objectConfig } = require('../../config/config'); 
const execMode = objectConfig.execMode;

const loggerRouter = Router();


loggerRouter.get('/', async (req, res) => {
    req.logger.info(`Se vienen las pruebas:`)
    req.logger.fatal(`Alerta de prueba nivel fatal - ${new Date().toLocaleString()}`)
    req.logger.error(`Alerta de prueba nivel error - ${new Date().toLocaleString()}`)
    req.logger.warning(`Alerta de prueba nivel warning - ${new Date().toLocaleString()}`)
    req.logger.info(`Alerta de prueba nivel info - ${new Date().toLocaleString()}`)
    req.logger.http(`Alerta de prueba nivel http - ${new Date().toLocaleString()}`)
    req.logger.debug(`Alerta de prueba nivel debug - ${new Date().toLocaleString()}`)

    res.send(`Pruebas de logger en mode de ejecución en modo ${execMode} - ${new Date().toLocaleString()}`)
})
module.exports = loggerRouter;

