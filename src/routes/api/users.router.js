const { Router } = require("express");
const {UsersController} = require("../../controllers/users.controller");
const { authorization } = require("../../middlewares/auth.middleware");
const bcrypt = require('bcrypt');

const usersRouter = Router();
const usersController = new UsersController();

usersRouter.get("/", authorization(['admin']), usersController.getUsers);
usersRouter.post("/", authorization(['admin']), usersController.createUser);
usersRouter.get("/premium/:uid", authorization(['admin']), usersController.switchPremium);
usersRouter.get("/filter", authorization(['admin']), usersController.getUserBy);
usersRouter.get("/email", authorization(['admin']), usersController.getUserByEmail);

usersRouter.get('/reset-password', authorization(['public']), usersController.resetPassword);
usersRouter.post('/reset-password', authorization(['public']), usersController.challengePassword);

module.exports = usersRouter;

