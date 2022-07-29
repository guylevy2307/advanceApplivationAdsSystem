const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let userSchema = new Schema(
    {
        email: {
            type: String,
        },
        password: {
            type: String,
        },
        isAdmin: {
            type: Boolean,
        },
        screens: {
            type: String,
        },
        ip: {
            type: List,
        },
        gps: {
            type: String,
        },
        createdDate: {
            type: Date,
        },
        updateDate: {
            type: Date,
        },
    },
    {
        collection: "user",
    }
);

module.exports = mongoose.model("User", userSchema);
