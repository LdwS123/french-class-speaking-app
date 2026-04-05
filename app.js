const { shuffle, pick, storeGet, storeSet, clear, el, setText,
        renderVocab, renderChips, renderCoach } = window.FrUtils;

const DATA    = window.FrenchClassData;
const TOPICS  = DATA.topics;
const BONUS   = DATA.bonusChallenges;
const BUILDER = DATA.builderTemplates;

const SEEN_KEY    = 'french_class_seen_topics';
const HISTORY_KEY = 'french_class_topic_history';
const CURRENT_KEY = 'french_class_current_topic';

const e = {
  randomBtn:        document.getElementById('randomBtn'),
  unseenBtn:        document.getElementById('unseenBtn'),
  resetBtn:         document.getElementById('resetBtn'),
  fullscreenBtn:    document.getElementById('fullscreenBtn'),
  topicCover:       document.getElementById('topicCover'),
  topicCategory:    document.getElementById('topicCategory'),
  topicDate:        document.getElementById('topicDate'),
  rouletteText:     document.getElementById('rouletteText'),
  topicTitle:       document.getElementById('topicTitle'),
  topicLead:        document.getElementById('topicLead'),
  topicQuestion:    document.getElementById('topicQuestion'),
  topicMission:     document.getElementById('topicMission'),
  topicGoalEn:      document.getElementById('topicGoalEn'),
  builderList:      document.getElementById('builderList'),
  phraseExamples:   document.getElementById('phraseExamples'),
  b1List:           document.getElementById('b1List'),
  b2List:           document.getElementById('b2List'),
  c1List:           document.getElementById('c1List'),
  rulesList:        document.getElementById('rulesList'),
  starterList:      document.getElementById('starterList'),
  coachList:        document.getElementById('coachList'),
  anglesList:       document.getElementById('anglesList'),
  totalTopics:      document.getElementById('totalTopics'),
  seenTopics:       document.getElementById('seenTopics'),
  currentWordCount: document.getElementById('currentWordCount'),
  bonusMode:        document.getElementById('bonusMode'),
  bonusText:        document.getElementById('bonusText'),
  progressLabel:    document.getElementById('progressLabel'),
  progressFill:     document.getElementById('progressFill'),
  remainingText:    document.getElementById('remainingText'),
  recentList:       document.getElementById('recentList'),
  timerDisplay:     document.getElementById('timerDisplay'),
};

let currentTopicId = null;
let isDrawing      = false;
let timerInterval  = null;
let timerRemaining = 45;

// ─── Seen / history ───────────────────────────────────────────
function getSeenTopics() { return new Set(storeGet(SEEN_KEY, [])); }
function getHistory()    { return storeGet(HISTORY_KEY, []); }

function markSeen(topicId) {
  const seen = getSeenTopics();
  if (!seen.has(topicId)) { seen.add(topicId); storeSet(SEEN_KEY, [...seen]); }
  const history = getHistory().filter(id => id !== topicId);
  history.unshift(topicId);
  storeSet(HISTORY_KEY, history.slice(0, 8));
}

// ─── Phrase examples ──────────────────────────────────────────
function renderPhraseExamples(items) {
  if (!e.phraseExamples) return;
  clear(e.phraseExamples);
  items.forEach((item, i) => {
    const div = el('div', 'coach-step');
    div.appendChild(el('strong', '', `Phrase ${i + 1}.`));
    div.appendChild(document.createTextNode(' ' + item));
    e.phraseExamples.appendChild(div);
  });
}

