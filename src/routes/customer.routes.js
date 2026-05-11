const express = require('express')
const router = express.Router()
const customerController = require('../controllers/customerController')
const measurementController = require("../controllers/measurementController")
const { authenticateToken, requireRole } = require('../middleware/auth')


router.post("/register", authenticateToken, customerController.createCustomer)

router.get("/", authenticateToken, customerController.getAllCustomers)

router.get("/:customerId", authenticateToken, customerController.getCustomerById)


router.post("/:customerId/measurements", authenticateToken, measurementController.createMeasurement)

router.get("/:customerId/measurements", authenticateToken, measurementController.getCustomerMeasurements)

// router.patch("/:customerId/measurements/:measurementId", authenticateToken, measurementController.updateMeasurement)
router.patch("/:customerId/measurements/:measurementId", authenticateToken, (req, res, next) => {
  console.log('Route hit')
  console.log('params:', req.params)
  next()
}, measurementController.updateMeasurement)


module.exports = router