const { createReservesService, getReservesUserService, updateReserveService } = require("../service/reservesService")

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
    createReservesUser,
    updateReserveUser
}