const DATA = window.FrenchClassData;
const TOPICS = DATA.topics;
const BONUS = DATA.bonusChallenges;
const BUILDER = DATA.builderTemplates;

const SEEN_KEY = "french_class_seen_topics";
const HISTORY_KEY = "french_class_topic_history";
const CURRENT_TOPIC_KEY = "french_class_current_topic";

const elements = {
  randomBtn: document.getElementById("randomBtn"),
  unseenBtn: document.getElementById("unseenBtn"),
  resetBtn: document.getElementById("resetBtn"),
  fullscreenBtn: document.getElementById("fullscreenBtn"),
  topicCover: document.getElementById("topicCover"),
  topicCategory: document.getElementById("topicCategory"),
  topicDate: document.getElementById("topicDate"),
  rouletteText: document.getElementById("rouletteText"),
  topicTitle: document.getElementById("topicTitle"),
  topicLead: document.getElementById("topicLead"),
  topicQuestion: document.getElementById("topicQuestion"),
  topicMission: document.getElementById("topicMission"),
  topicGoalEn: document.getElementById("topicGoalEn"),
  builderList: document.getElementById("builderList"),
  phraseExamples: document.getElementById("phraseExamples"),
  b1List: document.getElementById("b1List"),
  b2List: document.getElementById("b2List"),
  c1List: document.getElementById("c1List"),
  rulesList: document.getElementById("rulesList"),
  starterList: document.getElementById("starterList"),
  coachList: document.getElementById("coachList"),
  anglesList: document.getElementById("anglesList"),
  totalTopics: document.getElementById("totalTopics"),
  seenTopics: document.getElementById("seenTopics"),
  currentWordCount: document.getElementById("currentWordCount"),
  bonusMode: document.getElementById("bonusMode"),
  bonusText: document.getElementById("bonusText"),
  progressLabel: document.getElementById("progressLabel"),
  progressFill: document.getElementById("progressFill"),
  remainingText: document.getElementById("remainingText"),
  recentList: document.getElementById("recentList"),
  timerDisplay: document.getElementById("timerDisplay"),
  timerButtons: document.querySelectorAll(".tiny-btn")
};

let currentTopicId = null;
let isDrawing = false;
let timerInterval = null;
let timerRemaining = 45;

function readJson(key, fallback) {
  try {
    return JSON.parse(localStorage.getItem(key) || JSON.stringify(fallback));
  } catch {
    return fallback;
  }
}

