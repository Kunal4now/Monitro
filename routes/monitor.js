const express = require('express')
const router = express.Router()
const axios = require('axios')
const mailWrapper = require('../services/email')

const website = process.env.SITE

router.get('/monitor', async (req, res) => {
    axios.interceptors.request.use((config) => {
        config.metadata = {startTime: new Date()}
        return config
    }, (err) => {
        return Promise.reject(err)
    })
    axios.interceptors.response.use((response) => {
        response.config.metadata.endTime = new Date()
        response.duration = response.config.metadata.endTime - response.config.metadata.startTime
        return response
    }, (err) => {
        return Promise.reject(err)
    })  

    let result = {}
    axios.get(website).then((response) => {
        result = {
            time: new Date(),
            sucess: true,
            responseDuration: response.duration
        }
        return res.status(200).json(result)
    }).catch((error) => {
        result = {
            time: new Date(),
            error: error,
            sucess: false
        }
        mailWrapper.data.text = `Please check your website ${website} has gone down`
        // mailWrapper.mg.messages().send(data, function (error, body) {
            //     console.log(body);
        // });
        return res.status(404).json(result)
        })
    })

module.exports = router