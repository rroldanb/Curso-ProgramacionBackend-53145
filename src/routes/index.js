const { router: viewsRouter } = require("./views.router.js");
const { router: productsRouter } = require("./api/products.router.js");
const { router: cartsRouter } = require("./api/carts.router.js");
const { sessionsRouter } = require("./api/sessions.router.js");

const { Router } = require("express");
const mailRouter = require("./api/mail.router.js");
const usersRouter = require("./api/users.router.js");
const ticketsRouter = require("./api/tickets.router.js");
const mockingRouter = require("./api/mocking.router.js");
const loggerRouter = require("./api/logger.router.js");
// const authRouter = require("./api/auth.router.js");

const router = Router();

router.use("/", viewsRouter);
router.use("/api/products", productsRouter);
router.use("/api/carts", cartsRouter);

router.use("/api/tickets", ticketsRouter);

router.use("/api/users", usersRouter);

router.use("/api/sessions", sessionsRouter);
router.use('/api/mocking', mockingRouter)
router.use('/api/loggertest', loggerRouter)
router.use('/loggertest', loggerRouter)
// router.use('/auth', authRouter)
router.use("/sessions", sessionsRouter);
router.use('/mail', mailRouter)


router.use((req, res, next) => {
  res.status(404).send(`La ruta ${req.url} no está definida para este método`);
});

// router.use((error, req, res, next) => {
//   console.log(error);
//   res.status(500).send("Error 500 en el server");
// });

module.exports = {
  router,
};

