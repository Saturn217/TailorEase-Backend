const orderService = require("../services/orderService")
const AppError = require("../utils/appError")
const { order, staff } = require("../utils/prisma")


const createOrder = async (req, res)=>{
    try {
        const { companyId, staffId } = req.user
        const { customerId } = req.params

        const result = await orderService.createOrder(companyId, staffId, customerId, req.body)
        res.status(201).json(result)
        
    } catch (error) {
        const statusCode = error.statusCode || 500
        res.status(statusCode).json({
            message: error.message
        })
        
    }
}

const getCompanyOrders = async (req, res)=>{
    try {
        const {companyId} = req.user
    
        const {customerId, type, status, page, limit} = req.query

        const result = await orderService.getCompanyOrders(companyId, customerId, type, status, page, limit)
        res.status(200).json(result)
    } catch (error) {
        const statusCode = error.statusCode || 500
        res.status(statusCode).json({
            message: error.message
        })
        
    }
}

const getCustomerOrders = async (req, res)=>{
    try {
        const {companyId} = req.user
        const {customerId} = req.params
        const {type, status, page, limit} = req.query
        const result = await orderService.getCustomerOrders(companyId, customerId, type, status, page, limit)
        res.status(200).json(result)
    } catch (error) {
        const statusCode = error.statusCode || 500
        res.status(statusCode).json({
            message: error.message
        })

    }
}

const updateOrderStatus = async (req, res) =>{
    try {
        const {companyId, staffId, role} = req.user
        const {orderId} = req.params
        const {status} = req.body
       

        const result = await orderService.updateOrderStatus(companyId, staffId, role, orderId, status)

        res.status(200).json(result)

    } catch (error) {
        const statusCode = error.statusCode || 500
        res.status(statusCode).json({
            message: error.message
        })
        
    }
}

const uploadOrderPhoto = async (req, res) =>{
    try {
        const {companyId, staffId} = req.user
        const {orderId} = req.params
        const {caption} = req.body

        const file = req.file
        if(!file){
            throw new AppError("No file uploaded", 400)
        }

        const result = await orderService.uploadOrderPhoto(companyId, staffId, orderId, file, caption)
        res.status(200).json(result)
    } catch (error) {
        const statusCode = error.statusCode || 500
        res.status(statusCode).json({
            message: error.message
        })
    }
}


module.exports = { createOrder, getCompanyOrders, getCustomerOrders, updateOrderStatus, uploadOrderPhoto}
