const axios = require('axios')
const mailWrapper = require('../services/email')
const Website = require('../models/Website')

let sendMail = (website, reciever) => {
    const data = {
		from: process.env.MAILGUN_SENDER,
		to: reciever,
		subject: 'Your Website Just went down',
		text: `Please check your website ${website} has gone down`
	};
    mailWrapper(reciever).messages().send(data, function (error, body) {
        if (error) {
            res.status(500).json(error)
        }
    });
}

exports.monitor = async (req, res) => {
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

    const sites = await Website.find()
    let site = sites.map((doc) => {return doc.url})

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

    result.forEach(async (element) => {
        if (!element.sucess) {
            const url = element.url
            delete element.url
            await Website.findOneAndUpdate({url: url}, {
                $push: {stats: element}
            })
            sendMail(element.url, req.user.email)
        }
    })      

    res.status(200).json(result)
}