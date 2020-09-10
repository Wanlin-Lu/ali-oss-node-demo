require('dotenv').config()

const express = require('express')
const bodyParser = require('body-parser')
const MongoClient = require('mongodb').MongoClient

const imageRouter = require('./routers/image-route')
const imagesDAO = require('./dao/imageDao')

const app = express()
app.use(bodyParser.json())

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE, OPTIONS')
  next()
})

app.use('/api/upload', imageRouter)
app.use((req, res, next) => {
  throw new Error('Could not find this route.')
})

MongoClient.connect(
  process.env.DB_URL,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    poolSize: 50
  }
).catch(err => {
  console.log(err.stack)
  process.exit(1)
}).then(async client => {
  await imagesDAO.injectDB(client)
  app.listen(5000, () => {
    console.log(`listening on port 5000`)
  })
})