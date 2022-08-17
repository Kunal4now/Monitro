const express = require('express');
const router = express.Router();
const fetchuser = require('../middleware/fetchUser')
const authController = require('../controllers/auth-controller')

const {body} = require('express-validator')

const validations = [
    body('email', 'Enter a valid email').isEmail(),
    body('password', 'Password must be atleast 5 characters').isLength({min: 5})
]

router.post('/createuser', [
    body('name', 'Enter a valid name').isLength({min: 3}),
    validations
], authController.create)

router.post('/login', validations, authController.login)

router.get('/getuser',fetchuser, authController.fetchUser)

module.exports = router