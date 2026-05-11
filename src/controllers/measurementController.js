const measurementService = require("../services/measurementService")
const AppError = require("../utils/AppError")


const createMeasurement = async (req, res) => {

    try {
        const { companyId, staffId } = req.user
        const { customerId } = req.params
        // const { templateId, values, notes } = req.body

        const result = await measurementService.createMeasurement(companyId, staffId, customerId, req.body)
        res.status(201).json(result)
    } catch (error) {
        const statusCode = error.statusCode || 500
        res.status(statusCode).json({
            message: error.message
        })

    }
}

const getCustomerMeasurements = async (req, res) => {
    try {
        const { companyId } = req.user
        const { customerId } = req.params
        const { page, limit } = req.query

        const result = await measurementService.getCustomerMeasurements(companyId, customerId, page, limit)
        res.status(200).json(result)
    } catch (error) {
        const statusCode = error.statusCode || 500
        res.status(statusCode).json({
            message: error.message
        })
    }
}


const getCompanyMeasurements = async (req, res) => {
    try {
        const { companyId } = req.user
        const { page, limit } = req.query

        const result = await measurementService.getCompanyMeasurements(companyId, page, limit)
        res.status(200).json(result)
        
    } catch (error) {
        const statusCode = error.statusCode || 500
        res.status(statusCode).json({
            message: error.message
        })
    }
}

const updateMeasurement = async (req, res) => {
    try {
        const {companyId, staffId} = req.user
        const {customerId, measurementId} = req.params
    
        const result = await measurementService.updateMeasurement(companyId, staffId, customerId, measurementId, req.body) 
        res.status(200).json(result)


    } catch (error) {
        const statusCode = error.statusCode || 500
        res.status(statusCode).json({
            message: error.message
        })
    }
}


module.exports = { createMeasurement, getCustomerMeasurements, getCompanyMeasurements, updateMeasurement }
