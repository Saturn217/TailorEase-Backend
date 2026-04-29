const customerService = require("../services/customerService")
const AppError = require('../utils/AppError')


const createCustomer = async (req, res) =>{
    try{
         const {companyId, staffId} = req.user
        const result = await customerService.createCustomer(companyId, staffId, req.body)
        res.status(201).json(result)
    } catch (error) {
       const statusCode = error.statusCode || 500
       res.status(statusCode).json({ message: error.message })
    }
}


const getAllCustomers = async (req, res) => {
    try {
        const { companyId } = req.user
        const {page, limit } = req.query
        const result = await customerService.getAllCustomers(companyId, page, limit)
        res.status(200).json(result)
    } catch (error) {
        const statusCode = error.statusCode || 500
        res.status(statusCode).json({ message: error.message })
    }
}

const getCustomerById = async (req, res) => {
    try {
        const { companyId } = req.user
        const { customerId } = req.params
        const result = await customerService.getCustomerById(companyId, customerId)
        res.status(200).json(result)
    } catch (error) {
        const statusCode = error.statusCode || 500
        res.status(statusCode).json({ message: error.message })
        
    }
}


module.exports = { createCustomer, getAllCustomers, getCustomerById }