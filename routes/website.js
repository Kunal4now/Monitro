const express = require('express')
const router = express.Router()
const fetchuser = require('../middleware/fetchUser')
const User = require('../models/User')

router.post('/add/:id', fetchuser, async (req, res) => {
    console.log(req.body.url)
    const url = req.body.url
    User.findByIdAndUpdate(req.params.id, {
        $push: {
            websites: {url: url}
        }
    }).then((doc) => res.status(200).json(doc)).catch((err) => {
        res.status(500).json(err)
    })
})

router.get('/show/:id', fetchuser, async (req, res) => {
    User.find({_id: req.user.id}).select('websites').then((doc) => {
        return res.status(200).json(doc)
    }).catch((err) => {
        res.status(500).json(err)
    })
})

module.exports = router