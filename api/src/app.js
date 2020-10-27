const config = require('./utils/config')
const logger = require('./utils/logger')
const express = require('express')
const app = express()
const api = require('./controllers/api')
const cors = require('cors')
const mongoose = require('mongoose')

mongoose.connect(config.MONGODB_URI,
                 {
                   useNewUrlParser: true,
                   useUnifiedTopology: true,
                   useFindAndModify: false,
                   useCreateIndex: true
                 })
  .then(() => logger.info('connected to MongoDB'))
  .catch(err => logger.error('error connection to MongoDB:', err.message))

app.use(cors())
app.use(express.json())

app.use('/api', api)

module.exports = app
