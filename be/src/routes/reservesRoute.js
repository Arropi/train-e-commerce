const express = require('express')
const { authMiddleware } = require('../middleware/authMiddleware')
const { reservesCreateValidation, reservesUpdateValidation } = require('../validations/reservesValidation')
const { createReservesUser, getReservesUser, getReservesUserOngoing, updateReserveUser, getReservesInUse, getReservesLaboratoryInUse, getReservesAdmin, getReservesAdminOngoing, getReservesHistoryAdmin, getReservesUserHistory } = require('../controller/reservesController')
const route = express.Router()

route.get('/', authMiddleware,  getReservesInUse)
route.get('/user', authMiddleware, getReservesUser)
route.get('/user/ongoing', authMiddleware, getReservesUserOngoing)
route.get('/user/history', authMiddleware, getReservesUserHistory)
route.get('/admin', authMiddleware,  getReservesAdmin)
route.get('/admin/ongoing', authMiddleware, getReservesAdminOngoing)
route.get('/admin/history', authMiddleware, getReservesHistoryAdmin)
route.get('/:laboratory_id', authMiddleware, getReservesLaboratoryInUse)
route.post('/', authMiddleware, reservesCreateValidation, createReservesUser)
route.put('/:reserve_id', authMiddleware, reservesUpdateValidation, updateReserveUser)

module.exports = route