var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");

var UserSchema = new mongoose.Schema({
    username: String,
    email: String,
    password: String,
    admin: { type: Boolean, default: false }
});

// Adds in methods to User
UserSchema.plugin(passportLocalMongoose, {usernameQueryFields: ['email']});

module.exports = mongoose.model("User", UserSchema);