const mongoose = require('mongoose')

const department = mongoose.model('Department', {
    name : {
        type: String,
    }
})