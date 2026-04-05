const { shuffle, pick, storeGet, storeSet, clear, el, setText,
        renderVocab, renderChips, renderCoach,
        renderAnswerBtns, lockBtns, showCorrect } = window.FrUtils;

const GAME_DATA       = window.FrenchClassData;
const GAME_TOPICS     = GAME_DATA.topics;
const GAME_PACKS      = GAME_DATA.globalVocabPacks  || [];
const EXPRESSION_BANKS = GAME_DATA.expressionBanks  || [];

const CURRENT_TOPIC_KEY = 'french_class_current_topic';
const SEEN_KEY          = 'french_class_seen_topics';
const KNOWN_WORDS_KEY   = 'french_class_known_words';
const SPRINT_BEST_KEY   = 'french_class_sprint_best';
const SPRINT_MS         = 5000;

const PREPOSITION_QUESTIONS = [
  { sentence: 'Je vais __ la bibliotheque apres les cours.',    answer: 'a',    options: ['a', 'de', 'chez', 'sur']   },
  { sentence: 'On parle souvent __ ce sujet en classe.',        answer: 'de',   options: ['de', 'a', 'pour', 'dans']  },
  { sentence: 'Elle habite __ France depuis un an.',            answer: 'en',   options: ['en', 'a', 'chez', 'sur']   },
  { sentence: 'Je laisse mon sac __ la table.',                 answer: 'sur',  options: ['sur', 'dans', 'chez', 'de'] },
  { sentence: 'Il travaille __ un hopital a Paris.',            answer: 'dans', options: ['dans', 'en', 'de', 'a']    },
  { sentence: 'Nous allons __ Paul ce soir.',                   answer: 'chez', options: ['chez', 'dans', 'pour', 'sur'] },
  { sentence: 'Je fais cet exercice __ progresser en francais.', answer: 'pour', options: ['pour', 'de', 'a', 'en']   },
  { sentence: 'Son appartement est __ le troisieme etage.',     answer: 'au',   options: ['au', 'dans', 'sur', 'de']  },
  { sentence: 'Je rentre __ l\'ecole a 17h.',                   answer: 'de',   options: ['de', 'a', 'en', 'dans']    }
];

// ─── DOM refs ────────────────────────────────────────────────
const g = {
  poolSelect:          document.getElementById('poolSelect'),
  activePoolLabel:     document.getElementById('activePoolLabel'),
  knownWords:          document.getElementById('knownWords'),
  knownWordsFlash:     document.getElementById('knownWordsFlash'),
  sprintBest:          document.getElementById('sprintBest'),

  // Sprint
  sprintModeSelect:    document.getElementById('sprintModeSelect'),
  sprintModeLabel:     document.getElementById('sprintModeLabel'),
  startSprintBtn:      document.getElementById('startSprintBtn'),
  sprintReady:         document.getElementById('sprintReady'),
  sprintStreak:        document.getElementById('sprintStreak'),
  sprintLivesDisplay:  document.getElementById('sprintLivesDisplay'),
  sprintRound:         document.getElementById('sprintRound'),
  sprintSeconds:       document.getElementById('sprintSeconds'),
  sprintTimerFill:     document.getElementById('sprintTimerFill'),
  sprintQuestion:      document.getElementById('sprintQuestion'),
  sprintOptions:       document.getElementById('sprintOptions'),
  sprintFeedback:      document.getElementById('sprintFeedback'),

  // Flashcard
  flashMeta:           document.getElementById('flashMeta'),
  flashFront:          document.getElementById('flashFront'),
  flashBack:           document.getElementById('flashBack'),
  revealFlashBtn:      document.getElementById('revealFlashBtn'),
  nextFlashBtn:        document.getElementById('nextFlashBtn'),
  knowFlashBtn:        document.getElementById('knowFlashBtn'),

  // Prepositions
  newPrepositionBtn:   document.getElementById('newPrepositionBtn'),
  prepositionQuestion: document.getElementById('prepositionQuestion'),
  prepositionOptions:  document.getElementById('prepositionOptions'),
  prepositionFeedback: document.getElementById('prepositionFeedback'),

  // Mission
  newMissionBtn:       document.getElementById('newMissionBtn'),
  missionTitle:        document.getElementById('missionTitle'),
  missionQuestion:     document.getElementById('missionQuestion'),
  missionExpressions:  document.getElementById('missionExpressions'),
  missionSteps:        document.getElementById('missionSteps')
};

// ─── State ────────────────────────────────────────────────────
let flashWord      = null;
let sprintStreak   = 0;
let sprintLives    = 3;
let sprintRound    = 0;
let sprintLocked   = false;
let sprintStarted  = false;
let sprintTimer    = null;
let sprintDeadline = 0;

