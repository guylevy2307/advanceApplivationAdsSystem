const mongoose = require('mongoose')

const Schema = mongoose.Schema
const conversation = new Schema({
    members: {
        type: Array
    }
}, {timestamps: true})

const Conversation = mongoose.model('Conversation', conversation)
module.exports = Conversation