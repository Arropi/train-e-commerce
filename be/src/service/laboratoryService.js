const { getLaboratories } = require("../repository/laboratoryRepository")

const getLaboratoriesService = async () => {
    try {
        let labolatories = await getLaboratories()
        labolatories = labolatories.map((lab)=>{return {...lab, id: Number(lab.id)}}) 
        return labolatories
    } catch (error) {
        throw error
    }
}

module.exports = {
    getLaboratoriesService
}