const { getUserByEmail, updateUserByEmail, getUserEmail, updateAdminByEmail } = require("../repository/userRepository")
const { capitalize } = require("../utils/functions")

const getUserDataService = async (email)=>{
    try {
        const dataSensitive = await getUserByEmail(email)
        const role = dataSensitive.role == 'umum' ? 'Mahasiswa' : capitalize(dataSensitive.role)
        return {
            'id': Number(dataSensitive.id),
            'role': role,
            'email': dataSensitive.email,
            'username': dataSensitive.username,
            'image_url': dataSensitive.img_url,
            'nim': dataSensitive.nim,
            'prodi': dataSensitive.prodi,
            'lab_name': dataSensitive.labolatories ? dataSensitive.labolatories.name : null
        }
    } catch (error) {
        throw error
    }
}

const getUserAdminDataService = async (keyword) => {
    try {
        const data = await getUserEmail(keyword)
        console.log(data)
        return data
    } catch (error) {
        throw error
    }
}

const updateUserDataService = async (email, nim, prodi) => {
    try {
        const oldData = await getUserDataService(email)
        const dataSensitive = await updateUserByEmail(email, nim, prodi, null, null, oldData)
        const role = dataSensitive.role == 'umum' ? 'Mahasiswa' : capitalize(dataSensitive.role)
        return {
            'id': Number(dataSensitive.id),
            'role': role,
            'email': dataSensitive.email,
            'username': dataSensitive.username,
            'image_url': dataSensitive.img_url,
            'nim': dataSensitive.nim,
            'prodi': dataSensitive.prodi,
            'lab_name': dataSensitive.labolatories ? dataSensitive.labolatories.name : null
        }
    } catch (error) {
        throw error
    }
}

const updateAdminDataService = async(email, lab_id, user_id) => {
    try {
        const oldData = await getUserByEmail(email)
        
        // Cek apakah user tidak ditemukan
        if (!oldData) {
            throw new Error('Email tidak terdaftar dalam sistem')
        }
        
        // Cek apakah user sudah menjadi admin
        if (oldData.role === 'admin') {
            throw new Error('Email ini sudah terdaftar sebagai admin')
        }
        
        const dataSensitive = await updateAdminByEmail(email, lab_id, user_id, oldData)
        return {
            'id': Number(dataSensitive.id),
            'role': dataSensitive.role,
            'email': dataSensitive.email,
            'username': dataSensitive.username,
            'lab_name': dataSensitive.labolatories ? dataSensitive.labolatories.name : null
        }
    } catch (error) {
        throw error
    }
}

module.exports = {
    getUserDataService,
    updateUserDataService,
    getUserAdminDataService,
    updateAdminDataService
}