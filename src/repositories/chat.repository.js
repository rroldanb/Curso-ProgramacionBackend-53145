class ChatRepository {
    constructor(ChatDao) {
      this.chatDao = ChatDao;
    }

    getChats = async () =>{
      return await this.chatDao.find();
    }
    postMessage = async (newMessage)=>{
      return await this.chatDao.create(newMessage)
    }
    
  }
  
  module.exports = ChatRepository;
  