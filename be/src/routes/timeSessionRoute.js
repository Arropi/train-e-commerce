const express = require('express');
const { authMiddleware } = require('../middleware/authMiddleware');
const { getAllTimeSession, getNormalTimeSession, getSpecialTimeSession } = require('../controller/timeSessionController');
const route = express.Router();

route.get('/', authMiddleware, getAllTimeSession)
route.get('/normal', authMiddleware, getNormalTimeSession)
route.get('/special', authMiddleware, getSpecialTimeSession)

module.exports = route;