const express = require('express');
const router = express.Router();
const User = require('../models/User')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const fetchuser = require('../middleware/fetchUser')

const {body, validationResult} = require('express-validator')

const JWT_SECRET = process.env.JWT_SECRET;

router.post('/createuser', [
    body('name', 'Enter a valid name').isLength({min: 3}),
    body('email', 'Enter a valid email').isEmail(),
    body('password', 'Password must be atleast 5 characters').isLength({min: 5}),
], async (req, res) => {
    const errors = validationResult(req.body);
    if (!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array()});
    }
    try {
        let user = await User.findOne({email: req.body.email});
        if (user) {
            return res.status(400).json({error: "Sorry a user with this email is already registered"})
        }
        const salt = await bcrypt.genSalt(10);
        const secPass = await bcrypt.hash(req.body.password, salt);
        user = await User.create({
            name: req.body.name,
            email: req.body.email,
            password: secPass
        });
        const data = {
            user: {
                id: user.id
            }
        }
        const authToken = jwt.sign(data, JWT_SECRET);
        res.json({authToken})
    } catch(error) {
        console.log(error)
        res.status(500).json(error)
    }
})

router.post('/login', [
    body('email', 'Enter a valid email').isEmail(),
    body('password', 'Password cannot be blank').exists(),
], async (req, res) => {
    const errors = validationResult(req.body);
    if (!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array()});
    }
    const {email, password} = req.body;
    try {
        let user = await User.findOne({email});
        if (!user) {
            return res.status(400).json({error: "Sorry a user with this email does not exist"})
        }
        const passwordCompare = await bcrypt.compare(password, user.password)
        if (!passwordCompare) {
            return res.status(400).json({error: "Please try to login with correct credentials"})
        }
        const data = {
            user: {
                id: user.id
            }
        }
        const authToken = jwt.sign(data, JWT_SECRET);
        res.json({authToken: authToken, success: true})
    } catch(error) {
        console.log(error.message)
        res.status(500).send("Internal Server Error")
    }
})

router.get('/getuser',fetchuser, async (req, res) => {
    try {
        console.log(req.user)
        userId = req.user.id;
        const user = await User.findById(userId).select('-password');
        res.send(user);
    } catch(error) {
        console.log(error.message)
        res.status(500).send("Internal Server Error")
    }
})

module.exports = router