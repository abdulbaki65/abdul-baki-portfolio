const GEMINI_API_URL =
  'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent';

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
 * Cloudflare Pages Function handler for POST /api/chat
 * @param {{ request: Request, env: Record<string, string | undefined> }} context
 */
export async function onRequestPost(context) {
  try {
    const apiKey = context?.env?.GEMINI_API_KEY;
    if (!apiKey || typeof apiKey !== 'string' || !apiKey.trim()) {
      return jsonResponse(
        {
          error:
            'KHIORA is not configured yet. Please set GEMINI_API_KEY in your Cloudflare Pages environment variables.',
        },
        503
      );
    }

    let body;
    try {
      body = await context.request.json();
    } catch {
      return jsonResponse({ error: 'Invalid JSON request body.' }, 400);
    }

    const rawMessage = typeof body?.message === 'string' ? body.message.trim() : '';
    if (!rawMessage) {
      return jsonResponse({ error: 'Please enter a message.' }, 400);
    }

    if (rawMessage.length > MAX_MESSAGE_LENGTH) {
      return jsonResponse(
        {
          error: `Message is too long. Please keep it under ${MAX_MESSAGE_LENGTH} characters.`,
        },
        400
      );
    }

    const contents = [];

    if (Array.isArray(body?.history)) {
      const recentHistory = body.history.slice(-MAX_HISTORY_ITEMS);
      for (const entry of recentHistory) {
        if (!entry || typeof entry !== 'object') continue;
        const role = entry.role === 'model' ? 'model' : entry.role === 'user' ? 'user' : null;
        const text = typeof entry.text === 'string' ? entry.text.trim() : '';
        if (!role || !text) continue;
        contents.push({
          role,
          parts: [{ text: text.slice(0, MAX_MESSAGE_LENGTH) }],
        });
      }
    }

    contents.push({
      role: 'user',
      parts: [{ text: rawMessage }],
    });

    const geminiResponse = await fetch(GEMINI_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': apiKey.trim(),
      },
      body: JSON.stringify({
        systemInstruction: {
          parts: [{ text: SYSTEM_INSTRUCTION }],
        },
        contents,
      }),
    });

    const geminiData = await geminiResponse.json().catch(() => null);

    if (!geminiResponse.ok) {
      const status = geminiResponse.status === 429 ? 429 : 502;
      const friendlyMessage =
        geminiResponse.status === 429
          ? 'KHIORA is receiving too many requests right now. Please wait a moment and try again.'
          : 'KHIORA encountered a temporary issue connecting to the AI service. Please try again shortly.';

      return jsonResponse({ error: friendlyMessage }, status);
    }

    const parts = geminiData?.candidates?.[0]?.content?.parts;
    const replyText = Array.isArray(parts)
      ? parts
          .map((part) => (typeof part?.text === 'string' ? part.text : ''))
          .join('')
          .trim()
      : '';

    if (!replyText) {
      return jsonResponse(
        {
          error:
            'KHIORA could not generate a response for that message. Please try rephrasing your question.',
        },
        502
      );
    }

    return jsonResponse({ reply: replyText }, 200);
  } catch {
    return jsonResponse(
      {
        error:
          'An unexpected server error occurred. Please try again in a moment.',
      },
      500
    );
  }
}
