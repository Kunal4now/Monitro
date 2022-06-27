const User = require('../models/User')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const {validationResult} = require('express-validator')


const JWT_SECRET = process.env.JWT_SECRET;

exports.create = async (req, res) => {
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
}

exports.login = async (req, res) => {
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
}

exports.fetchUser = async (req, res) => {
    try {
        console.log(req.user)
        userId = req.user.id;
        const user = await User.findById(userId).select('-password');
        res.send(user);
    } catch(error) {
        console.log(error.message)
        res.status(500).send("Internal Server Error")
    }
}