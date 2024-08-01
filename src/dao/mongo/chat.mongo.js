const { chatModel } = require("./models/chat.model.js");

class ChattDaoMongo {
  constructor() {
    this.chatModel = chatModel;
  }


    async getChats() {
      return await this.chatDao.find();
    }
    async postMessage(newMessage){
      return await this.chatDao.create(newMessage)
    }
  
    
  }
  
  module.exports = ChattDaoMongo;