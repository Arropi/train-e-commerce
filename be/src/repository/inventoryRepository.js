const prisma = require('../config/dbConfig')

const getAllInventory = async () => {
    try {
        const inventories = await prisma.inventories.findMany({
            where: {
                deleted_at: null
            },
            include: {
                inventory_subjects: true,
                inventory_galleries: true
            }
        })
        return inventories
    } catch (error) {
        console.log('Inventory Repository Error: ', error)
        throw Error('Internal Server Database Not Respond :(')
    }
}

const getInventoriesLaboratory = async (labolatory_id) => {
    try {
        const inventories = await prisma.inventories.findMany({
            where: {
                labolatory_id: labolatory_id,
                deleted_at: null
            },
            include: {
                inventory_subjects: true,
                inventory_galleries: true,
            }
        })
        return inventories
    } catch (error) {
        console.log('Inventory Repository Error: ', error)
        throw Error('Internal Server Database Not Respond :(')
    }
}

const getInventoriesLaboratoryAvailable = async (labolatory_id, tanggal) => {
    try {
        const inventories = await prisma.inventories.findMany({
            where: {
                labolatory_id: labolatory_id,
                deleted_at: null,
                reserves: {
                    none: {
                        tanggal: tanggal,
                        status: {
                            in: ["approve", "waiting_to_be_return"]
                        }
                    }
                },
            },
            include: {
                inventory_galleries: true,
                inventory_subjects: true,
            }
        })
        return inventories
    } catch (error) {
        console.log('Inventory Repository Error: ', error)
        throw Error('Internal Server Database Not Respond :(')
    }
}

const getSpecificInventories = async (dataInventoriesId) => {
    try {
        const inventories = await prisma.inventories.findMany({
            where: {
                id: {
                    in: dataInventoriesId
                },
                deleted_at: null
            },
            include: {
                inventory_subjects: true,
                inventory_galleries: true
            }
        })
        return inventories
    } catch (error) {
        console.log('Error: ', error.message)
        return res.status(500).json({
            'message': 'Internal Server Database Error :('
        })
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
        throw Error('Internal Server Database Error :(')
    }
}

const getImageInventory = async (id) => {
    try {
        const imageInventory = await prisma.inventory_galleries.findFirst({
            where: {
                inventory_id: id,
                deleted_at: null
            }
        })
        return imageInventory
    } catch (error) {
        console.log('Inventory Repository Error: ', error)
        throw Error('Internal Server Database Error :(')
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
        throw Error('Internal Server Database Error :(')
    }
}

const createInventory = async (user_id, item_name, no_inventory,room_id, condition, type, special_session, labolatory_id ) => {
    try {
        const inventory = await prisma.inventories.create({
            data: {
                alat_bhp: 'alat',
                item_name: item_name,
                no_item: no_inventory,
                room_id: room_id,
                condition: condition,
                type: type,
                labolatory_id: labolatory_id,
                created_by: user_id,
                special_session: special_session,
                created_at: new Date()
            }
        })
        return inventory
    } catch (error) {
        console.log('Inventory Repository Error: ', error)
        throw Error('Internal Server Database Error :(')
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
        throw Error('Internal Server Database Error :(')
    }
}

const createImageInventory = async (inventory_id, image_url) => {
    try {
        const inventory = await prisma.inventory_galleries.create({
            data: {
                inventory_id: inventory_id,
                filepath: image_url,
                created_at: new Date()
            }
        })
        return inventory
    } catch (error) {
        console.log('Inventory Repository Error: ', error)
        throw Error('Internal Server Database Error :(')
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
        throw Error('Internal Server Database Error :(')
    }
}

const updateImageInventory = async (id, updatedData) => {
    try {
        const imageInventory = await prisma.inventory_galleries.update({
            data: updatedData,
            where: {
                id: id,
                deleted_at: null
            }
        })
        return imageInventory
    } catch (error) {
        console.log('Inventory Repository Error: ', error)
        throw Error('Internal Server Database Error :(')
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
        throw Error('Internal Server Database Error :(')
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
        throw Error('Internal Server Database Error :(')
    }
}

module.exports = {
    getAllInventory,
    getSubjectInventory,
    getImageInventory,
    getInventory,
    getSpecificInventories,
    getInventoriesLaboratoryAvailable,
    getInventoriesLaboratory,
    createInventory,
    createSubjectInventory,
    createImageInventory,
    updateInventory,
    updateImageInventory,
    deleteInventory,
    deleteSubjectInventory
}