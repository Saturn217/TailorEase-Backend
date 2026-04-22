const jwt = require('jsonwebtoken')
const adminService = require('../services/adminService')
const AppError = require('../utils/AppError')


const getAllCompanies = async (req, res) => {
    try {
        const { status, page, limit } = req.query
        const result = await adminService.getAllCompanies(status, page, limit)
        res.status(200).json(result)
    } catch (error) {
        const statusCode = error.statusCode || 500
        res.status(statusCode).json({
            message: error.message
        })

    }
}


const updateCompanyStatus = async (req, res) => {
    try {
        const { companyId } = req.params
        const { status } = req.body
        const result = await adminService.updateCompanyStatus(companyId, status)
        res.status(200).json(result)
    }

    catch (error) {
        const statusCode = error.statusCode || 500
        res.status(statusCode).json({
            message: error.message
        })
    }
}


const adminLogin = async (req, res) => {
    try {
        const { email, password } = req.body

        if (!email || !password) {

            return res.status(400).json({ message: 'Email and password are required' })
        }

        if (email !== process.env.APP_ADMIN_EMAIL || password !== process.env.APP_ADMIN_PASSWORD) {
            return res.status(401).json({ message: 'Invalid email or password' })

        }

        const token = jwt.sign({ email, isAppAdmin: true }, process.env.JWT_SECRET, { expiresIn: '7h' })
        res.status(200).json({
            message: 'Admin login successful',
            token
        })


    } catch (error) {
        res.status(500).json({
            message: 'An error occurred during admin login',
            error: error.message
        })
    }
}

module.exports = { adminLogin, getAllCompanies, updateCompanyStatus }