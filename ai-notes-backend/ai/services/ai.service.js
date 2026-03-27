'use strict';

const OpenAI = require('openai');

// ---------------------------------------------------------------------------
// Client initialisation (lazy – validated on first use)
// ---------------------------------------------------------------------------

let _client = null;

function getClient() {
  if (_client) return _client;

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey || apiKey.trim() === '') {
    throw new Error(
      '[AI] OPENAI_API_KEY is not set. ' +
        'Add it to your .env file before using the AI service.'
    );
  }

  _client = new OpenAI({ apiKey });
  return _client;
}

// ---------------------------------------------------------------------------
// Prompt
// ---------------------------------------------------------------------------

const SYSTEM_PROMPT = `You are an expert note editor and formatter.
You receive raw text that was extracted from a handwritten note using OCR.
The text may contain:
  - Spelling mistakes
  - OCR recognition errors (e.g. 'rn' instead of 'm', '0' instead of 'O')
  - Missing punctuation or capitalisation
  - Garbled words caused by unclear handwriting

Your job is to:
1. Fix all spelling mistakes and OCR errors.
2. Infer the most likely intended meaning where text is ambiguous.
3. Produce a clean, structured version of the note.

You MUST respond with a single valid JSON object — no markdown fences, no extra text.
The JSON must follow this exact schema:

{
  "title": "string  — a concise title for the note (max 10 words)",
  "headings": [
    {
      "heading": "string — section heading",
      "bullets": ["string — bullet point", "..."]
    }
  ],
  "summary": "string — a 2-4 sentence plain-English summary of the note"
}

Rules:
- If the note has no clear sections, use a single heading "Notes" with all bullets listed under it.
- Bullets should be concise (one idea per bullet).
- Do not add information that is not present in the original text.
- The summary should capture the key takeaways.`;

// ---------------------------------------------------------------------------
// Input validation
// ---------------------------------------------------------------------------

function validateInput(text) {
  if (typeof text !== 'string') {
    throw new Error(`[AI] processText() expects a string, received ${typeof text}.`);
  }
  const trimmed = text.trim();
  if (trimmed.length === 0) {
    throw new Error('[AI] processText() received an empty string — nothing to process.');
  }
  if (trimmed.length > 15_000) {
    throw new Error(
      `[AI] Input text is too long (${trimmed.length} chars). Maximum is 15,000 characters.`
    );
  }
  return trimmed;
}

// ---------------------------------------------------------------------------
// Response parser / validator
// ---------------------------------------------------------------------------

function parseStructuredResponse(raw) {
  let parsed;
  try {
    parsed = JSON.parse(raw);
  } catch {
    throw new Error(
      '[AI] Model returned non-JSON response. Raw output: ' + raw.slice(0, 300)
    );
  }

  if (typeof parsed.title !== 'string' || parsed.title.trim() === '') {
    throw new Error('[AI] Structured response is missing a valid "title" field.');
  }
  if (!Array.isArray(parsed.headings) || parsed.headings.length === 0) {
    throw new Error('[AI] Structured response is missing a valid "headings" array.');
  }
  for (const section of parsed.headings) {
    if (typeof section.heading !== 'string') {
      throw new Error('[AI] Each heading entry must have a string "heading" field.');
    }
    if (!Array.isArray(section.bullets)) {
      throw new Error('[AI] Each heading entry must have a "bullets" array.');
    }
  }
  if (typeof parsed.summary !== 'string' || parsed.summary.trim() === '') {
    throw new Error('[AI] Structured response is missing a valid "summary" field.');
  }

  return {
    title: parsed.title.trim(),
    headings: parsed.headings.map((s) => ({
      heading: s.heading.trim(),
      bullets: s.bullets.map((b) => String(b).trim()).filter(Boolean),
    })),
    summary: parsed.summary.trim(),
  };
}

// ---------------------------------------------------------------------------
// Core service function
// ---------------------------------------------------------------------------

/**
 * Process raw OCR-extracted text with GPT-4o-mini and return structured notes.
 *
 * @param {string} text  - Raw OCR text (e.g. from ai/services/ocr.service.js).
 * @returns {Promise<{ title: string, headings: Array<{ heading: string, bullets: string[] }>, summary: string }>}
 *
 * @example
 * const { processText } = require('./ai/services/ai.service');
 * const structured = await processText(rawOcrText);
 */
async function processText(text) {
  const cleanInput = validateInput(text);

  console.log(`[AI] Processing text | inputLength=${cleanInput.length} chars`);

  const client = getClient();

  let rawContent;
  try {
    const response = await client.chat.completions.create({
      model: 'gpt-4o-mini',
      response_format: { type: 'json_object' },
      temperature: 0.2,
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        {
          role: 'user',
          content:
            'Here is the raw OCR text extracted from a handwritten note. ' +
            'Please clean and structure it:\n\n' +
            cleanInput,
        },
      ],
    });

    rawContent = response.choices?.[0]?.message?.content;

    if (!rawContent) {
      throw new Error('[AI] OpenAI returned an empty response body.');
    }

    const tokensUsed = response.usage?.total_tokens ?? 'unknown';
    console.log(`[AI] Processing complete | tokens=${tokensUsed}`);
  } catch (err) {
    if (err.status) {
      throw new Error(`[AI] OpenAI API error (HTTP ${err.status}): ${err.message}`);
    }
    throw err;
  }

  const structured = parseStructuredResponse(rawContent);

  console.log(
    `[AI] Structured note ready | title="${structured.title}" sections=${structured.headings.length}`
  );

  return structured;
}

// ---------------------------------------------------------------------------
// Exports
// ---------------------------------------------------------------------------

module.exports = { processText };
