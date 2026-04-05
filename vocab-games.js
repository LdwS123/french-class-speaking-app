const GAME_DATA = window.FrenchClassData;
const GAME_TOPICS = GAME_DATA.topics;
const CURRENT_TOPIC_KEY_GAME = "french_class_current_topic";
const SEEN_KEY_GAME = "french_class_seen_topics";
const KNOWN_WORDS_KEY = "french_class_known_words";

const gameEls = {
  poolSelect: document.getElementById("poolSelect"),
  activePoolLabel: document.getElementById("activePoolLabel"),
  knownWords: document.getElementById("knownWords"),
  flashMeta: document.getElementById("flashMeta"),
  flashFront: document.getElementById("flashFront"),
  flashBack: document.getElementById("flashBack"),
  revealFlashBtn: document.getElementById("revealFlashBtn"),
  nextFlashBtn: document.getElementById("nextFlashBtn"),
  knowFlashBtn: document.getElementById("knowFlashBtn"),
  quizQuestion: document.getElementById("quizQuestion"),
  quizOptions: document.getElementById("quizOptions"),
  quizResult: document.getElementById("quizResult"),
  quizScore: document.getElementById("quizScore"),
  quizTotal: document.getElementById("quizTotal"),
  newQuizBtn: document.getElementById("newQuizBtn"),
  newPackBtn: document.getElementById("newPackBtn"),
  packTitle: document.getElementById("packTitle"),
  packWords: document.getElementById("packWords"),
  packTasks: document.getElementById("packTasks")
};

let flashWord = null;
let quizScore = 0;
let quizTotal = 0;

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

function nextQuiz() {
  const words = getPoolWords();
  if (words.length < 4) {
    gameEls.quizQuestion.textContent = "Pas assez de mots pour lancer le quiz.";
    gameEls.quizOptions.innerHTML = "";
    return;
  }

  const [correct, ...rest] = shuffleItems(words);
  const distractors = shuffleItems(rest.filter((word) => word.en !== correct.en)).slice(0, 3);
  const options = shuffleItems([correct, ...distractors]);

  gameEls.quizQuestion.textContent = `Que veut dire "${correct.fr}" ?`;
  gameEls.quizOptions.innerHTML = options.map((option) => (
    `<button class="answer-btn" data-key="${option.key}" data-correct="${option.key === correct.key}">${option.en}</button>`
  )).join("");

  gameEls.quizOptions.querySelectorAll(".answer-btn").forEach((button) => {
    button.addEventListener("click", () => {
      const isCorrect = button.dataset.correct === "true";
      quizTotal += 1;
      if (isCorrect) {
        quizScore += 1;
        button.classList.add("correct");
        markKnown(correct);
      } else {
        button.classList.add("wrong");
      }

      gameEls.quizScore.textContent = String(quizScore);
      gameEls.quizTotal.textContent = String(quizTotal);

      gameEls.quizOptions.querySelectorAll(".answer-btn").forEach((other) => {
        other.disabled = true;
        if (other.dataset.correct === "true") {
          other.classList.add("correct");
        }
      });
    });
  });
}

function renderPack() {
  const topics = getPoolTopics();
  if (!topics.length) {
    gameEls.packTitle.textContent = "Aucun pack disponible pour ce filtre.";
    gameEls.packWords.innerHTML = "";
    gameEls.packTasks.innerHTML = "";
    return;
  }

  const topic = shuffleItems(topics)[0];
  const words = shuffleItems([
    ...topic.levels.B1.slice(0, 2),
    ...topic.levels.B2.slice(0, 2),
    ...topic.levels.C1.slice(0, 2)
  ]);

  gameEls.packTitle.textContent = `${topic.title} • utilise 3 a 4 mots dans une mini reponse orale`;
  gameEls.packWords.innerHTML = words.map((item) => {
    const [fr, en] = item.split("|");
    return `<span class="chip"><span class="chip-fr">${fr}</span><span class="chip-en">${en}</span></span>`;
  }).join("");

  gameEls.packTasks.innerHTML = [
    "1. Choisis 3 mots du pack.",
    "2. Fais une phrase avec Je pense que...",
    "3. Ajoute parce que...",
    "4. Termine avec un exemple."
  ].map((line) => `<div class="coach-step">${line}</div>`).join("");
}

function rerenderAllGames() {
  updatePoolLabel();
  nextFlashcard();
  nextQuiz();
  renderPack();
}

gameEls.poolSelect.addEventListener("change", rerenderAllGames);
gameEls.nextFlashBtn.addEventListener("click", nextFlashcard);
gameEls.revealFlashBtn.addEventListener("click", revealFlashcard);
gameEls.knowFlashBtn.addEventListener("click", () => {
  if (flashWord) {
    markKnown(flashWord);
  }
});
gameEls.newQuizBtn.addEventListener("click", nextQuiz);
gameEls.newPackBtn.addEventListener("click", renderPack);

updateKnownWords();
rerenderAllGames();
