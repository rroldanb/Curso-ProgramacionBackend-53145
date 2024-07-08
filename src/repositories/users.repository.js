const UserDTO = require("../dtos/users.dto")

class UserRepository {
    constructor(userDao){
        this.userDao = userDao
    }
    async getUsers({ limit = 10, numPage = 1 }) {
        return await this.userDao.getUsers({ limit, numPage });
      }

      async getUserBy(filter) {
        return await this.userDao.getUserBy(filter);
      }
      async getUserByEmail(email) {
        return await this.userDao.getUserByEmail(email);
      }
    async getUser  (filter) {return await this.userDao.getBy(filter)}
    async createUser   (user)  {
        const newUser = new UserDto(user)
        return await this.userDao.create(newUser)        
    }
    async updateUser   ( uid, userToUpdate ) {return await this.userDao.update(uid, userToUpdate)}
    async deleteUser   (uid) { return await this.userDao.delete(uid)}
}



module.exports = UserRepository;
