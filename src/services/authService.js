

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const prisma = require("../utils/prisma");
const AppError = require('../utils/AppError');


const generateCompanyCode = () => {
    const number = Math.floor(Math.random() * 9000) + 1000
    return `TSE-${number}`
}

const registerCompany = async (data) => {


    const { companyName, email, companyImage, password, ownerFullname, ownerEmail, ownerPhone } = data;


    if (!companyName || !email || !password || !companyImage || !ownerFullname || !ownerEmail || !ownerPhone) {
        throw new Error('All fields are required')
    }

    const existingCompany = await prisma.company.findUnique({
        where: { email }
    })

    if (existingCompany) {
        throw new Error('Company Email already exists')
    }

    const existingStaff = await prisma.staff.findUnique({
        where: { email: ownerEmail }
    })

    if (existingStaff) {
        throw new Error('Owner email already exists')
    }


    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const companyCode = generateCompanyCode();


    const result = await prisma.$transaction(async (tx) => {
        const company = await tx.company.create({
            data: {
                companyCode,
                companyName,
                email,
                companyImage: companyImage || null,
                passwordHash: hashedPassword,
                status: 'PENDING',
                ownerFullname: ownerFullname,
                ownerEmail: ownerEmail,
                ownerPhone: ownerPhone
            }


        })

        const staff = await tx.staff.create({
            data: {
                companyId: company.id,
                fullName: ownerFullname,
                email: ownerEmail,
                passwordHash: hashedPassword,
                role: "SUPER_ADMIN",
                status: 'PENDING'
            }
        })

        return { company, staff }

    })

    return {
        message: "Company registered successfully",
        companyCode: result.company.companyCode,
        companyName: result.company.companyName,
        id: result.company.id,
        email: result.company.email,
        owner: {
            fullName: result.staff.fullName,
            email: result.staff.email,
            role: result.staff.role
        }
    }

}

const login = async (data) => {

    const { email, password } = data

    if (!email || !password) {
        throw new AppError('All fields are required', 400)
    }

    const staff = await prisma.staff.findUnique({
        where: { email },
        include: {
            company: true
        }
    })

    if (!staff) {
        throw new AppError('Invalid credentials', 401)
    }

    const isMatch = await bcrypt.compare(password, staff.passwordHash)
    if (!isMatch) {
        throw new AppError('Invalid credentials', 401)
    }


    if (staff.company.status === 'PENDING') {
        throw new AppError('Your company is awaiting platform approval', 403)
    }
    if (staff.company.status === 'REJECTED') {
        throw new AppError('Your company registration was rejected, contact support', 403)
    }
    if (staff.company.status === 'SUSPENDED') {
        throw new AppError('Your company account has been suspended, contact support', 403)
    }


    if (staff.status === 'PENDING') {
        throw new AppError('Your account is awaiting approval from your company admin', 403)
    }
    if (staff.status === 'REJECTED') {
        throw new AppError('Your account was rejected, contact your company admin', 403)
    }
    if (staff.status === 'SUSPENDED') {
        throw new AppError('Your account has been suspended, contact your company admin', 403)
    }

    const token = jwt.sign({ staffId: staff.id, companyId: staff.companyId, role: staff.role, status: staff.status }, process.env.JWT_SECRET, { expiresIn: '7h' })

    return {
        token,
        staff: {
            id: staff.id,
            fullName: staff.fullName,
            email: staff.email,
            role: staff.role,
            status: staff.status,
            createdAt: staff.createdAt,
            company: {
                id: staff.company.id,
                companyCode: staff.company.companyCode,
                companyName: staff.company.companyName,
            }
        }
    }

}

const registerStaff = async (data) => {


    const { companyCode, fullName, email, password, phone } = data
    if (!companyCode || !fullName || !email || !password) {
        throw new AppError('All fields are required', 400)
    }


    const company = await prisma.company.findUnique({
        where: { companyCode }
    })
    if (!company) {
        throw new AppError('Company not found', 404)
    }

    if (company.status !== 'APPROVED') {
        throw new AppError('This company is not active', 403)
    }

    const existingStaff = await prisma.staff.findUnique({
        where: { email }
    })
    if (existingStaff) {
        throw new AppError('Email already exists', 409)
    }



    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const staff = await prisma.staff.create({
        data: {
            fullName,
            email,
            companyId: company.id,
            passwordHash: hashedPassword,
            phone: phone || null,
            role: "STAFF",
            status: "PENDING",
            createdAt: new Date()

        }
    })

    return {
        message: "Staff registered successfully, awaiting company admin approval",
        staff: {
            id: staff.id,
            fullName: staff.fullName,
            email: staff.email,
            role: staff.role,
            status: staff.status,
            createdAt: staff.createdAt,
            company: {
                id: company.id,
                companyName: company.companyName,
            }
        }
    }

}

module.exports = { registerCompany, login, registerStaff }