// ─── Pool helpers ─────────────────────────────────────────────
function flattenSource(source) {
  return ['B1', 'B2', 'C1'].flatMap(level =>
    source.levels[level].map(raw => {
      const [fr, en] = raw.split('|');
      return { key: `${source.id}:${level}:${fr}`, topicId: source.id,
               topicTitle: source.title, category: source.category, level, fr, en };
    })
  );
}

function getPoolSources() {
  const mode    = g.poolSelect?.value ?? 'all';
  const seen    = new Set(storeGet(SEEN_KEY, []));
  const current = localStorage.getItem(CURRENT_TOPIC_KEY);

  if (mode === 'current' && current) return GAME_TOPICS.filter(t => t.id === current);
  if (mode === 'seen') {
    const s = GAME_TOPICS.filter(t => seen.has(t.id));
    return s.length ? s : GAME_TOPICS;
  }
  return GAME_TOPICS;
}

function getPoolWords() {
  return [...flattenSource({ id: 'packs', title: 'Packs', category: 'Packs',
    levels: { B1: [], B2: [], C1: [] } }),
    ...flattenSource.call(null, ...GAME_PACKS.map(() => null)) // placeholder
  ];
  // Actually build properly:
}

// Fixed version
function buildPoolWords() {
  const topics = getPoolSources();
  const topicWords = topics.flatMap(flattenSource);
  const packWords  = GAME_PACKS.flatMap(flattenSource);
  return [...topicWords, ...packWords];
}

function updatePoolLabel() {
  const mode = g.poolSelect?.value ?? 'all';
  const labels = { current: 'Sujet actuel', seen: 'Sujets vus', all: 'Tous' };
  if (g.activePoolLabel) setText(g.activePoolLabel, labels[mode] ?? 'Tous');
}

// ─── Known words ──────────────────────────────────────────────
function getKnown()          { return new Set(storeGet(KNOWN_WORDS_KEY, [])); }
function markKnown(word)     { const k = getKnown(); k.add(word.key); storeSet(KNOWN_WORDS_KEY, [...k]); updateKnownCount(); }
function updateKnownCount()  {
  const n = getKnown().size;
  if (g.knownWords)      setText(g.knownWords,      String(n));
  if (g.knownWordsFlash) setText(g.knownWordsFlash, String(n));
}

// ─── Sprint best ──────────────────────────────────────────────
function getBest()      { return Number(localStorage.getItem(SPRINT_BEST_KEY) || 0); }
function saveBest(n)    { localStorage.setItem(SPRINT_BEST_KEY, String(n)); }
function updateBest()   { if (g.sprintBest) setText(g.sprintBest, String(getBest())); }

// ─── Sprint UI helpers ────────────────────────────────────────
function livesDisplay(n) {
  return '♥'.repeat(Math.max(0, n)) + '♡'.repeat(Math.max(0, 3 - n));
}

function updateSprintStats() {
  if (g.sprintStreak)       setText(g.sprintStreak,       String(sprintStreak));
  if (g.sprintLivesDisplay) setText(g.sprintLivesDisplay, livesDisplay(sprintLives));
  if (g.sprintRound)        setText(g.sprintRound,        String(sprintRound));
  updateBest();
}

function getSprintMode() { return g.sprintModeSelect?.value ?? 'mix'; }

function updateSprintModeLabel() {
  const labels = { 'en-fr': 'Anglais → Francais', 'fr-en': 'Francais → Anglais', mix: 'Mixte (FR ↔ EN)' };
  if (g.sprintModeLabel) setText(g.sprintModeLabel, labels[getSprintMode()] ?? 'Mixte');
}

function paintTimer(ratio) {
  if (!g.sprintTimerFill) return;
  g.sprintTimerFill.style.width = `${Math.max(0, Math.min(1, ratio)) * 100}%`;
  // Color: green → orange → red
  const hue = Math.round(ratio * 120); // 120=green, 0=red
  g.sprintTimerFill.style.background = `hsl(${hue}, 80%, 48%)`;
  if (g.sprintSeconds) setText(g.sprintSeconds, `${Math.max(0, Math.ceil(SPRINT_MS * ratio / 1000))}s`);
}

function clearSprintTimer() {
  if (sprintTimer) { clearInterval(sprintTimer); sprintTimer = null; }
}

function startCountdown(onTimeout) {
  clearSprintTimer();
  sprintDeadline = Date.now() + SPRINT_MS;
  paintTimer(1);
  sprintTimer = setInterval(() => {
    const left = sprintDeadline - Date.now();
    if (left <= 0) { clearSprintTimer(); paintTimer(0); onTimeout(); return; }
    paintTimer(left / SPRINT_MS);
  }, 80);
}

