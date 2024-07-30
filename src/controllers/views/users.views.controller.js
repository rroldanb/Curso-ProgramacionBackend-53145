class UsersViewsController {
  constructor() {}

  resetPassword = async (req, res) => {
    const { token } = req.query;
    let expired = false
    if (!token) {
      return res.status(400).render("error", {
        title: "Error",
        message:
          "Token de restablecimiento no proporcionado. Por favor, verifica el enlace en tu correo.",
      });
    }

    try {
      const UsersManager = require("../../dao/mongo/users.mongo.js");
      const usersManager = new UsersManager();
      const user = await usersManager.getUserByResetToken(token);
      if (!user) {
        return res.status(400).render("error", {
          title: "Error",
          message:
            "Token de restablecimiento inválido. Por favor, solicita uno nuevo.",
        });
      }
      if (user.resetPasswordExpires < new Date()) {
        console.log("token expirado")
        expired = true
      }
      res.render("reset-password", {
        title: "Restablecer Contraseña",
        styles: "homeStyles.css",
        token: token,
        expired
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
}

module.exports = UsersViewsController;
