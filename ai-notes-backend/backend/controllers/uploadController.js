/**
 * Upload Controller
 * Handles file upload operations
 */

const path = require('path');
const logger = require('../utils/logger');

/**
 * Upload single image file
 * POST /upload
 * Expects multipart/form-data with 'image' field
 */
const uploadImage = (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file provided. Please upload an image file.'
      });
    }

    const filePath = `/uploads/${req.file.filename}`;

    logger.info('File uploaded successfully', {
      filename: req.file.filename,
      originalName: req.file.originalname,
      size: req.file.size,
      path: filePath
    });

    res.status(200).json({
      success: true,
      message: 'File uploaded successfully',
      data: {
        filename: req.file.filename,
        originalName: req.file.originalname,
        size: req.file.size,
        path: filePath,
        uploadedAt: new Date().toISOString()
      }
    });
  } catch (error) {
    logger.error('File upload error', error);
    res.status(500).json({
      success: false,
      message: 'File upload failed',
      error: error.message
    });
  }
};

module.exports = {
  uploadImage
};
