const passport = require("passport");
const { SessionsService } = require("../services/index");
const UserDTO = require("../dtos/users.dto");

const sessionsService =  SessionsService;

const githubAuth = (req, res) => {};

const githubCallback = (req, res) => {
  try {
    const user = req.user;
    const admin = req.user.role === "admin";

    req.session.user = { user };
    req.session.user.admin = { admin };

    res.redirect("/");
  } catch (error) {
    res.status(500).send({ error: 'Internal Server Error' });
  }
};

const register = async (req, res) => {
  try {
    const result = await sessionsService.register(req);
    res.send(result);
  } catch (error) {
    res.status(500).send({ error: 'Internal Server Error' });
  }
};

const failRegister = async (req, res) => {
  try {
    const result = await sessionsService.failRegister();
    res.send(result);
  } catch (error) {
    
    res.status(500).send({ error: 'Internal Server Error' });
  }
};

const login = async (req, res) => {
  try {
    const result = await sessionsService.login(req);
    res.send(result);
  } catch (error) {
    res.status(500).send({ error: 'Internal Server Error' });
  }
};

const failLogin = (req, res) => {
  try {
    const result = sessionsService.failLogin();
    res.send(result);
  } catch (error) {
    res.status(500).send({ error: 'Internal Server Error' });
  }
};

const currentUser = async (req, res) => {
  try {
    
    const result = await sessionsService.currentUser(req);
    if (result.status === "success") {
      const newUser = new UserDTO (result.payload)
      res.status(200).json(newUser);
    } else {
      res.status(401).json(result);
    }
  } catch (error) {
    res.status(500).send({ error: `Internal Server Error` });
  }
};

const logout = async (req, res) => {
  try {
    const redirectUrl = await sessionsService.logout(req);
    res.redirect(redirectUrl);
  } catch (error) {
    res.status(500).send({ error: 'Internal Server Error' });
  }
};

const status = async (req, res) => {
  try {
    const result = await sessionsService.status(req);
    res.json(result);
  } catch (error) {
    res.status(500).send({ error: 'Internal Server Error' });
  }
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
