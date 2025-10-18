const { getUserByEmail, updateUserByEmail } = require("../repository/userRepository")
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
            'prodi': dataSensitive.prodi
        }
    } catch (error) {
        throw error
    }
}

const updateUserDataService = async (email, nim, prodi) => {
    try {
        const oldData = await getUserDataService(email)
        const dataSensitive = await updateUserByEmail(email, nim, prodi, oldData)
        const role = dataSensitive.role == 'umum' ? 'Mahasiswa' : capitalize(dataSensitive.role)
        return {
            'id': Number(dataSensitive.id),
            'role': role,
            'email': dataSensitive.email,
            'username': dataSensitive.username,
            'image_url': dataSensitive.img_url,
            'nim': dataSensitive.nim,
            'prodi': dataSensitive.prodi
        }
    } catch (error) {
        throw error
    }
}

module.exports = {
    getUserDataService,
    updateUserDataService
}