const { getUserDataService, updateUserDataService, getUserAdminDataService, updateAdminDataService } = require('../service/userService')

const getUserData = async(req, res) => {
    try {
        const user = req.user
        const keyword = req.query.keyword
        let datas
        if (keyword) {
            if (user.role !== 'admin'){
                return res.status(403).json({
                    'message': 'Forbidden Access'
                })
            }
            datas = await getUserAdminDataService(keyword)
        } else {
            datas = await getUserDataService(user.email)
        }
        return res.status(200).json({
            "message": "Get data user successfully",
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
        let datas
        if (body.lab_id && body.email){
            if (user.role !== 'admin'){
                return res.status(403).json({
                    'message': 'Forbidden Access'
                })
            }
            datas = await updateAdminDataService(body.email, body.lab_id, user.id)
        } else {
            datas = await updateUserDataService(user.email, body.nim, body.prodi)
        }
        res.status(200).json({
            'message': 'Update user data successfully',
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