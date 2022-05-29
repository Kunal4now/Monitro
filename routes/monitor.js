const express = require('express')
const router = express.Router()
const axios = require('axios')

const website = process.env.SITE

router.get('/monitor', async (req, res) => {
    axios.get(website).then((response) => {
        err = {
            time: new Date(),
            sucess: true
        }
        return res.status(200).json(err)
    }).catch((error) => {
        err = {
            time: new Date(),
            error: error,
            sucess: false
        }
        return res.status(404).json(err)
    })
})

module.exports = router