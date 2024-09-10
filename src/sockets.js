const { chatModel } = require("./dao/mongo/models/chat.model.js");
const { logger } = require("./config/logger.config.js");

module.exports = (io) => {
  io.on("connection", async (socket) => {
    logger.info(`${socket.handshake.auth.username} se ha conectado`);

    socket.on("disconnect", () => {
      logger.info(`${socket.handshake.auth.username} se ha desconectado`);
    });

    socket.on("client_message", async (msg) => {
      let result;
      const username = socket.handshake.auth.username ?? "anonymous";
      const newMessage = {
        username: username,
        message: msg,
        dateTime: new Date(),
      };
      try {
        result = await chatModel.create(newMessage);
      } catch (e) {
        console.error(e);
        return;
      }

      io.emit("server_message", {
        ...newMessage,
        lastRow: result._id.toString(),
      });
    });
    // console.log("socket recovered", socket.recovered);
    if (!socket.recovered) {
      try {
        const messages = await chatModel.find({});

        messages.forEach((message) => {
          socket.emit("server_message", {
            username: message.username,
            message: message.message,
            dateTime: message.dateTime,
            lastRow: message._id.toString(),
          });
        });

        // Marcar el socket como recuperado
        socket.recovered = true;
      } catch (e) {
        console.error(e);
      }
    }
  });
};
