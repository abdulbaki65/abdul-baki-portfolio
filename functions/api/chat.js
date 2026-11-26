const GEMINI_API_BASE =
  'https://generativelanguage.googleapis.com/v1beta/models';

const MODEL_FALLBACK_LIST = [
  'gemini-3.5-flash-lite',
  'gemini-3.6-flash',
  'gemini-3.8-flash',
];

const SYSTEM_INSTRUCTION = `You are KHIORA, a fast, helpful, and polite AI assistant on Abdul Baki's Electrical Engineering portfolio website.

You should gladly answer BOTH:
1. Questions about Abdul Baki, his background, skills, certifications, and how to contact him.
2. Any general questions from visitors—including Electrical Engineering concepts, house wiring basics and safety, technology, programming, study topics, history, or general everyday Q&A.

Key facts about Abdul Baki (use when asked about him):
- Role: Electrical Engineering student at Bogura Government Polytechnic Institute (বগুড়া সরকারি পলিটেকনিক ইনস্টিটিউট), Bogura, Bangladesh. Never mention or invent any semester number.
- Certification: EIM LV-3 Certified (Electrical Installation & Maintenance Level-3 — practical electrical systems, safety standards, inspection, and maintenance).
- Core Skills:
  1. EIM LV-3 (Certified Electrical Installation & Maintenance Level-3)
  2. House Wiring (হাউজ ওয়্যারিং) — residential electrical wiring, load distribution, earthing, switchboard setup, circuit protection, and fault finding
  3. Electrical Fundamentals — circuit analysis, AC/DC power distribution, switchgear concepts, and core electrical engineering principles
  4. Problem Solving & Troubleshooting — systematic diagnostics, multimeter testing, and practical technical solutions
  5. Web Development Basics — clean HTML, CSS, and building modern responsive web interfaces
  6. Continuous Learning — exploring modern engineering tools, smart automation, and AI
- Direct Contact Details:
  - Phone / Call Now: 01575586681 (+8801575586681)
  - WhatsApp: 01575586681 (@bakia8542, https://wa.me/8801575586681)
  - Telegram: @Abdul23104 (https://t.me/Abdul23104)
  - Instagram: @abdul_baki_6.5 (https://www.instagram.com/abdul_baki_6.5)
  - Facebook: Abdulbaki231 (https://www.facebook.com/Abdulbaki231)

Response guidelines:
- Always reply politely, accurately, and concisely in whichever language (Bengali or English) the user writes in.
- Keep answers clear and easy to read inside a compact chat window (short paragraphs or crisp bullet points).
- For electrical or house wiring safety topics, always emphasize safe practices (such as turning off main power/MCB, proper earthing, and consulting a certified technician when working with live mains).`;

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
          // Merge consecutive identical roles so turns strictly alternate
          last.parts[0].text = `${last.parts[0].text}\n${clipped}`;
        } else {
          contents.push({
            role,
            parts: [{ text: clipped }],
          });
        }
      }
    }

    // Ensure the final turn is the current "user" message without consecutive user turns
    const lastEntry = contents[contents.length - 1];
    if (lastEntry && lastEntry.role === 'user') {
      lastEntry.parts[0].text = `${lastEntry.parts[0].text}\n${rawMessage}`;
    } else {
      contents.push({
        role: 'user',
        parts: [{ text: rawMessage }],
      });
    }

    const requestPayload = JSON.stringify({
      systemInstruction: {
        parts: [{ text: SYSTEM_INSTRUCTION }],
      },
      contents,
    });

    const encodedKey = encodeURIComponent(apiKey);
    let lastStatus = 502;
    let lastError = 'Unable to reach Gemini API.';

    for (let i = 0; i < MODEL_FALLBACK_LIST.length; i++) {
      const model = MODEL_FALLBACK_LIST[i];
      const hasNextModel = i < MODEL_FALLBACK_LIST.length - 1;
      const endpointUrl = `${GEMINI_API_BASE}/${model}:generateContent?key=${encodedKey}`;

      const geminiResponse = await fetch(endpointUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: requestPayload,
      });

      const rawResponseText = await geminiResponse.text();
      let geminiData = null;
      try {
        geminiData = rawResponseText ? JSON.parse(rawResponseText) : null;
      } catch {
        geminiData = null;
      }

      if (!geminiResponse.ok) {
        const upstreamError =
          geminiData?.error?.message ||
          geminiData?.message ||
          rawResponseText ||
          geminiResponse.statusText ||
          'Unknown Gemini API error';

        const safeError = sanitizeErrorText(String(upstreamError), apiKey);
        lastStatus = geminiResponse.status;
        lastError = safeError;

        console.error(
          `[KHIORA /api/chat] Model "${model}" failed (${geminiResponse.status}):`,
          safeError
        );

        // Automatically fall back to the next model on transient capacity/rate errors (503 or 429)
        if (
          (geminiResponse.status === 503 || geminiResponse.status === 429) &&
          hasNextModel
        ) {
          continue;
        }

        return jsonResponse(
          {
            status: geminiResponse.status,
            error: safeError,
          },
          geminiResponse.status
        );
      }

      const parts = geminiData?.candidates?.[0]?.content?.parts;
      const replyText = Array.isArray(parts)
        ? parts
            .map((part) => (typeof part?.text === 'string' ? part.text : ''))
            .join('')
            .trim()
        : '';

      if (!replyText) {
        const emptyErr = geminiData?.promptFeedback?.blockReason
          ? `Response blocked by safety filter (${geminiData.promptFeedback.blockReason}).`
          : `Model "${model}" returned an empty response.`;
        console.error('[KHIORA /api/chat] Empty response:', emptyErr);
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
