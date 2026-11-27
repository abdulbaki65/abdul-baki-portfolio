const GEMINI_API_BASE =
  'https://generativelanguage.googleapis.com/v1beta/models';

const MODEL_FALLBACK_LIST = [
  'gemini-3.5-flash-lite',
  'gemini-3.6-flash',
  'gemini-3.8-flash',
];

const BASE_GENERATION_CONFIG = {
  maxOutputTokens: 1500,
  temperature: 0.7,
};

const FAST_GENERATION_CONFIG = {
  ...BASE_GENERATION_CONFIG,
  thinkingConfig: {
    thinkingBudget: 0,
  },
};

const SYSTEM_INSTRUCTION = `You are KHIORA, the smart, friendly AI assistant on Abdul Baki's Electrical Engineering portfolio website.

Portfolio facts about Abdul Baki:
- Electrical Engineering student at Bogura Government Polytechnic Institute (বগুড়া সরকারি পলিটেকনিক ইনস্টিটিউট), Bogura, Bangladesh. Never mention or invent any semester number.
- EIM LV-3 Certified (Electrical Installation & Maintenance Level-3).
- Skills: EIM LV-3, House Wiring (হাউজ ওয়্যারিং), Electrical Fundamentals, Problem Solving & Troubleshooting, Web Development Basics, Continuous Learning.
- Site tools: EE Tools (House Load & Wire Estimator, Electricity Bill kWh Estimator) and Digital Visiting Card with QR & .vcf download.
- Contact: Call/WhatsApp 01575586681 (+8801575586681, @bakia8542), Telegram @Abdul23104, Instagram @abdul_baki_6.5, Facebook Abdulbaki231, Website https://abdulbaki-e1m.pages.dev.

Rules:
- Auto-detect each message's language regardless of UI language: pure Bengali -> natural Bengali; pure English -> clear English; mixed Bengali-English or Banglish -> clear natural Bengali (keeping standard English technical terms like MCB, Voltage, Phase, EIM LV-3 where helpful).
- Answer BOTH portfolio questions about Abdul Baki AND any general, technical, Electrical Engineering, house wiring, science, or study questions accurately and clearly.
- Keep simple answers concise; break complex/difficult questions into clear step-by-step points with practical examples. Include a brief safety tip for live electrical work.`;

const MAX_MESSAGE_LENGTH = 1500;
const MAX_HISTORY_ITEMS = 10;

/**
 * Helper to create a JSON Response with safe headers.
 * @param {Record<string, unknown>} payload
 * @param {number} status
 */
function jsonResponse(payload, status = 200) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-store',
    },
  });
}

/**
 * Normalize role strictly to "user" or "model" (never "assistant").
 * @param {unknown} role
 * @returns {"user" | "model" | null}
 */
function normalizeRole(role) {
  if (role === 'user') return 'user';
  if (role === 'model' || role === 'assistant') return 'model';
  return null;
}

/**
 * Redact the API key from any diagnostic error string before returning or logging.
 * @param {string} text
 * @param {string} apiKey
 */
function sanitizeErrorText(text, apiKey) {
  if (!apiKey) return text;
  return text.split(apiKey).join('[REDACTED]');
}

/**
 * Safely extract non-thought text from Gemini generateContent response.
 * Ignores hidden thinking parts where `part.thought === true`.
 * @param {any} geminiData
 * @returns {string}
 */
function extractReplyText(geminiData) {
  const parts = geminiData?.candidates?.[0]?.content?.parts;
  if (!Array.isArray(parts)) return '';

  return parts
    .filter(
      (part) =>
        part &&
        part.thought !== true &&
        typeof part.text === 'string' &&
        part.text.length > 0
    )
    .map((part) => part.text)
    .join('')
    .trim();
}

/**
 * Call a specific Gemini model once with a given generationConfig.
 * @param {string} model
 * @param {string} encodedKey
 * @param {Array<{ role: "user" | "model", parts: Array<{ text: string }> }>} contents
 * @param {Record<string, unknown>} generationConfig
 */
async function callGeminiModel(model, encodedKey, contents, generationConfig) {
  const endpointUrl = `${GEMINI_API_BASE}/${model}:generateContent?key=${encodedKey}`;
  const response = await fetch(endpointUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      systemInstruction: {
        parts: [{ text: SYSTEM_INSTRUCTION }],
      },
      contents,
      generationConfig,
    }),
  });

  const rawText = await response.text();
  let data = null;
  try {
    data = rawText ? JSON.parse(rawText) : null;
  } catch {
    data = null;
  }

  return { response, data, rawText };
}

/**
 * Cloudflare Pages Function handler for POST /api/chat
 * @param {{ request: Request, env: Record<string, string | undefined> }} context
 */
