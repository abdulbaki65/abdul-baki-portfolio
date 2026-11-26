const GEMINI_MODEL_ENDPOINT =
  'https://generativelanguage.googleapis.com/v1beta/models/gemini-3.8-flash:generateContent';

const SYSTEM_INSTRUCTION = `You are KHIORA, the helpful, polite Electrical-Engineering-themed AI assistant for Abdul Baki's personal portfolio website.

Key facts about Abdul Baki:
- Role: Electrical Engineering student at Bogura Government Polytechnic Institute (বগুড়া সরকারি পলিটেকনিক ইনস্টিটিউট), located in Bogura, Bangladesh. Never mention or invent any semester number.
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

Guidelines:
- Always reply concisely, clearly, and politely in whichever language (Bengali or English) the user writes in.
- Stay truthful to the facts above; if asked something unrelated to Abdul Baki or his engineering background, answer briefly if helpful or politely guide the visitor back to Abdul Baki's skills, projects, or contact options.
- Keep responses compact and easy to read in a small chat widget (2–5 sentences or short bullet points).`;

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

    const endpointUrl = `${GEMINI_MODEL_ENDPOINT}?key=${encodeURIComponent(apiKey)}`;

    const geminiResponse = await fetch(endpointUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        systemInstruction: {
          parts: [{ text: SYSTEM_INSTRUCTION }],
        },
        contents,
      }),
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
      console.error(
        `[KHIORA /api/chat] Gemini API error (${geminiResponse.status}):`,
        safeError
      );

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
      const emptyErr =
        geminiData?.promptFeedback?.blockReason
          ? `Response blocked by safety filter (${geminiData.promptFeedback.blockReason}).`
          : 'Gemini API returned an empty response.';
      console.error('[KHIORA /api/chat] Empty response:', emptyErr);
      return jsonResponse({ status: 502, error: emptyErr }, 502);
    }

    return jsonResponse({ reply: replyText }, 200);
  } catch (err) {
    const errMsg = sanitizeErrorText(
      err instanceof Error ? err.message : 'Unexpected server error.',
      apiKey
    );
    console.error('[KHIORA /api/chat] Unhandled error (500):', errMsg);
    return jsonResponse({ status: 500, error: errMsg }, 500);
  }
}