function writeJson(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function getSeenTopics() {
  return new Set(readJson(SEEN_KEY, []));
}

function getHistory() {
  return readJson(HISTORY_KEY, []);
}

function saveCurrentTopic(id) {
  localStorage.setItem(CURRENT_TOPIC_KEY, id);
}

function shuffle(list) {
  const copy = [...list];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function renderSimpleChips(target, items) {
  target.innerHTML = items.map((item) => `<span class="chip">${item}</span>`).join("");
}

function renderVocab(target, items) {
  target.innerHTML = items.map((item) => {
    const [fr, en] = item.split("|");
    return `<span class="chip"><span class="chip-fr">${fr}</span><span class="chip-en">${en}</span></span>`;
  }).join("");
}

function renderCoach(target, items) {
  target.innerHTML = items.map((item, index) => (
    `<div class="coach-step"><strong>${index + 1}.</strong> ${item}</div>`
  )).join("");
}

function renderPhraseExamples(items) {
  elements.phraseExamples.innerHTML = items.map((item, index) => (
    `<div class="coach-step"><strong>Phrase ${index + 1}.</strong> ${item}</div>`
  )).join("");
}

function updateTheme(topic) {
  document.documentElement.style.setProperty("--accent", "#0055a4");
  document.documentElement.style.setProperty("--accent-soft", "rgba(0, 85, 164, 0.2)");
  document.documentElement.style.setProperty("--accent-2", "#ef4135");
}

function hexToSoft(hex) {
  const clean = hex.replace("#", "");
  const r = parseInt(clean.slice(0, 2), 16);
  const g = parseInt(clean.slice(2, 4), 16);
  const b = parseInt(clean.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, 0.18)`;
}

function markSeen(topicId) {
  const seen = getSeenTopics();
  if (!seen.has(topicId)) {
    seen.add(topicId);
    writeJson(SEEN_KEY, [...seen]);
  }

  const history = getHistory().filter((item) => item !== topicId);
  history.unshift(topicId);
  writeJson(HISTORY_KEY, history.slice(0, 8));
}

function renderStats(currentTopic) {
  const seen = getSeenTopics();
  elements.totalTopics.textContent = String(TOPICS.length);
  elements.seenTopics.textContent = String(seen.size);
  elements.currentWordCount.textContent = currentTopic
    ? String(currentTopic.levels.B1.length + currentTopic.levels.B2.length + currentTopic.levels.C1.length)
    : "0";

  elements.progressLabel.textContent = `${seen.size} / ${TOPICS.length}`;
  elements.progressFill.style.width = `${(seen.size / TOPICS.length) * 100}%`;

  const remaining = TOPICS.length - seen.size;
  elements.remainingText.textContent = remaining > 0
    ? `${remaining} sujets n'ont pas encore ete vus.`
    : "Tous les sujets ont deja ete decouverts au moins une fois.";

  const history = getHistory();
  elements.recentList.innerHTML = history.length
    ? history
      .map((id) => TOPICS.find((topic) => topic.id === id))
      .filter(Boolean)
      .map((topic) => `<span class="recent-item">${topic.title}</span>`)
      .join("")
    : '<span class="recent-item">Aucun sujet vu pour le moment</span>';
}

function renderWaitingState() {
  elements.topicCategory.textContent = "Sujet surprise";
  elements.topicDate.textContent = "Pret";
  elements.rouletteText.textContent = 'Appuie sur "Tirer un sujet".';
  elements.topicTitle.textContent = "La pioche attend le prochain reveal";
  elements.topicLead.textContent = "Tire un sujet pour afficher une vraie question de classe avec tout le vocabulaire du theme.";
  elements.topicQuestion.textContent = "Quel sujet va tomber cette fois ?";
  elements.topicMission.textContent = "Tu recevras une mission simple des le reveal.";
  elements.topicGoalEn.textContent = "English goal: you will get a simple speaking target.";
  renderVocab(elements.builderList, BUILDER.slice(0, 4));
  renderPhraseExamples([
    "Je pense que ce sujet est important pour les jeunes.",
    "Parce que dans la vie quotidienne, on voit souvent ce probleme.",
    "Par exemple, dans mon ecole, les opinions sont differentes.",
    "Donc, a mon avis, il faut une solution simple."
  ]);
  renderVocab(elements.b1List, ["mot cache|hidden word", "mot surprise|surprise word"]);
  renderVocab(elements.b2List, ["idee cachee|hidden idea", "expression surprise|surprise expression"]);
  renderVocab(elements.c1List, ["nuance cachee|hidden nuance", "phrase surprise|surprise phrase"]);
  renderSimpleChips(elements.rulesList, ["la pioche choisit", "la classe reagit", "on improvise"]);
  renderSimpleChips(elements.starterList, ["Je pense que...", "Parce que...", "Par exemple..."]);
  renderCoach(elements.coachList, [
    "Read the question.",
    "Choose your opinion.",
    "Use one French example.",
    "Finish with a simple final idea."
  ]);
  renderSimpleChips(elements.anglesList, ["prix", "habitudes", "exemples"]);
  elements.bonusMode.textContent = "Surprise";
  elements.bonusText.textContent = "Le defi apparait en meme temps que le sujet.";
  elements.topicCover.classList.remove("hidden");
  renderStats(null);
}

function renderTopic(topic) {
  currentTopicId = topic.id;
  saveCurrentTopic(topic.id);
  markSeen(topic.id);
  updateTheme(topic);

  const bonus = BONUS[Math.floor(Math.random() * BONUS.length)];

  elements.topicCategory.textContent = topic.category;
  elements.topicDate.textContent = topic.date;
  elements.rouletteText.textContent = `Sujet en cours : ${topic.title}`;
  elements.topicTitle.textContent = topic.title;
  elements.topicLead.textContent = topic.lead;
  elements.topicQuestion.textContent = topic.question;
  elements.topicMission.textContent = topic.mission;
  elements.topicGoalEn.textContent = `English goal: ${topic.goalEn}`;
  renderVocab(elements.builderList, BUILDER);
  renderPhraseExamples([
    `Je pense que ${topic.title.toLowerCase()} est un sujet important.`,
    "Parce que dans la vie quotidienne, cela change beaucoup de choses.",
    `Par exemple, dans mon experience, je vois ce sujet assez souvent.`,
    "Donc, a mon avis, une regle simple ou une bonne habitude peut aider."
  ]);
  renderVocab(elements.b1List, topic.levels.B1);
  renderVocab(elements.b2List, topic.levels.B2);
  renderVocab(elements.c1List, topic.levels.C1);
  renderSimpleChips(elements.rulesList, topic.rules);
  renderSimpleChips(elements.starterList, topic.starters);
  renderCoach(elements.coachList, topic.coach);
  renderSimpleChips(elements.anglesList, topic.angles);
  elements.bonusMode.textContent = bonus.mode;
  elements.bonusText.textContent = bonus.text;
  elements.topicCover.classList.add("hidden");
  renderStats(topic);
}

function pickRandomTopic(unseenOnly = false) {
  const seen = getSeenTopics();
  let pool = TOPICS.filter((topic) => topic.id !== currentTopicId);

  if (unseenOnly) {
    pool = pool.filter((topic) => !seen.has(topic.id));
  }

  if (pool.length === 0) {
    pool = TOPICS.filter((topic) => topic.id !== currentTopicId);
  }

  return shuffle(pool)[0];
}

function animateDraw(unseenOnly = false) {
  if (isDrawing) {
    return;
  }

  isDrawing = true;
  elements.topicCover.classList.remove("hidden");
  elements.randomBtn.disabled = true;
  elements.unseenBtn.disabled = true;

  const steps = [
    "La pioche tourne...",
    "On melange les themes...",
    "Le sujet arrive...",
    "3",
    "2",
    "1"
  ];

  let index = 0;
  const timer = setInterval(() => {
    elements.rouletteText.textContent = steps[index];
    index += 1;
    if (index >= steps.length) {
      clearInterval(timer);
      renderTopic(pickRandomTopic(unseenOnly));
      elements.randomBtn.disabled = false;
      elements.unseenBtn.disabled = false;
      isDrawing = false;
    }
  }, 380);
}

function resetProgress() {
  localStorage.removeItem(SEEN_KEY);
  localStorage.removeItem(HISTORY_KEY);
  localStorage.removeItem(CURRENT_TOPIC_KEY);
  currentTopicId = null;
  renderWaitingState();
}

function updateTimerDisplay() {
  const minutes = String(Math.floor(timerRemaining / 60)).padStart(2, "0");
  const seconds = String(timerRemaining % 60).padStart(2, "0");
  elements.timerDisplay.textContent = `${minutes}:${seconds}`;
}

function stopTimer(resetToDefault = false) {
  if (timerInterval) {
    clearInterval(timerInterval);
    timerInterval = null;
  }
  if (resetToDefault) {
    timerRemaining = 45;
  }
  updateTimerDisplay();
}

function startTimer(seconds) {
  stopTimer();
  timerRemaining = seconds;
  updateTimerDisplay();
  timerInterval = setInterval(() => {
    timerRemaining -= 1;
    updateTimerDisplay();
    if (timerRemaining <= 0) {
      clearInterval(timerInterval);
      timerInterval = null;
      elements.timerDisplay.textContent = "00:00";
    }
  }, 1000);
}

elements.randomBtn.addEventListener("click", () => animateDraw(false));
elements.unseenBtn.addEventListener("click", () => animateDraw(true));
elements.resetBtn.addEventListener("click", resetProgress);
elements.fullscreenBtn.addEventListener("click", async () => {
  if (!document.fullscreenElement) {
    await document.documentElement.requestFullscreen();
  } else {
    await document.exitFullscreen();
  }
});

elements.timerButtons.forEach((button) => {
  button.addEventListener("click", () => {
    if (button.dataset.action === "stop") {
      stopTimer(true);
      return;
    }
    startTimer(Number(button.dataset.seconds));
  });
});

document.addEventListener("keydown", (event) => {
  if (event.code === "Space") {
    event.preventDefault();
    animateDraw(false);
  }
});

updateTimerDisplay();
renderWaitingState();
