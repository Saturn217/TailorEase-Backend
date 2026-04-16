

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
        throw new Error('Email already exists')
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
                role: "SUPER_ADMIN"
            }
        })

        return { company, staff }

    })

    return {
        message: "Company registered successfully",
        companyCode: result.company.companyCode,
        companyName: result.company.companyName,
        email: result.company.email,
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
        throw  new AppError('Your account is awaiting approval from your company admin', 403)
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
            name: staff.fullName,
            email: staff.email,
            role: staff.role,
            status: staff.status,
            company: {
                id: staff.company.id,
                companyCode: staff.company.companyCode,
                companyName: staff.company.companyName,
            }
        }
    }

}

module.exports = { registerCompany, login }
