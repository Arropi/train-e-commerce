const { getCartById, createCartInventory, deleteCartInventory, getSingleInventory, deleteCartByUserId } = require("../repository/cartRepository")
const { bigintToNumber } = require("../utils/functions")

const getCartService = async (user_id) => {
    try {
        const inventoryId = await getCartById(user_id)
        const clearInventory = bigintToNumber(inventoryId)
        return clearInventory
    } catch (error) {
        throw error
    }
}

const createInventoryToCartService = async (inventories, user_id) => {
    try {
        await Promise.all(inventories.map(async (inventory) => {
            const exist = await getSingleInventory(inventory.inventories_id, user_id)
            if(exist !== null){
                throw Error('Inventory already in Cart', {
                    cause: 'Bad Request'
                })
            }
        }))
        const dataInventoryToCart = inventories.map((inventory)=> {
            return {...inventory, tanggal: new Date(inventory.tanggal), user_id: user_id, created_at: new Date()}
        })
        const cart = await createCartInventory(dataInventoryToCart)
        return cart
    } catch (error) {
        throw error
    }
}

const deleteInventoryInCartService = async (inventory_id, user_id) => {
    try {
        const existCart = await getSingleInventory(inventory_id, user_id)
        if (existCart === null) {
            throw Error('Inventory not in Database', {
                cause: 'Not Found'
            })
        }
        const cart = await deleteCartInventory(existCart.id)
        return bigintToNumber(cart)
    } catch (error) {
        throw error
    }
}


const checkoutCartService = async (user_id) => {
    try {
        const result = await deleteCartByUserId(user_id)
        return result
    } catch (error) {
        throw error
    }
}

module.exports = { 
    getCartService,
    createInventoryToCartService,
    deleteInventoryInCartService,
    checkoutCartService
}