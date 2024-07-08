const { Router } = require("express");
const passport = require("passport");
const {
  githubAuth,
  githubCallback,
  register,
  failRegister,
  login,
  failLogin,
  currentUser,
  logout,
  status,
} = require("../../controllers/sessions.controller");
const { authorization } = require("../../middlewares/auth.middleware");

const sessionsRouter = Router();

sessionsRouter.get("/github",authorization(['public']), passport.authenticate("github", { scope: "user:email" }), githubAuth);

sessionsRouter.get("/githubcallback", authorization(['public']), passport.authenticate("github", { failureRedirect: "/login" }), githubCallback);

sessionsRouter.post("/register", authorization(['public']), passport.authenticate("register", { failureRedirect: "/failregister" }), register);

sessionsRouter.post("/failregister", authorization(['public']), failRegister);

sessionsRouter.post("/login", authorization(['public']), passport.authenticate("login", { failureRedirect: "faillogin" }), login);

sessionsRouter.get("/faillogin", authorization(['public']), failLogin);

sessionsRouter.get("/current", authorization(['user', 'admin']), currentUser);

sessionsRouter.get("/logout", authorization(['public']), logout);

sessionsRouter.get("/status", authorization(['public']), status);

module.exports = { sessionsRouter };

