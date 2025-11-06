const { getAllSubjects } = require("../repository/subjectRepository")

const getListSubjectService = async () => {
    try {
        const subjects = await getAllSubjects()
        const information = subjects.map((s)=> {
            return {
                ...s,
                id: Number(s.id),
            }
        })
        return information
    } catch (error) {
        throw error
    }
}

module.exports = {
    getListSubjectService
}