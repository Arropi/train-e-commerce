const { getUserDataService, updateUserDataService } = require('../service/userService')

const getUserData = async(req, res) => {
    try {
        const user = req.user
        const datas = await getUserDataService(user.email)
        return res.status(200).json({
            datas
        })
    } catch (error) {
        console.log('Error: ', error.message)
        return res.status(500).json({
            'message': 'Internal Server Error'
        })
    }
}

const updateUserData = async (req, res) => {
    try {
        const user = req.user
        const body = req.body
        const datas = await updateUserDataService(user.email, body.nim, body.prodi)
        res.status(200).json({
            datas
        })
    } catch (error) {
        console.log('Error: ', error.message)
        return res.status(500).json({
            'message': error.message
        })
    }
}
module.exports = {
    getUserData,
    updateUserData
}