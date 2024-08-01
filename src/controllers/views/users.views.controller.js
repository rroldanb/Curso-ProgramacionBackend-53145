class UsersViewsController {
  constructor() {}

  resetPassword = async (req, res) => {
    const { token } = req.query;
    let expired = false
    let inValidToken = false
    if (!token) {
      return res.status(400).render("error", {
        title: "Error",
        message:
          "Token de restablecimiento no proporcionado. Por favor, verifica el enlace en tu correo o solicita uno nuevo.",
      });
    }

    try {
      const UsersManager = require("../../dao/mongo/users.mongo.js");
      const usersManager = new UsersManager();
      const user = await usersManager.getUserByResetToken(token);
      if (!user) {
        inValidToken = true
        console.log('no user found')

      }
      if (user?.resetPasswordExpires < new Date()) {
        console.log("token expirado")
        expired = true
      }
      res.render("reset-password", {
        title: "Restablecer Contraseña",
        styles: "homeStyles.css",
        token: token,
        expired, inValidToken
      });
    } catch (error) {
      console.error("Error while fetching user by reset token:", error);
      res.status(500).render("error", {
        title: "Error del servidor",
        message:
          "Ocurrió un error al intentar restablecer la contraseña. Por favor, intenta nuevamente más tarde.",
      });
    }
  };


  renderChat = async (req, res) => {
    const user = req.user;
    res.render("chat", {
      title: "Chat mercadito || Gago",
      styles: "chat.css",
      user: JSON.stringify(user),
      username: user.email,
    });
  }

}

module.exports = UsersViewsController;
