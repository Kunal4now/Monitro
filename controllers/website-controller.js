const Website = require('../models/Website')
const User = require('../models/User')

exports.create = async (req, res) => {
    const url = req.body.url
    website = await Website.create({
        url: url,
        stats: []
    })
    User.findByIdAndUpdate(req.params.id, {
        $push: {
            websites: website._id
        }
    }).then(() => res.status(200).json({sucess: true})).catch((err) => {
        res.status(500).json(err)
    })
}

exports.findAll = async (req, res) => {
    User.find({_id: req.user.id}).populate('websites').select('websites').then((doc) => {
        return res.status(200).json(doc)
    }).catch((err) => {
        res.status(500).json(err)
    })
}

exports.deleteOne = async (req, res) => {
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
}

exports.findAllRegistered = async (req, res) => {
    Website.find().then((websites) => {
        res.status(200).json(websites)
    }).catch((error) => {
        res.status(500).json(error)
    })
}

