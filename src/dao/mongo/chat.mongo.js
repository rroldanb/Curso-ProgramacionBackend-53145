const { chatModel } = require("./models/chat.model.js");

class ChatDaoMongo {
  constructor() {
    this.chatModel = chatModel;
  }

    getChats = async () =>{
      return await this.chatModel.find();
    }
    postMessage = async (newMessage)=>{
      return await this.chatModel.create(newMessage)
    }
    
  }
  
  module.exports = ChatDaoMongo;