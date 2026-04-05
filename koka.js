const KOKA_DATA = window.FrenchClassData || {};
const KOKA_STORAGE_KEY = "french_class_koka_history";
const KOKA_MODE_KEY = "french_class_koka_mode";

const DEFAULT_SUGGESTIONS = KOKA_DATA.kokaSuggestions || [
  "Pose-moi une question simple sur la vie etudiante.",
  "Corrige ma reponse en francais, puis explique en anglais."
];

const QUICK_PROMPTS = [
  "Donne-moi 5 mots utiles pour ce sujet.",
  "Comment dire ca en francais ?",
  "Pose-moi une autre question.",
  "Corrige ma derniere phrase."
];

const DEFAULT_MODES = KOKA_DATA.kokaModes || [
  { id: "simple",   label: "Simple" },
  { id: "correct",  label: "Corriger" },
  { id: "vocab",    label: "Vocabulaire" },
  { id: "question", label: "Relancer" }
];

const modeHelpText = {
  simple:   "Koka repond en francais simple avec aide anglaise si besoin. Ideal pour pratiquer vite.",
  correct:  "Koka corrige ta phrase doucement et propose une meilleure version avec explication courte.",
  vocab:    "Koka te donne 5 a 8 mots utiles pour le sujet, puis te demande d'en reutiliser 2.",
  question: "Koka pose une nouvelle question de conversation simple pour continuer la discussion."
};

const kokaEls = {
  newChatBtn:      document.getElementById("newChatBtn"),
  suggestionChips: document.getElementById("kokaSuggestionChips"),
  quickPrompts:    document.getElementById("kokaQuickPrompts"),
  modeSwitch:      document.getElementById("kokaModeSwitch"),
  modeHelp:        document.getElementById("kokaModeHelp"),
  status:          document.getElementById("kokaStatus"),
  onlineDot:       document.getElementById("kokaOnlineDot"),
  chatMessages:    document.getElementById("chatMessages"),
  typingIndicator: document.getElementById("typingIndicator"),
  chatForm:        document.getElementById("chatForm"),
  chatInput:       document.getElementById("chatInput"),
  sendChatBtn:     document.getElementById("sendChatBtn")
};

let activeMode = localStorage.getItem(KOKA_MODE_KEY) || "simple";
let isSending = false;

// ──────────────────────────────────────────────
// Storage
// ──────────────────────────────────────────────
function readHistory() {
  try {
    return JSON.parse(localStorage.getItem(KOKA_STORAGE_KEY) || "[]");
  } catch {
    return [];
  }
}

function writeHistory(msgs) {
  localStorage.setItem(KOKA_STORAGE_KEY, JSON.stringify(msgs.slice(-20)));
}

function getWelcomeMessage() {
  return {
    role: "assistant",
    content: "Salut ! Je suis Koka, ton coach de francais oral.\n\nEcris une phrase en francais — meme courte — et je peux te corriger, simplifier ou te donner du vocabulaire utile. Choisis un mode pour changer mon comportement."
  };
}

let messages = (() => {
  const saved = readHistory();
  return saved.length ? saved : [getWelcomeMessage()];
})();

// ──────────────────────────────────────────────
// Safe text: escape then apply simple markdown
// All user/assistant content passes through escapeText
// before any insertion into the DOM.
// ──────────────────────────────────────────────
function escapeText(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.textContent;
}

