const express = require('express');
const bodyPaser = require('body-parser');
const session = require('express-session');
const app = express();
const mongoose = require('mongoose');
const User = require('./models/user');

app.use(session({
    secret: 'ksjkjdskdsjk649403jg34ie99ghhdsoisoq56880290',
    saveUninitialized: false,
    resave: false
}));

mongoose.Promise = Promise;
mongoose.connect('mongodb://localhost:27017/angulardb')
    .then(() => console.log('Mongoose up'));

app.use(bodyPaser.json());

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
    const {email, password} = req.body;

    const existingUser = await User.findOne({email});
    if (existingUser) {
        res.json({
            success: false,
            message: "Email already in use"
        });
        return
    }
    const user = new User({
        email,
        password
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
    res.json({
        status: true,
        email: req.session.user,
        quote: user.quote
    })
});

app.listen(1234, () => console.log('Server listening at 1234'));