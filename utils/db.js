// <<<===== CONNECT MONGOOSE =====>>>
const mongoose = require('mongoose');

// <<<===== CONNECT DATBASE MONGODB =====>>>
mongoose.connect('mongodb://127.0.0.1:27017/admincampus', {
    useNewUrlParser: true, 
    useUnifiedTopology: true,
    useCreateIndex: true,
});


// const student1 = new student({
//     name: 'Andriano',
//     noID: '1220001',
//     email: 'andriano@gmail.com',
// });

// student1.save().then((student) => console.log(student));