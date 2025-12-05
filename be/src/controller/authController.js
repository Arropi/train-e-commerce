const authService = require("../service/authService")

const authController = async (req, res)=> {
    try {
        const data = req.body
        const login = await authService(data.email, data.username, data.img_url)
        return res.status(login.status).json({
            'message': login.message,
            'token': login.token,
            'role': login.role,
            'lab': login.lab
        })
    } catch (error) {
        return res.status(500).json({
            'message': error.message
        })
    }
}

module.exports = authController