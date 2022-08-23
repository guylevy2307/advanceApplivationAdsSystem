const express = require('express');
const {sendMessage, getMessages} = require("../Controllers/messageController");
const messageRouter = express.Router();

messageRouter.post("/",sendMessage)
messageRouter.get("/:conversationId", getMessages)

module.exports = {messageRouter}