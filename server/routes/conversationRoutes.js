const express = require('express');
const conversationRouter = express.Router();

const ConversationController = require('../Controllers/conversationController')

conversationRouter.post("/",ConversationController.newConversation)
conversationRouter.get("/:userEmail",ConversationController.getAllConversation)
conversationRouter.get("/", ConversationController.getSpecificConversationBuUsers)

module.exports = {conversationRouter}