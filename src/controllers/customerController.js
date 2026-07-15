const customerService = require("../services/customerService")



const createCustomer = async (req, res, next) => {
    try {
        const { companyId, staffId } = req.user
        const result = await customerService.createCustomer(companyId, staffId, req.body)
        res.status(201).json(result)
    } catch (error) {
        next(error)
    }
}


const getAllCustomers = async (req, res, next) => {
    try {
        const { companyId } = req.user
        const { page, limit } = req.query
        const result = await customerService.getAllCustomers(companyId, page, limit)
        res.status(200).json(result)
    } catch (error) {
        next(error)
    }
}

const getCustomerById = async (req, res, next) => {
    try {
        const { companyId } = req.user
        const { customerId } = req.params
        const result = await customerService.getCustomerById(companyId, customerId)
        res.status(200).json(result)
    } catch (error) {

        next(error)
    }
}


module.exports = { createCustomer, getAllCustomers, getCustomerById }