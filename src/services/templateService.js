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
        template:{
            id: template.id,
            name: template.name,
            fieldDefinitions: template.fieldDefinitions,
            createdAt: template.createdAt
        }

    }
}







module.exports = {createTemplate}