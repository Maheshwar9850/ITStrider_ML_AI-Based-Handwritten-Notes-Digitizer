'use strict';

/**
 * ai/ barrel export
 *
 * Consumers can import from this single entry point:
 *
 *   const { extractText, processText, processPipeline } = require('./ai');
 */

module.exports = {
  ...require('./services/ocr.service'),    // extractText, SUPPORTED_LANGUAGES
  ...require('./services/ai.service'),     // processText
  ...require('./pipeline/process.pipeline'), // processPipeline, _steps
};
