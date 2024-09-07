const { Router } = require("express");
const passport = require("passport");
const SessionsController = require("../../controllers/sessions.controller");
const { authorization } = require("../../middlewares/auth.middleware");
const sessionsController = new SessionsController()
const sessionsRouter = Router();

sessionsRouter.get("/github",authorization(['public']), passport.authenticate("github", { scope: "user:email" }), sessionsController.githubAuth);
sessionsRouter.get("/githubcallback", authorization(['public']), passport.authenticate("github", { failureRedirect: "/login" }), sessionsController.githubCallback);

sessionsRouter.post("/register", authorization(['public']), passport.authenticate("register", { failureRedirect: "/failregister" }), sessionsController.register);
sessionsRouter.post("/failregister", authorization(['public']), sessionsController.failRegister);

sessionsRouter.post("/login", authorization(['public']), passport.authenticate("login", { failureRedirect: "faillogin" }), sessionsController.login);
sessionsRouter.get("/faillogin", authorization(['public']), sessionsController.failLogin);

sessionsRouter.get("/current", authorization(['user', 'premium' ,'admin']), sessionsController.currentUser);

sessionsRouter.get("/logout", authorization(['public']), sessionsController.logout);

sessionsRouter.get("/status", authorization(['public']), sessionsController.status);

module.exports = { sessionsRouter };

