const { testEmail, sendResetEmail, deleteProductEmail } = require("../utils/sendMail");
const crypto = require("crypto");
const UsersManager = require("../dao/mongo/users.mongo");
const usersManager = new UsersManager();

class MailController {
  constructor () {}

  sendTest = async (req, res) => {
      try {
        await testEmail();
        res.status(200).send("Email enviado con éxito");
      } catch (error) {
        console.error(error);
        res.status(500).send("Error al enviar el email");
      }
  }
  
  sendResetEmail = async (req, res) => {
      const { email } = req.body;
      try {

    
        const user = await usersManager.getUserByEmail({ email });
        if (!user) {
          return res.status(404).send("Usuario no encontrado");
        }
        const token = crypto.randomBytes(20).toString("hex");
        user.resetPasswordToken = token;
        user.resetPasswordExpires = Date.now() + 3600000;
    
        const result = await usersManager.updateUser(user._id, {
          resetPasswordToken: token,
          resetPasswordExpires: user.resetPasswordExpires,
        });
        await resetEmail(user.email, token);
        res
          .status(200)
          .json({ message: "Correo de restablecimiento enviado con éxito" });
      } catch (error) {
        console.error(error);
        res
          .status(500)
          .json({ error: "Error al enviar el correo de restablecimiento" });
      }
  }




  sendDeleteProductEmail = async (req, res) => {
    const { email, product } = req.body;
    try {
      const user = await usersManager.getUserByEmail({ email });
      if (!user) {
        return res.status(404).send("Usuario no encontrado");
      }
      await deleteProductEmail(user.email, product);
      res
        .status(200)
        .json({ message: "Correo de notificación de eliminación de producto enviado con éxito" });
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ error: "Error al enviar el correo de notificación de eliminación de producto" });
    }
}

}

module.exports = {MailController}