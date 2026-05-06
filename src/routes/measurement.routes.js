const express = require('express')
const { authenticateToken, requireRole } = require('../middleware/auth')
const measurementController = require("../controllers/measurementController")
const router = express.Router()

router.get("/", authenticateToken, requireRole("SUPER_ADMIN"), measurementController.getCompanyMeasurements )

module.exports = router