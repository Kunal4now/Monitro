const mongoose = require('mongoose')
const { Schema } = mongoose

const userSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    websites: [
        {
            url: {
                type: String,
                required: true
            },
            stats: {
                type: Object
            }
        }
    ]
})

const User = mongoose.model('User', userSchema);
module.exports = User;