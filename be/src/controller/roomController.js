const { getListRoomsService } = require("../service/roomService")

const getListRoom = async (req, res) => {
    try {
        const subjects = await getListRoomsService()
        return res.status(200).json({
            'messsage': 'Getting data subjects successfully',
            'data': subjects
        })
    } catch (error) {
        console.log(error)
        if (error.cause == 'Bad Request') {
            res.status(400).json({
                'message': error.message
            })
        } else {
            res.status(500).json({
                'message': error.message
            })
        }
    }
}

module.exports = {
    getListRoom
}