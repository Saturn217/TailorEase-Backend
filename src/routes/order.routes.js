const express = require('express')
const { authenticateToken } = require('../middleware/auth')
const orderController = require('../controllers/orderController')
const router = express.Router()

router.post("/", authenticateToken, orderController.createOrder)



module.exports = router