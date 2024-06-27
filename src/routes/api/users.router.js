// routes/users.router.js
const { Router } = require("express");
const UsersController = require("../../controllers/users.controller");

const usersRouter = Router();
const usersController = new UsersController();

usersRouter.get("/", usersController.getUsers);
usersRouter.post("/", usersController.createUser);
usersRouter.get("/filter", usersController.getUserBy);
usersRouter.get("/email", usersController.getUserByEmail);

module.exports = usersRouter;
