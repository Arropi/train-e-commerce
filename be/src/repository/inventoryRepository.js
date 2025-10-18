const prisma = require('../config/dbConfig')

const getAllInventory = async () => {
    try {
        const inventories = await prisma.inventories.findMany({
            where: {
                deleted_at: null
            }
        })
        return inventories
    } catch (error) {
        console.log('Inventory Repository Error: ', error)
        throw Error('Internal Server Database Not Respond :(')
    }
}

const getInventory = async (id) => {
    try {
        const inventory = await prisma.inventories.findUnique({
            where: {
                id: id
            }
        })
        return inventory
    } catch (error) {
        console.log('Inventory Repository Error: ', error)
        throw Error('Internal Server Database Not Respond :(')
    }
}

const getImageInventory = async (id) => {
    try {
        const imageInventory = await prisma.inventory_galleries.findUnique({
            where: {
                inventory_id: id,
                deleted_at: null
            }
        })
        return imageInventory
    } catch (error) {
        console.log('Inventory Repository Error: ', error)
        throw Error('Internal Server Database Not Respond :(')
    }
}

const getSubjectInventory = async (id) => {
    try {
        const getSubjectInventory = await prisma.inventory_subjects.findMany({
            where:{
                inventory_id: id,
                deleted_at: null
            }
        })
        return getSubjectInventory
    } catch (error) {
        console.log('Inventory Repository Error: ', error)
        throw Error('Internal Server Database Not Respond :(')
    }
}

const createInventory = async (user_id, item_name, no_inventory,room_id, condition, type, special_session ) => {
    try {
        const inventory = await prisma.inventories.create({
            data: {
                alat_bhp: 'alat',
                item_name: item_name,
                no_item: no_inventory,
                room_id: room_id,
                condition: condition,
                type: type,
                created_by: user_id,
                special_session: special_session
            }
        })
        return inventory
    } catch (error) {
        console.log('Inventory Repository Error: ', error)
        throw Error('Internal Server Database Not Respond :(')
    }
}

const createSubjectInventory = async(dataSubject) =>{
    try {
        const inventories = await prisma.inventory_subjects.createMany({
            data: dataSubject
        })
        return inventories
    } catch (error) {
        console.log('Inventory Repository Error: ', error)
        throw Error('Internal Server Database Not Respond :(')
    }
}

const createImageInventory = async (inventory_id, image_url) => {
    try {
        const inventory = await prisma.inventory_galleries.create({
            data: {
                inventory_id: inventory_id,
                filepath: image_url
            }
        })
        return inventory
    } catch (error) {
        console.log('Inventory Repository Error: ', error)
        throw Error('Internal Server Database Not Respond :(')
    }
}

const updateInventory = async (inventory_id, updatedData) => {
    try {
        const inventory = await prisma.inventories.update({
            data: updatedData, 
            where: {
                id: inventory_id,
            }
        })
        return inventory
    } catch (error) {
        console.log('Inventory Repository Error: ', error)
        throw Error('Internal Server Database Not Respond :(')
    }
}

const updateImageInventory = async (inventory_id, updatedData) => {
    try {
        const imageInventory = await prisma.inventory_galleries.update({
            where:{
                inventory_id: inventory_id,
                deleted_at: null
            },
            data: updatedData
        })
        return imageInventory
    } catch (error) {
        console.log('Inventory Repository Error: ', error)
        throw Error('Internal Server Database Not Respond :(')
    }
}

const deleteInventory = async (inventory_id, user_id) => {
    try {
        const inventory = await prisma.inventories.update({
            where:{
                id: inventory_id
            },
            data: {
                updated_by: user_id,
                deleted_at: new Date()
            }
        })
        return inventory
    } catch (error) {
        console.log('Inventory Repository Error: ', error)
        throw Error('Internal Server Database Not Respond :(')
    }
}

const deleteSubjectInventory = async (dataSubject) => {
    try {
        const inventories = await prisma.inventory_subjects.updateMany({
            where: {
                OR: dataSubject
            },
            data: {
                deleted_at: new Date()
            }
        })
        return inventories
    } catch (error) {
        console.log('Inventory Repository Error: ', error)
        throw Error('Internal Server Database Not Respond :(')
    }
}

module.exports = {
    getAllInventory,
    getSubjectInventory,
    getImageInventory,
    createInventory,
    createSubjectInventory,
    createImageInventory,
    getInventory,
    updateInventory,
    updateImageInventory,
    deleteInventory,
    deleteSubjectInventory
}