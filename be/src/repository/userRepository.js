const prisma = require("../config/dbConfig")

const createUser = async (email, username, img_url) => {
    try {
        const user = await prisma.users.create({
            data: {
                email: email,
                username: username,
                img_url: img_url
            },
            include: {
                labolatories: true
            }
        })
        
        return user
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
            },
            include: {
                labolatories: true
            }
        })
        return user
    } catch (error) {
        console.log('User Repository Error: ', error)
        throw Error('Internal Server Database Not Respond :(')
    }
}

const getUserEmail = async (keyword) => {
    try {
        const user = await prisma.users.findMany({
            select : {
                email: true
            },
            where: {
                email: {
                    contains: keyword
                },
                role: {
                    not: 'admin'
                }
            }
        })
        return user
    } catch (error) {
        console.log('User Repository Error: ', error)
        throw Error('Internal Server Database Not Respond :(')
    }
}

const updateUserByEmail = async (email, nim, prodi, oldData) => {
    try {
        const updated = await prisma.users.update({
            where:{
                email: email
            },
            data: {
                nim: nim ?? oldData.nim,
                prodi: prodi ?? oldData.prodi,
            },
        })
        return updated
    } catch (error) {
        console.log('User Repository Error: ', error)
        throw Error('Internal Server Database Not Respond :(')
    }
}

const updateAdminByEmail = async (email, lab_id, user_id, oldData) => {
    try {
        const updated = await prisma.users.update({
            where:{
                email: email
            },
            data: {
                role: 'admin',
                lab_id: lab_id,
                updated_by: user_id 
            },
            include: {
                labolatories: true
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
    getUserEmail,
    updateUserByEmail,
    updateAdminByEmail
}