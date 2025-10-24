const { getLaboratoriesService } = require("../service/laboratoryService")

const getLaboratories = async (req, res) => {
    try {
        const labolatories = await getLaboratoriesService()
        return res.status(200).json({
            'message': 'Getting all laboratory successfully',
            'data': labolatories
        })
    } catch (error) {
        console.log('Error: ', error.message)
        return res.status(500).json({
            'message': 'Internal Server Error'
        })   
    }
}

module.exports = {
    getLaboratories
}