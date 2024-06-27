const passport = require("passport");
const {SessionsService} = require("../services/index");

const sessionsService = new SessionsService();

const githubAuth = (req, res) => {};

const githubCallback = (req, res) => {
  const user = req.user;
  const admin = req.user.role === "admin";

  req.session.user = { user };
  req.session.user.admin = { admin };

  res.redirect("/");
};

const register = async (req, res) => {
  const result = await sessionsService.register(req);
  res.send(result);
};

const failRegister = async (req, res) => {
  const result = await sessionsService.failRegister();
  res.send(result);
};

const login = async (req, res) => {
  const result = await sessionsService.login(req);
  res.send(result);
};

const failLogin = (req, res) => {
  const result = sessionsService.failLogin();
  res.send(result);
};

const currentUser = (req, res) => {
  const result = sessionsService.currentUser(req);
  res.send(result);
};

const logout = async (req, res) => {
  try {
    const redirectUrl = await sessionsService.logout(req);
    res.redirect(redirectUrl);
  } catch (error) {
    res.send(error);
  }
};

const status = async (req, res) => {
  const result = await sessionsService.status(req);
  res.json(result);
};

module.exports = {
  githubAuth,
  githubCallback,
  register,
  failRegister,
  login,
  failLogin,
  currentUser,
  logout,
  status,
};
