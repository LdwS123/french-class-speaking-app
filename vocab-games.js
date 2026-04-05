const GAME_DATA = window.FrenchClassData;
const GAME_TOPICS = GAME_DATA.topics;
const EXPRESSION_BANKS = GAME_DATA.expressionBanks || [];
const CURRENT_TOPIC_KEY_GAME = "french_class_current_topic";
const SEEN_KEY_GAME = "french_class_seen_topics";
const KNOWN_WORDS_KEY = "french_class_known_words";
const SPRINT_BEST_KEY = "french_class_sprint_best";
const SPRINT_DURATION = 5000;
const PREPOSITION_QUESTIONS = [
  { sentence: "Je vais __ la bibliotheque apres les cours.", answer: "a", options: ["a", "de", "chez", "sur"] },
  { sentence: "On parle souvent __ ce sujet en classe.", answer: "de", options: ["de", "a", "pour", "dans"] },
  { sentence: "Elle habite __ France depuis un an.", answer: "en", options: ["en", "a", "chez", "sur"] },
  { sentence: "Je laisse mon sac __ la table.", answer: "sur", options: ["sur", "dans", "chez", "de"] },
  { sentence: "Il travaille __ un hopital a Paris.", answer: "dans", options: ["dans", "en", "de", "a"] },
  { sentence: "Nous allons __ Paul ce soir.", answer: "chez", options: ["chez", "dans", "pour", "sur"] },
  { sentence: "Je fais cet exercice __ progresser en francais.", answer: "pour", options: ["pour", "de", "a", "en"] }
];

const gameEls = {
  poolSelect: document.getElementById("poolSelect"),
  activePoolLabel: document.getElementById("activePoolLabel"),
  knownWords: document.getElementById("knownWords"),
  sprintBest: document.getElementById("sprintBest"),
  sprintStreak: document.getElementById("sprintStreak"),
  sprintLives: document.getElementById("sprintLives"),
  sprintSeconds: document.getElementById("sprintSeconds"),
  sprintQuestion: document.getElementById("sprintQuestion"),
  sprintOptions: document.getElementById("sprintOptions"),
  sprintFeedback: document.getElementById("sprintFeedback"),
  sprintTimerFill: document.getElementById("sprintTimerFill"),
  startSprintBtn: document.getElementById("startSprintBtn"),
  flashMeta: document.getElementById("flashMeta"),
  flashFront: document.getElementById("flashFront"),
  flashBack: document.getElementById("flashBack"),
  revealFlashBtn: document.getElementById("revealFlashBtn"),
  nextFlashBtn: document.getElementById("nextFlashBtn"),
  knowFlashBtn: document.getElementById("knowFlashBtn"),
  newPrepositionBtn: document.getElementById("newPrepositionBtn"),
  prepositionQuestion: document.getElementById("prepositionQuestion"),
  prepositionOptions: document.getElementById("prepositionOptions"),
  prepositionFeedback: document.getElementById("prepositionFeedback"),
  newMissionBtn: document.getElementById("newMissionBtn"),
  missionTitle: document.getElementById("missionTitle"),
  missionQuestion: document.getElementById("missionQuestion"),
  missionExpressions: document.getElementById("missionExpressions"),
  missionSteps: document.getElementById("missionSteps")
};

let flashWord = null;
let sprintStreak = 0;
let sprintLives = 3;
let sprintLocked = false;
let sprintTimer = null;
let sprintDeadline = 0;

function readJsonValue(key, fallback) {
  try {
    return JSON.parse(localStorage.getItem(key) || JSON.stringify(fallback));
  } catch {
    return fallback;
  }
}

