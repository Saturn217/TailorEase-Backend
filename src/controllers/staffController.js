 

const staffService = require('../services/staffService')
const AppError = require("../utils/AppError")


const getAllStaff = async (req, res) =>{
    const {companyId} = req.params
    const {status, page, limit} = req.query

    try{
        const result = await staffService.getAllStaff(companyId, status, page, limit)
        res.status(200).json(result)
    } catch (error) {
        const statusCode = error.statusCode || 500
        res.status(statusCode).json({ message: error.message })
    }       
    
}

const updateStaffStatus = async (req, res) => {
    const {companyId, staffId} = req.params
    const {status} = req.body

    try{
        const result = await staffService.updateStaffStatus(companyId, staffId, status)
        res.status(200).json(result)
    } catch (error) {
        const statusCode = error.statusCode || 500
        res.status(statusCode).json({ message: error.message })
    }
}

module.exports = { getAllStaff, updateStaffStatus }