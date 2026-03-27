const express = require('express');
const router = express.Router();
const healthController = require('../controllers/healthController');

/**
 * Health Check Route
 * GET /
 * Returns the health status of the API
 */
router.get('/', healthController.getHealth);

module.exports = router;
