const templateService = require("../services/templateService")



const createTemplate = async (req, res, next) => {

    try {
        const { companyId } = req.user
       
        console.log(req.body)

        const result = await templateService.createTemplate(companyId, req.body)
        res.status(201).json(result)
    } catch (error) {
      next(error)
    }
}

const getAllTemplates = async (req, res, next) => {
    try {
        const { companyId } = req.user
        const { page, limit } = req.query

        const result = await templateService.getAllTemplates(companyId, page, limit)
        res.status(200).json(result)
    } catch (error) {
       next(error)
    }
}

const updateTemplate = async (req, res, next) => {
    try {
        const { companyId } = req.user
        const { templateId } = req.params

        const result = await templateService.updateTemplate(companyId, templateId, req.body)
        res.status(200).json(result)

    } catch (error) {
       next(error)

    }
}

const deleteTemplate = async (req, res, next) => {
    try {
        const { companyId } = req.user
        const { templateId } = req.params

        const result = await templateService.deleteTemplate(companyId, templateId)
        res.status(200).json(result)
    } catch (error) {
       next(error)
    }
}








module.exports = { createTemplate, getAllTemplates, updateTemplate, deleteTemplate }