class UserRepository {
  constructor(UserDao) {
    this.userDao = UserDao;
  }
  getUsers = async ({ limit = 10, numPage = 1 }) =>{
    return await this.userDao.getUsers({ limit, numPage });
  }

  getUserBy = async (filter) =>{
    return await this.userDao.getUserBy(filter);
  }

  createUser = async (user) =>{
    return await this.userDao.create(user);
  }

  deleteById = async (uid) =>{
    return await this.userDao.deleteById(uid)
  }

  updateUser = async (uid, userToUpdate) =>{
    return await this.userDao.updateUser(uid, userToUpdate);
  }

}

module.exports = UserRepository;

