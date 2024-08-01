const {UsersService}= require("../services/index");
const bcrypt = require('bcrypt');
const { createHash, isValidPassword } = require("../utils/bcrypt.js");


class UsersController {
    constructor() {
        this.usersService =  UsersService;
    }


  getUsers = async (req, res) => {
    try {
      const { limit, numPage } = req.query;
      const users = await this.usersService.getUsers({ limit, numPage });
      res.send({ status: "success", payload: users });
    } catch (error) {
      console.error("Error getting users:", error);
      res.status(500).json({ error: "Error getting users" });
    }
  };

  createUser = async (req, res) => {
    try {
      const user = req.body;
      if (!user.email || !user.password) {
        throw new Error("Email and password are required");
      }
      const newUser = await this.usersService.createUser(user);
      res.send({ status: "success", payload: newUser });
    } catch (error) {
      console.error("Error creating user:", error);
      res.status(500).json({ error: "Error creating user" });
    }
  };

  switchPremium = async (req, res) => {
    try {
      const { uid } = req.params;
      const user = await this.usersService.getUserBy({_id:uid});
      
      if (!user) {
        return res.status(404).send({ status: "error", message: "User not found" });
      }

      if (user.role !== 'user' && user.role !== 'premium') {
        return res.status(403).send({ status: "error", message: "Role switch not allowed for this user" });
      }
      
      const newRole = user.role === 'user' ? 'premium' : 'user';
      const updatedUser = await this.usersService.updateUserRole(uid, newRole);
  
      res.send({ status: "success", payload: updatedUser });
    } catch (error) {
      console.error("Error switching user's role:", error);
      res.status(500).json({ error: "Error switching user's role" });
    }
  };
  

  getUserBy = async (req, res) => {
    try {
      const filter = req.query;
      const user = await this.usersService.getUserBy(filter);
      if (user) {
        res.send({ status: "success", payload: user });
      } else {
        res.status(404).json({ error: "User not found" });
      }
    } catch (error) {
      console.error("Error getting user by filter:", error);
      res.status(500).json({ error: "Error getting user by filter" });
    }
  };

  getUserByEmail = async (req, res) => {
    try {
      const  email  = req.query;
      if (!email) {
        throw new Error("Email is required");
      }  
      const user = await this.usersService.getUserByEmail(email);
      if (user) {
        res.send({ status: "success", payload: user });
      } else {
        res.status(404).json({ error: "User not found" });
      }
    } catch (error) {
      console.error("Error getting user by email:", error);
      res.status(500).json({ error: "Error getting user by email" });
    }
  };

resetPassword =  async (req, res) => {
  const { token } = req.query;
  let expired =false
  try {
    const user = await this.usersService.getUserBy({
      resetPasswordToken: token,
    });
    if (!user) {
      return res.status(400).send('Token de restablecimiento inválido');
    }
    if (user.resetPasswordExpires < new Date()) {
      console.log("token expirado")
      expired = true
      return res.status(400).send('Token de restablecimiento expirado');
    }
    res.render('reset-password', { token , expired}); 
  } catch (error) {
    console.error(error);
    res.status(500).send('Error en la solicitud');
  }
};



challengePassword = async (req, res) => {
  const { token, newPassword } = req.body;
  let expired =false
  try {
    const user = await this.usersService.getUserBy({
      resetPasswordToken: token,
    });
    if (!user) {
      return res.status(400).json({ message: 'Token de restablecimiento inválido' });
    }
    if (user.resetPasswordExpires < new Date()) {
      console.log("token expirado")
      expired = true
      return res.status(400).send('Token de restablecimiento expirado');
    }
    const isSamePassword = isValidPassword(newPassword, {
      password: user.password,
    });  //await bcrypt.compare(newPassword, user.password);
    if (isSamePassword) {
      return res.status(400).json({ message: 'La nueva contraseña no puede ser la misma que la anterior' });
    }
    user.password = createHash(newPassword) // await bcrypt.hash(newPassword, 10);
    // user.resetPasswordExpires = (new Date()-3600);
    // await this.usersService.updateUser(user._id, {...user, resetPasswordToken : undefined , resetPasswordExpires: undefined});
    await this.usersService.updateUser(user._id, {
      password: user.password,
      $unset: {
        resetPasswordToken: "",
        resetPasswordExpires: "",
      }
    });

    res.status(200).json({ message: 'Contraseña restablecida con éxito' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al restablecer la contraseña' });
  }
};

}

module.exports = {UsersController};
