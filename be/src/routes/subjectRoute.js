const express = require('express')
const { authMiddleware } = require('../middleware/authMiddleware')
const { getListSubject } = require('../controller/subjectController')
const route = express.Router()

route.get('/', authMiddleware, getListSubject)

module.exports = route