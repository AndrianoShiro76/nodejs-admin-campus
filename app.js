// <<<===== CONNECT EXPRESS =====>>>
const express = require('express');
// <<<===== CONNECT EXPRESS LAYOUTS =====>>>
const expressLayouts = require('express-ejs-layouts');
// <<<===== CONNECT MULTER =====>>>
const multer = require('multer');

// <<<===== CONNECT FLASH MESSAGE =====>>>
const session = require('express-session');
const cookieParser = require('cookie-parser');
const flash = require('express-flash');


// <<<===== CONNECT REQUIRE VALIDATION =====>>>
const { body, validationResult, check } = require('express-validator');

// <<<===== CONNECT METHOD OVER RIDE =====>>>
const methodOverride = require('method-override');

// <<<===== CONNECT UTILS DATABASE =====>>>
require('./utils/db')

// <<<===== CONNECT MODEL =====>>>
const Student = require('./model/student');
const { ensureIndexes } = require('./model/student');
const Staff = require('./model/staff');


// <<<===== SET UP MULTER =====>>>
const fileStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/img');
    },
    filename: (req, file, cb) => {
        cb(null, new Date().getTime() + '-' + file.originalname)
    }
})



const app = express();
const port = 3000;

// <<<===== SET UP METHOD OVER RIDE =====>>>
app.use(methodOverride('_method'));


// <<<===== SET UP EJS =====>>>
app.set('view engine', 'ejs');
app.use(expressLayouts);
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

// <<<===== CONFIGURATION FLASH =====>>>
app.use(cookieParser('secret'));
app.use(session ({
    cookie: { maxAge: 6000 },
    secret: 'secret',
    resave: true,
    saveUninitialized: true,
}));  
app.use(flash());

const fileFilter = (req, file, cb) => {
    if( file.mimetype === 'image/png' || 
        file.mimetype === 'image/jpg' || 
        file.mimetype === 'image/jpeg'
        ) {
        cb(null, true)
    } else {
        cb(null, false);
    }
}
app.use(multer({storage: fileStorage, fileFilter: fileFilter}).single('image'));



// <<<===== DASBOARD PAGE =====>>>
app.get('/', async (req, res) => {
    const staffs = await Staff.find();
    const students = await Student.find();
    const statusReguler = { status: "Reguler Employee"}
    const statusTemporary = { status: "Temporary Worker"}
    const statusParttime = { status: "Parttime Worker"}
    const staffTotal = await Staff.countDocuments();
    const staffReguler = await Staff.countDocuments(statusReguler);
    const staffTemporary = await Staff.countDocuments(statusTemporary);
    const staffParttime = await Staff.countDocuments(statusParttime);
    const statusActive = { status: "Active"}
    const statusInactive = { status: "Inactive"}
    const statusGraduate = { status: "Graduate"}
    const studentTotal = await Student.countDocuments();
    const studentActive = await Student.countDocuments(statusActive);
    const studentInactive = await Student.countDocuments(statusInactive);
    const studentGraduate = await Student.countDocuments(statusGraduate);
    res.render('index', { 
        title : 'Home',
        layout : 'layouts/main-layout',
        name : 'Andriano', 
        staffs,
        students,
        staffTotal,
        staffReguler,
        staffTemporary,
        staffParttime,
        studentActive,
        studentInactive,
        studentGraduate,
        studentTotal,
    });
});

// <<<===== DEPARTMENT PAGE =====>>>
app.get('/department', async (req, res) => {
    const staffs = await Staff.find();
    const students = await Student.find();
    const statusReguler = { status: "Reguler Employee"}
    const statusTemporary = { status: "Temporary Worker"}
    const statusParttime = { status: "Parttime Worker"}
    const staffTotal = await Staff.countDocuments();
    const staffReguler = await Staff.countDocuments(statusReguler);
    const staffTemporary = await Staff.countDocuments(statusTemporary);
    const staffParttime = await Staff.countDocuments(statusParttime);
    const statusActive = { status: "Active"}
    const statusInactive = { status: "Inactive"}
    const statusGraduate = { status: "Graduate"}
    const studentTotal = await Student.countDocuments();
    const studentActive = await Student.countDocuments(statusActive);
    const studentInactive = await Student.countDocuments(statusInactive);
    const studentGraduate = await Student.countDocuments(statusGraduate);
    res.render('department', {
        title : 'Department',
        layout : 'layouts/main-layout',
        staffs,
        students,
        staffTotal,
        staffReguler,
        staffTemporary,
        staffParttime,
        studentActive,
        studentInactive,
        studentGraduate,
        studentTotal,
    })
})


