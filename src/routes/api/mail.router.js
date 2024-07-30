const { Router } = require("express");
const { testEmail, sendResetEmail } = require("../../utils/sendMail");
const { authorization } = require("../../middlewares/auth.middleware");
const crypto = require("crypto");

const mailRouter = Router();

mailRouter.get("/testemail", authorization(["admin"]), async (req, res) => {
  try {
    await testEmail();
    res.status(200).send("Email enviado con éxito");
  } catch (error) {
    console.error(error);
    res.status(500).send("Error al enviar el email");
  }
});

mailRouter.post("/recoverpass", async (req, res) => {
  const { email } = req.body;
  try {
    const UsersManager = require("../../dao/mongo/users.mongo");
    const usersManager = new UsersManager();

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
    await sendResetEmail(user.email, token);
    res
      .status(200)
      .json({ message: "Correo de restablecimiento enviado con éxito" });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "Error al enviar el correo de restablecimiento" });
  }
});

module.exports = mailRouter;
