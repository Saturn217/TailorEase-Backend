const measurementService = require("../services/measurementService")
const AppError = require("../utils/AppError")


const createMeasurement = async (req, res) => {

    try {
        const { companyId, staffId } = req.user
        const {customerId} = req.params
        // const { templateId, values, notes } = req.body

        const result = await measurementService.createMeasurement(companyId, staffId,customerId, req.body)
        res.status(201).json(result)
    } catch (error) {
        const statusCode = error.statusCode || 500
        res.status(statusCode).json({
            message: error.message
        })

    }
}

module.exports = {createMeasurement}
