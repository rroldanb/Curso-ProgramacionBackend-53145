const { Schema, model } = require("mongoose");

const chatCollection = 'messages';

const chatSchema = new Schema({
    username: {
        type:String,
        required:true
    },
    message: String,
    dateTime: { type: Date, default: Date.now }
});

exports.chatModel =  model(chatCollection, chatSchema)


