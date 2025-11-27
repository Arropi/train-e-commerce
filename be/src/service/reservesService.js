const { getReservesUser, getReserveOnGoingUser, getReserveOnGoingAdmin, createReserves, updateReserve,  getReservesUserOnProcess, getReservesAdmin, getReservesInSpesificDate, getReservesLaboratoryInSpesificDate, getReserveHistoryAdmin, getReserveHistoryUser } = require("../repository/reservesRepository")
const { bigintToNumber } = require("../utils/functions")

const getReservesUserService = async (user_id) => {
    try {
        const reserves = await getReservesUser(user_id)
        const clearReserves = bigintToNumber(reserves)
        return clearReserves
    } catch (error) {
        throw error
    }
}

const getReservesUserOngoingService = async (user_id) => {
    try {
        const reserves = await getReserveOnGoingUser(user_id)
        const clearReserves = bigintToNumber(reserves)
        return clearReserves
    } catch (error) {
        throw error
    }
}

const getReservesAdminOngoingService = async () => {
    try {
        const reserves = await getReserveOnGoingAdmin()
        const clearReserves = bigintToNumber(reserves)
        return clearReserves
    } catch (error) {
        throw error
    }
}

const getReservesUserHistoryService = async (user_id) => {
    try {
        const reserves = await getReserveHistoryUser(user_id)
        const reserveClear = bigintToNumber(reserves)
        return reserveClear
    } catch (error) {
        throw error
    }
}

const getReservesAdminService = async () => {
    try {
        const reserves = await getReservesAdmin()
        const clearReserves = bigintToNumber(reserves)
        return clearReserves
    } catch (error) {
        throw error
    }
}

const getReservesAdminHistoryService = async () => {
    try {
        const reserves = await getReserveHistoryAdmin()
        const reserveClear = bigintToNumber(reserves)
        return reserveClear
    } catch (error) {
        throw error
    }
}

const getReservesInUseService = async (tanggal) => {
    try {
        const validTanggal = new Date(tanggal)
        const reserves = await getReservesInSpesificDate(validTanggal)
        const clearReserves = bigintToNumber(reserves)
        return clearReserves
    } catch (error) {
        throw error
    }
}

const getReservesLaboratoryInUseService = async (tanggal, lab_id) => {
    try {
        const validTanggal = new Date(tanggal)
        const reserves = await getReservesLaboratoryInSpesificDate(validTanggal, lab_id)
        const clearReserves = bigintToNumber(reserves)
        return clearReserves
    } catch (error) {
        throw error
    }
}


const createReservesService = async (dataInput, user_id) => {
    try {
        const toCheck = dataInput.map((i) => {
            const {subject_id, session_id,pic, ...rest} = i
            return {
                AND: [
                    {tanggal: new Date(i.tanggal)},
                    {session_id: i.session_id},
                    {inventories_id: i.inventories_id},
                    {status: "process"}
                ]
            }
        })
        const existReserve = await getReservesUserOnProcess(toCheck)
        console.log(existReserve)
        if(existReserve.length > 0) {
            const thisUser = existReserve.find(e => Number(e.user_id) === user_id)
            console.log(thisUser)   
            if (thisUser) {
                throw Error("Inventory Reserve In Process", {
                    cause: "Bad Request"
                })
            } else {
                throw Error("Inventory Already Reserved by Other User", {
                    cause: "Bad Request"
                })
            }
        }
        const dataReserves = dataInput.map((i) => { 
            return {
                ...i,
                'tanggal': new Date(i.tanggal),
                'user_id': user_id,
                'created_at': new Date()
            }
        })
        console.log(dataReserves)
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
    getReservesUserOngoingService,
    getReservesUserHistoryService,
    getReservesAdminService,
    getReservesAdminOngoingService,
    getReservesAdminHistoryService,
    getReservesInUseService,
    getReservesLaboratoryInUseService,
    createReservesService,
    updateReserveService
}