function applyMarkdown(escaped) {
  // Only processes already-escaped text — no raw HTML can reach here.
  // Patterns: **bold**, *italic*, `code`, newlines -> <br>
  return escaped
    .replace(/\*\*(.*?)\*\*/g, (_, m) => `<strong>${m}</strong>`)
    .replace(/\*(.*?)\*/g, (_, m) => `<em>${m}</em>`)
    .replace(/`([^`]+)`/g, (_, m) => `<code class="inline-code">${m}</code>`)
    .replace(/\n/g, "<br>");
}

function setBubbleContent(bubbleEl, text) {
  // textContent escapes the string; then we apply only safe markdown transforms
  const escaped = document.createElement("div");
  escaped.textContent = text;
  const safe = applyMarkdown(escaped.textContent);
  bubbleEl.innerHTML = safe; // safe: input is fully text-escaped before markdown
}

// ──────────────────────────────────────────────
// Status / online indicator
// ──────────────────────────────────────────────
function setStatus(text) {
  kokaEls.status.textContent = text;
}

function setOnline(online) {
  kokaEls.onlineDot && kokaEls.onlineDot.classList.toggle("offline", !online);
}

function buildStatusFromPayload(payload) {
  if (payload?.reason === "missing_config" && Array.isArray(payload.missingConfig)) {
    return `Config manquante : ${payload.missingConfig.join(", ")}.`;
  }
  if (payload?.source === "fallback") return "Reponse de secours utilisee.";
  return "Koka a repondu.";
}

// ──────────────────────────────────────────────
// Mode
// ──────────────────────────────────────────────
function setMode(modeId) {
  activeMode = modeId;
  localStorage.setItem(KOKA_MODE_KEY, modeId);
  renderModes();
}

function renderModes() {
  kokaEls.modeSwitch.replaceChildren();

  DEFAULT_MODES.forEach((mode) => {
    const btn = document.createElement("button");
    btn.className = `mode-btn${mode.id === activeMode ? " is-active" : ""}`;
    btn.type = "button";
    btn.dataset.mode = mode.id;
    btn.textContent = mode.label;
    btn.addEventListener("click", () => setMode(mode.id));
    kokaEls.modeSwitch.appendChild(btn);
  });

  kokaEls.modeHelp.textContent = modeHelpText[activeMode] || modeHelpText.simple;
}

// ──────────────────────────────────────────────
// Typing indicator
// ──────────────────────────────────────────────
function showTyping() {
  kokaEls.typingIndicator.classList.remove("hidden");
  kokaEls.chatMessages.appendChild(kokaEls.typingIndicator);
  scrollToBottom();
}

function hideTyping() {
  kokaEls.typingIndicator.classList.add("hidden");
}

function scrollToBottom() {
  requestAnimationFrame(() => {
    kokaEls.chatMessages.scrollTop = kokaEls.chatMessages.scrollHeight;
  });
}

// ──────────────────────────────────────────────
// Build a single message element (DOM only)
// ──────────────────────────────────────────────
function buildMessageEl(message) {
  const isUser = message.role === "user";
  const row = document.createElement("div");
  row.className = `msg ${isUser ? "msg-user" : "msg-koka"}`;

  if (!isUser) {
    const avatar = document.createElement("div");
    avatar.className = "msg-avatar";
    const img = document.createElement("img");
    img.src = "./assets/koka.jpg";
    img.alt = "K";
    avatar.appendChild(img);
    row.appendChild(avatar);
  }

  const body = document.createElement("div");
  body.className = "msg-body";

  const bubble = document.createElement("div");
  bubble.className = "msg-bubble";
  setBubbleContent(bubble, message.content);

  const name = document.createElement("span");
  name.className = "msg-name";
  name.textContent = isUser ? "Toi" : "Koka";

  body.appendChild(bubble);
  body.appendChild(name);
  row.appendChild(body);
  return row;
}

// ──────────────────────────────────────────────
// Render all messages
// ──────────────────────────────────────────────
function renderMessages() {
  // Remove everything except typing indicator
  Array.from(kokaEls.chatMessages.children).forEach((child) => {
    if (child.id !== "typingIndicator") child.remove();
  });

  messages.forEach((msg) => {
    kokaEls.chatMessages.insertBefore(
      buildMessageEl(msg),
      kokaEls.typingIndicator
    );
  });

  scrollToBottom();
}

// ──────────────────────────────────────────────
// Suggestion buttons
// ──────────────────────────────────────────────
function renderSuggestionButtons(container, prompts) {
  container.replaceChildren();
  prompts.forEach((prompt) => {
    const btn = document.createElement("button");
    btn.className = "chip chip-action";
    btn.type = "button";
    btn.textContent = prompt;
    btn.addEventListener("click", () => sendPrompt(prompt));
    container.appendChild(btn);
  });
}

// ──────────────────────────────────────────────
// Auto-resize textarea
// ──────────────────────────────────────────────
function autoResize(el) {
  el.style.height = "auto";
  el.style.height = Math.min(el.scrollHeight, 120) + "px";
}

// ──────────────────────────────────────────────
// Lock / unlock
// ──────────────────────────────────────────────
function lockComposer(locked) {
  isSending = locked;
  kokaEls.sendChatBtn.disabled = locked;
  kokaEls.chatInput.disabled = locked;
  if (locked) {
    showTyping();
  } else {
    hideTyping();
    kokaEls.chatInput.focus();
    autoResize(kokaEls.chatInput);
  }
}

// ──────────────────────────────────────────────
// Push a message and persist
// ──────────────────────────────────────────────
function pushMessage(role, content) {
  messages.push({ role, content });
  writeHistory(messages);
  // Append just the new message instead of re-rendering everything
  kokaEls.chatMessages.insertBefore(
    buildMessageEl({ role, content }),
    kokaEls.typingIndicator
  );
  scrollToBottom();
}

function resetChat() {
  messages = [getWelcomeMessage()];
  writeHistory(messages);
  renderMessages();
  setStatus("Nouvelle conversation prete.");
  kokaEls.chatInput.focus();
}

// ──────────────────────────────────────────────
// Fallback replies
// ──────────────────────────────────────────────
function buildFallbackReply(message) {
  if (activeMode === "correct") {
    return "Je ne peux pas joindre le serveur pour l'instant.\n\nEssaie deja cette structure : **Sujet + verbe + raison**.\nExemple : *Je pense que ce sujet est important parce qu'il change la vie des etudiants.*";
  }
  if (activeMode === "vocab") {
    return "Je ne peux pas joindre le serveur pour l'instant.\n\nVoici du vocabulaire utile :\n- **le budget** (budget)\n- **une habitude** (habit)\n- **pratique** (practical)\n- **une limite** (limit)\n- **s'organiser** (to get organized)\n\nEssaie une phrase avec 2 de ces mots.";
  }
  if (activeMode === "question") {
    return "Je ne peux pas joindre le serveur pour l'instant.\n\nNouvelle question : **Est-ce que cette habitude aide vraiment les etudiants dans la vie quotidienne ?**";
  }
  return `Je ne peux pas joindre le serveur pour l'instant.\n\nEssaie deja ce modele :\n**Je pense que...** Parce que... Par exemple... Donc...\n\nA partir de ton message, ecris 2 phrases simples.`;
}

