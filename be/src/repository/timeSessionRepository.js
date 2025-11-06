const prisma = require('../config/dbConfig')

const getTimeSession = async () => {
    try {
        const session = await prisma.time_sessions.findMany()
        return session
    } catch (error) {
        console.log('Time Session Repository Error: ', error)
        throw Error('Internal Server Database Not Respond :(')
    }
}

const getSpecialSession = async () => {
    try {
        const session = await prisma.time_sessions.findMany({
            where: {
                special_session: true
            }
        })
        return session
    } catch (error) {
        console.log('Time Session Repository Error: ', error)
        throw Error('Internal Server Database Not Respond :(')
    }
}

const getNormalSession = async () => {
    try {
        const session = await prisma.time_sessions.findMany({
            where:{
                special_session: false
            }
        })
        return session
    } catch (error) {
        console.log('Time Session Repository Error: ', error)
        throw Error('Internal Server Database Not Respond :(')
    }
}

module.exports= {
    getTimeSession,
    getSpecialSession,
    getNormalSession
}