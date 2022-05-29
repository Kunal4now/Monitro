const mongoose = require('mongoose')

const websiteSchema = new mongoose.Schema({
    url: {
        type: String,
        required: true
    },
    stats: [
        {
            type: Object
        }
    ]
})

const Website = mongoose.model('Website', websiteSchema)
module.exports = Website