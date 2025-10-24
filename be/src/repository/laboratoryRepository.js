const prisma = require('../config/dbConfig')
const { listLab } = require('../utils/helper')

const getLaboratories = async () => {
    try {
        const laboratories = await prisma.labolatories.findMany({
            select: {
                name: true,
                id: true
            },
            where: {
                name: {
                    in: listLab
                }
            }
        })
        return laboratories
    } catch (error) {
        console.log('Laboratory Repository Error: ', error)
        throw Error('Internal Server Database Not Respond :(')
    }
}

const getLaboratory = async (id) => {
    try {
        const laboratory = await prisma.labolatories.findFirst({
            select: {
                name: true
            },
            where: {
                id: id
            }
        })
        return laboratory
    } catch (error) {
        console.log('Laboratory Repository Error: ', error)
        throw Error('Internal Server Database Not Respond :(')
    }
}

module.exports = {
    getLaboratories,
    getLaboratory
}