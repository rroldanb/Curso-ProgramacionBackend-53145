const passport = require("passport");
const logger = require('../../utils/loggers')

class SessionDaoMongo {
  register = async (req) =>{
    return { status: "success", message: "User Registered" };
  }

  failRegister = async () =>{
    console.error("falló la estrategia");
    return { error: "Register failed" };
  }

  login = async (req) =>{
    if (!req.user) {
      return { status: "error", error: "credenciales invalidas" };
    }

    req.session.user = {
      first_name: req.user.first_name,
      last_name: req.user.last_name,
      cart_id: req.user.cart_id,
      admin: req.user.role === "admin",
      email: req.user.email,
      role: req.user.role,
      uid: req.user._id
    };

    return { status: "success", payload: req.session.user };
  }

  failLogin = async () =>{
    console.error("login failed");
    return { error: "Login failed" };
  }

  currentUser = async (req, res) =>{
    const user = req.session.user;
    if (user) {
      return { status: "success", payload: user };
    } else {
      return { status: "error", error: "Usuario no autenticado" };
    }
    
  }

  logout = async (req) =>{
    return new Promise((resolve, reject) => {
      req.session.destroy((err) => {
        if (err) {
          reject({ status: "error", error: err });
        } else {
          resolve("/");
        }
      });
    });
  }

  status = async (req) =>{
    if (req.session.user) {
      return {
        isAuthenticated: true,
        username: req.session.user.email,
        isAdmin: req.session.user.admin,
        isPremium: req.session.user.role.toLowerCase() === 'premium'
      };
    } else {
      return {
        isAuthenticated: false,
        isAdmin: false,
      };
    }
  }
}

module.exports = SessionDaoMongo;
