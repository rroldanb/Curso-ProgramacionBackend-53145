// const express = require("express");

const { Router } = require("express");
const { authorization } = require("../middlewares/auth.middleware");
const { ChatController } = require("../controllers/chat.controller");
const chatRouter = Router();

const chatController = new ChatController()

chatRouter.get("/", authorization(['user', 'premium']),
chatController.getChats
);

chatRouter.post("/", authorization(['user', 'premium']), 
chatController.postMessage
);

module.exports =   chatRouter;

