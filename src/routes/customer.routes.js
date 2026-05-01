const express = require('express')
const router = express.Router()
const customerController = require('../controllers/customerController')
const measurementController = require("../controllers/measurementController")
const { authenticateToken, requireRole } = require('../middleware/auth')


router.post("/register", authenticateToken, customerController.createCustomer)

router.get("/", authenticateToken, customerController.getAllCustomers)

router.get("/:customerId", authenticateToken, customerController.getCustomerById)


router.post("/:customerId/measurements", authenticateToken, measurementController.createMeasurement)



module.exports = router