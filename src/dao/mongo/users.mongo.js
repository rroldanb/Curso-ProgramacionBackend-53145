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
    return this.userModel.findOne(filter);
  }

  async getUserByEmail(email) {
    return this.users.find((user) => user.email === email);
  }
}

module.exports = UserDaoMongo;
