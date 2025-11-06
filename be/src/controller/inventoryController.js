const { getInventoriesService, createInventoryService, addInventoriesSubjectService, addInventoriesImageService, updateInventoryService, updateInventoriesSubjectService, updateInventoriesImageService, deleteInventoryService, getInventoriesLaboratoryService } = require("../service/inventoryService")

const getInventories = async (req, res) => {
    try {
        const inventories = await getInventoriesService()       
        return res.status(200).json({
            message: 'Getting data inventory succesfull',
            inventories
        })
    } catch (error) {
        console.log('Error: ', error.message)
        return res.status(500).json({
            'message': 'Internal Server Error'
        })
    }
}

const getInventoryLaboratory = async (req, res) => {
    try {
        const lab_id = req.params.laboratory_id
        const inventories = await getInventoriesLaboratoryService(lab_id)
        return res.status(200).json({
            'message': 'Getting data inventory in lab successfully',
            inventories
        })
    } catch (error) {
        console.log('Error: ', error.message)
        return res.status(500).json({
            'message': 'Internal Server Error'
        })
    }
}

const createInventory = async (req, res) => {
    try {
        const user = req.user
        const data = req.body
        const inventory = await createInventoryService(user.id, data.item_name, data.room_id, data.no_inventory, data.type, data.condition, data.special_session, data.laboratory_id)
        const inventory_subject = await addInventoriesSubjectService(data.subjects, inventory.id)
        let dataSend = { 
            ...inventory,
            id: inventory.id? Number(inventory.id) : null,
            room_id: inventory.room_id? Number(inventory.room_id) : null,
            labolatory_id : inventory.labolatory_id? Number(inventory.labolatory_id) : null,
            created_by: inventory.created_by? Number(inventory.created_by) : null ,
            updated_by: inventory.updated_by? Number(inventory.updated_by) : null ,
            subject_added: inventory_subject.count
        }
        if (data.img_url) {
            const inventory_galleries = await addInventoriesImageService(data.img_url, inventory.id)
            dataSend = {
                ...dataSend,
                img_url: inventory_galleries.filepath
            }
        }
        return res.status(201).json({
            'message': 'Creating New Inventory Successfully',
            'data': dataSend
        })
    } catch (error) {
        console.log('Error: ', error.message)
        return res.status(500).json({
            'message': 'Internal Server Error'
        })
    }
}

const updateInventory = async (req, res) => {
    try {
        const user = req.user
        const data = req.body
        const inventory_id = req.params.inventory_id
        let allUpdated = {}
        console.log(data.laboratory_id)
        if(data.item_name || data.room_id || data.no_inventory || data.type || data.condition || data.special_session || data.laboratory_id){
            const updateInventory = await updateInventoryService(inventory_id, user.id, data.item_name,data.room_id, data.no_inventory, data.type, data.condition, data.special_session, data.laboratory_id)
            allUpdated = {
                ...updateInventory,
                id: updateInventory.id? Number(updateInventory.id) : null,
                room_id: updateInventory.room_id? Number(updateInventory.room_id) : null,
                created_by: updateInventory.created_by? Number(updateInventory.created_by) : null ,
                updated_by: updateInventory.updated_by? Number(updateInventory.updated_by) : null ,
                labolatory_id: updateInventory.labolatory_id? Number(updateInventory.labolatory_id) : null
            }            
        }
        if(data.subjects){
            const updateSubject = await updateInventoriesSubjectService(inventory_id, data.subjects)
            allUpdated = {...allUpdated, ...updateSubject}
        }
        if(data.img_url){
            const updateUrl = await updateInventoriesImageService(inventory_id, data.img_url)
            const {filepath, ...updateUrlUnnecessary} = updateUrl
            allUpdated = {...allUpdated, filepath}
        }
        return res.status(200).json({
            'message': 'Updated inventory succesfully',
            'data': allUpdated
        })
    } catch (error) {
        console.log('Error: ', error.message)
        if (error.cause == "Not found") {
            return res.status(404).json({
                'message': error.message
            })
        }
        return res.status(500).json({
            'message': 'Internal Server Error'
        })
    }
}

const deleteInventory = async (req, res) => {
    try {
        const user = req.user
        const inventory_id = req.params.inventory_id
        const deletedInventory = await deleteInventoryService(inventory_id, user.id)
        const dataDeletedInventory = {
            ...deletedInventory,
                id: deletedInventory.id? Number(deletedInventory.id) : null,
                room_id: deletedInventory.room_id? Number(deletedInventory.room_id) : null,
                created_by: deletedInventory.created_by? Number(deletedInventory.created_by) : null ,
                updated_by: deletedInventory.updated_by? Number(deletedInventory.updated_by) : null ,
                labolatory_id: deletedInventory.labolatory_id? Number(deletedInventory.labolatory_id) : null
        }
        return res.status(200).json({
            'message': 'Deleted inventory succesfully',
            'data': dataDeletedInventory
        })
    } catch (error) {
        console.log('Error: ', error.message)
        if (error.cause == "Not found") {
            return res.status(404).json({
                'message': error.message
            })
        }
        return res.status(500).json({
            'message': 'Internal Server Error'
        })
    }
}
module.exports = {
    getInventories,
    getInventoryLaboratory,
    createInventory,
    updateInventory,
    deleteInventory
}