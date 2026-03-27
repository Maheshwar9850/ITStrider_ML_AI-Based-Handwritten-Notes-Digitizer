/**
 * Health Check Controller
 * Handles health check endpoints for the application
 */

const getHealth = (req, res) => {
  res.status(200).json({
    success: true,
    message: 'AI Notes Backend is running',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development',
    version: process.env.API_VERSION || '1.0.0'
  });
};

module.exports = {
  getHealth
};
