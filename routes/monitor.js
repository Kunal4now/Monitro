const express = require('express')
const router = express.Router()
const axios = require('axios')
const mailWrapper = require('../services/email')
const User = require('../models/User')
const fetchuser = require('../middleware/fetchUser')

const website = process.env.SITE

router.get('/monitor', fetchuser, async (req, res) => {
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

    const sites = await User.findOne({_id: req.user.id}).select('websites')
    let site = sites.websites.map((doc) => {return doc.url})

    monitor = async (website) => {
        try {
            const response = await axios.get(website).then((response) => {
                return response
            })
            return obj = {
                url: website,
                time: new Date(),
                sucess: true,
                responseDuration: response.duration
            }
        } catch(error) {
            return obj = {
                url: website,
                time: new Date(),
                sucess: false
            }
        }
    }

    let promises = []
    for (let i = 0; i < site.length; i++) {
        promises.push(monitor(site[i]))
    }

    const result = await Promise.all(promises)

    result.forEach((element) => {
        if (!element.sucess) {
            // User.find
        }
    })

        //     mailWrapper.data.text = `Please check your website ${website} has gone down`
    //     // mailWrapper.mg.messages().send(data, function (error, body) {
    //         //     console.log(body);
    //     // });
    
    res.status(200).json(result)
})

module.exports = router