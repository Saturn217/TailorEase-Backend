
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const prisma = require("../utils/prisma");
const AppError = require('../utils/AppError');



const getAllCompanies = async (status, page, limit) => {
    const currentPage = parseInt(page) || 1
    const pageSize = parseInt(limit) || 10
    const skip = (currentPage - 1) * pageSize

    const [companies, totalCount] = await Promise.all([

        prisma.company.findMany({
            where: status ? { status } : {},
            select: {
                id: true,
                companyCode: true,
                companyImage: true,
                companyName: true,
                email: true,
                status: true,
                ownerFullname: true,
                ownerEmail: true,
                createdAt: true,
                _count: {
                    select: {
                        staff: true
                    }
                }
            },
            orderBy: { createdAt: 'desc' },
            skip,
            take: pageSize

        }),

        prisma.company.count({
            where: status ? { status } : {}

        })

    ])


    if (companies.length === 0) {
        throw new AppError('No companies found', 404)
    }

    return {
        message: 'Companies retrieved successfully',
        companies,
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


const updateCompanyStatus = async (companyId, status) => {

    const validStatuses = ['APPROVED', 'REJECTED', 'SUSPENDED']

    if (!validStatuses.includes(status)) {
        throw new AppError('Invalid status value', 400)
    }

    const company = await prisma.company.findUnique({
        where: { id: companyId }
    })

    if (!company) {
        throw new AppError('Company not found', 404)
    }

    if (company.status === status) {
        throw new AppError(`Company is already ${status.toLowerCase()}`, 400)
    }

    if (status === 'APPROVED') {
        await prisma.$transaction(async (tx) => {
            await tx.company.update({
                where: { id: companyId },
                data: { status }
            })


            await tx.staff.updateMany({
                where: { companyId: companyId, role: 'SUPER_ADMIN' },
                data: { status: 'APPROVED' }

            })
        })

        return { message: 'Company approved successfully' }

    }



    await prisma.$transaction(async (tx) => {
        await tx.company.update({
            where: { id: companyId },
            data: { status }
        })

        await tx.staff.updateMany({
            where: { companyId: companyId },
            data: { status: "SUSPENDED" }
        })

    })
    return {
        message: `Company ${status.toLowerCase()} successfully`
    }

}

module.exports = { getAllCompanies }