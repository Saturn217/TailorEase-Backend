const jwt = require('jsonwebtoken')
const adminService = require('../services/adminService')
const AppError = require('../utils/AppError')


const getAllCompanies = async (req, res, next) => {
    try {
        const { status, page, limit } = req.query
        const result = await adminService.getAllCompanies(status, page, limit)
        res.status(200).json(result)
    } catch (error) {
        next(error)

    }
}


const updateCompanyStatus = async (req, res, next) => {
    try {
        const { companyId } = req.params
        const { status } = req.body
        const result = await adminService.updateCompanyStatus(companyId, status)
        res.status(200).json(result)
    }

    catch (error) {
        next(error)
    }
}


const adminLogin = async (req, res, next) => {
    try {
        const { email, password } = req.body

        if (!email || !password) {

            throw new AppError( 'Email and password are required', 400)
        }

        if (email !== process.env.APP_ADMIN_EMAIL || password !== process.env.APP_ADMIN_PASSWORD) {
          throw new AppError('Invalid email or password', 401)

        }

        const token = jwt.sign({ email, isAppAdmin: true }, process.env.JWT_SECRET, { expiresIn: '7h' })
        res.status(200).json({
            message: 'Admin login successful',
            token
        })


    } catch (error) {
        next(error)
    }
}

module.exports = { adminLogin, getAllCompanies, updateCompanyStatus }