// ─── Sprint game ──────────────────────────────────────────────
function showSprintReady(msg) {
  sprintStarted = false;
  sprintLocked  = true;
  clearSprintTimer();
  paintTimer(1);
  clear(g.sprintOptions);
  if (g.sprintQuestion)  setText(g.sprintQuestion, '');
  if (g.sprintFeedback)  setText(g.sprintFeedback, msg ?? '');
  if (g.sprintReady)     g.sprintReady.classList.remove('hidden');
  if (g.startSprintBtn)  setText(g.startSprintBtn, sprintRound === 0 ? 'Lancer le sprint' : 'Rejouer');
}

function finishSprint() {
  sprintLocked  = true;
  sprintStarted = false;
  showSprintReady(`Partie terminee. Meilleure serie : ${getBest()}.`);
}

function scheduleNext() {
  clearSprintTimer();
  sprintTimer = setTimeout(renderSprintRound, 700);
}

function renderSprintRound() {
  const words = buildPoolWords();
  if (words.length < 4) {
    showSprintReady('Pas assez de mots. Choisis une autre banque.');
    return;
  }

  const [correct, ...rest] = shuffle(words);
  const mode      = getSprintMode();
  const direction = mode === 'mix' ? (Math.random() > 0.5 ? 'en-fr' : 'fr-en') : mode;
  const distractors = shuffle(
    rest.filter(w => direction === 'en-fr' ? w.fr !== correct.fr : w.en !== correct.en)
  ).slice(0, 3);
  const options = shuffle([correct, ...distractors]);

  sprintRound += 1;
  sprintLocked  = false;
  updateSprintStats();
  if (g.sprintReady) g.sprintReady.classList.add('hidden');

  if (g.sprintQuestion) {
    setText(g.sprintQuestion,
      direction === 'en-fr'
        ? `Comment dit-on "${correct.en}" en francais ?`
        : `What does "${correct.fr}" mean in English?`
    );
  }
  if (g.sprintFeedback) setText(g.sprintFeedback, '');

  renderAnswerBtns(g.sprintOptions,
    options.map(o => ({ text: direction === 'en-fr' ? o.fr : o.en, isCorrect: o.key === correct.key })),
    (btn, isCorrect) => {
      if (sprintLocked) return;
      sprintLocked = true;
      clearSprintTimer();

      lockBtns(g.sprintOptions);
      showCorrect(g.sprintOptions);

      if (isCorrect) {
        btn.classList.add('correct');
        sprintStreak += 1;
        markKnown(correct);
        if (sprintStreak > getBest()) saveBest(sprintStreak);
        updateSprintStats();
        if (g.sprintFeedback) setText(g.sprintFeedback, `Correct ! Serie : ${sprintStreak}`);
        scheduleNext();
      } else {
        btn.classList.add('wrong');
        sprintLives -= 1;
        updateSprintStats();
        if (g.sprintFeedback) setText(g.sprintFeedback,
          sprintLives > 0 ? `Rate. Il restait "${direction === 'en-fr' ? correct.fr : correct.en}".` : 'Plus de vies. Fin du sprint.');
        if (sprintLives > 0) scheduleNext(); else finishSprint();
      }
    }
  );

  startCountdown(() => {
    if (sprintLocked) return;
    sprintLocked = true;
    sprintLives -= 1;
    lockBtns(g.sprintOptions);
    showCorrect(g.sprintOptions);
    updateSprintStats();
    if (g.sprintFeedback) setText(g.sprintFeedback,
      sprintLives > 0 ? 'Temps ecoule. Une vie en moins.' : 'Temps ecoule. Fin du sprint.');
    if (sprintLives > 0) scheduleNext(); else finishSprint();
  });
}

function startSprint() {
  sprintStreak  = 0;
  sprintLives   = 3;
  sprintRound   = 0;
  sprintStarted = true;
  sprintLocked  = false;
  updateSprintStats();
  if (g.sprintReady) g.sprintReady.classList.add('hidden');
  if (g.startSprintBtn) setText(g.startSprintBtn, 'Rejouer');
  renderSprintRound();
}

// ─── Flashcard ────────────────────────────────────────────────
function nextFlashcard() {
  const words = buildPoolWords();
  if (!words.length) {
    if (g.flashFront) setText(g.flashFront, 'Aucun mot disponible.');
    if (g.flashMeta)  setText(g.flashMeta,  'Reviens sur la page Sujets d\'abord.');
    return;
  }
  flashWord = pick(shuffle(words));
  if (g.flashMeta)  setText(g.flashMeta,  `${flashWord.topicTitle} · ${flashWord.level}`);
  if (g.flashFront) setText(g.flashFront, flashWord.fr);
  if (g.flashBack) {
    setText(g.flashBack, '');
    g.flashBack.classList.add('hidden');
  }
}

