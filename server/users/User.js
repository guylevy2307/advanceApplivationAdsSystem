const mongoose = require('mongoose')
const Schema = mongoose.Schema
const user = new Schema({
    firstName: {type: String, require: true},
    lastName: {type: String, require: true},
    email: {type: String, require: true},
    password: {type: String, require: true},
    friends: {type: [{type: String}], default: []},
    creationDate: {type: String, default: Date.now().toString()},
    isAdmin: {type: Boolean, default: false},
    address: {type: String, default: 'Not provided'},
    profilePicture: {type: String, default: ''},
    allPostIDs: {type: [{type: String}], default: []},
    isDeleted: {type: Boolean, default: false}
})

const User = mongoose.model('User', user)
module.exports = User