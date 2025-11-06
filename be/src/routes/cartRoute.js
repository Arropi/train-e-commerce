const express = require('express')
const { authMiddleware } = require('../middleware/authMiddleware')
const { getCart, createInventoryToCart, deleteInventoryCart } = require('../controller/cartController')
const { createInventoryToCartValidation } = require('../validations/cartValidation')
const route = express.Router()

route.get('/', authMiddleware, getCart)
route.post('/', authMiddleware, createInventoryToCartValidation, createInventoryToCart)
route.delete('/:inventory_id', authMiddleware, deleteInventoryCart)

module.exports = route