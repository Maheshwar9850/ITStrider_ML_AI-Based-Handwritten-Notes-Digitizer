'use strict';

const { createWorker } = require('tesseract.js');
const path = require('path');
const fs = require('fs');

// ---------------------------------------------------------------------------
// Configuration
// ---------------------------------------------------------------------------

/**
 * Tesseract OCR parameters tuned for handwritten notes.
 *
 * PSM (Page-Segmentation-Mode) values:
 *   6  – Assume a single uniform block of text  (good default)
 *   11 – Sparse text; find as much text as possible  (better for notes)
 *
 * OEM (OCR-Engine-Mode) values:
 *   1  – Neural-net LSTM only  (most accurate)
 */
const DEFAULT_OCR_CONFIG = {
  // LSTM engine only – most accurate for modern text and handwriting
  tessedit_ocr_engine_mode: '1',
  // Sparse text mode – best for handwritten notes that aren't neatly arranged
  tessedit_pageseg_mode: '11',
  // Preserve interword spaces
  preserve_interword_spaces: '1',
};

/**
 * Supported language packs.
 * Add new language codes here and pass the key to extractText().
 *
 * Language codes must match Tesseract's traineddata names:
 *   https://github.com/naptha/tessdata/tree/gh-pages/4.0.0
 */
const SUPPORTED_LANGUAGES = {
  en: 'eng',
  fr: 'fra',
  de: 'deu',
  es: 'spa',
  hi: 'hin',
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function resolveLanguage(languageKey = 'en') {
  const lang = SUPPORTED_LANGUAGES[languageKey.toLowerCase()];
  if (!lang) {
    const supported = Object.keys(SUPPORTED_LANGUAGES).join(', ');
    throw new Error(
      `Unsupported language "${languageKey}". Supported keys: ${supported}`
    );
  }
  return lang;
}

function validateImagePath(imagePath) {
  if (!imagePath || typeof imagePath !== 'string') {
    throw new Error('imagePath must be a non-empty string.');
  }
  const resolved = path.resolve(imagePath);
  if (!fs.existsSync(resolved)) {
    throw new Error(`Image file not found: ${resolved}`);
  }
  try {
    fs.accessSync(resolved, fs.constants.R_OK);
  } catch {
    throw new Error(`Image file is not readable: ${resolved}`);
  }
  return resolved;
}

// ---------------------------------------------------------------------------
// Core service
// ---------------------------------------------------------------------------

/**
 * Extract text from an image of handwritten notes using Tesseract OCR.
 *
 * @param {string} imagePath   - Absolute or relative path to the image file.
 * @param {string} [language]  - Short language key (default: 'en').
 * @returns {Promise<string>}  - Extracted text, trimmed.
 * @throws {Error}             - On invalid input, missing file, or OCR failure.
 *
 * @example
 * const { extractText } = require('./ai/services/ocr.service');
 * const text = await extractText('/uploads/note.jpg');
 * const frenchText = await extractText('/uploads/note.jpg', 'fr');
 */
async function extractText(imagePath, language = 'en') {
  const resolvedPath = validateImagePath(imagePath);
  const tessLang = resolveLanguage(language);

  console.log(`[OCR] Starting extraction | file="${resolvedPath}" lang="${tessLang}"`);

  let worker = null;

  try {
    worker = await createWorker(tessLang, 1 /* OEM.LSTM_ONLY */, {
      logger: (m) => {
        if (m.status === 'recognizing text') {
          console.log(`[OCR] Progress: ${Math.round(m.progress * 100)}%`);
        }
      },
    });

    await worker.setParameters(DEFAULT_OCR_CONFIG);

    const { data } = await worker.recognize(resolvedPath);
    const extractedText = (data.text || '').trim();

    console.log(
      `[OCR] Extraction complete | confidence=${data.confidence?.toFixed(1)}% | chars=${extractedText.length}`
    );

    return extractedText;
  } catch (err) {
    const message = `[OCR] Failed to extract text from "${resolvedPath}": ${err.message}`;
    console.error(message);
    throw new Error(message);
  } finally {
    if (worker) {
      try {
        await worker.terminate();
      } catch (terminateErr) {
        console.warn(`[OCR] Worker termination warning: ${terminateErr.message}`);
      }
    }
  }
}

// ---------------------------------------------------------------------------
// Exports
// ---------------------------------------------------------------------------

module.exports = {
  extractText,
  SUPPORTED_LANGUAGES,
};
