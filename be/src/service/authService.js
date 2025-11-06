require('dotenv').config()
const jwt = require('jsonwebtoken')
const { capitalize } = require('../utils/functions')
const { getUserByEmail, createUser } = require('../repository/userRepository')

const authService = async (email, username, img_url)=>{
    try {
        const user = await getUserByEmail(email)
        if (user){
            const id = Number(user.id)
            const token = jwt.sign({id: id, email:user.email, role: user.role}, process.env.SECRET_TOKEN, {expiresIn: 60 * 60 * 24});
            const role = user.role == 'umum' ? 'Mahasiswa' : capitalize(user.role)
            return {
                'status': 200,
                'message': `Login berhasil dengan email ${user.email}`,
                'token': token,
                'role': role,
            }
        } else {
            const user = await createUser(email, username, img_url)
            const role = user.role == 'umum' ? 'Mahasiswa' : capitalize(user.role)
            const id = Number(user.id)
            const token = jwt.sign({id: id, email: user.email}, process.env.SECRET_TOKEN, {expiresIn: 60*60*24})
            return {
                'status': 201,
                'message': `Sign up berhasil dengan email ${user.email}`,
                'token': token,
                'role': role
            }
        }
    } catch (error) {
        throw error
    }
}

module.exports = authService