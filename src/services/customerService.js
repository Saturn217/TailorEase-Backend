
const prisma = require("../utils/prisma");
const AppError = require('../utils/AppError')


const createCustomer = async (companyId, staffId, data) => {
    const { fullName, email, phone } = data

    if (!fullName || !email) {
        throw new AppError('All fields are required', 400)
    }

    const existingCustomer = await prisma.customer.findFirst({
        where: { companyId, email }
    })

    if (existingCustomer) {
        throw new AppError('Customer with this email already exists', 409)
    }

    const customer = await prisma.customer.create({
        data: {
            fullName: fullName,
            email,
            phone: phone || null,
            companyId,
            createdBy: staffId
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
        message: 'Customer created successfully',
        customer: {
            id: customer.id,
            fullName: customer.fullName,
            email: customer.email,
            phone: customer.phone,
            createdAt: customer.createdAt,
            createdBy: {
                id: customer.createdByStaff.id,
                fullName: customer.createdByStaff.fullName,
                email: customer.createdByStaff.email
            }

        }
    }

}


const getAllCustomers = async (companyId, page, limit) => {
    const currentPage = parseInt(page) || 1
    const pageSize = parseInt(limit) || 10
    const skip = (currentPage - 1) * pageSize

    const [customers, totalCount] = await Promise.all([
        prisma.customer.findMany({
            where: { companyId },
            select: {
                id: true,
                fullName: true,
                email: true,
                phone: true,
                createdAt: true,
                createdBy: true,
                createdByStaff: {
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
        prisma.customer.count({
            where: { companyId }
        })
    ])


    if (customers.length === 0) {
        throw new AppError('No customers found', 404)
    }

    return {
        message: 'Customers retrieved successfully',
        customers,
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

const getCustomerById = async (companyId, customerId) => {

    const customer = await prisma.customer.findFirst({
        where: { id: customerId, companyId },

        select: {
            id: true,
            fullName: true,
            email: true,
            phone: true,
            createdAt: true,
            createdBy: true,
            companyId: true
        }
    })

    if (!customer) {
        throw new AppError('Customer not found', 404)
    }

    if (customer.companyId !== companyId) {
        throw new AppError('Unauthorized access to this customer', 403)
    }

    return {
        message: 'Customer retrieved successfully',
        customer: {
            id: customer.id,
            fullName: customer.fullName,
            email: customer.email,
            phone: customer.phone,
            createdAt: customer.createdAt,
            createdBy: customer.createdBy,
            companyId: customer.companyId
        }
    }

}





module.exports = { createCustomer, getAllCustomers, getCustomerById }