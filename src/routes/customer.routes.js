const express = require('express')
const router = express.Router()
const customerController = require('../controllers/customerController')
const measurementController = require("../controllers/measurementController")
const orderController = require('../controllers/orderController')
const { authenticateToken, requireRole } = require('../middleware/auth')


router.post("/register", authenticateToken, customerController.createCustomer)

router.get("/", authenticateToken, customerController.getAllCustomers)

router.get("/:customerId", authenticateToken, customerController.getCustomerById)


router.post("/:customerId/measurements", authenticateToken, measurementController.createMeasurement)

router.get("/:customerId/measurements", authenticateToken, measurementController.getCustomerMeasurements)


router.patch("/:customerId/measurements/:measurementId", authenticateToken, measurementController.updateMeasurement)


// orders

router.post("/:customerId/orders", authenticateToken, orderController.createOrder)


module.exports = router