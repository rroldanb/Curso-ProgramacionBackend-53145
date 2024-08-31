const { Router } = require("express");
const {UsersController} = require("../../controllers/users.controller");
const { authorization } = require("../../middlewares/auth.middleware");
const uploader = require("../../middlewares/uploader");

const usersRouter = Router();
const usersController = new UsersController();

usersRouter.get("/", authorization(['admin']), usersController.getUsers);
usersRouter.get("/filter", authorization(['admin']), usersController.getUserBy);
usersRouter.get("/email", authorization(['admin']), usersController.getUserByEmail);
usersRouter.post("/", authorization(['admin']), usersController.createUser);
usersRouter.get("/premium/:uid", authorization(['admin']), usersController.switchPremium);
usersRouter.post("/:uid/documents", authorization(['user', 'premium', 'admin']), uploader.array('documents', 4), usersController.updateUserProfile);
usersRouter.delete("/:uid", authorization(['admin']), usersController.deleteUserById);


usersRouter.get('/reset-password', authorization(['public']), usersController.resetPassword);
usersRouter.post('/reset-password', authorization(['public']), usersController.challengePassword);

module.exports = usersRouter;

