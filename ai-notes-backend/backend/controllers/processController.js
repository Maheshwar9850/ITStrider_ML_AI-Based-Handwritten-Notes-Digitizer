'use strict';

const path = require('path');
const { processPipeline } = require('../../ai/pipeline/process.pipeline');
const logger = require('../utils/logger');

/**
 * POST /process
 *
 * Accepts a multipart image upload and runs the full pipeline:
 *   OCR → OpenAI structuring → ML inference
 *
 * Request:
 *   Content-Type: multipart/form-data
 *   Fields:
 *     - image    (file, required) — handwritten note image
 *     - language (string, optional) — ISO 639-1 code, default "en"
 *
 * Response 200:
 *   {
 *     "success": true,
 *     "data": {
 *       "rawText":        "...",
 *       "structuredText": { "title": "...", "headings": [...], "summary": "..." },
 *       "mlResult":       "...",
 *       "confidence":     0.97
 *     }
 *   }
 */
const processNote = async (req, res) => {
  try {
    // ── Validate file ──────────────────────────────────────────────────────
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No image provided. Please upload an image file.',
      });
    }

    const imagePath = req.file.path;                        // absolute disk path (Multer sets this)
    const language  = (req.body.language || 'en').trim();  // optional language override

    logger.info('[PROCESS] Request received', {
      filename: req.file.originalname,
      size:     req.file.size,
      language,
    });

    // ── Run pipeline ───────────────────────────────────────────────────────
    const result = await processPipeline({ imagePath, language });

    logger.info('[PROCESS] Pipeline completed successfully', {
      title:      result.structuredText.title,
      confidence: result.confidence,
    });

    // ── Respond ────────────────────────────────────────────────────────────
    return res.status(200).json({
      success: true,
      data: {
        rawText:        result.rawText,
        structuredText: result.structuredText,
        mlResult:       result.mlResult,
        confidence:     result.confidence,
      },
    });

  } catch (error) {
    logger.error('[PROCESS] Pipeline failed', error);

    // Give the client a useful status code based on what failed
    const statusCode
      = error.message.includes('Step 1 (OCR)')  ? 422   // image couldn't be read
      : error.message.includes('Step 3 (ML)')   ? 502   // ML service unreachable
      : 500;

    return res.status(statusCode).json({
      success: false,
      message: error.message,
      ...(process.env.NODE_ENV === 'development' && { stack: error.stack }),
    });
  }
};

module.exports = { processNote };
