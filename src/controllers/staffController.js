

const staffService = require('../services/staffService')



const getAllStaff = async (req, res, next) => {

    try {
           const { companyId } = req.user
    const { status, page, limit } = req.query
        const result = await staffService.getAllStaff(companyId, status, page, limit)
        res.status(200).json(result)
    } catch (error) {
       next(error)
    }

}

const updateStaffStatus = async (req, res, next) => {

    try {
        const { companyId } = req.user
        const { staffId } = req.params
        const { status } = req.body
        
        const result = await staffService.updateStaffStatus(companyId, staffId, status)
        res.status(200).json(result)
    } catch (error) {
       next(error)
    }
}

module.exports = { getAllStaff, updateStaffStatus }