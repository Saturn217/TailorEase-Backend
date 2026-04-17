 const adminService = require('../services/adminService')
const AppError = require('../utils/AppError')

const getAllCompanies = async (req, res) => {
    try {
        const { status, page, limit } = req.query
        const result = await adminService.getAllCompanies(status, page, limit)
        res.status(200).json(result) 
    } catch (error) {
        const statusCode = error.statusCode || 500
        res.status(statusCode).json({
            message: error.message
        })

    }
}