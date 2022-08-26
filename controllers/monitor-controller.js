const axios = require('axios')
const mailWrapper = require('../services/email')
const Website = require('../models/Website')
const User = require('../models/User')

let sendMail = (website, reciever) => {
    const data = {
		from: process.env.MAILGUN_SENDER,
		to: reciever,
		subject: 'Your Website Just went down',
		text: `Please check your website ${website} has gone down`
	};
    mailWrapper.mg.messages().send(data, function (error, body) {
        if (error) {
            console.log(error)
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
    // const sites = await User.findOne({_id: req.user.id}).populate('websites').select('websites')
    let site = sites.map((doc) => {
        return {
            id: doc._id,
            url: doc.url
        }
    })

    monitor = async (website) => {
        try {
            const response = await axios.get(website.url).then((response) => {
                return response
            })
            return obj = {
                url: website.url,
                time: new Date(),
                sucess: true,
                responseDuration: response.duration
            }
        } catch(error) {
            return obj = {
                id: website.id,
                url: website.url,
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
            await Website.findOneAndUpdate({url: url}, {
                $push: {stats: element}
            })
            const registeredUsers = await User.find({website: element.id}).select('email')
            registeredUsers.forEach((user) => {
                sendMail(element.url, user.email)
            })
        }
    })      

    res.status(200).json(result)
}