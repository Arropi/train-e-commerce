const prisma = require('../config/dbConfig')

const getCartById = async (id) => {
    try {
        const cart = await prisma.carts.findMany({
            where: {
                user_id: id
            },
            include: {
                inventories: {
                    include: {
                        inventory_galleries: true,
                        inventory_subjects: true
                    }
                }
            }
        })
        return cart
    } catch (error) {
        console.log('Cart Repository Error: ', error)
        throw Error('Internal Server Database Error :(')
    }
}

const getSpecificCart = async (inventories, user_id) => {
    try {
        const cart = await prisma.carts.findMany({
            where: {
                user_id: user_id,
                inventories_id: {
                    in: inventories
                }
            }
        })
        return cart
    } catch (error) {
        console.log('Cart Repository Error: ', error)
        throw Error('Internal Server Database Error :(')
    }
}

const getSingleInventory = async (inventory_id, user_id) => {
    try {
        const cart = await prisma.carts.findFirst({
            where: {
                user_id: user_id,
                inventories_id: inventory_id
            }
        })
        return cart
    } catch (error) {
        console.log('Cart Repository Error: ', error)
        throw Error('Internal Server Database Error :(')
    }
}

const createCartInventory = async (dataInventory) => {
    try {
        const cart = await prisma.carts.createMany({
            data: dataInventory
        })
        return cart
    } catch (error) {
        console.log('Cart Repository Error: ', error)
        throw Error('Internal Server Database Error :(')
    }
}

const deleteCartInventory = async (cart_id) => {
    try {
        const cart = prisma.carts.delete({
            where: {
                id: cart_id
            }
        })
        return cart
    } catch (error) {
        console.log('Cart Repository Error: ', error)
        throw Error('Internal Server Database Error :(')
    }
}

module.exports = { getCartById, getSingleInventory, createCartInventory, deleteCartInventory, getSpecificCart }