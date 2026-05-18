const prisma = require("../utils/prisma");
const AppError = require('../utils/AppError');
const sendEmail = require("../utils/email")
const { init, get } = require("../app");
const { registerCompany } = require("../controllers/authController");



const createOrder = async (companyId, staffId, customerId, data) => {
    const { title, type, parentOrderId, note } = data

    if (!title || !type) {
        throw new AppError('Title and type are required', 400)
    }

    if (type !== "NEW" && type !== "AMENDMENT") {
        throw new AppError('Invalid order type', 400)
    }

    if (type === "AMENDMENT" && !parentOrderId) {
        throw new AppError('parentOrderId is required for amendment orders', 400)
    }

    if (type === "NEW" && parentOrderId) {
        throw new AppError('parentOrderId should not be provided for new orders', 400)
    }

    if (parentOrderId) {
        const parentOrder = await prisma.order.findFirst({
            where: { id: parentOrderId, companyId, customerId }
        })
        if (!parentOrder) {
            throw new AppError('Parent order not found for this customer', 404)
        }
    }


    const customer = await prisma.customer.findFirst({
        where: { id: customerId, companyId },
        select: { fullName: true, email: true }

    })
    if (!customer) {
        throw new AppError('Customer not found', 404)
    }


    const staff = await prisma.staff.findUnique({
        where: { id: staffId },
        select: {
            id: true,
            fullName: true,
            email: true
        }
    })



    let initialNotes = []
    if (note) {
        const newNote = {
            note,
            addedBy: staffId,
            addedByName: staff.fullName,
            addedAt: new Date().toISOString()
        }

        initialNotes = [...initialNotes, newNote]

    }

    const order = await prisma.order.create({
        data: {
            title,
            type,
            companyId,
            customerId,
            staffId,
            notes: initialNotes,
            status: "RECEIVED",
            parentOrderId: parentOrderId || null

        }
    })

    await sendEmail({
        to: customer.email,
        subject: 'Order received',
        html: `<p>Hi ${customer.fullName}, your order "${title}" has been received</p>`
    })

    return {
        message: 'Order created successfully',
        order: {
            id: order.id,
            title: order.title,
            type: order.type,
            status: order.status,
            customerId: order.customerId,
            customerName: customer.fullName,
            createdBy: staff.fullName,
            createdAt: order.createdAt,
            notes: order.notes
        }
    }

}

const getCompanyOrders = async (companyId, customerId, type, status, page, limit) => {
    const currentPage = parseInt(page) || 1
    const pageSize = parseInt(limit) || 10
    const skip = (currentPage - 1) * pageSize

    const [orders, totalCount] = await Promise.all([
        prisma.order.findMany({
            where: { companyId, ...(customerId ? { customerId } : {}), ...(type ? { type } : {}), ...(status ? { status } : {}) },
            select: {
                id: true,
                title: true,
                type: true,
                status: true,
                createdAt: true,
                updatedAt: true,
                staffId: true,
                notes: true,
                customerId: true,
                customer: {
                    select: {
                        fullName: true
                    }
                },
                staff: {
                    select: {
                        fullName: true
                    }
                },

            },
            orderBy: { createdAt: 'desc' },
            skip,
            take: pageSize
        }),
        prisma.order.count({
            where: {
                companyId, ...(customerId ? { customerId } : {}),
                ...(type ? { type } : {}),
                ...(status ? { status } : {})
            }
        })


    ])

    if (orders.length === 0) {
        throw new AppError('No orders found', 404)
    }


    return {
        message: 'Orders retrieved successfully',
        orders,
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


const getCustomerOrders = async (companyId, customerId, type, status, page, limit) => {
    const currentPage = parseInt(page) || 1
    const pageSize = parseInt(limit) || 10
    const skip = (currentPage - 1) * pageSize

    const customer = await prisma.customer.findFirst({
        where: { id: customerId, companyId },
        select: { fullName: true }

    })

    if (!customer) {
        throw new AppError("No customer found", 404)
    }

    const [order, totalCount] = await Promise.all([
        prisma.order.findMany({
            where: { companyId, customerId, ...(type ? { type } : {}), ...(status ? { status } : {}) },
            select: {
                id: true,
                customerId: true,
                title: true,
                type: true,
                status: true,
                createdAt: true,
                updatedAt: true,
                staffId: true,
                notes: true,

                staff: {
                    select: {
                        fullName: true
                    }
                },
                parentOrderId: true

            },
            orderBy: { createdAt: 'desc' },
            skip,
            take: pageSize


        }),
        prisma.order.count({
            where: { companyId, customerId, ...(type ? { type } : {}), ...(status ? { status } : {}) }
        })
    ])

    if (order.length === 0) {
        throw new AppError("No orders found for this customer", 404)
    }

    return {
        message: 'Orders retrieved successfully',
        customerName: customer.fullName,
        orders: order,
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

const updateOrderStatus = async (companyId, staffId, role, orderId, status) => {
    const validStatuses = ["RECEIVED", "CUT_IN_PROGRESS", "SEWING_IN_PROGRESS", "FINISHING", "COMPLETED"]

    if (!validStatuses.includes(status)) {
        throw new AppError("Invalid Status", 400)
    }

    if (role === "STAFF" && status === "COMPLETED") {
        throw new AppError('Only super admin can mark an order as completed', 403)

    }

    const order = await prisma.order.findFirst({
        where: { id: orderId, companyId },
        select: {
            id: true,
            title: true,
            status: true,
            createdAt: true,
            updatedAt: true,
            staff: {
                select: {
                    id: true,
                    fullName: true
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

    if (!order) {
        throw new AppError("Order not found", 404)
    }

    if (order.status === status) {
        throw new AppError(`Order is already in ${status} status`, 400)
    }

    const StatusMessage = {
        RECEIVED: "Order has been received",
        CUT_IN_PROGRESS: "Order is being cut",
        SEWING_IN_PROGRESS: "Order is beign sewn",
        FINISHING: "Order is in finishing stage",
        COMPLETED: "Order is ready for pickup",

    }

    let newStatusHistory
    await prisma.$transaction(async (tx) => {
        await tx.order.update({
            where: { id: orderId },
            data: { status }
        })

        newStatusHistory = await tx.statusHistory.create({
            data: {
                orderId,
                status,
                updatedById: staffId
            }
        })
    })


    if (status === "COMPLETED") {

        await sendEmail({
            to: order.customer.email,
            subject: 'Order completed',
            html: `<p>Hi ${order.customer.fullName}, your order "${order.title}" is ready for pickup</p>`
        })
    }


    return {
        message: StatusMessage[status],
        order: {
            id: order.id,
            title: order.title,
            previousStatus: order.status,
            newStatus: status,
            updatedBy: {
                id: staffId,
                fullName: order.staff.fullName
            },
            orderCreatedAt: order.createdAt,
            orderUpdatedAt: order.updatedAt

        },
        statusHistory: {
            orderId: newStatusHistory.orderId,
            status: newStatusHistory.status,
            updatedById: newStatusHistory.updatedById,
            createdAt: newStatusHistory.createdAt
        }


    }



}





module.exports = { createOrder, getCompanyOrders, getCustomerOrders, updateOrderStatus }

