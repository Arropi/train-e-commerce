const express = require('express')
const authController = require('../controller/authController')
const { userValidation, updateValidation} = require('../validations/userValidation')
const { getUserData, updateUserData } = require('../controller/userController')
const { authMiddleware } = require('../middleware/authMiddleware')
const route = express.Router()

route.post('/login', userValidation, authController )

route.get('/user', authMiddleware, getUserData)
route.put('/user', authMiddleware, updateValidation, updateUserData)

module.exports = route