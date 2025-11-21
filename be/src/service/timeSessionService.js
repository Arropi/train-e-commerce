const { getTimeSession, getSpecialSession, getNormalSession } = require("../repository/timeSessionRepository")
const { bigintToNumber } = require("../utils/functions")

const getAllTimeSessionsService = async () => {
    try {
        const sessions = await getTimeSession()
        console.log(sessions)
        const clearSessions = bigintToNumber(sessions)
        const clearTimeSessions = clearSessions.map(session => {
            return {
                ...session,
                start: session.start.toISOString().substring(11, 16),
                end: session.end.toISOString().substring(11, 16)
            }
        })
        return clearTimeSessions
    } catch (error) {
        throw error
    }
}

const getSpecialTimeSessionsService = async () => {
    try {
        const sessions = await getSpecialSession()
        const clearSessions = bigintToNumber(sessions)
        const clearTimeSessions = clearSessions.map(session => {
            return {
                ...session,
                start: session.start.toISOString().substring(11, 16),
                end: session.end.toISOString().substring(11, 16)
            }
        })
        return clearTimeSessions
    } catch (error) {
        throw error
    }
}

const getNormalTimeSessionsService = async () => {
    try {
        const sessions = await getNormalSession()
        const clearSessions = bigintToNumber(sessions)
        const clearTimeSessions = clearSessions.map(session => {
            return {
                ...session,
                start: session.start.toISOString().substring(11, 16),
                end: session.end.toISOString().substring(11, 16)
            }
        })
        return clearTimeSessions
    } catch (error) {
        throw error
    }
}

module.exports = {
    getAllTimeSessionsService,
    getSpecialTimeSessionsService,
    getNormalTimeSessionsService
}