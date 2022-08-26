require('dotenv').config()
const express = require('express')
const app = express()
const morgan = require('morgan')
const connectToMongo = require('./db')

app.use(morgan('dev'))
app.use(express.json())

app.use('/api/auth', require('./routes/auth'))
app.use('/api/monitor', require('./routes/monitor'))
app.use('/api/website', require('./routes/website'))

app.get('/api/health', (req, res) => {
    try {
        res.status(200).json({
            message: 'Active'
        })
    } catch(err) {
        res.status(500).json({
            message: err
        })
    }
})

app.get('*', (req, res) => {
    res.status(404).json({
        message: 'Page not found'
    })
})

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`listening on port ${PORT}`)
})

connectToMongo()