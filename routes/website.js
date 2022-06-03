const express = require('express')
const router = express.Router()
const fetchuser = require('../middleware/fetchUser')
const User = require('../models/User')
const Website = require('../models/Website')

router.post('/add/:id', fetchuser, async (req, res) => {
    console.log(req.body.url)
    const url = req.body.url
    website = await Website.create({
        url: url,
        stats: []
    })
    User.findByIdAndUpdate(req.params.id, {
        $push: {
            websites: website._id
        }
    }).then((doc) => res.status(200).json(doc)).catch((err) => {
        res.status(500).json(err)
    })
})

router.get('/show/:id', fetchuser, async (req, res) => {
    User.find({_id: req.user.id}).populate('websites').select('websites').then((doc) => {
        return res.status(200).json(doc)
    }).catch((err) => {
        res.status(500).json(err)
    })
})

router.post('/remove/:id', fetchuser, async (req, res) => {
    User.updateOne({_id: req.user.id}, {
        $pull: {websites: req.params.id}
    }).then(() => {
        Website.findByIdAndRemove({_id: req.params.id}).then(() => {
            return res.status(200).json({sucess: true})
        }).catch((err) => {
            res.status(500).json(err)
        })
    }).catch((error) => {
        res.status(500).json(error)
    })
})

module.exports = router