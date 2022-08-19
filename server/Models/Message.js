const mongoose = require('mongoose')

const Schema = mongoose.Schema
const message = new Schema({
    conversationId:{
        type:String,
        required: true
    },
    sender:{
        type:String,
        required: true
    },
    text: {
        type:String,
        required: true
    }
}, {timestamps: true})

const Message = mongoose.model('Message', message)
module.exports = Message