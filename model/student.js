// <<<===== CONNECT MONGOOSE =====>>>
const mongoose = require('mongoose');

// <<<===== CREATE SCHEMA STUDENTS =====>>>
const student = mongoose.model('Student', {
    name: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        required: true,
    },
    noID: {
        type: String,
        required: true,
    },
    department: {
        type: String,
    },
    semester: {
        type: String,
    },
    birth: {
        type: String,
    },
    genre: {
        type: String,
    },
    email: {
        type: String,
    },
    noPhone: {
        type: String,
    },
    address: {
        type: String,
    },       
    image: {
        type: String,
    },
    facebook: {
        type: String,
    },
    instagram: {
        type: String,
    },
    twitter: {
        type: String,
    },
    github: {
        type: String,
    },
});



// <<<===== EXPORT MODULE =====>>>
module.exports = student;

