// const { chatModel } = require("../dao/mongo/models/chat.model");
const  {ChatService}  = require("../services/index");

class ChatController {
    constructor(){
        this.chatService =  ChatService
    }

    getChats = async (req, res) => {
        req.io.on("connection", async (socket) => {
          try {
            const messages = await this.chatService.find({});
            req.io.emit("server_message", { messages });
            res.render("chat", {
              title: "Chat mercadito || Gago",
              styles: "chat.css",
            });
          } catch (error) {
            console.error("Error al obtener los mensajes del chat:", error);
            res.status(500).send("Error interno del servidor");
          }
        });
      }

      postMessage =async (req, res) => {
        const { io } = req;
        const { msg } = req.body;
      
        let result;
        const username = req.socket.handshake.auth.username ?? "anonymous";
      
        const newMessage = {
          username: username,
          message: msg,
          dateTime: new Date(),
        };
      
        try {
          result = await this.chatService.create(newMessage);
        } catch (e) {
          console.error(e);
          return res.status(500).send("Error interno del servidor");
        }
      
        io.emit("server_message", {
          ...newMessage,
          lastRow: result._id.toString(),
        });
      
        res.status(200).send("Mensaje enviado exitosamente");
      }
}

module.exports = {ChatController}