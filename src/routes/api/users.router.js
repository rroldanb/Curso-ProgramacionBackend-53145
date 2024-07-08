const { Router } = require("express");
const {UsersController} = require("../../controllers/users.controller");
const { authorization } = require("../../middlewares/auth.middleware");

const usersRouter = Router();
const usersController = new UsersController();

usersRouter.get("/", authorization(['admin']), usersController.getUsers);
usersRouter.post("/", authorization(['admin']), usersController.createUser);
usersRouter.get("/filter", authorization(['admin']), usersController.getUserBy);
usersRouter.get("/email", authorization(['admin']), usersController.getUserByEmail);

module.exports = usersRouter;
