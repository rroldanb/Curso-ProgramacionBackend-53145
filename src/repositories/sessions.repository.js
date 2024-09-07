class SessionRepository {
  constructor(SessionDao) {
    this.sessionDao =  SessionDao;
  }

  
  register = async (req) =>{
    return await this.sessionDao.register(req);
  }

  failRegister = async () =>{
    return await this.sessionDao.failRegister();
  }

  login = async (req) =>{
    return await this.sessionDao.login(req);
  }

  failLogin = async () =>{
    return await this.sessionDao.failLogin();
  }

  currentUser = async (req) =>{
    return await this.sessionDao.currentUser(req);
  }

  logout = async (req) =>{
    return await this.sessionDao.logout(req);
  }

  status = async (req) =>{
    return await this.sessionDao.status(req);
  }
}

module.exports = SessionRepository;
