const express = require('express')
const route = express.Router()
const { authMiddleware } = require('../middleware/authMiddleware')
const { getLaboratories } = require('../controller/laboratoryController')

route.get('/', authMiddleware, getLaboratories)

module.exports = route