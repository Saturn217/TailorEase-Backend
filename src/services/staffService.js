
const prisma = require("../utils/prisma");
const AppError = require('../utils/AppError')




const getAllStaff = async (companyId, status, page, limit) => {
    const currentPage = parseInt(page) || 1
    const pageSize = parseInt(limit) || 10
    const skip = (currentPage - 1) * pageSize

    const [staff, totalCount] = await Promise.all([
        prisma.staff.findMany({
            where: { companyId, role: "STAFF", ...(status ? { status } : {}) },
            select: {
                id: true,
                fullName: true,
                email: true,
                phone: true,
                role: true,
                status: true,
                createdAt: true,
            },
            orderBy: { createdAt: 'desc' },
            skip,
            take: pageSize

        }),

        prisma.staff.count({
            where: { companyId, role: "STAFF", ...(status ? { status } : {}) },
        })

    ])



    if (staff.length === 0) {
        throw new AppError('No staff found', 404)
    }

    return {
        message: 'Staff retrieved successfully',
        staff,
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

const updateStaffStatus = async (companyId, staffId, status) => {
    const validStatuses = ["APPROVED", "REJECTED", "SUSPENDED"]

    if (!validStatuses.includes(status)) {
        throw new AppError('Invalid status value', 400)
    }

    const staff = await prisma.staff.findUnique({
        where: { id: staffId }
    })

    if (!staff) {
        throw new AppError('Staff not found', 404)
    }

    if (staff.companyId !== companyId) {
        throw new AppError('Unauthorized to update this staff member', 403)
    }

    if (staff.role === "SUPER_ADMIN") {
        throw new AppError('Cannot change status of a super admin', 403)
    }

    if (staff.status === status) {
        throw new AppError(`Staff is already ${status.toLowerCase()}`, 400)
    }


    const updatedStaff = await prisma.staff.update({
        where: {id: staffId },
        data: { status }
    })

    return {
        message: 'Staff status updated successfully',
        staff: {
            id: updatedStaff.id,
            fullName: updatedStaff.fullName,
            email: updatedStaff.email,
            phone: updatedStaff.phone,
            role: updatedStaff.role,
            status: updatedStaff.status,
            createdAt: updatedStaff.createdAt
        }
    }
}


module.exports = { getAllStaff, updateStaffStatus }


