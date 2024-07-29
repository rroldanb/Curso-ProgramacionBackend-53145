const { Router } = require('express');
const UsersManager = require("../../dao/mongo/users.mongo");
const usersManager = new UsersManager();
const bcrypt = require('bcrypt');

const authRouter = Router();

authRouter.get('/reset-password', async (req, res) => {
  const { token } = req.query;

  try {
    const user = await usersManager.getUserBy({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() }, 
    });

    if (!user) {
      return res.status(400).send('Token de restablecimiento inválido o expirado');
    }


    res.render('reset-password', { token }); 
  } catch (error) {
    console.error(error);
    res.status(500).send('Error en la solicitud');
  }
});

authRouter.post('/reset-password', async (req, res) => {
    const { token, newPassword } = req.body;
  
    try {
      const user = await usersManager.getUserBy({
        resetPasswordToken: token,
        resetPasswordExpires: { $gt: Date.now() },
      });
  
      if (!user) {
        return res.status(400).json({ message: 'Token de restablecimiento inválido o expirado' });
      }
  
      const isSamePassword = await bcrypt.compare(newPassword, user.password);
      if (isSamePassword) {
        return res.status(400).json({ message: 'La nueva contraseña no puede ser la misma que la anterior' });
      }
  
      // Actualizar contraseña
      user.password = await bcrypt.hash(newPassword, 10);
      user.resetPasswordToken = undefined;
      user.resetPasswordExpires = undefined;
      await usersManager.updateUser(user._id, user);
  
      res.status(200).json({ message: 'Contraseña restablecida con éxito' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error al restablecer la contraseña' });
    }
  });

module.exports = authRouter;
