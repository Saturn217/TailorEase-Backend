const prisma = require("../utils/prisma")
const AppError = require("../utils/AppError")

const createMeasurement = async (companyId, staffId, customerId, data) => {
    const { templateId, values, notes, unit } = data

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
        where: { id: templateId, companyId },

    })

    if (!template) {
        throw new AppError("Template not found", 404)
    }

    const validFieldIds = template.fieldDefinitions.map(f => f.fieldId)
    const invalidKeys = Object.keys(values).filter(key => !validFieldIds.includes(key))   // return values that are not included in the fild id

    if (invalidKeys.length > 0) {
        throw new AppError(`Invalid field keys: ${invalidKeys.join(', ')}. Use fieldId as key`,
            400)
    }

    const nonNumberValues = Object.entries(values).filter(([key, value]) => value !== null && typeof value !== "number")
    if (nonNumberValues.length > 0) {
        const invalidFields = nonNumberValues.map(([key]) => key).join(", ")
        throw new AppError(
            `Values must be numbers. Invalid fields: ${invalidFields}`,
            400
        )

    }

    const negativeValues = Object.entries(values).filter(([key, value]) => value !== null && value <= 0)

    if (negativeValues.length > 0) {
        const invalidValue = negativeValues.map(([key]) => key).join(", ")
        throw new AppError(
            `Values must be positive numbers. Invalid fields: ${invalidValue}`,
            400
        )

    }


    const snapshot = template.fieldDefinitions

    const measurement = await prisma.measurement.create({
        data: {
            customerId,
            templateId,
            values,
            snapshot,
            unit: unit || "cm",
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
            },
            template: {
                select: {
                    name: true
                }
            },
            customer: {
                select: {
                    fullName: true,
                    email: true
                }
            }

        }

    })
    return {
        message: "Measurement created successfully",
        measurement: {
            id: measurement.id,
            customerId: measurement.customerId,
            templateId: measurement.templateId,
            templateName: measurement.template.name,
            values: measurement.values,
            snapshot: measurement.snapshot,
            unit: measurement.unit,
            notes: measurement.notes,
            createdAt: measurement.createdAt,
            updatedAt: measurement.updatedAt,
            createdBy: {
                id: measurement.createdByStaff.id,
                fullName: measurement.createdByStaff.fullName,
                email: measurement.createdByStaff.email
            },
            customer: {
                fullName: measurement.customer.fullName,
                email: measurement.customer.email
            }
        }


    }
}


