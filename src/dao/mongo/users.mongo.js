const { usersModel } = require("./models/users.model.js");

class UserDaoMongo {
  constructor() {
    this.userModel = usersModel;
  }

  async getUsers({ limit = 10, numPage = 1 }) {
    // const users =  await this.userModel.find().lean()
    const users = await this.userModel.paginate(
      {},
      { limit, page: numPage, lean: true }
    );
    return users;
  }

  async createUser(user) {
    return await this.userModel.create(user);
  }

  async getUserBy(filter) {
    return await this.userModel.findOne(filter);
  }


  async updateRole(id, newRole) {
    return await this.userModel.findByIdAndUpdate(id, { role: newRole }, { new: true });
  }

  async getUserByEmail(email) {
    return await this.userModel.findOne(email);
  }


  async updateUser(id, updateData) {
    try {
      const updatedUser = await this.userModel.findByIdAndUpdate(id, updateData, { new: true });
      return updatedUser;
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  }
  
  async getUserByResetToken(token) {
    try {
      return await this.userModel.findOne({
        resetPasswordToken: token,
        resetPasswordExpires: { $gt: Date.now() }
      });
    } catch (error) {
      console.error('Error in getUserByResetToken:', error);
      throw error;
    }
  }
}

module.exports = UserDaoMongo;
