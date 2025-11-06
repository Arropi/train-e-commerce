const { getSpecificInventories, getImageInventory, getSubjectInventory } = require("../repository/inventoryRepository")
const { getReservesUser, createReserves, updateReserve, deleteReserve, getReservesUserOnProcess, getReservesAdmin, getReservesInSpesificDate, getReservesLaboratoryInSpesificDate } = require("../repository/reservesRepository")
const { getInventoryId } = require("../utils/functions")

const getReservesUserService = async (user_id) => {
    try {
        const reserves = await getReservesUser(user_id)
        const inventories_id = getInventoryId(reserves)
        const inventories = await getSpecificInventories(inventories_id)
        const information = reserves.map((reserve) =>{
            const match = inventories.find(inventory => inventory.id === reserve.inventories_id)
            return {
                id: Number(reserve.inventories.id),
                item_name: reserve.inventories.item_name,
                no_item: reserve.inventories.no_item,
                condition: reserve.inventories.condition,
                type: reserve.inventories.type,
                special_session: reserve.inventories.special_session,
                room_id: reserve.inventories.room_id? Number(reserve.inventories.room_id) : null,
                laboratory_id: reserve.inventories.labolatory_id? Number(reserve.inventories.labolatory_id) : null,
                img_url: match.inventory_galleries.find(galleries => galleries.deleted_at===null)?.filepath ?? null,
                subject_id: match.inventory_subjects.flatMap(subjects => subjects.deleted_at? [] : [Number(subjects.subject_id)]),
                status: reserve.status,
                reserve_id: Number(reserve.id),
                tanggal: reserve.tanggal
            }
        })
        return information
    } catch (error) {
        throw error
    }
}

const getReservesAdminService = async () => {
    try {
        const reserves = await getReservesAdmin()
        const inventories_id = getInventoryId(reserves)
        const inventories = await getSpecificInventories(inventories_id)
        const information = reserves.map((reserve) =>{
            const match = inventories.find(inventory => inventory.id === reserve.inventories_id)
            return {
                id: Number(reserve.inventories.id),
                item_name: reserve.inventories.item_name,
                no_item: reserve.inventories.no_item,
                condition: reserve.inventories.condition,
                type: reserve.inventories.type,
                special_session: reserve.inventories.special_session,
                room_id: reserve.inventories.room_id? Number(reserve.inventories.room_id) : null,
                laboratory_id: reserve.inventories.labolatory_id? Number(reserve.inventories.labolatory_id) : null,
                img_url: match.inventory_galleries.find(galleries => galleries.deleted_at===null)?.filepath ?? null,
                subject_id: match.inventory_subjects.flatMap(subjects => subjects.deleted_at? [] : [Number(subjects.subject_id)]),
                status: reserve.status,
                reserve_id: Number(reserve.id),
                tanggal: reserve.tanggal
            }
        })
        return information
    } catch (error) {
        throw error
    }
}

const getReservesInUseService = async (tanggal) => {
    try {
        const validTanggal = new Date(tanggal)
        const reserves = await getReservesInSpesificDate(validTanggal)
        const inventories_id = getInventoryId(reserves)
        const inventories = await getSpecificInventories(inventories_id)
        const information = reserves.map((reserve) =>{
            const match = inventories.find(inventory => inventory.id === reserve.inventories_id)
            return {
                id: Number(reserve.inventories.id),
                item_name: reserve.inventories.item_name,
                no_item: reserve.inventories.no_item,
                condition: reserve.inventories.condition,
                type: reserve.inventories.type,
                special_session: reserve.inventories.special_session,
                room_id: reserve.inventories.room_id? Number(reserve.inventories.room_id) : null,
                laboratory_id: reserve.inventories.labolatory_id? Number(reserve.inventories.labolatory_id) : null,
                img_url: match.inventory_galleries.find(galleries => galleries.deleted_at===null)?.filepath ?? null,
                subject_id: match.inventory_subjects.flatMap(subjects => subjects.deleted_at? [] : [Number(subjects.subject_id)]),
                status: reserve.status,
                reserve_id: Number(reserve.id),
                tanggal: reserve.tanggal
            }
        })
        return information
    } catch (error) {
        throw error
    }
}

const getReservesLaboratoryInUseService = async (tanggal, lab_id) => {
    try {
        const validTanggal = new Date(tanggal)
        const reserves = await getReservesLaboratoryInSpesificDate(validTanggal, lab_id)
        const inventories_id = getInventoryId(reserves)
        const inventories = await getSpecificInventories(inventories_id)
        const information = reserves.map((reserve) =>{
            const match = inventories.find(inventory => inventory.id === reserve.inventories_id)
            return {
                id: Number(reserve.inventories.id),
                item_name: reserve.inventories.item_name,
                no_item: reserve.inventories.no_item,
                condition: reserve.inventories.condition,
                type: reserve.inventories.type,
                special_session: reserve.inventories.special_session,
                room_id: reserve.inventories.room_id? Number(reserve.inventories.room_id) : null,
                laboratory_id: reserve.inventories.labolatory_id? Number(reserve.inventories.labolatory_id) : null,
                img_url: match.inventory_galleries.find(galleries => galleries.deleted_at===null)?.filepath ?? null,
                subject_id: match.inventory_subjects.flatMap(subjects => subjects.deleted_at? [] : [Number(subjects.subject_id)]),
                status: reserve.status,
                reserve_id: Number(reserve.id),
                tanggal: reserve.tanggal
            }
        })
        return information
    } catch (error) {
        throw error
    }
}


const createReservesService = async (dataInput, user_id) => {
    try {
        const inventories_id = getInventoryId(dataInput)
        const existReserve = await getReservesUserOnProcess(user_id, inventories_id)
        if(existReserve.length > 0) {
            throw Error("Inventory Reserve In Process", {
                cause: "Bad Request"
            })
        }
        const dataReserves = dataInput.map((i) => { 
            return {
                ...i,
                'user_id': user_id,
                'created_at': new Date()
            }
        })
        const reserves = await createReserves(dataReserves)
        return reserves
    } catch (error) {
        throw error
    }
}

const updateReserveService = async (dataInput, user_id, reserve_id) => {
    try {
        let dataUpdate = {
            ...dataInput,
            'updated_by': user_id,
            'updated_at': new Date()
        }
        if(dataInput.status === "rejected" || dataInput.status === "done" || dataInput.status === "canceled") {
            dataUpdate = {
                ...dataUpdate,
                'deleted_at': new Date()
            }
        }
        const reserve = await updateReserve(dataUpdate, reserve_id)
        return {
            ...reserve,
            id: Number(reserve.id),
            session_id: Number(reserve.session_id),
            inventories_id: Number(reserve.inventories_id),
            user_id: Number(reserve.user_id),
            subject_id: Number(reserve.subject_id),
            updated_by: Number(reserve.updated_by)
        }
    } catch (error) {
        throw error
    }
}


module.exports = {
    getReservesUserService,
    getReservesAdminService,
    getReservesInUseService,
    getReservesLaboratoryInUseService,
    createReservesService,
    updateReserveService
}