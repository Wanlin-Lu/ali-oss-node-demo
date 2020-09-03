const express = require('express')
const bodyParser = require('body-parser')

const app = express()

app.use(bodyParser.json())

app.use('/', (req, res, next) => {
  res.status(200).json({"status":"ok"})
})

app.listen(5000)