
const jwt = require('jsonwebtoken');
const AppError = require('../utils/AppError');


const authenticateToken = (req, res, next) => {

    const authheader = req.headers.authorization

    if (!authheader || !authheader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'No token provided, access denied' })
    }

    const token = authheader.split(' ')[1]
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        req.user = decoded
        next()
    } catch (error) {
        return res.status(401).json({ message: 'Invalid or expired token' })

    }

}

const requireRole = (role) => {

    return (req, res, next) => {
        if (req.user.role !== role) {
            return res.status(403).json({ message: 'You do not have permission to perform this action' })
        }

        next()
    }
        
}

module.exports = { authenticateToken, requireRole }