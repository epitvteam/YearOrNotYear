const mongoose = require('mongoose');

const ModuleSchema = new mongoose.Schema({
    nameModule: String,
    cred: String
});

const Module = mongoose.model('Module', ModuleSchema);

module.exports = Module;