const prisma = require("../utils/prisma");
const AppError = require('../utils/AppError')
const { company } = require('../utils/prisma')



const createTemplate = async (companyId, data) => {
    const { name, fieldDefinitions } = data


    if (!name) {
        throw new AppError('Template name is required', 400)
    }

    if (!fieldDefinitions || !Array.isArray(fieldDefinitions)) {
        throw new AppError('Template definitions must be an array', 400)
    }

    if (fieldDefinitions.length === 0) {
        throw new AppError('Field definitions cannot be empty', 400)
    }

    const invalidField = fieldDefinitions.some((field) => !field.measurementName || !field.unit)

    if (invalidField) {
        throw new AppError('Each field definition must have a measurement name and unit', 400)
    }

    const validUnits = ['cm', 'inches']
    const invalidUnit = fieldDefinitions.some((field) => !validUnits.includes(field.unit))
    if (invalidUnit) {
        throw new AppError(`Invalid unit in field definitions. Valid units are cm or inches`, 400)
    }

    const measurementNames = fieldDefinitions.map((field) => field.measurementName.toLowerCase().trim())

    const uniqueNames = new Set(measurementNames)
    if (measurementNames.length !== uniqueNames.size) {
        throw new AppError("Each measurement name must be unique within a template", 400)
    }

    const existingTemplate = await prisma.measurementTemplate.findFirst({
        where: { companyId, name: { equals: name, mode: "insensitive" } }
    })

    if (existingTemplate) {
        throw new AppError("Template with this name already exists", 409)
    }

    const processFields = fieldDefinitions.map(field => ({
        fieldId: field.measurementName
            .toLowerCase()
            .trim()
            .replace(/\s+/g, '_')        // spaces to underscores
            .replace(/[^a-z0-9_]/g, ''), // remove special characters
        measurementName: field.measurementName.trim(),
        unit: field.unit

    }))


    const template = await prisma.measurementTemplate.create({
        data: {
            name,
            companyId,
            fieldDefinitions: processFields
        }
    })

    return {
        message: 'Template created successfully',
        template: {
            id: template.id,
            name: template.name,
            fieldDefinitions: template.fieldDefinitions,
            createdAt: template.createdAt
        }

    }
}


const getAllTemplates = async (companyId, page, limit) => {

    console.log('companyId:', companyId)
    console.log('page:', page)
    console.log('limit:', limit)

    const currentPage = parseInt(page) || 1
    const pageSize = parseInt(limit) || 10
    const skip = (currentPage - 1) * pageSize


    const [templates, totalCount] = await Promise.all([
        prisma.measurementTemplate.findMany({
            where: { companyId },
            select: {
                id: true,
                name: true,
                fieldDefinitions: true,
                createdAt: true,
                _count: {
                    select: { measurements: true }
                }
            },
            orderBy: { createdAt: 'desc' },
            skip,
            take: pageSize
        }),
        prisma.measurementTemplate.count({
            where: {
                companyId
            }

        })
    ])

    if (templates.length === 0) {
        throw new AppError("No Template Found", 404)
    }

    return {
        message: "Templates retrieved successfully",
        templates,
        pagination: {
            totalCount,
            totalPages: Math.ceil(totalCount / pageSize),
            currentPage,
            pageSize,
            hasNextPage: currentPage < Math.ceil(totalCount / pageSize),
            hasPrevPage: currentPage > 1
        }
    }

}

const updateTemplate = async (companyId, templateId, data) => {
    console.log('companyId:', companyId)
    console.log('templateId:', templateId)

    const { newTemplateName, fields, deleteFieldId } = data

    if (!newTemplateName && !fields && !deleteFieldId) {
        throw new AppError('Nothing to update', 400)
    }

    const template = await prisma.measurementTemplate.findFirst({
        where: { id: templateId, companyId },
        include: {
            measurements: {
                select: {
                    values: true
                }
            }
        }


    })

    if (!template) {
        throw new AppError("Template not found", 404)
    }

    if (fields) {
        if (!Array.isArray(fields)) {
            throw new AppError('Template definitions must be an array', 400)
        }

        if (fields.length === 0) {
            throw new AppError('Field definitions cannot be empty', 400)
        }

        const invalidField = fields.some(field => !field.measurementName || !field.unit)

        if (invalidField) {
            throw new AppError('Each field definition must have a measurement name and unit', 400)

        }

        const validUnits = ["cm", "inches"]
        const invalidUnit = fields.some(field => !validUnits.includes(field.unit))

        if (invalidUnit) {
            throw new AppError(`Invalid unit in field definitions. Valid units are cm or inches`, 400)
        }

        const measurementNames = fields.map((field) => field.measurementName.toLowerCase().trim())

        const uniqueNames = new Set(measurementNames)
        if (measurementNames.length !== uniqueNames.size) {
            throw new AppError("Each measurement name must be unique within a template", 400)
        }

    }


    if (newTemplateName) {
        const existingTemplate = await prisma.measurementTemplate.findFirst({
            where: {
                companyId,
                name: { equals: newTemplateName, mode: "insensitive" },
                NOT: { id: templateId }
            }
        })

        if (existingTemplate) {
            throw new AppError("Template Name Already Exists", 409)
        }

    }
    let updatedField = template.fieldDefinitions
    if (deleteFieldId) {
        const fieldExist = template.fieldDefinitions.find(field => field.fieldId === deleteFieldId)
      

        if (!fieldExist) {
            throw new AppError("FieldId does not exist", 404)
        }

        const fieldInUse = template.measurements.some(m => m.values[deleteFieldId] !== undefined)
        if (fieldInUse) {
            throw new AppError(
                `Field "${fieldExist.measurementName}" has saved measurements and cannot be removed`,
                400
            )
        }

        updatedField = template.fieldDefinitions.filter(field => field.fieldId !== deleteFieldId)


       
    }


    if (fields) {
        processNewFields = fields.map(field => ({
            fieldId: field.fieldId || field.measurementName
                .toLowerCase()
                .trim()
                .replace(/\s+/g, '_')
                .replace(/[^a-z0-9_]/g, ''),
            measurementName: field.measurementName.trim(),
            unit: field.unit
        }))

        const existingFieldIds = updatedField.map(f => f.fieldId)

        updatedField = updatedField.map(existing => {
            const update = processNewFields.find(f => f.fieldId === existing.fieldId)
            return update || existing
        })

        const newFields = processNewFields.filter(f => !existingFieldIds.includes(f.fieldId))

        updatedField = [...updatedField, ...newFields]
    }



    const updatedTemplate = await prisma.measurementTemplate.update({
        where: { id: templateId },
        data: { ...(newTemplateName ? { name: newTemplateName } : {}), fieldDefinitions: updatedField }

    })

    const actions = []
    if (newTemplateName) actions.push("renamed")
    if (fields) actions.push("fields updated")
    if (deleteFieldId) actions.push("fields deleted")

    return {
        message: `Template ${actions.join(", ")} successfully`,
        template: {
            id: updatedTemplate.id,
            name: updatedTemplate.name,
            fieldDefinitions: updatedTemplate.fieldDefinitions,
            createdAt: updatedTemplate.createdAt

        }
    }


}










module.exports = { createTemplate, getAllTemplates, updateTemplate }