const prisma = require("../utils/prisma")
const AppError = require("../utils/AppError")

const createMeasurement = async (companyId, staffId, customerId, data) => {
    const { templateId, values, notes } = data

    if (!templateId || !values) {
        throw new AppError("Template and values are required", 400)

    }
    if (typeof values !== "object" || Array.isArray(values)) {
        throw new AppError('Values must be an object', 400)

    }

    const validUnits = ['cm', 'inches']
    if (unit && !validUnits.includes(unit)) {
        throw new AppError('Unit must be cm or inches', 400)
    }


    const customer = await prisma.customer.findFirst({
        where: { id: customerId, companyId }
    })

    if (!customer) {
        throw new AppError("Customer not found", 404)

    }

    const template = await prisma.measurementTemplate.findFirst({
        where: { id: templateId, companyId }
    })

    if (!template) {
        throw new AppError("Template not found", 404)
    }

    const snapshot = template.fieldDefinitions

    const measurement = await prisma.measurement.create({
        data: {
            customerId,
            templateId,
            values,
            snapshot,
            notes: notes || null,
            createdBy: staffId,


        },
        include: {
            createdByStaff: {
                select: {
                    id: true,
                    fullName: true,
                    email: true,
                }
            }

        }

    })
    return {
        message: "Measurement created successfully",
        measurement: {
            customerId: measurement.customerId,
            templateId: measurement.templateId,
            values: measurement.values,
            snapshot: measurement.snapshot,
            notes: measurement.notes,
            createdAt: measurement.createdAt,
            updatedAt: measurement.updatedAt,
            createdBy: {
                id: measurement.createdByStaff.id,
                fullName: measurement.createdByStaff.fullName,
                email: measurement.createdByStaff.email
            }
        }


    }
}











module.exports = { createMeasurement }