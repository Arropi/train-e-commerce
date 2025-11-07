const express = require('express')
const { authMiddleware } = require('../middleware/authMiddleware')
const { getListRoom } = require('../controller/roomController')
const route = express.Router()

route.get('/', authMiddleware, getListRoom)

module.exports = route