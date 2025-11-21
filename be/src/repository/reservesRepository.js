const prisma = require('../config/dbConfig')

const getReservesUser = async (user_id) => {
    try {
        const reserves = prisma.reserves.findMany({
            where: {
                user_id: user_id,
            },
            include: {
                inventories: true,
            }
        })
        return reserves
    } catch (error) {
        console.log('Reserves Repository Error: ', error)
        throw Error('Internal Server Database Not Respond :(')
    }
}


const getReservesUserOnProcess = async (user_id, inventories_id) => {
    try {
        const reserve = await prisma.reserves.findMany({
            where: {
                user_id: user_id,
                inventories_id: {
                    in: inventories_id
                },
                status: "process"
            }
        })
        return reserve
    } catch (error) {
        console.log('Reserves Repository Error: ', error)
        throw Error('Internal Server Database Not Respond :(')
    }
}

const getReservesAdmin = async () => {
    try {
        const reserves = await prisma.reserves.findMany({
            include: {
                inventories: {
                    include: {
                        inventory_galleries: true,
                        inventory_subjects: true
                    }
                },
                reserve_user_created: true
            }
        })
        return reserves
    } catch (error) {
        console.log('Reserves Repository Error: ', error)
        throw Error('Internal Server Database Not Respond :(')
    }
}

const getReservesInSpesificDate = async (tanggal) => {
    try {
        const reserves = await prisma.reserves.findMany({
            where: {
                status: {
                    in: ["approve", "waiting_to_be_return"]
                },
                tanggal: tanggal
            },
            include: {
                inventories: true
            }
        })
        return reserves
    } catch (error) {
        console.log('Reserves Repository Error: ', error)
        throw Error('Internal Server Database Not Respond :(')
    }
}

const getReservesLaboratoryInSpesificDate = async (tanggal, lab_id) => {
    try {
        console.log(tanggal, lab_id)
        const reserves = await prisma.reserves.findMany({
            where: {
                status: {
                    in: ["approve", "waiting_to_be_return"]
                },
                tanggal: tanggal,
                inventories: {
                    labolatory_id: lab_id
                }
            },
            include: {
                inventories: true
            }
        })
        return reserves
    } catch (error) {
        console.log('Reserves Repository Error: ', error)
        throw Error('Internal Server Database Not Respond :(')
    }
}

const getReserveDetail = async (reserve_id) => {
    try {
        const reserve = await prisma.reserves.findUnique({
            where:{
                id: reserve_id
            }
        })
        return reserve
    } catch (error) {
        console.log('Reserves Repository Error: ', error)
        throw Error('Internal Server Database Not Respond :(')
    }
}

const createReserves = async (dataReserves) => {
    try {
        const reserves = prisma.reserves.createMany({
            data: dataReserves
        })
        return reserves
    } catch (error) {
        console.log('Reserves Repository Error: ', error)
        throw Error('Internal Server Database Not Respond :(')
    }
}

const updateReserve = async (dataReserves, reserve_id) => {
    try {
        const reserve = await prisma.reserves.update({
            where: {
                id: reserve_id,
            }, 
            data: dataReserves
        })
        return reserve
    } catch (error) {
        console.log('Reserves Repository Error: ', error)
        throw Error('Internal Server Database Not Respond :(')
    }
}



module.exports= {
    getReservesUser,
    getReservesAdmin,
    getReservesInSpesificDate,
    getReservesLaboratoryInSpesificDate,
    getReservesUserOnProcess,
    getReserveDetail,
    createReserves,
    updateReserve,
}