const prisma = require("../utils/prisma");
const AppError = require('../utils/AppError');
const sendEmail = require("../utils/email")
const { init } = require("../app");



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

    if(type ==="NEW" && parentOrderId) {
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

        initialNotes = [...initialNotes, newNote ]

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


module.exports = { createOrder }


