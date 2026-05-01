const express = require('express')
const { authenticateToken } = require('../middleware/auth')
const measurementController = require("../controllers/measurementController")

const router = express.Router()

router.post("/customers/:customerId/measurement", authenticateToken, measurementController.createMeasurement )

module.exports = router