/**
 * koka-chat — Netlify serverless function
 *
 * Required env vars (set in Netlify UI or .env.local for local dev):
 *   SPENDEX_API_KEY   — your OpenAI-compatible API key
 *   SPENDEX_BASE_URL  — base URL of the router, e.g. https://your-router.example.com/v1
 *   SPENDEX_MODEL     — model name, defaults to "gpt-4.1-mini"
 *
 * The function accepts POST /api/koka-chat with JSON body:
 *   { message: string, history: [{role, content}], mode: string }
 *
 * It returns:
 *   { reply: string, source: "live" | "fallback", reason?: string }
 */

const corsHeaders = {
  "Content-Type": "application/json; charset=utf-8",
  "Cache-Control": "no-store",
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type",
  "Access-Control-Allow-Methods": "POST, OPTIONS"
};

// ─── Mode instructions ────────────────────────────────────────
const MODE_INSTRUCTIONS = {
  simple:
    "Respond primarily in simple, clear French (A2–B1 level). Keep answers short (3–5 sentences). " +
    "Add a brief English gloss only when a word is tricky. End with a warm encouragement.",
  correct:
    "The student has written French. Your job: (1) give a corrected version in French, " +
    "(2) highlight the 1–2 main improvements in plain English, (3) invite them to try again with a better sentence. " +
    "Be kind — never make them feel bad about mistakes.",
  vocab:
    "Give exactly 5–7 useful French words or expressions related to the topic. " +
    "Format: **French term** — English meaning. " +
    "Then pick 2 of them and write a model sentence using both. Invite the student to write their own sentence.",
  question:
    "Ask ONE new follow-up conversation question in simple French. " +
    "Then add one short English support line to help them understand. " +
    "Do not explain the topic — just pose the question and wait."
};

// ─── System prompt ────────────────────────────────────────────
function buildSystemPrompt(mode) {
  return [
    "You are Koka, a warm and encouraging French speaking coach for anglophone high school students.",
    "Your students are at A2–B1 level. They need support, not perfection.",
    "Always be concise — students read you on a phone in class. Max 120 words per reply.",
    "Never lecture. Never use bullet-point lists unless giving vocabulary.",
    "Use **bold** for key French words students should notice.",
    MODE_INSTRUCTIONS[mode] || MODE_INSTRUCTIONS.simple
  ].join(" ");
}

// ─── Helpers ─────────────────────────────────────────────────
function json(status, body) {
  return { statusCode: status, headers: corsHeaders, body: JSON.stringify(body) };
}

function normalizeChatUrl(base) {
  const url = String(base || "").trim().replace(/\/+$/, "");
  if (!url) return "";
  if (url.includes("/chat/completions")) return url;
  if (url.endsWith("/v1")) return `${url}/chat/completions`;
  return `${url}/chat/completions`;
}

function sanitizeHistory(raw) {
  if (!Array.isArray(raw)) return [];
  return raw
    .filter(m => m && (m.role === "user" || m.role === "assistant") && typeof m.content === "string")
    .slice(-12)
    .map(m => ({ role: m.role, content: m.content.slice(0, 2000) }));
}

// ─── Fallback replies (used when API is unavailable) ─────────
function fallbackReply(mode, reason) {
  const hint = reason ? ` (${reason})` : "";

  const replies = {
    correct:
      `Je ne peux pas joindre le serveur${hint}.\n\n` +
      `Essaie deja cette structure : **Sujet + verbe + raison courte.**\n` +
      `Exemple : *Je pense que les telephones sont utiles parce qu'on peut chercher des informations vite.*`,
    vocab:
      `Je ne peux pas joindre le serveur${hint}.\n\n` +
      `Quelques mots utiles :\n` +
      `**le budget** — budget · **une habitude** — habit · **pratique** — practical · ` +
      `**une limite** — limit · **s'organiser** — to get organized\n\n` +
      `Essaie une phrase avec 2 de ces mots.`,
    question:
      `Je ne peux pas joindre le serveur${hint}.\n\n` +
      `Question : **Est-ce que cette habitude aide vraiment les etudiants dans la vie quotidienne ?**\n` +
      `*(Does this habit really help students in daily life?)*`,
    simple:
      `Je ne peux pas joindre le serveur${hint}.\n\n` +
      `Essaie ce modele :\n` +
      `**Je pense que...** Parce que... Par exemple... Donc...\n\n` +
      `Ecris 2 phrases courtes avec ce modele.`
  };

  return replies[mode] || replies.simple;
}

// ─── Handler ─────────────────────────────────────────────────
exports.handler = async (event) => {
  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 204, headers: corsHeaders, body: "" };
  }
  if (event.httpMethod !== "POST") {
    return json(405, { reply: "Method not allowed.", source: "error" });
  }

  // Parse body
  let body;
  try {
    body = JSON.parse(event.body || "{}");
  } catch {
    return json(400, { reply: fallbackReply("simple", "body invalide"), source: "fallback" });
  }

  const message = typeof body.message === "string" ? body.message.trim() : "";
  const mode    = typeof body.mode    === "string" ? body.mode    : "simple";
  const history = sanitizeHistory(body.history);

  if (!message) {
    return json(400, { reply: "Message vide.", source: "fallback" });
  }

  // Check config
  const apiKey = process.env.SPENDEX_API_KEY;
  const baseUrl = process.env.SPENDEX_BASE_URL;
  const model  = process.env.SPENDEX_MODEL || "gpt-4.1-mini";
  const apiUrl = normalizeChatUrl(baseUrl);

  const missing = [];
  if (!apiKey) missing.push("SPENDEX_API_KEY");
  if (!apiUrl)  missing.push("SPENDEX_BASE_URL");

  if (missing.length) {
    return json(200, {
      reply: fallbackReply(mode, "configuration manquante"),
      source: "fallback",
      reason: "missing_config",
      missingConfig: missing
    });
  }

  // Call API
  try {
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model,
        temperature: 0.72,
        max_tokens: 300,
        messages: [
          { role: "system", content: buildSystemPrompt(mode) },
          ...history,
          { role: "user",   content: message }
        ]
      })
    });

    if (!response.ok) {
      const reason =
        response.status === 401 || response.status === 403 ? "acces refuse" :
        response.status === 429 ? "limite de requetes atteinte" :
        `erreur HTTP ${response.status}`;
      return json(200, { reply: fallbackReply(mode, reason), source: "fallback", reason });
    }

    const payload = await response.json();
    const reply   = payload?.choices?.[0]?.message?.content?.trim();

    if (!reply) {
      return json(200, { reply: fallbackReply(mode, "reponse vide"), source: "fallback", reason: "empty_reply" });
    }

    return json(200, { reply, source: "live" });

  } catch (err) {
    const reason = err?.code === "ECONNREFUSED" ? "serveur injoignable" : "erreur reseau";
    return json(200, { reply: fallbackReply(mode, reason), source: "fallback", reason });
  }
};
