const templateService = require("../services/templateService")
const AppError = require("../utils/AppError")


const createTemplate = async (req, res) => {
        console.log(req.body)
    try {
        const { companyId } = req.user
        const { name, fieldDefinitions } = req.body
        console.log(req.body)

        const result = await templateService.createTemplate(companyId, req.body)
        res.status(201).json(result)
    } catch (error) {
        const statusCode = error.statusCode || 500
        res.status(statusCode).json({ message: error.message })

    }
}








module.exports = {createTemplate}