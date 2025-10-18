const adminAccessMiddleware = (req, res, next) => {
    try {
        const user = req.user
        if (user.role == 'umum') {
            res.status(403).json({
                'message': 'Access Denied For Admin Only'
            })
        } else {
            next()
        }
    } catch (error) {
        res.status(500).json({
            'message': error.message
        })
    }
}

module.exports = {
    adminAccessMiddleware
}