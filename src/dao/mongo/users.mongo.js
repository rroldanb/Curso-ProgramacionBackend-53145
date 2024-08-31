const { usersModel } = require("./models/users.model.js");

class UserDaoMongo {
  constructor() {
    this.userModel = usersModel;
  }

  getUsers = async ({ limit = 10, numPage = 1 }) =>{
    // return await this.userModel.find().lean() 
    return await this.userModel.paginate({},{ limit, page: numPage, lean: true });
  }

  createUser = async (user) =>{
    return await this.userModel.create(user);
  }

  getUserBy = async (filter) =>{
    return await this.userModel.findOne(filter);
  }

  deleteById = async (uid) =>{
    return await this.userModel.findByIdAndDelete(uid)
  }

  updateRole = async (id, newRole) =>{
    return await this.userModel.findByIdAndUpdate(id, { role: newRole }, { new: true });
  }

  getUserByEmail = async (email) =>{
    return await this.userModel.findOne(email);
  }

  updateUser = async (id, updateData) =>{
    return await this.userModel.findByIdAndUpdate(id, updateData, { new: true });
  }
  
  getUserByResetToken = async (token) =>{
      return await this.userModel.findOne({resetPasswordToken: token});
  }

}

module.exports = UserDaoMongo;
