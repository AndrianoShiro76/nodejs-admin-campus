// <<<===== CONNECT MONGOOSE =====>>>
const mongoose = require('mongoose');

// <<<===== CREATE SCHEMA STUDENTS =====>>>
const staff = mongoose.model('Staff', {
    name : {
        type: String,
        required: true,
    },
    email : {
        type: String,
        required: true,
    },
    status : {
        type: String,
    },
    noID : {
        type: String,
    },
    department : {
        type: String,
    },
    birth : {
        type: String,
    },
    genre : {
        type: String,
    },
    noPhone : {
        type : String,
    },
    address : {
        type: String,
    },
    start : {
        type: String,
    },
    image : {
        type: String,
    },
});

// <<<===== EXPORT MODULE =====>>>
module.exports = staff;