// ─── Stats ────────────────────────────────────────────────────
function renderStats(currentTopic) {
  const seen      = getSeenTopics();
  const remaining = TOPICS.length - seen.size;

  if (e.totalTopics)      setText(e.totalTopics,    String(TOPICS.length));
  if (e.seenTopics)       setText(e.seenTopics,     String(seen.size));
  if (e.currentWordCount) {
    const n = currentTopic
      ? currentTopic.levels.B1.length + currentTopic.levels.B2.length + currentTopic.levels.C1.length
      : 0;
    setText(e.currentWordCount, String(n));
  }
  if (e.progressLabel) setText(e.progressLabel, `${seen.size} / ${TOPICS.length}`);
  if (e.progressFill)  e.progressFill.style.width = `${(seen.size / TOPICS.length) * 100}%`;
  if (e.remainingText) setText(e.remainingText,
    remaining > 0 ? `${remaining} sujets pas encore vus.` : 'Tous les sujets ont ete decouverts !'
  );

  if (e.recentList) {
    clear(e.recentList);
    const titles = getHistory()
      .map(id => TOPICS.find(t => t.id === id)?.title)
      .filter(Boolean);
    if (titles.length) titles.forEach(title => e.recentList.appendChild(el('span', 'recent-item', title)));
    else e.recentList.appendChild(el('span', 'recent-item', 'Aucun sujet vu'));
  }
}

// ─── Waiting state ────────────────────────────────────────────
function renderWaitingState() {
  if (e.topicCategory) setText(e.topicCategory, 'Sujet surprise');
  if (e.topicDate)     setText(e.topicDate,     'Pret');
  if (e.rouletteText)  setText(e.rouletteText,  'Appuie sur "Nouveau sujet".');
  if (e.topicTitle)    setText(e.topicTitle,    'La pioche attend le prochain reveal');
  if (e.topicLead)     setText(e.topicLead,     'Tire un sujet pour afficher la question, les mots et le plan de reponse.');
  if (e.topicQuestion) setText(e.topicQuestion, 'Quel sujet va tomber cette fois ?');
  if (e.topicMission)  setText(e.topicMission,  'Tu recevras une mission simple des le reveal.');
  if (e.topicGoalEn)   setText(e.topicGoalEn,   'English goal: you will get a simple speaking target.');
  if (e.bonusMode)     setText(e.bonusMode,     'Surprise');
  if (e.bonusText)     setText(e.bonusText,     'Le defi apparait en meme temps que le sujet.');

  renderVocab(e.builderList, BUILDER);
  renderPhraseExamples([
    'Je pense que ce sujet est important pour les jeunes.',
    'Parce que dans la vie quotidienne, on voit souvent ce probleme.',
    'Par exemple, dans mon ecole, les opinions sont differentes.',
    'Donc, a mon avis, il faut une solution simple.'
  ]);
  renderVocab(e.b1List, ['mot cache|hidden word']);
  renderVocab(e.b2List, ['idee cachee|hidden idea']);
  renderVocab(e.c1List, ['nuance cachee|hidden nuance']);
  renderChips(e.rulesList,   ['la pioche choisit', 'la classe reagit', 'on improvise']);
  renderChips(e.starterList, ['Je pense que...', 'Parce que...', 'Par exemple...']);
  renderCoach(e.coachList, ['Read the question.', 'Choose your opinion.', 'Give one example.', 'End with a short conclusion.']);
  renderChips(e.anglesList, ['prix', 'habitudes', 'exemples']);
  if (e.topicCover) e.topicCover.classList.remove('hidden');
  renderStats(null);
}

// ─── Topic render ─────────────────────────────────────────────
function renderTopic(topic) {
  currentTopicId = topic.id;
  localStorage.setItem(CURRENT_KEY, topic.id);
  markSeen(topic.id);

  const bonus = pick(shuffle(BONUS));

  if (e.topicCategory) setText(e.topicCategory, topic.category);
  if (e.topicDate)     setText(e.topicDate,     topic.date);
  if (e.rouletteText)  setText(e.rouletteText,  `Sujet : ${topic.title}`);
  if (e.topicTitle)    setText(e.topicTitle,    topic.title);
  if (e.topicLead)     setText(e.topicLead,     topic.lead);
  if (e.topicQuestion) setText(e.topicQuestion, topic.question);
  if (e.topicMission)  setText(e.topicMission,  topic.mission);
  if (e.topicGoalEn)   setText(e.topicGoalEn,   `English goal: ${topic.goalEn}`);
  if (e.bonusMode)     setText(e.bonusMode,     bonus.mode);
  if (e.bonusText)     setText(e.bonusText,     bonus.text);

  renderVocab(e.builderList, BUILDER);
  renderPhraseExamples([
    `Je pense que ${topic.title.toLowerCase()} est un sujet important.`,
    'Parce que dans la vie quotidienne, cela change beaucoup de choses.',
    'Par exemple, dans mon experience, je vois ce sujet assez souvent.',
    'Donc, a mon avis, une regle simple ou une bonne habitude peut aider.'
  ]);
  renderVocab(e.b1List, topic.levels.B1);
  renderVocab(e.b2List, topic.levels.B2);
  renderVocab(e.c1List, topic.levels.C1);
  renderChips(e.rulesList,   topic.rules);
  renderChips(e.starterList, topic.starters);
  renderCoach(e.coachList,   topic.coach);
  renderChips(e.anglesList,  topic.angles);
  if (e.topicCover) e.topicCover.classList.add('hidden');
  renderStats(topic);
}

