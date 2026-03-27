'use strict';

const axios = require('axios');
const { extractText } = require('../services/ocr.service');
const { processText } = require('../services/ai.service');

// ---------------------------------------------------------------------------
// Configuration
// ---------------------------------------------------------------------------

/**
 * Base URL of the Python ML service.
 * Defaults to http://localhost:3000 — override via ML_SERVICE_URL in .env
 */
const ML_SERVICE_URL = (process.env.ML_SERVICE_URL || 'http://localhost:3000').replace(/\/$/, '');

// Timeout for ML service requests (ms)
const ML_REQUEST_TIMEOUT_MS = 15_000;

// ---------------------------------------------------------------------------
// Step helpers (isolated for testability)
// ---------------------------------------------------------------------------

/**
 * Step 1 — OCR: extract raw text from image.
 * @param {string} imagePath
 * @param {string} language
 * @returns {Promise<string>} rawText
 */
async function stepOcr(imagePath, language) {
  console.log(`[PIPELINE] Step 1 — OCR started | file="${imagePath}" lang="${language}"`);
  const rawText = await extractText(imagePath, language);
  console.log(`[PIPELINE] Step 1 — OCR done | extracted ${rawText.length} chars`);
  return rawText;
}

/**
 * Step 2 — AI: clean and structure raw OCR text via OpenAI.
 * @param {string} rawText
 * @returns {Promise<{ title: string, headings: Array, summary: string }>} structuredText
 */
async function stepAi(rawText) {
  console.log(`[PIPELINE] Step 2 — AI processing started | inputLength=${rawText.length} chars`);
  const structuredText = await processText(rawText);
  console.log(`[PIPELINE] Step 2 — AI processing done | title="${structuredText.title}" sections=${structuredText.headings.length}`);
  return structuredText;
}

/**
 * Step 3 — ML: send structured summary text to the Python ML service.
 * @param {string} text      — plain text to send (uses structuredText.summary)
 * @param {string} language
 * @returns {Promise<{ result: string, confidence: number, language: string }>}
 */
async function stepMl(text, language) {
  const endpoint = `${ML_SERVICE_URL}/predict/`;
  const payload = { text, language };

  console.log(`[PIPELINE] Step 3 — ML request sent | url="${endpoint}" lang="${language}"`);

  const response = await axios.post(endpoint, payload, {
    timeout: ML_REQUEST_TIMEOUT_MS,
    headers: { 'Content-Type': 'application/json' },
  });

  const mlResult = response.data;
  console.log(
    `[PIPELINE] Step 3 — ML response received | confidence=${mlResult.confidence} result="${String(mlResult.result).slice(0, 80)}..."`
  );

  return mlResult;
}

// ---------------------------------------------------------------------------
// Main pipeline
// ---------------------------------------------------------------------------

/**
 * End-to-end processing pipeline:
 *   Image → OCR (Tesseract) → AI Structuring (GPT-4o-mini) → ML Inference (FastAPI)
 *
 * @param {object}  options
 * @param {string}  options.imagePath  - Path to the handwritten note image.
 * @param {string}  [options.language] - Short language code (default: 'en').
 *
 * @returns {Promise<{
 *   rawText:        string,
 *   structuredText: { title: string, headings: Array<{ heading: string, bullets: string[] }>, summary: string },
 *   mlResult:       string,
 *   confidence:     number
 * }>}
 *
 * @throws {Error}  Any step failure is caught, logged with context, and re-thrown
 *                  with a clear pipeline-level message.
 *
 * @example
 * const { processPipeline } = require('./ai/pipeline/process.pipeline');
 *
 * const result = await processPipeline({ imagePath: './uploads/note.jpg' });
 * console.log(result.structuredText.title);
 * console.log(result.mlResult);
 * console.log(result.confidence);
 */
async function processPipeline({ imagePath, language = 'en' }) {
  console.log(`\n[PIPELINE] ── Starting pipeline ──────────────────────────────`);
  console.log(`[PIPELINE] imagePath="${imagePath}" | language="${language}"`);

  let rawText;
  let structuredText;
  let mlResponse;

  // ── Step 1: OCR ──────────────────────────────────────────────────────────
  try {
    rawText = await stepOcr(imagePath, language);
  } catch (err) {
    throw new Error(`[PIPELINE] Step 1 (OCR) failed: ${err.message}`);
  }

  if (!rawText || rawText.trim().length === 0) {
    throw new Error('[PIPELINE] Step 1 (OCR) produced empty text — cannot continue.');
  }

  // ── Step 2: OpenAI structuring ───────────────────────────────────────────
  try {
    structuredText = await stepAi(rawText);
  } catch (err) {
    throw new Error(`[PIPELINE] Step 2 (AI) failed: ${err.message}`);
  }

  // ── Step 3: ML inference ─────────────────────────────────────────────────
  try {
    // Send the human-readable summary to the ML service as the input text.
    // Swap structuredText.summary for rawText if your model prefers noisy input.
    mlResponse = await stepMl(structuredText.summary, language);
  } catch (err) {
    // Surface axios-specific details for easier debugging
    const detail = err.response
      ? `HTTP ${err.response.status}: ${JSON.stringify(err.response.data)}`
      : err.code === 'ECONNREFUSED'
      ? `ML service unreachable at ${ML_SERVICE_URL} — is it running?`
      : err.message;

    throw new Error(`[PIPELINE] Step 3 (ML) failed: ${detail}`);
  }

  const output = {
    rawText,
    structuredText,
    mlResult:   mlResponse.result,
    confidence: mlResponse.confidence,
  };

  console.log(`[PIPELINE] ── Pipeline complete ─────────────────────────────────`);
  console.log(`[PIPELINE] confidence=${output.confidence} | mlResult="${String(output.mlResult).slice(0, 60)}..."\n`);

  return output;
}

// ---------------------------------------------------------------------------
// Exports
// ---------------------------------------------------------------------------

module.exports = {
  processPipeline,
  // Export step helpers for unit testing
  _steps: { stepOcr, stepAi, stepMl },
};
