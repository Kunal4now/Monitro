const express = require('express')
const router = express.Router()
const fetchuser = require('../middleware/fetchUser')
const websiteController = require('../controllers/website-controller')

router.post('/add/:id', fetchuser, websiteController.create)

router.get('/show/:id', fetchuser, websiteController.findAll)

router.post('/remove/:id', fetchuser, websiteController.deleteOne)

router.get('/allsites', fetchuser, websiteController.findAllRegistered)
 
module.exports = router