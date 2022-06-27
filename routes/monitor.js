const express = require('express')
const router = express.Router()
const fetchuser = require('../middleware/fetchUser')
const monitorController = require('../controllers/monitor-controller')

router.get('/', fetchuser, monitorController.monitor)

module.exports = router