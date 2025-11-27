const { createReservesService, getReservesUserService, getReservesUserOngoingService, getReservesAdminOngoingService, updateReserveService, getReservesAdminService, getReservesInUseService, getReservesLaboratoryInUseService, getReservesAdminHistoryService, getReservesUserHistoryService } = require("../service/reservesService")

const getReservesUser = async (req, res) => {
    try {
        const user = req.user
        const reserves = await getReservesUserService(user.id)
        res.status(200).json({
            'message': 'Getting Reserves Data Successsfully',
            'data': reserves
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            'message': error.message
        })
    }
}

const getReservesUserOngoing = async (req, res) => {
    try {
        const user = req.user
        const reserves = await getReservesUserOngoingService(user.id)
        return res.status(200).json({
            'message': 'Getting ongoing reserves data successfully',
            'data': reserves
        })
    } catch (error) {
        console.log('Error: ', error)
        return res.status(500).json({
            'message': error.message
        })
    }
}

const getReservesAdminOngoing = async (req, res) => {
    try {
        const reserves = await getReservesAdminOngoingService()
        return res.status(200).json({
            'message': 'Getting ongoing reserves data successfully',
            'data': reserves
        })
    } catch (error) {
        console.log('Error: ', error)
        return res.status(500).json({
            'message': error.message
        })
    }
}

const getReservesUserHistory = async (req, res) => {
    try {
        const user = req.user
        const reserves = await getReservesUserHistoryService(user.id)
        return res.status(200).json({
            'message': 'Getting reserve history data successfully',
            'data': reserves
        })
    } catch (error) {
        console.log('Error: ', error)
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

const getReservesHistoryAdmin = async (req, res) => {
    try {
        const reserves = await getReservesAdminHistoryService()
        return res.status(200).json({
            'message': 'Getting reserve history data successfully',
            'data': reserves
        })
    } catch (error) {
        console.log('Error: ', error)
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

const getReservesAdmin = async (req, res) => {
    try {
        const reserves = await getReservesAdminService()
        return res.status(200).json({
            'message': 'Getting data successfully',
            'data': reserves
        })
    } catch (error) {
        console.log('Error: ', error)
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

const getReservesInUse = async (req, res) => {
    try {
        const tanggal = req.query.tanggal
        console.log(tanggal)
        const reserves = await getReservesInUseService(tanggal)
        return res.status(200).json({
            'message': 'Getting reserve data successfully',
            'data': reserves
        })
    } catch (error) {
        console.log('Error: ', error)
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

const getReservesLaboratoryInUse = async (req, res) => {
    try {
        const laboratory_id = req.params.laboratory_id
        const tanggal = req.query.tanggal
        let reserves
        if(tanggal){
            reserves = await getReservesLaboratoryInUseService(tanggal, laboratory_id)
        } else {
            reserves = await getReservesLaboratoryInUseService(laboratory_id)
        }
        return res.status(200).json({
            'message': 'Getting reserve data successfully',
            'data': reserves
        })
    } catch (error) {
        console.log('Error: ', error)
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

const createReservesUser = async (req, res) => {
    try {
        const user = req.user
        const data = req.body
        const reserves = await createReservesService(data.data, user.id)
        res.status(201).json({
            'message': 'Create Reserves Successfully',
            'data': reserves
        })
    } catch (error) {
        console.log('Error: ', error)
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

const updateReserveUser = async (req, res) => {
    try {
        const user = req.user
        const data = req.body
        const reserve_id = req.params.reserve_id
        const reserve = await updateReserveService(data, user.id, reserve_id)
        res.status(200).json({
            'message': 'Update data reserve successfully',
            'data': reserve
        })
    } catch (error) {
        console.log('Error: ', error.message)
        if (error.cause == "Not Found") {
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
    getReservesUser,
    getReservesUserOngoing,
    getReservesUserHistory,
    getReservesAdmin,
    getReservesAdminOngoing,
    getReservesHistoryAdmin,
    getReservesInUse,
    getReservesLaboratoryInUse,
    createReservesUser,
    updateReserveUser
}