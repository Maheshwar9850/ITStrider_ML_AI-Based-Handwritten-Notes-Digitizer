'use strict';

const express = require('express');
const router = express.Router();
const { uploadSingleFile } = require('../utils/multer');
const { processNote } = require('../controllers/processController');

/**
 * POST /process
 *
 * Full end-to-end pipeline:
 *   Upload image → OCR → OpenAI structuring → ML inference → structured JSON
 *
 * Body: multipart/form-data
 *   - image    {File}   required — handwritten note image (JPEG/PNG/WebP/GIF, max 5MB)
 *   - language {string} optional — ISO 639-1 code (default: "en")
 *
 * Example with curl:
 *   curl -X POST http://localhost:5000/process \
 *        -F "image=@./note.jpg" \
 *        -F "language=en"
 */
router.post('/', uploadSingleFile, processNote);

module.exports = router;
