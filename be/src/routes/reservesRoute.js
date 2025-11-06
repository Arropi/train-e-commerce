const express = require('express')
const { authMiddleware } = require('../middleware/authMiddleware')
const { reservesCreateValidation, reservesUpdateValidation } = require('../validations/reservesValidation')
const { createReservesUser, getReservesUser, updateReserveUser } = require('../controller/reservesController')
const route = express.Router()


route.get('/', authMiddleware, getReservesUser)
route.post('/', authMiddleware, reservesCreateValidation, createReservesUser)
route.put('/:reserve_id', authMiddleware, reservesUpdateValidation, updateReserveUser)

module.exports = route