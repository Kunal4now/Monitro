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
            type: mongoose.Types.ObjectId,
            ref: 'Website'
        }
    ]
})

const User = mongoose.model('User', userSchema);
module.exports = User;