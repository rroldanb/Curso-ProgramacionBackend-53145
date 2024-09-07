class ChatRepository {
    constructor(ChatDao) {
      this.chatDao = ChatDao;
    }

    getChats = async () =>{
      return await this.chatDao.getChats();
    }
    postMessage = async (newMessage)=>{
      return await this.chatDao.postMessage(newMessage)
    }
    
  }
  
  module.exports = ChatRepository;
  