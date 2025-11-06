const express = require('express')
const { authMiddleware } = require('../middleware/authMiddleware')
const { reserveGetFilterValidation,reservesCreateValidation, reservesUpdateValidation } = require('../validations/reservesValidation')
const { createReservesUser, getReservesUser, updateReserveUser, getReservesInUse, getReservesLaboratoryInUse } = require('../controller/reservesController')
const route = express.Router()


route.get('/', authMiddleware, reserveGetFilterValidation, getReservesInUse)
route.get('/user', authMiddleware, getReservesUser)
route.get('/:laboratory_id', authMiddleware, reserveGetFilterValidation, getReservesLaboratoryInUse)
route.post('/', authMiddleware, reservesCreateValidation, createReservesUser)
route.put('/:reserve_id', authMiddleware, reservesUpdateValidation, updateReserveUser)

module.exports = route