export async function onRequestPost(context) {
  const apiKey =
    typeof context?.env?.GEMINI_API_KEY === 'string'
      ? context.env.GEMINI_API_KEY.trim()
      : '';

  if (!apiKey) {
    const missingMessage =
      'Missing GEMINI_API_KEY environment variable in Cloudflare Pages settings.';
    console.error('[KHIORA /api/chat] Status 500:', missingMessage);
    return jsonResponse({ status: 500, error: missingMessage }, 500);
  }

  try {
    let body;
    try {
      body = await context.request.json();
    } catch {
      const parseErr = 'Invalid JSON request body.';
      console.error('[KHIORA /api/chat] Status 400:', parseErr);
      return jsonResponse({ status: 400, error: parseErr }, 400);
    }

    const rawMessage =
      typeof body?.message === 'string' ? body.message.trim() : '';
    if (!rawMessage) {
      return jsonResponse(
        { status: 400, error: 'Please enter a message.' },
        400
      );
    }

    if (rawMessage.length > MAX_MESSAGE_LENGTH) {
      return jsonResponse(
        {
          status: 400,
          error: `Message is too long. Please keep it under ${MAX_MESSAGE_LENGTH} characters.`,
        },
        400
      );
    }

    /** @type {Array<{ role: "user" | "model", parts: Array<{ text: string }> }>} */
    const contents = [];

    if (Array.isArray(body?.history)) {
      const recentHistory = body.history.slice(-MAX_HISTORY_ITEMS);
      for (const entry of recentHistory) {
        if (!entry || typeof entry !== 'object') continue;
        const role = normalizeRole(entry.role);
        const text =
          typeof entry.text === 'string'
            ? entry.text.trim()
            : typeof entry.content === 'string'
              ? entry.content.trim()
              : '';
        if (!role || !text) continue;

        // Gemini requires conversation history to start with a "user" turn
        if (contents.length === 0 && role !== 'user') continue;

        const clipped = text.slice(0, MAX_MESSAGE_LENGTH);
        const last = contents[contents.length - 1];
        if (last && last.role === role) {
          last.parts[0].text = `${last.parts[0].text}\n${clipped}`;
        } else {
          contents.push({
            role,
            parts: [{ text: clipped }],
          });
        }
      }
    }

    const lastEntry = contents[contents.length - 1];
    if (lastEntry && lastEntry.role === 'user') {
      lastEntry.parts[0].text = `${lastEntry.parts[0].text}\n${rawMessage}`;
    } else {
      contents.push({
        role: 'user',
        parts: [{ text: rawMessage }],
      });
    }

    const encodedKey = encodeURIComponent(apiKey);
    let lastStatus = 502;
    let lastError = 'Unable to generate a response right now. Please try again.';

    for (let i = 0; i < MODEL_FALLBACK_LIST.length; i++) {
      const model = MODEL_FALLBACK_LIST[i];
      const hasNextModel = i < MODEL_FALLBACK_LIST.length - 1;

      // First try with thinkingBudget: 0 for fast 1–2s replies
      let attempt = await callGeminiModel(
        model,
        encodedKey,
        contents,
        FAST_GENERATION_CONFIG
      );

      // If this model rejects thinkingConfig (HTTP 400), immediately retry the same model without thinkingConfig
      if (!attempt.response.ok && attempt.response.status === 400) {
        const errLower = String(
          attempt.data?.error?.message || attempt.rawText || ''
        ).toLowerCase();
        if (errLower.includes('thinking')) {
          console.warn(
            `[KHIORA /api/chat] Model "${model}" rejected thinkingConfig, retrying without thinkingConfig.`
          );
          attempt = await callGeminiModel(
            model,
            encodedKey,
            contents,
            BASE_GENERATION_CONFIG
          );
        }
      }

      if (!attempt.response.ok) {
        const upstreamError =
          attempt.data?.error?.message ||
          attempt.data?.message ||
          attempt.rawText ||
          attempt.response.statusText ||
          'Unknown Gemini API error';

        const safeError = sanitizeErrorText(String(upstreamError), apiKey);
        lastStatus = attempt.response.status;
        lastError = safeError;

        console.error(
          `[KHIORA /api/chat] Model "${model}" failed (${attempt.response.status}):`,
          safeError
        );

        // Stop immediately on auth/key errors; otherwise fall back to next model
        const isAuthError =
          attempt.response.status === 401 || attempt.response.status === 403;
        if (!isAuthError && hasNextModel) {
          continue;
        }

        return jsonResponse(
          {
            status: attempt.response.status,
            error: safeError,
          },
          attempt.response.status
        );
      }

      // Safely extract non-thought text from candidates[0].content.parts
      const replyText = extractReplyText(attempt.data);

      if (!replyText) {
        const finishReason = attempt.data?.candidates?.[0]?.finishReason;
        const blockReason = attempt.data?.promptFeedback?.blockReason;
        const emptyErr = blockReason
          ? `Response blocked by safety filter (${blockReason}).`
          : `Model "${model}" returned HTTP 200 with no text${finishReason ? ` (finishReason: ${finishReason})` : ''}.`;

        console.error('[KHIORA /api/chat] Empty 200 reply:', emptyErr);
        lastStatus = 502;
        lastError = emptyErr;

        // Fall back to the next model instead of returning an empty 200 reply
        if (hasNextModel) {
          continue;
        }

        return jsonResponse({ status: 502, error: emptyErr }, 502);
      }

      return jsonResponse({ reply: replyText }, 200);
    }

    return jsonResponse({ status: lastStatus, error: lastError }, lastStatus);
  } catch (err) {
    const errMsg = sanitizeErrorText(
      err instanceof Error ? err.message : 'Unexpected server error.',
      apiKey
    );
    console.error('[KHIORA /api/chat] Unhandled error (500):', errMsg);
    return jsonResponse({ status: 500, error: errMsg }, 500);
  }
}
