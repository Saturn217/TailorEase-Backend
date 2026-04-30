const templateService = require("../services/templateService")
const AppError = require("../utils/AppError")


const createTemplate = async (req, res) => {

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

const getAllTemplates = async (req, res) => {
    try {
        const { companyId } = req.user
        const { page, limit } = req.query

        const result = await templateService.getAllTemplates(companyId, page, limit)
        res.status(201).json(result)
    } catch (error) {
        const statusCode = error.statusCode || 500
        res.status(statusCode).json({
            message: error.message
        })
    }
}

const updateTemplate = async (req, res) => {
    try {
        const { companyId } = req.user
        const { templateId } = req.params
        const { newTemplateName, fields, deleteFieldId } = req.body

        const result = await templateService.updateTemplate(companyId, templateId, req.body)
        res.status(200).json(result)

    } catch (error) {
        const statusCode = error.statusCode || 500
        res.status(statusCode).json({
            message: error.message
        })

    }
}

const deleteTemplate = async (req, res) => {
    try {
        const { companyId } = req.user
        const { templateId } = req.params

        const result = await templateService.deleteTemplate(companyId, templateId)
        res.status(200).json(result)
    } catch (error) {
        const statusCode = error.statusCode || 500
        res.status(statusCode).json({
            message: error.message
        })
    }
}








module.exports = { createTemplate, getAllTemplates, updateTemplate, deleteTemplate }