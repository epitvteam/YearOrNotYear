const express = require('express');
const bodyPaser = require('body-parser');
const session = require('express-session');
const app = express();
const mongoose = require('mongoose');
const User = require('./models/user');
const Module = require('./models/module');
const ObjectId = require('mongodb').ObjectID;

app.use(session({
    secret: 'ksjkjdskdsjk649403jg34ie99ghhdsoisoq56880290',
    saveUninitialized: false,
    resave: false
}));

mongoose.Promise = Promise;
mongoose.connect('mongodb://localhost:27017/angulardb')
    .then(() => console.log('Mongoose up'));

app.use(bodyPaser.json());

app.post('/api/syncModule', async (req, res) => {
    const moduleSave = new Module({
        moduleSync: []
    });
    const resultModule = await moduleSave.save();
    console.log(resultModule);
    res.json({
        success: true,
        message: "Create"
    });
});

app.post('/api/login', async (req, res) => {
    const {email, password} = req.body;

    console.log(email, password);
    const resp = await User.findOne({email, password});
    if (!resp) {
        console.log('Incorrect détails');
        res.json({
            success: false,
            message: "Incorrect details"
        });
    } else {
        req.session.user = email;
        res.json({
            success: true
        });
        req.session.save();
        console.log('Log In correct');
    }
    //res.send('k');
});

app.get('/api/isloggedin', (req, res) => {
    res.json({
        status: !!req.session.user
    });
});

app.post('/api/register', async (req, res) => {
    const {email, password, firstName, lastName, year} = req.body;
    const existingUser = await User.findOne({email});
    console.log("TEST");
    const arrayMod = await Module.find({_id:ObjectId("5c98e27b2dfcea3b0555b7dd")});
    if (existingUser) {
        res.json({
            success: false,
            message: "Email already in use"
        });
        return
    }
    const user = new User({
        email,
        password,
        firstName,
        lastName,
        year,
        modulesAdd: arrayMod,
        modulesHave: []
    });
    const result = await user.save();
    console.log(result);
    res.json({
        success: true,
        message: "Welcome!"
    });
});

app.get('/api/data', async (req, res) => {

    const user = await User.findOne({email: req.session.user});

    if (!user) {
        res.json({
            status: false,
            message: 'User was deleted'
        });
        return
    }
    console.log(user.moduleAdd);
    res.json({
        status: true,
        email: req.session.user,
        firstName: user.firstName,
        lastName: user.lastName,
        year: user.year,
        modulesAdd: user.modulesAdd
    })
});

app.get('/api/logout', (req, res) => {
    req.session.destroy();
    console.log('Deco');

    res.json({
        success: true
    });
});

app.post('/api/moduleUpdate', async (req, res) => {
    const user = await User.findOne({email: req.session.user});
    if (!user) {
        res.json({
            success: false,
            message: 'invalid'
        });
        return
    }
    await User.updateOne(
        {
            email: req.session.user,
            "modulesAdd.name": req.body.nameModule,
        },
        {
            $set: {
                "modulesAdd.$": {
                    "name": req.body.nameModule,
                    "credits": req.body.cred
                }
            }
        });
    res.json({
        success: true,
        message: 'Updated'
    });
});

app.post('/api/moduleCreate', async (req, res) => {
    const user = await User.findOne({email: req.session.user});
    if (!user) {
        res.json({
            success: false,
            message: 'invalid'
        });
        return
    }
    var ap = {
        name: req.body.nameModule,
        credits: req.body.cred
    };

    await User.updateOne(
        {
            email: req.session.user
        },
        {
            $push: {
                'modulesAdd': ap
            }
        },
        {
            safe: true,
            upsert: true,
            new: true
        });

    res.json({
        success: true,
        message: 'Created'
    });
});

app.post('/api/moduleCreate', async (req, res) => {

    const user = await User.findOne({email: req.session.user});
    if (!user) {
        res.json({
            success: false,
            message: 'invalid'
        });
        return
    }
    await user.create(
        {
            email: req.session.user
        },
        {
            $set: {
                "modulesAdd.$": {
                    "name": req.body.nameModule,
                    "credits": req.body.cred
                }
            }
        });
    res.json({
        success: true,
        message: 'Create'
    });
});

app.listen(1234, () => console.log('Server listening at 1234'));