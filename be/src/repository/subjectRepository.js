const prisma = require('../config/dbConfig')

const getAllSubjects = async () => {
    try {
        const subjects = await prisma.subjects.findMany()
        return subjects
    } catch (error) {
        console.log('Subject Repository Error: ', error)
        throw Error('Internal Server Database Not Respond :(')
    }
}

module.exports = {
    getAllSubjects
}