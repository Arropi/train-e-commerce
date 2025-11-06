const { getCartById, createCartInventory, deleteCartInventory, getSingleInventory, getSpecificCart } = require("../repository/cartRepository")
const { getSpecificInventories, getImageInventory, getSubjectInventory } = require("../repository/inventoryRepository")
const { getInventoryId } = require("../utils/functions")

const getCartService = async (user_id) => {
    try {
        const inventoryId = await getCartById(user_id)
        const dataId = getInventoryId(inventoryId)
        const inventories = await getSpecificInventories(dataId)
        const information = inventories.map((inventory) => {
            return {
                id: Number(inventory.id),
                item_name: inventory.item_name,
                no_item: inventory.no_item,
                condition: inventory.condition,
                type: inventory.type,
                special_session: inventory.special_session,
                room_id: inventory.room_id? Number(inventory.room_id) : null,
                laboratory_id: inventory.labolatory_id? Number(inventory.labolatory_id) : null,
                img_url: inventory.inventory_galleries.find(galleries => galleries.deleted_at===null)?.filepath ?? null,
                subject_id: inventory.inventory_subjects.flatMap(subjects => subjects.deleted_at? [] : [Number(subjects.subject_id)])
            }
        })
        return information
    } catch (error) {
        throw error
    }
}

const createInventoryToCartService = async (inventories, user_id) => {
    try {
        const existCart = await getSpecificCart(inventories, user_id)
        if(existCart.length > 0){
            throw Error("Inventory was inserted in Cart", {
                cause: "Bad Request"
            })
        }
        const dataInventoryToCart = inventories.map((inventory)=> {
            return {inventories_id: inventory, user_id: user_id, created_at: new Date()}
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
        return { ...cart, inventories_id: Number(cart.inventories_id), user_id: Number(cart.user_id), id: Number(cart.id)}
    } catch (error) {
        throw error
    }
}

module.exports = { 
    getCartService,
    createInventoryToCartService,
    deleteInventoryInCartService
}