function revealFlashcard() {
  if (!flashWord || !g.flashBack) return;
  setText(g.flashBack, flashWord.en);
  g.flashBack.classList.remove('hidden');
}

// ─── Prepositions ─────────────────────────────────────────────
function renderPrepositionGame() {
  if (!g.prepositionQuestion || !g.prepositionOptions) return;
  const item = pick(shuffle(PREPOSITION_QUESTIONS));
  setText(g.prepositionQuestion, item.sentence.replace('__', '____'));
  if (g.prepositionFeedback) setText(g.prepositionFeedback, 'Choisis la bonne preposition.');

  renderAnswerBtns(g.prepositionOptions,
    shuffle(item.options).map(opt => ({ text: opt, isCorrect: opt === item.answer })),
    (btn, isCorrect) => {
      lockBtns(g.prepositionOptions);
      showCorrect(g.prepositionOptions);
      if (isCorrect) {
        btn.classList.add('correct');
        if (g.prepositionFeedback) setText(g.prepositionFeedback, `Bien joue ! "${item.answer}" est correct.`);
      } else {
        btn.classList.add('wrong');
        if (g.prepositionFeedback) setText(g.prepositionFeedback, `Pas tout a fait. La bonne reponse etait "${item.answer}".`);
      }
    },
    'prep-btn'
  );
}

// ─── Mission ──────────────────────────────────────────────────
function pickFromBank(bankId) {
  const bank = EXPRESSION_BANKS.find(b => b.id === bankId);
  if (!bank) return null;
  const [fr] = pick(shuffle(bank.items)).split('|');
  return fr;
}

function renderMission() {
  const sources = getPoolSources();
  const topic   = pick(shuffle(sources.length ? sources : GAME_TOPICS));

  if (g.missionTitle)    setText(g.missionTitle,    `${topic.title} — reponds en 4 phrases`);
  if (g.missionQuestion) setText(g.missionQuestion, topic.question);

  const exprs = ['opinion', 'reason', 'example', 'conclusion']
    .map(pickFromBank)
    .filter(Boolean);

  if (g.missionExpressions) {
    clear(g.missionExpressions);
    exprs.forEach(fr => {
      const chip = el('span', 'chip');
      chip.appendChild(el('span', 'chip-fr', fr));
      g.missionExpressions.appendChild(chip);
    });
  }

  if (g.missionSteps) {
    renderCoach(g.missionSteps, [
      'Commence avec ton opinion.',
      'Utilise une raison claire.',
      'Ajoute un exemple personnel.',
      'Termine avec une courte conclusion.'
    ]);
  }
}

// ─── Tabs ─────────────────────────────────────────────────────
function initTabs() {
  const tabBtns   = document.querySelectorAll('.game-tab');
  const tabPanels = document.querySelectorAll('.game-tab-panel');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const target = btn.dataset.tab;
      tabBtns.forEach(b => b.classList.toggle('is-active', b.dataset.tab === target));
      tabPanels.forEach(p => p.classList.toggle('is-active', p.id === `tab-${target}`));
    });
  });
}

// ─── Init ─────────────────────────────────────────────────────
function init() {
  updateKnownCount();
  updateBest();
  updatePoolLabel();
  updateSprintModeLabel();
  showSprintReady('Choisis un mode et lance le sprint.');
  nextFlashcard();
  renderPrepositionGame();
  renderMission();
  initTabs();
}

// ─── Events ───────────────────────────────────────────────────
g.poolSelect?.addEventListener('change', () => {
  updatePoolLabel();
  showSprintReady('Banque changee. Lance un nouveau sprint.');
  nextFlashcard();
  renderMission();
});

g.startSprintBtn?.addEventListener('click', startSprint);
g.sprintModeSelect?.addEventListener('change', () => {
  updateSprintModeLabel();
  showSprintReady('Mode change. Lance le sprint.');
});

g.revealFlashBtn?.addEventListener('click', revealFlashcard);
g.nextFlashBtn?.addEventListener('click', nextFlashcard);
g.knowFlashBtn?.addEventListener('click', () => { if (flashWord) markKnown(flashWord); nextFlashcard(); });

g.newPrepositionBtn?.addEventListener('click', renderPrepositionGame);
g.newMissionBtn?.addEventListener('click', renderMission);

init();