// ──────────────────────────────────────────────
// Send
// ──────────────────────────────────────────────
async function sendPrompt(prompt) {
  kokaEls.chatInput.value = prompt;
  autoResize(kokaEls.chatInput);
  await submitCurrentMessage();
}

async function submitCurrentMessage() {
  const message = kokaEls.chatInput.value.trim();
  if (!message || isSending) return;

  pushMessage("user", message);
  kokaEls.chatInput.value = "";
  autoResize(kokaEls.chatInput);
  setStatus("Koka reflechit...");
  lockComposer(true);
  setOnline(true);

  try {
    const response = await fetch("/api/koka-chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message,
        history: messages.slice(-10),
        mode: activeMode
      })
    });

    const payload = await response.json().catch(() => ({}));
    const reply = payload.reply || buildFallbackReply(message);
    pushMessage("assistant", reply);
    setStatus(buildStatusFromPayload(payload));
    setOnline(payload?.source === "live");
  } catch {
    pushMessage("assistant", buildFallbackReply(message));
    setStatus("Erreur reseau. Reponse de secours affichee.");
    setOnline(false);
  } finally {
    lockComposer(false);
  }
}

// ──────────────────────────────────────────────
// Event listeners
// ──────────────────────────────────────────────
kokaEls.chatForm.addEventListener("submit", (event) => {
  event.preventDefault();
  submitCurrentMessage();
});

// Enter sends, Shift+Enter = new line
kokaEls.chatInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter" && !event.shiftKey) {
    event.preventDefault();
    submitCurrentMessage();
  }
});

kokaEls.chatInput.addEventListener("input", () => autoResize(kokaEls.chatInput));

kokaEls.newChatBtn.addEventListener("click", resetChat);

// ──────────────────────────────────────────────
// Init
// ──────────────────────────────────────────────
renderSuggestionButtons(kokaEls.suggestionChips, DEFAULT_SUGGESTIONS);
renderSuggestionButtons(kokaEls.quickPrompts, QUICK_PROMPTS);
renderModes();
renderMessages();
setStatus("En ligne · Pret a t'aider");
setOnline(true);