// ─── Draw animation ───────────────────────────────────────────
function pickTopic(unseenOnly = false) {
  const seen = getSeenTopics();
  let pool = TOPICS.filter(t => t.id !== currentTopicId);
  if (unseenOnly) pool = pool.filter(t => !seen.has(t.id));
  if (!pool.length) pool = TOPICS.filter(t => t.id !== currentTopicId);
  return pick(shuffle(pool));
}

function animateDraw(unseenOnly = false) {
  if (isDrawing) return;
  isDrawing = true;
  if (e.topicCover) e.topicCover.classList.remove('hidden');
  if (e.randomBtn)  e.randomBtn.disabled = true;
  if (e.unseenBtn)  e.unseenBtn.disabled = true;

  const steps = ['La pioche tourne...', 'On melange les themes...', '3', '2', '1'];
  let idx = 0;
  const t = setInterval(() => {
    if (e.rouletteText) setText(e.rouletteText, steps[idx]);
    idx++;
    if (idx >= steps.length) {
      clearInterval(t);
      renderTopic(pickTopic(unseenOnly));
      if (e.randomBtn) e.randomBtn.disabled = false;
      if (e.unseenBtn) e.unseenBtn.disabled = false;
      isDrawing = false;
    }
  }, 380);
}

// ─── Timer ────────────────────────────────────────────────────
function updateTimerDisplay() {
  if (!e.timerDisplay) return;
  const m = String(Math.floor(timerRemaining / 60)).padStart(2, '0');
  const s = String(timerRemaining % 60).padStart(2, '0');
  setText(e.timerDisplay, `${m}:${s}`);
}

function stopTimer(resetToDefault = false) {
  if (timerInterval) { clearInterval(timerInterval); timerInterval = null; }
  if (resetToDefault) timerRemaining = 45;
  updateTimerDisplay();
}

function startTimer(seconds) {
  stopTimer();
  timerRemaining = seconds;
  updateTimerDisplay();
  timerInterval = setInterval(() => {
    timerRemaining -= 1;
    updateTimerDisplay();
    if (timerRemaining <= 0) { clearInterval(timerInterval); timerInterval = null; if (e.timerDisplay) setText(e.timerDisplay, '00:00'); }
  }, 1000);
}

// ─── Events ───────────────────────────────────────────────────
e.randomBtn?.addEventListener('click', () => animateDraw(false));
e.unseenBtn?.addEventListener('click', () => animateDraw(true));
e.resetBtn?.addEventListener('click', () => {
  localStorage.removeItem(SEEN_KEY);
  localStorage.removeItem(HISTORY_KEY);
  localStorage.removeItem(CURRENT_KEY);
  currentTopicId = null;
  renderWaitingState();
});
e.fullscreenBtn?.addEventListener('click', async () => {
  if (!document.fullscreenElement) await document.documentElement.requestFullscreen();
  else await document.exitFullscreen();
});
document.querySelectorAll('.tiny-btn[data-seconds]').forEach(btn =>
  btn.addEventListener('click', () => startTimer(Number(btn.dataset.seconds)))
);
document.querySelector('.tiny-btn[data-action="stop"]')?.addEventListener('click', () => stopTimer(true));
document.addEventListener('keydown', ev => {
  if (ev.code === 'Space' && ev.target === document.body) { ev.preventDefault(); animateDraw(false); }
});

// ─── Init ─────────────────────────────────────────────────────
updateTimerDisplay();
renderWaitingState();
