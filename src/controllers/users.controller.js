const 
    UsersService
   = require("../services/index");
  
  class UsersController {
    constructor() {
        this.usersService = new UsersService();
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
      const { email } = req.query;
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
}

module.exports = UsersController;
