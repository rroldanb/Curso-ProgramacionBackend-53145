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

const sessionsRouter = Router();

sessionsRouter.get("/github", passport.authenticate("github", { scope: "user:email" }), githubAuth);

sessionsRouter.get("/githubcallback", passport.authenticate("github", { failureRedirect: "/login" }), githubCallback);

sessionsRouter.post("/register", passport.authenticate("register", { failureRedirect: "/failregister" }), register);

sessionsRouter.post("/failregister", failRegister);

sessionsRouter.post("/login", passport.authenticate("login", { failureRedirect: "faillogin" }), login);

sessionsRouter.get("/faillogin", failLogin);

sessionsRouter.get("/current", currentUser);

sessionsRouter.get("/logout", logout);

sessionsRouter.get("/status", status);

module.exports = { sessionsRouter };

