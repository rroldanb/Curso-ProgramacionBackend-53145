class ChatRepository {
    constructor(ChattDao) {
      this.chatDao = ChattDao;
    }

    async getChats() {
      return await this.chatDao.getChats();
    }
    async postMessage(newMessage){
      return await this.chatDao.postMessage(newMessage)
    }
  
    
  }
  
  module.exports = ChatRepository;
  