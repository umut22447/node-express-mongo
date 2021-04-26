const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { registerValidation, loginValidation } = require('../validation');

//REGISTER
router.post('/register', async (req, res) => {
    const { name, email, password } = req.body;

    //VALIDATE USER
    const { error } = registerValidation(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    //CHECK EMAIL EXISTS
    const emailExists = await User.findOne({ email });
    if (emailExists) return res.status(400).send('Email already exists.');

    //HASH THE PASSWORD
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    //CREATE NEW USER
    const user = new User({
        name,
        email,
        password: hashedPassword
    });
    try {
        const savedUser = await user.save();
        res.send({ user: user._id });
    }
    catch (err) {
        res.status(400).send(err);
    }
})

//LOGIN
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    //VALIDATE USER
    const { error } = loginValidation(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    //CHECK EMAIL EXISTS
    const user = await User.findOne({ email });
    if (!user) return res.status(400).send('Email or Password is wrong');

    //PASSWORD IS CORRECT
    const validPass = await bcrypt.compare(password, user.password);
    if (!validPass) return res.status(400).send('Email or Password is wrong');

    //CREATE AND ASSIGN TOKEN
    const token = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET);
    res.header('auth-token', token).send(token);

})

module.exports = router;