const { chatModel } = require("./models/chat.model.js");

class ChattDaoMongo {
  constructor() {
    this.chatModel = chatModel;
  }

    getChats = async () =>{
      return await this.chatDao.find();
    }
    postMessage = async (newMessage)=>{
      return await this.chatDao.create(newMessage)
    }
    
  }
  
  module.exports = ChattDaoMongo;