const getCustomerMeasurements = async (companyId, customerId, page, limit) => {
    const currentPage = parseInt(page) || 1
    const pageSize = parseInt(limit) || 10
    const skip = (currentPage - 1) * pageSize

    const customer = await prisma.customer.findFirst({
        where: { id: customerId, companyId }
    })

    if (!customer) {
        throw new AppError("Customer not found", 404)
    }

    const [measurement, totalCount] = await Promise.all([
        prisma.measurement.findMany({
            where: { customerId, customer: { companyId } },
            select: {
                id: true,
                customerId: true,
                templateId: true,
                values: true,
                snapshot: true,
                unit: true,
                notes: true,
                createdAt: true,
                updatedAt: true,
                customer: {
                    select: {
                        id: true,
                        fullName: true,
                        email: true
                    }
                },
                template: {
                    select: {
                        name: true
                    }
                },
                createdByStaff: {
                    select: {
                        id: true,
                        fullName: true,
                        email: true

                    }
                },
                updatedByStaff: {
                    select: {
                        id: true,
                        fullName: true,
                        email: true

                    }
                }


            },
            orderBy: { createdAt: 'desc' },
            skip,
            take: pageSize,

        }),
        prisma.measurement.count({
            where: {
                customerId, customer: { companyId }

            }
        })
    ])

    if (measurement.length === 0) {
        throw new AppError("There are no measurement found", 404)
    }

    return {
        message: "Measurements retrieved successfully",
        measurement,
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



const getCompanyMeasurements = async (companyId, page, limit) => {
    const currentPage = parseInt(page) || 1
    const pageSize = parseInt(limit) || 10
    const skip = (currentPage - 1) * pageSize

    const [measurement, totalCount] = await Promise.all([
        prisma.measurement.findMany({
            where: { customer: { companyId } },
            select: {
                id: true,
                customerId: true,
                templateId: true,
                values: true,
                snapshot: true,
                unit: true,
                notes: true,
                createdAt: true,
                updatedAt: true,
                customer: {
                    select: {
                        id: true,
                        fullName: true,
                        email: true
                    }
                },
                template: {
                    select: {
                        name: true
                    }
                },
                createdByStaff: {
                    select: {
                        id: true,
                        fullName: true,
                        email: true

                    }
                },
                updatedByStaff: {
                    select: {
                        id: true,
                        fullName: true,
                        email: true

                    }
                }


            },
            orderBy: { createdAt: 'desc' },
            skip,
            take: pageSize,

        }),
        prisma.measurement.count({
            where: { customer: { companyId } },
        })
    ])

    if (measurement.length === 0) {
        throw new AppError("There are no measurement found", 404)
    }

    return {
        message: "Measurements retrieved successfully",
        measurement,
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

const updateMeasurement = async (companyId, staffId, customerId, measurementId, data) => {

    // console.log('companyId:', companyId)
    // console.log('staffId:', staffId)
    // console.log('customerId:', customerId)
    // console.log('measurementId:', measurementId)
    const { values, note } = data


    if (!values && !note) {
        throw new AppError("Values or note are required", 400)
    }
   
    const customer = await prisma.customer.findFirst({
        where: { id: customerId, companyId }
    })



    if (!customer) {
        throw new AppError("Customer not found", 404)
    }

    const measurement = await prisma.measurement.findFirst({
        where: { id: measurementId }
    })

    if (!measurement) {
        throw new AppError("Measurement not found for this customer", 404)
    }


    const template = await prisma.measurementTemplate.findFirst({
        where: { id: measurement.templateId, companyId }
    })

    if (!template) {
        throw new AppError('Template not found', 404)
    }



    if (values) {

        if (typeof values !== "object" || Array.isArray(values))
            throw new AppError('Values must be an object', 400)

        const validFieldIds = template.fieldDefinitions.map(f => f.fieldId)
        const invalidKeys = Object.keys(values).filter(key => !validFieldIds.includes(key))
        if (invalidKeys.length > 0) {
            throw new AppError(`Invalid field keys: ${invalidKeys.join(', ')}. Use fieldId as key`,
                400)
        }

        const nonNumberValues = Object.entries(values).filter(([key, value]) => value !== null && typeof value !== "number")
        if (nonNumberValues.length > 0) {
            const invalidFields = nonNumberValues.map(([key]) => key).join(", ")
            throw new AppError(
                `Values must be numbers. Invalid fields: ${invalidFields}`,
                400
            )
        }

        const negativeValues = Object.entries(values).filter(([key, value]) => value !== null && value <= 0)

        if (negativeValues.length > 0) {
            const invalidValue = negativeValues.map(([key]) => key).join(", ")
            throw new AppError(
                `Values must be positive numbers. Invalid fields: ${invalidValue}`,
                400
            )

        }

    }


    let updatedValues = values ? { ...measurement.values, ...values } : measurement.values

    const staff = await prisma.staff.findUnique({
        where: { id: staffId },
        select: { fullName: true }
    })

    let updatedNotes = Array.isArray(measurement.notes) ? measurement.notes : []
    if (note) {

        const newNote = {
            note,
            addedBy: staffId,
            addedByName: staff.fullName,
            addedAt: new Date().toISOString()
        }

        updatedNotes = [...updatedNotes, newNote]
    }



    const updatedMeasurement = await prisma.measurement.update({
        where: { id: measurementId },
        data: { values: updatedValues, notes: updatedNotes, snapshot: template.fieldDefinitions, updatedBy: staffId },
        include: {
            updatedByStaff: {
                select: {
                    id: true,
                    fullName: true,
                    email: true
                }
            },
            template: {
                select: {
                    id: true,
                    name: true
                }
            },

            customer: {
                select: {
                    id: true,
                    fullName: true
                }
            }
        }

    })

    return {
        message: "Measurement updated successfully",
        measurement: {
            id: updatedMeasurement.id,
            customerId: updatedMeasurement.customerId,
            customerName: updatedMeasurement.customer.fullName,
            templateId: updatedMeasurement.templateId,
            templateName: updatedMeasurement.template.name,
            unit: updatedMeasurement.unit,
            notes: updatedMeasurement.notes,
            values: updatedMeasurement.values,
            snapshot: updatedMeasurement.snapshot,
            updatedAt: updatedMeasurement.updatedAt,
            updatedBy: {
                id: updatedMeasurement.updatedByStaff.id,
                fullName: updatedMeasurement.updatedByStaff.fullName,
                email: updatedMeasurement.updatedByStaff.email
            }
        }
    }

}








module.exports = { createMeasurement, getCustomerMeasurements, getCompanyMeasurements, updateMeasurement }