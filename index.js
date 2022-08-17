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

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`listening on port ${PORT}`)
})

connectToMongo()