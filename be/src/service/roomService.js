const { getRooms } = require("../repository/roomRepository")

const getListRoomsService = async () => {
    try {
        const rooms = await getRooms()
        const information = rooms.map((s)=> {
            return {
                ...s,
                id: Number(s.id),
            }
        })
        return information
    } catch (error) {
        throw error
    }
}

module.exports = {
    getListRoomsService
}