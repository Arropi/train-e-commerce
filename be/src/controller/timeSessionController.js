const { getAllTimeSessionsService, getNormalTimeSessionsService, getSpecialTimeSessionsService } = require("../service/timeSessionService")

const getAllTimeSession = async (req, res) => {
    try {
        const timeSessions = await getAllTimeSessionsService()
        return res.status(200).json({
            'message': 'Getting time session data successfully',
            'data': timeSessions
        })
    } catch (error) {
        console.log('Error: ', error.message)
        return res.status(500).json({
            'message': 'Internal Server Error'
        })
    }
}

const getNormalTimeSession = async (req, res) => {
    try {
        const timeSessions = await getNormalTimeSessionsService()
        return res.status(200).json({
            'message': 'Getting normal time session data successfully',
            'data': timeSessions
        })
    } catch (error) {
        console.log('Error: ', error.message)
        return res.status(500).json({
            'message': 'Internal Server Error'
        })
    }
}

const getSpecialTimeSession = async (req, res) => {
    try {
        const timeSessions = await getSpecialTimeSessionsService()
        return res.status(200).json({
            'message': 'Getting special time session data successfully',
            'data': timeSessions
        })
    } catch (error) {
        console.log('Error: ', error.message)
        return res.status(500).json({
            'message': 'Internal Server Error'
        })
    }
}

module.exports = {
    getAllTimeSession,
    getNormalTimeSession,
    getSpecialTimeSession
}