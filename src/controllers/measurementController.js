const measurementService = require("../services/measurementService")



const createMeasurement = async (req, res, next) => {

    try {
        const { companyId, staffId } = req.user
        const { customerId } = req.params
        // const { templateId, values, notes } = req.body

        const result = await measurementService.createMeasurement(companyId, staffId, customerId, req.body)
        res.status(201).json(result)
    } catch (error) {
        next(error)

    }
}

const getCustomerMeasurements = async (req, res, next) => {
    try {
        const { companyId } = req.user
        const { customerId } = req.params
        const { page, limit } = req.query

        const result = await measurementService.getCustomerMeasurements(companyId, customerId, page, limit)
        res.status(200).json(result)
    } catch (error) {
        next(error)
    }
}


const getCompanyMeasurements = async (req, res, next) => {
    try {
        const { companyId } = req.user
        const { page, limit } = req.query

        const result = await measurementService.getCompanyMeasurements(companyId, page, limit)
        res.status(200).json(result)
        
    } catch (error) {
       next(error)
    }
}

const updateMeasurement = async (req, res, next) => {
    try {
        const {companyId, staffId} = req.user
        const {customerId, measurementId} = req.params
    
        const result = await measurementService.updateMeasurement(companyId, staffId, customerId, measurementId, req.body) 
        res.status(200).json(result)


    } catch (error) {
        next(error)
    }
}


module.exports = { createMeasurement, getCustomerMeasurements, getCompanyMeasurements, updateMeasurement }
