require('dotenv').config()
const express = require('express')
const app = express()
const morgan = require('morgan')

app.use(morgan('dev'))

app.use('/api', require('./routes/monitor'))

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`listening on port ${PORT}`)
})