const UserDTO = require("../dtos/users.dto");

class UserRepository {
  constructor(userDao) {
    this.userDao = userDao;
  }
  getUsers = async ({ limit = 10, numPage = 1 }) =>{
    return await this.userDao.getUsers({ limit, numPage });
  }
  getUserBy = async (filter) =>{
    return await this.userDao.getUserBy(filter);
  }
  getUserByEmail = async (email) =>{
    return await this.userDao.getUserByEmail(email);
  }
  deleteById = async (uid) =>{
    return await this.userDao.deleteById(uid)
  }
  getUser = async (filter) =>{
    return await this.userDao.getBy(filter);
  }
  createUser = async (user) =>{
    const newUser = new UserDto(user);
    return await this.userDao.create(newUser);
  }
  updateUserRole = async (id, newRole) =>{
    return await this.userDao.updateRole(id, newRole);
  }
  updateUser = async (uid, userToUpdate) =>{
    return await this.userDao.updateUser(uid, userToUpdate);
  }
  deleteUser = async (uid) =>{
    return await this.userDao.delete(uid);
  }
}

module.exports = UserRepository;

