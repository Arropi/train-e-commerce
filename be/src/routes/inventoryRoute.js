const express = require('express')
const route = express.Router()
const { authMiddleware } = require('../middleware/authMiddleware')
const { getInventories, createInventory, updateInventory, deleteInventory, getInventoryLaboratory } = require('../controller/inventoryController')
const { inventCreateValidation, inventUpdateValidation } = require('../validations/inventoryValidation')

route.get('/', authMiddleware, getInventories)
route.get('/:laboratory_id', authMiddleware, getInventoryLaboratory)
route.post('/', authMiddleware, inventCreateValidation, createInventory)
route.put('/:inventory_id', authMiddleware, inventUpdateValidation, updateInventory)
route.delete('/:inventory_id', authMiddleware, deleteInventory)
module.exports = route