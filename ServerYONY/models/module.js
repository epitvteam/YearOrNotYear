const mongoose = require('mongoose');

const ModuleSchema = new mongoose.Schema({
    Module: Array,
});

const Module = mongoose.model('Module', ModuleSchema);

module.exports = Module;