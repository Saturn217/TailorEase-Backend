const orderService = require("../services/orderService")
const AppError = require("../utils/appError")


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


module.exports = { createOrder }
