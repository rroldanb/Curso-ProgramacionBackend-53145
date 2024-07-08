class SessionRepository {
  constructor(SessionDao) {
    this.sessionDao =  SessionDao;
  }

  async register(req) {
    return await this.sessionDao.register(req);
  }

  async failRegister() {
    return await this.sessionDao.failRegister();
  }

  async login(req) {
    return await this.sessionDao.login(req);
  }

  async failLogin() {
    return await this.sessionDao.failLogin();
  }

  async currentUser(req) {
    return await this.sessionDao.currentUser(req);
  }

  async logout(req) {
    return await this.sessionDao.logout(req);
  }

  async status(req) {
    return await this.sessionDao.status(req);
  }
}

module.exports = SessionRepository;
