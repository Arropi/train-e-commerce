const { subjects } = require("../config/dbConfig")
const { getAllInventory, createInventory, createSubjectInventory, createImageInventory, getInventory,  updateInventory, getImageInventory, updateImageInventory, getSubjectInventory, deleteSubjectInventory, deleteInventory } = require("../repository/inventoryRepository")
const { getSubjectId, filterSubject } = require("../utils/functions")

const getInventoriesService = async () => {
    try {
        const inventories = await getAllInventory()
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

const createInventoryService = async (user_id, item_name, room_id, no_inventory, type, condition,special_session, laboratory_id) => {
    try {
        const createInven = await createInventory(user_id, item_name, no_inventory, room_id, condition, type, special_session, laboratory_id)
        return {
            id: Number(createInven.id),
            ...createInven
        }
    } catch (error) {
        throw error
    }
}

const addInventoriesSubjectService = async (subjects, inventory_id) => {
    try {
        const dataSubjects = subjects.map(function(subject) {
            return { inventory_id: inventory_id, subject_id: subject, created_at: new Date() }
        })
        const inventory_subjects = await createSubjectInventory(dataSubjects)  
        return inventory_subjects
    } catch (error) {
        throw error
    }
}

const addInventoriesImageService = async (img_url, inventory_id) => {
    try {
        const inventory_galleries = await createImageInventory(inventory_id, img_url)
        return inventory_galleries
    } catch (error) {
        throw error
    }
}

const updateInventoryService = async (id, user_id, item_name, room_id, no_inventory, type, condition,special_session, labolatory_id) => {
    try {
        const oldData = await getInventory(id)
        if (!oldData) {
            throw Error("Inventory not found", {cause: "Not found"})
        }
        const updateData = {
            ...oldData,
            updated_at: new Date(),
            updated_by: user_id,
            item_name: item_name?? oldData.item_name,
            room_id: room_id?? oldData.room_id,
            type: type?? oldData.type,
            no_item: no_inventory?? oldData.no_item,
            condition: condition?? oldData.condition,
            special_session: special_session?? oldData.special_session,
            labolatory_id: labolatory_id?? oldData.labolatory_id
        }
        
        const updatedInven = await updateInventory(id, updateData)
        return updatedInven
    } catch (error) {
        throw error
    }
}

const updateInventoriesSubjectService = async (id, subjects) => {
    try {
        const oldData = await getSubjectInventory(id)
        if (!oldData) {
            throw Error("Inventory Subject not found", {cause: "Not found"})
        }
        const oldSubjectId = getSubjectId(oldData)
        const {toInsert, toRemove} = filterSubject(subjects, oldSubjectId, id)
        const newSubject = await createSubjectInventory(toInsert)
        const oldSubject = await deleteSubjectInventory(toRemove)
        return { inserted_subject: newSubject.count ,deleted_subject: oldSubject.count }
    } catch (error) {
        throw error
    }
}

const updateInventoriesImageService = async (id, img_url) => {
    try {
        const oldData = await getImageInventory(id)
        if (!oldData) {
            throw Error("Inventory Image not found", {cause: "Not found"})
        }
        const updatedData = {
            ...oldData,
            updated_at: new Date(),
            filepath: img_url?? oldData.filepath
        }
        const updatedImage = await updateImageInventory(oldData.id, updatedData)
        return updatedImage
    } catch (error) {
        throw error
    }
}

const deleteInventoryService = async (id, user_id) => {
    try {
        const oldData = await getInventory(id)
        if (!oldData) {
            throw Error("Inventory not found", {cause: "Not found"})
        }
        const inventory = await deleteInventory(id, user_id)
        return inventory
    } catch (error) {
        throw error
    }
}

module.exports = {
    getInventoriesService,
    createInventoryService,
    addInventoriesImageService,
    addInventoriesSubjectService, 
    updateInventoryService, 
    updateInventoriesSubjectService,
    updateInventoriesImageService,
    deleteInventoryService
}