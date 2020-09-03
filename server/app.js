require('dotenv').config()

const express = require('express')
const bodyParser = require('body-parser')

const OSS = require('ali-oss')
const STS = OSS.STS

const app = express()
const sts = new STS({
  accessKeyId: process.env.ALI_OSS_APP_ACCESS_KEY_ID,
  accessKeySecret: process.env.ALI_OSS_APP_ACCESS_KEY_SECRET
})


app.use(bodyParser.json())

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE, OPTIONS')
  next()
})

app.use('/api/upload/credential', async (req, res, next) => {
  try {
    const { credentials } = await sts.assumeRole(
      "acs:ram::1786389648930150:role/uploader", //role arn
      null, // policy
      15 * 60, // expiration
      'web-client' // session name
    )
    console.log(credentials)
    res.status(200).json({ result: credentials })
  } catch (err) {
    res.status(401).json({e:err})
  }
})

app.listen(5000)