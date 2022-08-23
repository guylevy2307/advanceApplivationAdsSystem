const mongoose = require('mongoose')
const Schema = mongoose.Schema
const post = new Schema({
    userEmail: {type: String, require: true},
    content: {type: String, require: false},
    image: {type: String, require: false},
    creationDate: {type: String, require: true, default: Date.now().toString()},
    isDeleted: {type: Boolean, require: true, default: false},
    allCommentIDs: {type: [{type: String}], default: []}
})

const Post = mongoose.model('Post', post)
module.exports = Post