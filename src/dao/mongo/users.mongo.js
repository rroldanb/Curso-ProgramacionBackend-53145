const { usersModel } = require("./models/users.model.js");

class UserDaoMongo {
  constructor() {
    this.userModel = usersModel;
  }

  getUsers = async ({ limit = 10, numPage = 1 }) =>{
    return await this.userModel.paginate({},{ limit, page: numPage, lean: true });
  }

  getUserBy = async (filter) =>{
    return await this.userModel.findOne(filter);
  }

  createUser = async (user) =>{
    return await this.userModel.create(user);
  }

  deleteById = async (uid) =>{
    return await this.userModel.findByIdAndDelete(uid)
  }
  
  updateUser = async (id, updateData) =>{
    return await this.userModel.findByIdAndUpdate(id, updateData, { new: true });
  }

}

module.exports = UserDaoMongo;