// <<<===== STAFF PAGE =====>>>
app.get('/staff', async (req, res) => {
    const staffs = await Staff.find();
    const statusReguler = { status: "Reguler Employee"}
    const statusTemporary = { status: "Temporary Worker"}
    const statusParttime = { status: "Parttime Worker"}
    const staffTotal = await Staff.countDocuments();
    const staffReguler = await Staff.countDocuments(statusReguler);
    const staffTemporary = await Staff.countDocuments(statusTemporary);
    const staffParttime = await Staff.countDocuments(statusParttime);
    res.render('staff', { 
        title : 'Staff', 
        layout : 'layouts/main-layout',
        staffs,
        staffTotal,
        staffReguler,
        staffTemporary,
        staffParttime,
        msg: req.flash('msg'),
    });
});


// <<<===== STUDENT PAGE =====>>>
app.get('/student', async (req, res) => {
    // const counts = await Student.aggregate([]).itcount(); 
    const students = await Student.find();
    const statusActive = { status: "Active"}
    const statusInactive = { status: "Inactive"}
    const statusGraduate = { status: "Graduate"}
    const studentTotal = await Student.countDocuments();
    const studentActive = await Student.countDocuments(statusActive);
    const studentInactive = await Student.countDocuments(statusInactive);
    const studentGraduate = await Student.countDocuments(statusGraduate);
    res.render('student', { 
        title : 'Student',
        layout : 'layouts/main-layout',
        students,
        studentTotal,
        studentActive,
        studentInactive,
        studentGraduate,
        msg: req.flash('msg'),
    });
    
});

// <<<----- ADD NEW STAFF ----->>>
app.get('/staff/add', (req, res) => {
    res.render('add-staff', {
        title: 'Add New Staff',
        layout: 'layouts/main-layout',
    });
});

// <<<----- ADD NEW STUDENT ----->>>
app.get('/student/add', (req, res) => {
    res.render('add-student', {
        title: 'Add New Student',
        layout : 'layouts/main-layout',
    });
});

// <<<----- VALIDATION ADD NEW STAFF ----->>>
app.post('/staff', 
[
    body('name').custom( async (value) => {
        const duplicate = await Staff.findOne({ name: value });
        if (duplicate) {
            throw new Error('Name staff has been registered!, use other name please...');
        }
        return true;
    }),
    check('email', 'Email not valid').isEmail(),
    check('noID', 'Number ID not valid').isNumeric(),
    check('noPhone', 'Number phone not valid').isMobilePhone('id-ID'),
], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.render('add-staff', {
            title: 'Add New Staff',
            layout: 'layouts/main-layout',
            errors: errors.array(),
        });
    } else {
        Staff.insertMany( req.body, ((error, result) => {
            // send flash 
            req.flash('msg', 'Data has been added!!')
            res.redirect('/staff');
        }))
    }
});

// <<<----- VALIDATION ADD NEW STUDENT ----->>>
app.post('/student', 
[
    body('name').custom( async (value) => {
        const duplicate = await Student.findOne({ name: value });
        if (duplicate) {
            throw new Error('Name student has been registered!, use other name please...');
        }
        return true;
    }),
    check('email', 'Email not valid').isEmail(),
    check('noID', 'Number ID not valid').isNumeric(),
    check('noPhone', 'Number phone not valid').isMobilePhone('id-ID'),
], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.render('add-student', {
            title: 'Add New Student',
            layout: 'layouts/main-layout',
            errors: errors.array(),
        });
    } else {
        Student.insertMany( req.body, ((error, result) => {
            // send flash 
            req.flash('msg', 'Data has been added!!')
            res.redirect('/student');
        }))
    }
});

// <<<----- DELETE STAFF ----->>>
app.delete('/staff', (req, res) => {
    Staff.deleteOne({ _id: req.body._id }).then((result) => {
        // send flash 
        req.flash('msg', 'Staff has been deleted successfuly')
        res.redirect('/staff');
    });
});

