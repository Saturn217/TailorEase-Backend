
const jwt = require('jsonwebtoken')



const isAppAdmin = (req, res, next) => {

    const authHeader = req.headers.authorization

    if (!authHeader || !authHeader.startsWith("Bearer")) {
        return res.status(401).json({ message: 'Unauthorized' })
    }

    const token = authHeader.split(" ")[1]

    try {

        const decoded = jwt.verify(token, process.env.JWT_SECRET)

        if (!decoded.isAppAdmin) {
            return res.status(403).json({ message: 'Access denied, platform admin only' })
        }

        req.admin = decoded
        next()


    } catch (error) {
        return res.status(401).json({ message: 'Invalid or expired token' })
    }
}

module.exports =  isAppAdmin 