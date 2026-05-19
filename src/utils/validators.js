const AppError = require('./AppError')


const validatePassword = (password) => {
    if (password.length < 8) {
        throw new AppError('Password must be at least 8 characters', 400)
    }
    if (!/[A-Z]/.test(password)) {
        throw new AppError('Password must contain at least one uppercase letter', 400)
    }
    if (!/[0-9]/.test(password)) {
        throw new AppError('Password must contain at least one number', 400)
    }
}

const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
        throw new AppError('Invalid email format', 400)
    }
}


module.exports = {
    validatePassword,
    validateEmail
}