// <<<----- DELETE STUDENT ----->>>
app.delete('/student', (req, res) => {
    Student.deleteOne({ _id: req.body._id }).then((result) => {
        // send flash 
        req.flash('msg', 'Student has been deleted successfuly')
        res.redirect('/student');
    });
});

// <<<----- EDIT STAFF ----->>>
app.get('/staff/edit/:name', async (req, res) => {
    const staff = await Staff.findOne({ name: req.params.name });
    res.render('edit-staff', {
        title: 'Edit Staff',
        layout : 'layouts/main-layout',
        staff,
    });
});

// <<<----- EDIT STUDENT ----->>>
app.get('/student/edit/:name', async (req, res) => {
    const student = await Student.findOne({ name: req.params.name });
    res.render('edit-student', {
        title: 'Edit Student',
        layout : 'layouts/main-layout',
        student,
    });
});

// <<<----- PUT EDIT STAFF TO DATABASE ----->>>
app.put('/staff', 
[
    body('name').custom( async (value, {req}) => {
        const duplicate = await Staff.findOne({ name: value });
        if (value !== req.body.oldName && duplicate) {
            throw new Error('Name staff has been registered!, use other name please...');
        }
        return true;
    }),
    check('email', 'Email not valid').isEmail(),
    check('noID', 'Number ID not valid').isNumeric(),
    check('noPhone', 'Number phone not valid').isMobilePhone('id-ID'),
    // check('image', 'File not valid').isMimeType('image/jpeg')
], (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        if (value !== image) {
        }
        res.render('edit-staff', {
            title: 'Edit Data Staff',
            layout: 'layouts/main-layout',
            errors: errors.array(),
            staff: {
                body: req.body,
                image: req.file.path,
            }
        });
    } else {
        Staff.updateOne(
            { _id: req.body._id },
            {
                $set: {
                    name: req.body.name,
                    email: req.body.email,
                    status: req.body.status,
                    noID: req.body.noID,
                    department: req.body.department,
                    birth: req.body.birth,
                    genre: req.body.genre,
                    noPhone: req.body.noPhone,
                    address: req.body.address,
                    start: req.body.start,
                    image: req.file.filename,
                }
            }
        ).then((result) => {
            // send flash 
            req.flash('msg', 'Data has been updated!!')
            res.redirect('/staff');
        });
    }
});


// <<<----- PUT EDIT STUDENT TO DATABASE ----->>>
app.put('/student', 
[
    body('name').custom( async (value, {req}) => {
        const duplicate = await Student.findOne({ name: value });
        if (value !== req.body.oldName && duplicate) {
            throw new Error('Name student has been registered!, use other name please...');
        }
        return true;
    }),
    check('email', 'Email not valid').isEmail(),
    check('noID', 'Number ID not valid').isNumeric(),
    check('noPhone', 'Number phone not valid').isMobilePhone('id-ID'),
    // check('image', 'File not valid').isMimeType('image/jpeg')
], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.render('edit-student', {
            title: 'Edit Data Student',
            layout: 'layouts/main-layout',
            errors: errors.array(),
            student: {
                body: req.body,
                image: req.file.filename,
            }
        });
    } else {
        Student.updateOne(
            { _id: req.body._id },
            {
                $set: {
                    name: req.body.name,
                    status: req.body.status,
                    noID: req.body.noID,
                    department: req.body.department,
                    semester: req.body.semester,
                    birth: req.body.birth,
                    genre: req.body.genre,
                    email: req.body.email,
                    noPhone: req.body.noPhone,
                    address: req.body.address,
                    image: req.file.filename,
                    facebook: req.body.facebook,
                    instagram: req.body.instagram,
                    twitter: req.body.twitter,
                    github: req.body.github,
                }
            }
        ).then((result) => {
            // send flash 
            req.flash('msg', 'Data has been updated!!')
            res.redirect('/student');
        });
    }
});


// <<<----- DETAIL STUDENT PAGE ----->>>
app.get('/student/:name', async (req, res) => {
    const student = await Student.findOne({ name: req.params.name });
    res.render('detail-student', { 
        title : 'Detail Student',
        layout : 'layouts/main-layout',
        student,
    });
});

// <<<===== URL PORT =====>>>
app.listen(port, () => {
    console.log(`Admin Campus | listening at http://localhost:${port}`);
});
