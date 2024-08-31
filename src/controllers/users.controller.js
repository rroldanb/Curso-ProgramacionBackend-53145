const { UsersService } = require("../services/index");
const bcrypt = require("bcrypt");
const { createHash, isValidPassword } = require("../utils/bcrypt.js");
const uploader = require("../middlewares/uploader.js");
const path = require("path");
// const { status } = require("./sessions.controller.js");

class UsersController {
  constructor() {
    this.usersService = UsersService;
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
      const user = await this.usersService.getUserBy({ _id: uid });

      if (!user) {
        return res
          .status(404)
          .send({ status: "error", message: "User not found" });
      }

      if (user.role !== "user" && user.role !== "premium") {
        return res.status(403).send({
          status: "error",
          message: `No está permitido cambiar el rol de un usuario ${user.role}`,
        });
      }

      const requiredDocuments = [ 'dni', 'domicilio', 'cuenta'];
      const hasAllDocuments = requiredDocuments.every(docName =>
          user.documents.some(doc => doc.name === docName)
      );

      if (!hasAllDocuments && user.role==='user') {
          return res.status(400).json({ status:"error", message: 'El usuario no tiene todos los documentos requeridos para promoverlo a Premium.' });
      }

      const newRole = user.role === "user" ? "premium" : "user";
      const updatedUser = await this.usersService.updateUserRole(uid, newRole);

      return res.status(200).send({
        status: "success",
        message: `Rol del usuario actualizado con éxito`,
        payload: updatedUser
      });
    } catch (error) {
      console.error("Error actualizando el rol del usuario:", error);
      res.status(500).json({ error: "Error actualizando el rol del usuario" });
    }
  };

  getUserBy = async (req, res) => {
    try {
      const filter = req.query;
      const user = await this.usersService.getUserBy(filter);
      if (user) {
        res.send({ status: "success", payload: user });
      } else {
        res.status(404).json({ error: "Usuario no encontrado" });
      }
    } catch (error) {
      console.error("Error obteniendo el usuario con el filtro otorgado:", error);
      res.status(500).json({ error: "Error obteniendo el usuario con el filtro otorgado" });
    }
  };

  getUserByEmail = async (req, res) => {
    try {
      const email = req.query;
      if (!email) {
        throw new Error("El email es requerido");
      }
      const user = await this.usersService.getUserByEmail(email);
      if (user) {
        res.send({ status: "success", payload: user });
      } else {
        res.status(404).json({ error: "Usuario no encontrado" });
      }
    } catch (error) {
      console.error("Error obteniendo el usuario con el email entregado:", error);
      res.status(500).json({ error: "Error obteniendo el usuario con el email entregado" });
    }
  };

  resetPassword = async (req, res) => {
    const { token } = req.query;
    let expired = false;
    try {
      const user = await this.usersService.getUserBy({
        resetPasswordToken: token,
      });
      if (!user) {
        return res.status(400).send("Token de restablecimiento inválido");
      }
      if (user.resetPasswordExpires < new Date()) {
        console.log("token expirado");
        expired = true;
        return res.status(400).send("Token de restablecimiento expirado");
      }
      res.render("reset-password", { token, expired });
    } catch (error) {
      console.error(error);
      res.status(500).send("Error en la solicitud");
    }
  };

  challengePassword = async (req, res) => {
    const { token, newPassword } = req.body;
    let expired = false;
    try {
      const user = await this.usersService.getUserBy({
        resetPasswordToken: token,
      });
      if (!user) {
        return res
          .status(400)
          .json({ message: "Token de restablecimiento inválido" });
      }
      if (user.resetPasswordExpires < new Date()) {
        console.log("token expirado");
        expired = true;
        return res.status(400).send("Token de restablecimiento expirado");
      }
      const isSamePassword = isValidPassword(newPassword, {
        password: user.password,
      }); //await bcrypt.compare(newPassword, user.password);
      if (isSamePassword) {
        return res.status(400).json({
          message: "La nueva contraseña no puede ser la misma que la anterior",
        });
      }
      user.password = createHash(newPassword); // await bcrypt.hash(newPassword, 10);
      // user.resetPasswordExpires = (new Date()-3600);
      // await this.usersService.updateUser(user._id, {...user, resetPasswordToken : undefined , resetPasswordExpires: undefined});
      await this.usersService.updateUser(user._id, {
        password: user.password,
        $unset: {
          resetPasswordToken: "",
          resetPasswordExpires: "",
        },
      });

      res.status(200).json({ message: "Contraseña restablecida con éxito" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error al restablecer la contraseña" });
    }
  };

  uploadDocuments = async (req, res) => {
    try {
      const userId = req.params.uid;
      const files = req.files;
      if (!files || files.length === 0) {
        return res.status(400).json({ message: "No se subieron archivos" });
      }

      const uploadedDocuments = files.map((file) => ({
        name: file.originalname,
        reference: file.path,
      }));

      const user = await User.findByIdAndUpdate(
        userId,
        { $push: { documents: { $each: uploadedDocuments } } },
        { new: true }
      );

      if (!user) {
        return res.status(404).json({ message: "Usuario no encontrado" });
      }

      res.status(200).json({ message: "Documentos subidos con éxito", user });
    } catch (error) {
      res.status(500).json({ message: "Error al subir los documentos", error });
    }
  };

  updateUserProfile = async (req, res) => {
    const userId = req.params.uid;

    try {
        const { first_name, last_name, age, email, documentsToDelete } = req.body;
        const files = req.files;

        if (email) {
          const existingUser = await this.usersService.getUserBy({ email });
          if (existingUser && existingUser._id.toString() !== userId) {
              return res.status(400).json({ message: "El correo electrónico ya está en uso por otro usuario." });
          }
      }

        const updateData = {
            first_name,
            last_name,
            age,
            email,
            documents: []
        };

        const user = await this.usersService.getUserBy({_id:userId});

        if (user.documents && Array.isArray(user.documents)) {
            user.documents.forEach(doc => {
                if (!documentsToDelete || !documentsToDelete.includes(doc.name)) {
                    updateData.documents.push(doc);
                }
            });
        }

        if (files && files.length > 0) {
            files.forEach(file => {
                const fileNameWithoutExt = path.parse(file.originalname).name.toLowerCase();
                const uploadIndex = file.path.indexOf('uploads')+8;
                const relativePath = file.path.slice(uploadIndex);
                updateData.documents.push({
                    name: fileNameWithoutExt,
                    reference: `/${relativePath}` 
                });
            });
        }

        const updatedUser = await this.usersService.updateUser(userId, updateData, {
            new: true,
        });

        if (!updatedUser) {
        return res.status(404).json({ message: "Usuario no encontrado" });
        
        }
        res.status(200).json({ message: "Datos actualizados con éxito", updatedUser });

        
    } catch (error) {
        console.error('Error updating user profile:', error);
      res.status(500).json({ message: "Error al actualizar los datos", error });
     
    }
};

  deleteUserById = async (req,res)=>{
    try {
      // uid = req.query
      const { uid } = req.params;

      if (!uid) {
        throw new Error ('No se ingresó un uid');
      }
      const user = await this.usersService.getUserBy({_id:uid})
      if (!user){
        throw new Error('No se encontró el usuario')
      }

      const twoDaysAgo = new Date();
      twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);
      
      if (user.last_connection < twoDaysAgo) {
          
      }
      
      const thirtyMinutesAgo = new Date();
      thirtyMinutesAgo.setMinutes(thirtyMinutesAgo.getMinutes() - 30);
      
      if (user.last_connection < thirtyMinutesAgo) {
        try {
            const response = await this.usersService.deleteById(uid);
            // console.log(response);
            res.send({ status: "success", message: "Usuario eliminado correctamente" });
        } catch (error) {
            console.error('Error al eliminar el usuario:', error);
            res.status(500).send({ status: "error", message: "No se pudo eliminar el usuario" });
        }
    } else {
      const now = new Date();
          const timeDifferenceMs = now - user.last_connection; 
          const minutesSinceLastConnection = Math.floor(timeDifferenceMs / (1000 * 60)); 
      
          console.log(`No se puede eliminar el usuario, La última conexión fue hace ${minutesSinceLastConnection} minuto(s)`);

        res.status(400).send({ status: "fail", message: `Usuario activo hace ${minutesSinceLastConnection} minuto(s)` });
    }

    } catch (error) {
      console.error("Error eliminando el usuario:", error);
      res.status(500).json({ error: "Error eliminando el usuario" });
    }
  }


  
}

module.exports = { UsersController };
