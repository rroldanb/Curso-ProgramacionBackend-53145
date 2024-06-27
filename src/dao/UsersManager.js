const { userModel } = require ("./models/users.model.js")

 class UsersManagerMongo {
    constructor() {
      this.userModel = userModel;
    }

    async getUsers({limit = 10, numPage=1}) {
        // const users =  await this.userModel.find().lean()
        const users =  await this.userModel.paginate({}, {limit, page: numPage, 
             lean: true })
        return users
    }
  
    async createUser(user) {
        return await this.userModel.create(user)
    }
  
    async getUserBy(filter) {
      return this.userModel.findOne(filter);
    }
  
    async getUserByEmail(email) {
      return this.users.find((user) => user.email === email);
    }  
  
  }

  module.exports = {UsersManagerMongo};



