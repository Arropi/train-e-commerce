const prisma = require('../config/dbConfig')

const getRooms = async()=>{
    try {
        const rooms = await prisma.rooms.findMany()
        return rooms
    } catch (error) {
        console.log('Rooms Repository Error: ', error)
        throw Error('Internal Server Database Not Respond :(')
    }
}

const getRoomById = async (id) => {
    try {
        const room = await prisma.rooms.findUnique({
            where: {
                id: id
            }
        })
        return room
    } catch (error) {
        console.log('Rooms Repository Error: ', error)
        throw Error('Internal Server Database Not Respond :(')
    }
}

const createRoom = async (name) => {
    try {
        const room = await prisma.rooms.create({
            data: {
                name: name,
                type: 'laboratorium'
            }
        })
        return room
    } catch (error) {
        console.log('Rooms Repository Error: ', error)
        throw Error('Internal Server Database Not Respond :(')
    }
}


module.exports ={
    getRoomById,
    getRooms,
    createRoom
}