function writeJsonValue(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function flattenWords(topics) {
  return topics.flatMap((topic) => ["B1", "B2", "C1"].flatMap((level) =>
    topic.levels[level].map((item) => {
      const [fr, en] = item.split("|");
      return {
        key: `${topic.id}:${level}:${fr}`,
        topicId: topic.id,
        topicTitle: topic.title,
        category: topic.category,
        level,
        fr,
        en
      };
    })
  ));
}

function getPoolTopics() {
  const mode = gameEls.poolSelect.value;
  const seen = new Set(readJsonValue(SEEN_KEY_GAME, []));
  const currentId = localStorage.getItem(CURRENT_TOPIC_KEY_GAME);

  if (mode === "current" && currentId) {
    return GAME_TOPICS.filter((topic) => topic.id === currentId);
  }

  if (mode === "seen") {
    const seenTopics = GAME_TOPICS.filter((topic) => seen.has(topic.id));
    return seenTopics.length ? seenTopics : GAME_TOPICS;
  }

  return GAME_TOPICS;
}

function shuffleItems(list) {
  const copy = [...list];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function getPoolWords() {
  return flattenWords(getPoolTopics());
}

function updatePoolLabel() {
  const mode = gameEls.poolSelect.value;
  gameEls.activePoolLabel.textContent =
    mode === "current" ? "Sujet actuel" : mode === "seen" ? "Sujets vus" : "Tous";
}

function updateKnownWords() {
  const known = new Set(readJsonValue(KNOWN_WORDS_KEY, []));
  gameEls.knownWords.textContent = String(known.size);
}

function readSprintBest() {
  return Number(localStorage.getItem(SPRINT_BEST_KEY) || 0);
}

function writeSprintBest(value) {
  localStorage.setItem(SPRINT_BEST_KEY, String(value));
}

function updateSprintStats() {
  gameEls.sprintStreak.textContent = String(sprintStreak);
  gameEls.sprintLives.textContent = String(sprintLives);
  gameEls.sprintBest.textContent = String(readSprintBest());
}

function paintSprintTimer(ratio) {
  if (!gameEls.sprintTimerFill || !gameEls.sprintSeconds) {
    return;
  }

  const safeRatio = Math.max(0, Math.min(1, ratio));
  gameEls.sprintTimerFill.style.width = `${safeRatio * 100}%`;
  gameEls.sprintSeconds.textContent = String(Math.max(0, Math.ceil((SPRINT_DURATION * safeRatio) / 1000)));
}

function renderExpressionChips(items) {
  return items.map((item) => {
    const [fr, en] = item.split("|");
    return `<span class="chip"><span class="chip-fr">${fr}</span><span class="chip-en">${en}</span></span>`;
  }).join("");
}

function markKnown(word) {
  const known = new Set(readJsonValue(KNOWN_WORDS_KEY, []));
  known.add(word.key);
  writeJsonValue(KNOWN_WORDS_KEY, [...known]);
  updateKnownWords();
}

function nextFlashcard() {
  const words = getPoolWords();
  if (!words.length) {
    gameEls.flashMeta.textContent = "Aucun mot disponible";
    gameEls.flashFront.textContent = "Reviens d'abord sur la page des sujets.";
    gameEls.flashBack.textContent = "";
    return;
  }

  flashWord = shuffleItems(words)[0];
  gameEls.flashMeta.textContent = `${flashWord.topicTitle} • ${flashWord.level}`;
  gameEls.flashFront.textContent = flashWord.fr;
  gameEls.flashBack.textContent = "Clique sur Voir la traduction";
}

function revealFlashcard() {
  if (!flashWord) {
    return;
  }
  gameEls.flashBack.textContent = flashWord.en;
}

function clearSprintTimer() {
  if (sprintTimer) {
    window.clearInterval(sprintTimer);
    sprintTimer = null;
  }
}

function finishSprint() {
  sprintLocked = true;
  gameEls.sprintFeedback.textContent = `Partie terminee. Serie finale: ${sprintStreak}.`;
}

function scheduleNextSprintRound() {
  clearSprintTimer();
  sprintTimer = window.setTimeout(() => {
    renderSprintRound();
  }, 650);
}

function startSprintCountdown(onTimeout) {
  clearSprintTimer();
  sprintDeadline = Date.now() + SPRINT_DURATION;
  paintSprintTimer(1);

  sprintTimer = window.setInterval(() => {
    const remaining = sprintDeadline - Date.now();
    if (remaining <= 0) {
      clearSprintTimer();
      paintSprintTimer(0);
      onTimeout();
      return;
    }

    paintSprintTimer(remaining / SPRINT_DURATION);
  }, 100);
}

function renderSprintRound() {
  if (!gameEls.sprintQuestion || !gameEls.sprintOptions || sprintLives <= 0) {
    return;
  }

  const words = getPoolWords();
  if (words.length < 4) {
    gameEls.sprintQuestion.textContent = "Pas assez de mots pour lancer le sprint.";
    gameEls.sprintOptions.innerHTML = "";
    return;
  }

  const [correct, ...rest] = shuffleItems(words);
  const distractors = shuffleItems(rest.filter((word) => word.fr !== correct.fr)).slice(0, 3);
  const options = shuffleItems([correct, ...distractors]);

  sprintLocked = false;
  gameEls.sprintQuestion.textContent = `Comment dit-on "${correct.en}" en francais ?`;
  gameEls.sprintFeedback.textContent = "Reponds vite pour garder ta serie.";
  gameEls.sprintOptions.innerHTML = options.map((option) => (
    `<button class="answer-btn" data-key="${option.key}" data-correct="${option.key === correct.key}">${option.fr}</button>`
  )).join("");

  startSprintCountdown(() => {
    if (sprintLocked) {
      return;
    }

    sprintLocked = true;
    sprintLives -= 1;
    gameEls.sprintFeedback.textContent = sprintLives > 0
      ? "Temps ecoule. Une vie en moins."
      : "Temps ecoule. Partie terminee.";
    updateSprintStats();
    gameEls.sprintOptions.querySelectorAll(".answer-btn").forEach((other) => {
      other.disabled = true;
      if (other.dataset.correct === "true") {
        other.classList.add("correct");
      }
    });
    if (sprintLives > 0) {
      scheduleNextSprintRound();
    } else {
      finishSprint();
    }
  });

  gameEls.sprintOptions.querySelectorAll(".answer-btn").forEach((button) => {
    button.addEventListener("click", () => {
      if (sprintLocked) {
        return;
      }

      sprintLocked = true;
      clearSprintTimer();
      const isCorrect = button.dataset.correct === "true";
      if (isCorrect) {
        sprintStreak += 1;
        button.classList.add("correct");
        markKnown(correct);
        gameEls.sprintFeedback.textContent = "Bien joue. On continue.";
        if (sprintStreak > readSprintBest()) {
          writeSprintBest(sprintStreak);
        }
        updateSprintStats();
        scheduleNextSprintRound();
      } else {
        sprintLives -= 1;
        button.classList.add("wrong");
        gameEls.sprintFeedback.textContent = sprintLives > 0
          ? "Rate. Une vie en moins."
          : "Plus de vies.";
        updateSprintStats();
        gameEls.sprintOptions.querySelectorAll(".answer-btn").forEach((other) => {
          other.disabled = true;
          if (other.dataset.correct === "true") {
            other.classList.add("correct");
          }
        });
        if (sprintLives > 0) {
          scheduleNextSprintRound();
        } else {
          finishSprint();
        }
        return;
      }

      gameEls.sprintOptions.querySelectorAll(".answer-btn").forEach((other) => {
        other.disabled = true;
        if (other.dataset.correct === "true") {
          other.classList.add("correct");
        }
      });
    });
  });
}

function startSprint() {
  clearSprintTimer();
  sprintStreak = 0;
  sprintLives = 3;
  updateSprintStats();
  paintSprintTimer(1);
  renderSprintRound();
}

function renderPrepositionGame() {
  if (!gameEls.prepositionQuestion || !gameEls.prepositionOptions || !gameEls.prepositionFeedback) {
    return;
  }

  const item = shuffleItems(PREPOSITION_QUESTIONS)[0];
  gameEls.prepositionQuestion.textContent = item.sentence;
  gameEls.prepositionFeedback.textContent = "Choisis la bonne preposition.";
  gameEls.prepositionOptions.innerHTML = shuffleItems(item.options).map((option) => (
    `<button class="answer-btn" data-correct="${option === item.answer}">${option}</button>`
  )).join("");

  gameEls.prepositionOptions.querySelectorAll(".answer-btn").forEach((button) => {
    button.addEventListener("click", () => {
      const isCorrect = button.dataset.correct === "true";
      gameEls.prepositionOptions.querySelectorAll(".answer-btn").forEach((other) => {
        other.disabled = true;
        if (other.dataset.correct === "true") {
          other.classList.add("correct");
        }
      });

      if (isCorrect) {
        button.classList.add("correct");
        gameEls.prepositionFeedback.textContent = "Bien joue. La preposition est correcte.";
      } else {
        button.classList.add("wrong");
        gameEls.prepositionFeedback.textContent = `Pas cette fois. La bonne reponse est "${item.answer}".`;
      }
    });
  });
}

function pickExpressionFromBank(bankId) {
  const bank = EXPRESSION_BANKS.find((item) => item.id === bankId);
  if (!bank) {
    return null;
  }
  return shuffleItems(bank.items)[0];
}

function renderMission() {
  if (!gameEls.missionTitle || !gameEls.missionQuestion || !gameEls.missionExpressions || !gameEls.missionSteps) {
    return;
  }

  const topics = getPoolTopics();
  const topic = topics.length ? shuffleItems(topics)[0] : shuffleItems(GAME_TOPICS)[0];
  const missionExpressions = [
    pickExpressionFromBank("opinion"),
    pickExpressionFromBank("reason"),
    pickExpressionFromBank("example"),
    pickExpressionFromBank("conclusion")
  ].filter(Boolean);

  gameEls.missionTitle.textContent = `${topic.title} • reponds en 4 phrases courtes`;
  gameEls.missionQuestion.textContent = topic.question;
  gameEls.missionExpressions.innerHTML = renderExpressionChips(missionExpressions);
  gameEls.missionSteps.innerHTML = [
    "1. Commence avec ton opinion.",
    "2. Utilise une raison claire.",
    "3. Ajoute un exemple personnel ou scolaire.",
    "4. Termine avec une petite conclusion."
  ].map((line) => `<div class="coach-step">${line}</div>`).join("");
}

function rerenderAllGames() {
  updatePoolLabel();
  startSprint();
  nextFlashcard();
  renderPrepositionGame();
  renderMission();
}

if (gameEls.poolSelect) {
  gameEls.poolSelect.addEventListener("change", rerenderAllGames);
}

if (gameEls.nextFlashBtn) {
  gameEls.nextFlashBtn.addEventListener("click", nextFlashcard);
}

if (gameEls.revealFlashBtn) {
  gameEls.revealFlashBtn.addEventListener("click", revealFlashcard);
}

if (gameEls.knowFlashBtn) {
  gameEls.knowFlashBtn.addEventListener("click", () => {
    if (flashWord) {
      markKnown(flashWord);
    }
  });
}

if (gameEls.startSprintBtn) {
  gameEls.startSprintBtn.addEventListener("click", startSprint);
}

if (gameEls.newPrepositionBtn) {
  gameEls.newPrepositionBtn.addEventListener("click", renderPrepositionGame);
}

if (gameEls.newMissionBtn) {
  gameEls.newMissionBtn.addEventListener("click", renderMission);
}

updateKnownWords();
updateSprintStats();
rerenderAllGames();
