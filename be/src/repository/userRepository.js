const prisma = require("../config/dbConfig")

const createUser = async (email, username, img_url) => {
    try {
        const user = await prisma.users.create({
            data: {
                email: email,
                username: username,
                img_url: img_url
            }
        })
        const userInformation = {
            'id': user.id,
            'role': user.role,
            'email': user.email
        }
        return userInformation
    } catch (error) {
        console.log('Create User Repository User', error)
        throw Error ('Database Server Error Dalam Membuat User')
    }
}

const getUserByEmail = async (email)=>{
    try {
        const user = await prisma.users.findFirst({
            where: {
                email: email
            }
        })
        return user
    } catch (error) {
        console.log('User Repository Error: ', error)
        throw Error('Internal Server Database Not Respond :(')
    }
}

const updateUserByEmail = async (email, nim, prodi) => {
    try {
        const updated = await prisma.users.update({
            where:{
                email: email
            },
            data: {
                nim: nim,
                prodi: prodi
            }
        })
        return updated
    } catch (error) {
        console.log('User Repository Error: ', error)
        throw Error('Internal Server Database Not Respond :(')
    }
}

module.exports = {
    createUser,
    getUserByEmail,
    updateUserByEmail
}