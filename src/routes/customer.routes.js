const express = require('express')
 const router = express.Router()
const customerController = require('../controllers/customerController')
const { aunthenticateToken, requireRole } = require('../middleware/auth')


router.post("/register", aunthenticateToken, customerController.createCustomer)

router.get("/", aunthenticateToken, customerController.getAllCustomers)

router.get("/:customerId", aunthenticateToken, customerController.getCustomerById)



 module.exports = router