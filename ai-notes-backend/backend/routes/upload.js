const express = require('express');
const router = express.Router();
const uploadController = require('../controllers/uploadController');
const { uploadSingleFile } = require('../utils/multer');

/**
 * Upload Image Route
 * POST /upload
 * Accepts multipart/form-data with 'image' field
 * Returns uploaded file path
 */
router.post('/', uploadSingleFile, uploadController.uploadImage);

module.exports = router;
