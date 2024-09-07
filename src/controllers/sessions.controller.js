const { SessionsService } = require("../services/index");
const UserDTO = require("../dtos/users.dto");


class SessionsController {
  constructor() {
    this.sessionsService =  SessionsService;
  }

  githubAuth = (req, res) => {
  };

//   githubCallback = (req, res) => {
    
//     try {
//       const user = req.user;
//       const admin = req.user.role === "admin";

//     req.session.user = { user };
//     req.session.user.admin = { admin };

//     res.redirect("/");
//   } catch (error) {
//     res.status(500).send({ error: 'Error interno del Servidor registrando el usuario con GitHub' });
//   }
// };

githubCallback = (req, res) => {
  try {
    const user = req.user;
    
    if (!user) {
      console.log('No se pudo autenticar al usuario.' )
      return res.status(401).send({ error: 'No se pudo autenticar al usuario.' });
    }
    const isAdmin = user.role === "admin";  

    req.session.user = {
      uid: user._id,
      email: user.email,
      first_name: user.first_name,
      last_name: user.first_name,
      role: user.role,
      admin: isAdmin,
      cart_id: user.cart_id,




    };

    res.redirect("/"); 
  } catch (error) {
    console.error('Error en el callback de GitHub:', error);
    res.status(500).send({ error: 'Error interno del servidor al registrar al usuario con GitHub' });
  }
};



  register = async (req, res) => {
  try {
    const result = await this.sessionsService.register(req);
    res.send(result);
  } catch (error) {
    res.status(500).send({ error: 'Error interno del Servidor registrando el usuario' });
  }
};

  failRegister = async (req, res) => {
  try {
    const result = await this.sessionsService.failRegister();
    res.send(result);
  } catch (error) {
    
    res.status(500).send({ error: 'FailRegister: Error interno del Servidor registrando el usuario' });
  }
};

  login = async (req, res) => {
  try {
    const result = await this.sessionsService.login(req);
    res.send(result);
  } catch (error) {
    res.status(500).send({ error: 'Error interno del Servidor al intentar loguear al usuario' });
  }
};

  failLogin = (req, res) => {
  try {
    const result = this.sessionsService.failLogin();
    res.send(result);
  } catch (error) {
    res.status(500).send({ error: 'FailLogin: Error interno del Servidor al intentar loguear al usuario' });
  }
};

  currentUser = async (req, res) => {
  try {
    const result = await this.sessionsService.currentUser(req);
    if (result.status === "success") {
      const newUser = new UserDTO (result.payload)
      res.status(200).json(newUser);
    } else {
      res.status(401).json(result);
    }
  } catch (error) {
    res.status(500).send({ error: `Error interno del Servidor inetntando obtener el CurrentUser` });
  }
};

  logout = async (req, res) => {
  try {
    const redirectUrl = await this.sessionsService.logout(req);
    res.redirect(redirectUrl);
  } catch (error) {
    res.status(500).send({ error: 'Error interno del Servidor al intentar cerrar la sesión' });
  }
};

  status = async (req, res) => {
  try {
    const result = await this.sessionsService.status(req);
    res.json(result);
  } catch (error) {
    res.status(500).send({ error: 'Error interno del Servidor al intentar obtener el UserStatus' });
  }
};

} 
module.exports =  SessionsController ;
