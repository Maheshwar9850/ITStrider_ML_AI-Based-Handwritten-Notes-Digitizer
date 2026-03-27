const express = require('express');
const path = require('path');
const cors = require('cors');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from uploads directory
// __dirname = backend/config  →  ../../uploads = project root /uploads
app.use('/uploads', express.static(path.join(__dirname, '../../uploads')));

// Routes
const healthRoutes  = require('../routes/health');
const uploadRoutes  = require('../routes/upload');
const processRoutes = require('../routes/process');

app.use('/', healthRoutes);
app.use('/upload', uploadRoutes);
app.use('/process', processRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
    path: req.originalUrl
  });
});

// Error handler middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

module.exports = app;
