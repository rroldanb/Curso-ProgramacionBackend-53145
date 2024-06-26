// session -> login - register - logout
const { Router } = require("express");
const sessionsRouter = Router();

const { UsersManagerMongo } = require("../../dao/UsersManager.js");
const userService = new UsersManagerMongo();

const { createHash, isValidPassword } = require("../../utils/bcrypt.js");
const { auth } = require("../../middlewares/auth.middleware.js");
const { toCapital } = require("../../public/js/renderUtils.js");
const passport = require("passport");
const MongoStore = require("connect-mongo");

sessionsRouter.get(
  "/github",
  passport.authenticate("github", { scope: "user:email" }),
  async (req, res) => {}
);
sessionsRouter.get(
  "/githubcallback",
  passport.authenticate("github", { failureRedirect: "/login" }),
  (req, res) => {
    const user = req.user;
    const admin = req.user.role === "admin";

    req.session.user = { user };
    req.session.user.admin = { admin };

    res.redirect("/");
  }
);


sessionsRouter.post(
  "/register",
  passport.authenticate("register", { failureRedirect: "/failregister" }),
  async (req, res) => {
    res.send({ status: "success", message: "User Registered" });
  }
);

sessionsRouter.post("/failregister", async (req, res) => {
  console.log("falló la estrategia");
  res.send({ error: "Register failed" });
});

sessionsRouter.post(
  "/login",
  passport.authenticate("login", { failureRedirect: "faillogin" }),

  async (req, res) => {
    if (!req.user)
      return res
        .status(400)
        .send({ status: "error", error: "credenciales invalidas" });
    req.session.user = {
      first_name: req.user.first_name,
      last_name: req.user.last_name,
      cart_id: req.user.cart_id,
      admin: req.user.role === "admin",
      email: req.user.email,
    };
    res.send({ status: "success", payload: req.session.user });
    // res.send({status: 'success'})
  }
);

sessionsRouter.get("/faillogin", (req, res) => {
  console.log("login failed");
  res.send({ error: "Login failed" });
});

sessionsRouter.get("/current", (req, res) => {
  const user = req.session.user;
  res.send({ status: "success", payload: user });
});

sessionsRouter.get("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) return res.send({ status: "error", error: err });
    else return res.redirect("/login");
  });
});

sessionsRouter.get("/status", (req, res) => {
  if (req.session.user) {
    res.json({
      isAuthenticated: true,
      isAdmin: req.session.user.admin,
    });
  } else {
    res.json({
      isAuthenticated: false,
      isAdmin: false,
    });
  }
});

module.exports = { sessionsRouter };
