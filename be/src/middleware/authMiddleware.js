const jwt = require('jsonwebtoken')

const authMiddleware = (req, res,  next)=> {
    const {authorization} = req.headers
    if(!authorization){
        return res.status(403).json({
            "message": "Token needed"
        })
    } 
    try {
        const secretToken = process.env.SECRET_TOKEN
        const token = authorization.split(' ')[1]
        const jwtDecode = jwt.verify(token, secretToken)
        req.user = jwtDecode
        next()
    } catch (error) {
        console.log(error)
        return res.status(401).json({
            "message": "Authorize failed"
        })
    }
}

module.exports = {
    authMiddleware
}