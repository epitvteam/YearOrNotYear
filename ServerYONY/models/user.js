const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    email: String,
    password: String,
    firstName: String,
    lastName: String,
    year: String,
    modulesAdd: Array,
    modulesHave: Array
});

const User = mongoose.model('User', UserSchema);

module.exports = User;