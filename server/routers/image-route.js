const express = require('express')

const imageControllers = require('../controllers/image-controllers')

const router = express.Router()

router.get('/credentials', imageControllers.getCredentials)
router.get('/images', imageControllers.getImages)
router.post('/images',imageControllers.postImages)

module.exports = router