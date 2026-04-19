/**
 * verbes.js — 8 mini-jeux autour des verbes.
 * Utilise window.FrenchVerbs (verbs-data.js) et window.FrUtils (utils.js).
 */
const { shuffle, pick, clear, el, setText,
        renderAnswerBtns, lockBtns, showCorrect } = window.FrUtils;

const { VERBS, PRONOUNS, VERB_PREPOSITIONS, VERB_INFINITIVE_QUESTIONS, AUX_QUESTIONS, ALL_TENSES, showWithPronoun } = window.FrenchVerbs;

const TENSE_LABELS = Object.fromEntries(ALL_TENSES.map(t => [t.key, t.label]));
const TENSE_KEYS   = ALL_TENSES.map(t => t.key);
const COMPOUND_TENSES = ALL_TENSES.filter(t => t.type === 'compose').map(t => t.key);
const SIMPLE_TENSES   = ALL_TENSES.filter(t => t.type === 'simple').map(t => t.key);

// Affichage homogene "je / j'" + forme conjuguee
function display(pronoun, form) {
  return showWithPronoun ? showWithPronoun(pronoun, form) : `${pronoun} ${form}`;
}

// ─── Storage ──────────────────────────────────────────────────
const KEY_DAILY    = 'french_class_verbs_daily';
const KEY_STREAK   = 'french_class_verbs_best_streak';
const KEY_WHEEL    = 'french_class_verbs_wheel_best';
const KEY_BLITZ    = 'french_class_verbs_blitz_best';
const KEY_TYPE     = 'french_class_verbs_type_best';
const TODAY_KEY    = new Date().toISOString().slice(0, 10);

function dailyGet() {
  const raw = localStorage.getItem(KEY_DAILY);
  try {
    const obj = raw ? JSON.parse(raw) : {};
    if (obj.date !== TODAY_KEY) return { date: TODAY_KEY, score: 0 };
    return obj;
  } catch { return { date: TODAY_KEY, score: 0 }; }
}
function dailyBump() {
  const obj = dailyGet();
  obj.score += 1;
  localStorage.setItem(KEY_DAILY, JSON.stringify(obj));
  repaintGlobal();
}
function getBestStreak() { return Number(localStorage.getItem(KEY_STREAK) || 0); }
function setBestStreak(v) { localStorage.setItem(KEY_STREAK, String(v)); repaintGlobal(); }
function bumpBestStreak(v) { if (v > getBestStreak()) setBestStreak(v); }

function repaintGlobal() {
  const d = document.getElementById('vDailyScore');
  if (d) setText(d, String(dailyGet().score));
  const b = document.getElementById('vBestStreak');
  if (b) setText(b, String(getBestStreak()));
}

// ─── Utility ──────────────────────────────────────────────────
function filterVerbs({ group = 'all' }) {
  return VERBS.filter(v => {
    if (group === 'all') return true;
    if (group === 'irregular') return v.irregular;
    return v.group === group;
  });
}

function randomTense(allowed) {
  const arr = allowed && allowed.length ? allowed : TENSE_KEYS;
  return pick(arr);
}

// ======================================================================
// 1. ROUE DES VERBES
// ======================================================================
let wheelScore = 0, wheelTotal = 0, wheelStreak = 0, wheelLocked = false;
let wheelCurrent = null;

const wheelRefs = {
  tense:     document.getElementById('wheelTense'),
  group:     document.getElementById('wheelGroup'),
  spinBtn:   document.getElementById('wheelSpinBtn'),
  verb:      document.getElementById('wheelVerb'),
  pronoun:   document.getElementById('wheelPronoun'),
  tenseDisp: document.getElementById('wheelTenseDisplay'),
  options:   document.getElementById('wheelOptions'),
  feedback:  document.getElementById('wheelFeedback'),
  score:     document.getElementById('wheelScore'),
  streak:    document.getElementById('wheelStreak'),
  best:      document.getElementById('wheelBest')
};

function updateWheelStats() {
  setText(wheelRefs.score,  `${wheelScore}/${wheelTotal}`);
  setText(wheelRefs.streak, String(wheelStreak));
  setText(wheelRefs.best,   String(Number(localStorage.getItem(KEY_WHEEL) || 0)));
}

function spinWheel() {
  const tenseChoice = wheelRefs.tense.value;
  const groupChoice = wheelRefs.group.value;
  const verbs       = filterVerbs({ group: groupChoice });
  if (!verbs.length) return;

  const verb    = pick(verbs);
  const allowed = tenseChoice === 'all' ? TENSE_KEYS : [tenseChoice];
  const tense   = randomTense(allowed);
  const pIdx    = Math.floor(Math.random() * 6);
  const correct = verb[tense][pIdx];

  // Distractors : pick 3 other forms (from other tenses/persons, other verbs)
  const pool = new Set();
  // different person same tense same verb
  for (let i = 0; i < 6; i++) if (i !== pIdx) pool.add(verb[tense][i]);
  // different tense same person same verb
  TENSE_KEYS.forEach(t => { if (t !== tense) pool.add(verb[t][pIdx]); });
  // different verb same person/tense
  shuffle(verbs).slice(0, 4).forEach(v => { if (v !== verb) pool.add(v[tense][pIdx]); });
  pool.delete(correct);

  const distractors = shuffle([...pool]).slice(0, 3);
  const options     = shuffle([correct, ...distractors]);

  wheelCurrent = { verb, tense, pIdx, correct };
  wheelLocked  = false;

  setText(wheelRefs.verb,      verb.infinitive);
  setText(wheelRefs.pronoun,   PRONOUNS[pIdx]);
  setText(wheelRefs.tenseDisp, TENSE_LABELS[tense]);
  setText(wheelRefs.feedback,  '');

  renderAnswerBtns(wheelRefs.options,
    options.map(o => ({ text: o, isCorrect: o === correct })),
    (btn, isCorrect) => {
      if (wheelLocked) return;
      wheelLocked = true;
      wheelTotal += 1;
      lockBtns(wheelRefs.options);
      showCorrect(wheelRefs.options);
      if (isCorrect) {
        btn.classList.add('correct');
        wheelScore  += 1;
        wheelStreak += 1;
        dailyBump();
        bumpBestStreak(wheelStreak);
        const wb = Number(localStorage.getItem(KEY_WHEEL) || 0);
        if (wheelStreak > wb) localStorage.setItem(KEY_WHEEL, String(wheelStreak));
        setText(wheelRefs.feedback,
          `✅ ${verb.infinitive} · ${display(PRONOUNS[pIdx], correct)} (${TENSE_LABELS[tense]}). Serie : ${wheelStreak}`);
      } else {
        btn.classList.add('wrong');
        wheelStreak = 0;
        setText(wheelRefs.feedback,
          `❌ La bonne reponse : ${display(PRONOUNS[pIdx], correct)} (${verb.infinitive}, ${TENSE_LABELS[tense]}).`);
      }
      updateWheelStats();
    }
  );
  updateWheelStats();
}

// ======================================================================
// 2. CONJUGAISON BLITZ (speed, with lives)
// ======================================================================
const BLITZ_MS_BASE = 5000, BLITZ_MS_MIN = 1800, BLITZ_MS_STEP = 200;
let blitzStreak = 0, blitzLives = 3, blitzCorrect = 0, blitzTotal = 0;
let blitzTimer = null, blitzDeadline = 0, blitzStarted = false, blitzLocked = true, blitzCurrent = null;

const blitzRefs = {
  tense:   document.getElementById('blitzTense'),
  group:   document.getElementById('blitzGroup'),
  start:   document.getElementById('blitzStartBtn'),
  ready:   document.getElementById('blitzReady'),
  timer:   document.getElementById('blitzTimerFill'),
  question:document.getElementById('blitzQuestion'),
  meta:    document.getElementById('blitzMeta'),
  combo:   document.getElementById('blitzCombo'),
  options: document.getElementById('blitzOptions'),
  feedback:document.getElementById('blitzFeedback'),
  streak:  document.getElementById('blitzStreak'),
  lives:   document.getElementById('blitzLives'),
  score:   document.getElementById('blitzScore'),
  seconds: document.getElementById('blitzSeconds')
};

function getBlitzMs() {
  return Math.max(BLITZ_MS_MIN, BLITZ_MS_BASE - Math.floor(blitzStreak / 3) * BLITZ_MS_STEP);
}
function livesStr(n) { return '♥'.repeat(Math.max(0, n)) + '♡'.repeat(Math.max(0, 3 - n)); }
function updateBlitzStats() {
  setText(blitzRefs.streak, String(blitzStreak));
  setText(blitzRefs.lives,  livesStr(blitzLives));
  setText(blitzRefs.score,  `${blitzCorrect}/${blitzTotal}`);
  if (blitzStreak >= 5) {
    setText(blitzRefs.combo, `🔥 Combo ×${blitzStreak}`);
    blitzRefs.combo.classList.remove('hidden');
  } else {
    blitzRefs.combo.classList.add('hidden');
  }
}
function paintBlitzTimer(ratio, ms) {
  blitzRefs.timer.style.width = `${Math.max(0, Math.min(1, ratio)) * 100}%`;
  const hue = Math.round(ratio * 120);
  blitzRefs.timer.style.background = `hsl(${hue}, 80%, 48%)`;
  blitzRefs.timer.classList.toggle('is-urgent', ratio > 0 && ratio < 0.3);
  setText(blitzRefs.seconds, `${Math.max(0, Math.ceil((ms ?? BLITZ_MS_BASE) * ratio / 1000))}s`);
}
function clearBlitzTimer() { if (blitzTimer) { clearInterval(blitzTimer); blitzTimer = null; } }

function blitzReady(msg) {
  blitzStarted = false; blitzLocked = true;
  clearBlitzTimer();
  paintBlitzTimer(1);
  clear(blitzRefs.options);
  setText(blitzRefs.question, '');
  setText(blitzRefs.meta, '');
  setText(blitzRefs.feedback, msg ?? '');
  blitzRefs.ready.classList.remove('hidden');
  setText(blitzRefs.start, 'Relancer');
}

function blitzFinish() {
  const acc = blitzTotal ? Math.round(100 * blitzCorrect / blitzTotal) : 0;
  blitzReady(`Partie finie — ${blitzCorrect}/${blitzTotal} (${acc}%).`);
}

function blitzRound() {
  const groupChoice = blitzRefs.group.value;
  const tenseChoice = blitzRefs.tense.value;
  const verbs = filterVerbs({ group: groupChoice });
  if (!verbs.length) return blitzReady('Aucun verbe disponible.');

  const verb    = pick(verbs);
  const allowed = tenseChoice === 'all' ? TENSE_KEYS : [tenseChoice];
  const tense   = randomTense(allowed);
  const pIdx    = Math.floor(Math.random() * 6);
  const correct = verb[tense][pIdx];

  const pool = new Set();
  for (let i = 0; i < 6; i++) if (i !== pIdx) pool.add(verb[tense][i]);
  TENSE_KEYS.forEach(t => { if (t !== tense) pool.add(verb[t][pIdx]); });
  shuffle(verbs).slice(0, 3).forEach(v => { if (v !== verb) pool.add(v[tense][pIdx]); });
  pool.delete(correct);
  const options = shuffle([correct, ...shuffle([...pool]).slice(0, 3)]);

  blitzCurrent = { verb, tense, pIdx, correct };
  blitzLocked  = false;
  blitzRefs.ready.classList.add('hidden');

  setText(blitzRefs.question, `${PRONOUNS[pIdx]} ___ (${verb.infinitive})`);
  setText(blitzRefs.meta,     `${TENSE_LABELS[tense]} · groupe ${verb.group}`);
  setText(blitzRefs.feedback, '');

  renderAnswerBtns(blitzRefs.options,
    options.map(o => ({ text: o, isCorrect: o === correct })),
    (btn, isCorrect) => handleBlitzAnswer(btn, isCorrect, correct, verb, tense)
  );

  const ms = getBlitzMs();
  blitzDeadline = Date.now() + ms;
  paintBlitzTimer(1, ms);
  clearBlitzTimer();
  blitzTimer = setInterval(() => {
    const left = blitzDeadline - Date.now();
    if (left <= 0) {
      clearBlitzTimer();
      paintBlitzTimer(0, ms);
      if (blitzLocked) return;
      blitzLocked = true;
      blitzTotal += 1;
      blitzLives -= 1;
      blitzStreak = 0;
      lockBtns(blitzRefs.options);
      showCorrect(blitzRefs.options);
      setText(blitzRefs.feedback,
        blitzLives > 0 ? `⏰ Temps ecoule ! La reponse : ${correct}` : 'Temps ecoule. Fin.');
      updateBlitzStats();
      if (blitzLives > 0) setTimeout(blitzRound, 900); else blitzFinish();
      return;
    }
    paintBlitzTimer(left / ms, ms);
  }, 80);
}

function handleBlitzAnswer(btn, isCorrect, correct, verb, tense) {
  if (blitzLocked) return;
  blitzLocked = true;
  clearBlitzTimer();
  blitzTotal += 1;
  lockBtns(blitzRefs.options);
  showCorrect(blitzRefs.options);
  if (isCorrect) {
    btn.classList.add('correct');
    blitzCorrect += 1;
    blitzStreak  += 1;
    dailyBump();
    bumpBestStreak(blitzStreak);
    const best = Number(localStorage.getItem(KEY_BLITZ) || 0);
    if (blitzStreak > best) localStorage.setItem(KEY_BLITZ, String(blitzStreak));
    setText(blitzRefs.feedback, `✅ Bravo ! Serie : ${blitzStreak}`);
    updateBlitzStats();
    setTimeout(blitzRound, 500);
  } else {
    btn.classList.add('wrong');
    blitzStreak = 0;
    blitzLives -= 1;
    setText(blitzRefs.feedback,
      blitzLives > 0 ? `❌ C'etait "${correct}" (${verb.infinitive}).` : `Plus de vies. Bonne reponse : ${correct}.`);
    updateBlitzStats();
    if (blitzLives > 0) setTimeout(blitzRound, 1000); else blitzFinish();
  }
}

function blitzStart() {
  blitzStreak = 0; blitzLives = 3; blitzCorrect = 0; blitzTotal = 0;
  blitzStarted = true;
  updateBlitzStats();
  blitzRefs.ready.classList.add('hidden');
  blitzRound();
}

// ======================================================================
// 3. SENS DU VERBE
// ======================================================================
let meaningScore = 0, meaningTotal = 0, meaningStreak = 0, meaningLocked = false;

const meaningRefs = {
  dir:      document.getElementById('meaningDir'),
  newBtn:   document.getElementById('meaningNewBtn'),
  question: document.getElementById('meaningQuestion'),
  options:  document.getElementById('meaningOptions'),
  feedback: document.getElementById('meaningFeedback'),
  score:    document.getElementById('meaningScore'),
  streak:   document.getElementById('meaningStreak')
};

function updateMeaningStats() {
  setText(meaningRefs.score, `${meaningScore}/${meaningTotal}`);
  setText(meaningRefs.streak, String(meaningStreak));
}

function renderMeaning() {
  const dir     = meaningRefs.dir.value;
  const correct = pick(VERBS);
  const others  = shuffle(VERBS.filter(v => v !== correct)).slice(0, 3);
  const options = shuffle([correct, ...others]);
  meaningLocked = false;

  setText(meaningRefs.question,
    dir === 'fr-en' ? `Que signifie "${correct.infinitive}" ?` : `Comment dit-on "${correct.en}" en francais ?`);
  setText(meaningRefs.feedback, '');

  renderAnswerBtns(meaningRefs.options,
    options.map(o => ({ text: dir === 'fr-en' ? o.en : o.infinitive, isCorrect: o === correct })),
    (btn, isCorrect) => {
      if (meaningLocked) return;
      meaningLocked = true;
      meaningTotal += 1;
      lockBtns(meaningRefs.options);
      showCorrect(meaningRefs.options);
      if (isCorrect) {
        btn.classList.add('correct');
        meaningScore += 1; meaningStreak += 1; dailyBump(); bumpBestStreak(meaningStreak);
        setText(meaningRefs.feedback, `✅ Exact ! ${correct.infinitive} = ${correct.en}`);
      } else {
        btn.classList.add('wrong');
        meaningStreak = 0;
        setText(meaningRefs.feedback, `❌ La bonne reponse : "${dir === 'fr-en' ? correct.en : correct.infinitive}".`);
      }
      updateMeaningStats();
    }
  );
  updateMeaningStats();
}

// ======================================================================
// 4. TROUVE L'INFINITIF
// ======================================================================
let inferScore = 0, inferTotal = 0, inferStreak = 0, inferLocked = false;

const inferRefs = {
  newBtn:   document.getElementById('inferNewBtn'),
  question: document.getElementById('inferQuestion'),
  meta:     document.getElementById('inferMeta'),
  options:  document.getElementById('inferOptions'),
  feedback: document.getElementById('inferFeedback'),
  score:    document.getElementById('inferScore'),
  streak:   document.getElementById('inferStreak')
};

function updateInferStats() {
  setText(inferRefs.score, `${inferScore}/${inferTotal}`);
  setText(inferRefs.streak, String(inferStreak));
}

function renderInfer() {
  const verb  = pick(VERBS);
  const tense = randomTense(TENSE_KEYS);
  const pIdx  = Math.floor(Math.random() * 6);
  const form  = verb[tense][pIdx];
  const others = shuffle(VERBS.filter(v => v !== verb)).slice(0, 3);
  const options = shuffle([verb, ...others]);
  inferLocked = false;

  setText(inferRefs.question, form);
  setText(inferRefs.meta, `${PRONOUNS[pIdx]} · ${TENSE_LABELS[tense]}`);
  setText(inferRefs.feedback, '');

  renderAnswerBtns(inferRefs.options,
    options.map(o => ({ text: o.infinitive, isCorrect: o === verb })),
    (btn, isCorrect) => {
      if (inferLocked) return;
      inferLocked = true;
      inferTotal += 1;
      lockBtns(inferRefs.options);
      showCorrect(inferRefs.options);
      if (isCorrect) {
        btn.classList.add('correct');
        inferScore += 1; inferStreak += 1; dailyBump(); bumpBestStreak(inferStreak);
        setText(inferRefs.feedback, `✅ ${form} → ${verb.infinitive} (${verb.en})`);
      } else {
        btn.classList.add('wrong');
        inferStreak = 0;
        setText(inferRefs.feedback, `❌ C'etait "${verb.infinitive}".`);
      }
      updateInferStats();
    }
  );
  updateInferStats();
}

// ======================================================================
// 5. PARTICIPES PASSES
// ======================================================================
let ppScore = 0, ppTotal = 0, ppStreak = 0, ppLocked = false;
const ppRefs = {
  newBtn:  document.getElementById('ppNewBtn'),
  question:document.getElementById('ppQuestion'),
  options: document.getElementById('ppOptions'),
  feedback:document.getElementById('ppFeedback'),
  score:   document.getElementById('ppScore'),
  streak:  document.getElementById('ppStreak')
};

function updatePpStats() {
  setText(ppRefs.score, `${ppScore}/${ppTotal}`);
  setText(ppRefs.streak, String(ppStreak));
}

function renderPp() {
  const verb = pick(VERBS.filter(v => !v.pronominal));
  const correct = verb.pp;
  const others = shuffle(VERBS.filter(v => v.pp !== correct && !v.pronominal)).slice(0, 3).map(v => v.pp);
  const options = shuffle([correct, ...others]);
  ppLocked = false;

  setText(ppRefs.question, `${verb.infinitive} → ?`);
  setText(ppRefs.feedback, `Auxiliaire : ${verb.aux}`);

  renderAnswerBtns(ppRefs.options,
    options.map(o => ({ text: o, isCorrect: o === correct })),
    (btn, isCorrect) => {
      if (ppLocked) return;
      ppLocked = true;
      ppTotal += 1;
      lockBtns(ppRefs.options);
      showCorrect(ppRefs.options);
      if (isCorrect) {
        btn.classList.add('correct');
        ppScore += 1; ppStreak += 1; dailyBump(); bumpBestStreak(ppStreak);
        setText(ppRefs.feedback, `✅ ${verb.infinitive} → ${correct} (${verb.aux})`);
      } else {
        btn.classList.add('wrong');
        ppStreak = 0;
        setText(ppRefs.feedback, `❌ C'etait "${correct}" (${verb.aux}).`);
      }
      updatePpStats();
    }
  );
  updatePpStats();
}

// ======================================================================
// 6. ETRE OU AVOIR
// ======================================================================
let auxScore = 0, auxTotal = 0, auxStreak = 0, auxLocked = false;
const auxRefs = {
  newBtn:   document.getElementById('auxNewBtn'),
  question: document.getElementById('auxQuestion'),
  options:  document.getElementById('auxOptions'),
  feedback: document.getElementById('auxFeedback'),
  score:    document.getElementById('auxScore'),
  streak:   document.getElementById('auxStreak')
};

function updateAuxStats() {
  setText(auxRefs.score, `${auxScore}/${auxTotal}`);
  setText(auxRefs.streak, String(auxStreak));
}

function renderAux() {
  const item = pick(AUX_QUESTIONS);
  auxLocked = false;
  setText(auxRefs.question, item.sentence);
  setText(auxRefs.feedback, `Verbe : ${item.verb}`);

  renderAnswerBtns(auxRefs.options,
    shuffle(item.options).map(o => ({
      text: o,
      isCorrect: (item.aux === 'etre' && (o === 'est' || o === 'sont' || o === 'suis' || o === 'es' || o === 'sommes' || o === 'etes'))
              || (item.aux === 'avoir' && (o === 'a' || o === 'as' || o === 'ai' || o === 'avons' || o === 'avez' || o === 'ont'))
    })),
    (btn, isCorrect) => {
      if (auxLocked) return;
      auxLocked = true;
      auxTotal += 1;
      lockBtns(auxRefs.options);
      showCorrect(auxRefs.options);
      if (isCorrect) {
        btn.classList.add('correct');
        auxScore += 1; auxStreak += 1; dailyBump(); bumpBestStreak(auxStreak);
        setText(auxRefs.feedback, `✅ "${item.verb}" utilise l'auxiliaire ${item.aux}.`);
      } else {
        btn.classList.add('wrong');
        auxStreak = 0;
        setText(auxRefs.feedback, `❌ "${item.verb}" → auxiliaire ${item.aux}.`);
      }
      updateAuxStats();
    }
  );
  updateAuxStats();
}

// ======================================================================
// 7. VERBE + PREPOSITION
// ======================================================================
let vprepScore = 0, vprepTotal = 0, vprepStreak = 0, vprepLocked = false;
const vprepRefs = {
  newBtn:   document.getElementById('vprepNewBtn'),
  question: document.getElementById('vprepQuestion'),
  options:  document.getElementById('vprepOptions'),
  feedback: document.getElementById('vprepFeedback'),
  score:    document.getElementById('vprepScore'),
  streak:   document.getElementById('vprepStreak')
};

function updateVprepStats() {
  setText(vprepRefs.score, `${vprepScore}/${vprepTotal}`);
  setText(vprepRefs.streak, String(vprepStreak));
}

function renderVprep() {
  const item = pick(VERB_PREPOSITIONS);
  vprepLocked = false;
  setText(vprepRefs.question, item.sentence.replace('___', '____'));
  setText(vprepRefs.feedback, `Verbe : ${item.verb}`);

  renderAnswerBtns(vprepRefs.options,
    shuffle(item.options).map(o => ({ text: o, isCorrect: o === item.answer })),
    (btn, isCorrect) => {
      if (vprepLocked) return;
      vprepLocked = true;
      vprepTotal += 1;
      lockBtns(vprepRefs.options);
      showCorrect(vprepRefs.options);
      if (isCorrect) {
        btn.classList.add('correct');
        vprepScore += 1; vprepStreak += 1; dailyBump(); bumpBestStreak(vprepStreak);
        setText(vprepRefs.feedback, `✅ "${item.verb} ${item.answer}" · Serie : ${vprepStreak}`);
      } else {
        btn.classList.add('wrong');
        vprepStreak = 0;
        setText(vprepRefs.feedback, `❌ La bonne preposition : "${item.answer}".`);
      }
      updateVprepStats();
    }
  );
  updateVprepStats();
}

// ======================================================================
// 8. TAPE LA CONJUGAISON
// ======================================================================
let typeScore = 0, typeTotal = 0, typeStreak = 0;
let typeCurrent = null;

const typeRefs = {
  tense:    document.getElementById('typeTense'),
  newBtn:   document.getElementById('typeNewBtn'),
  pronoun:  document.getElementById('typePronoun'),
  verb:     document.getElementById('typeVerb'),
  badge:    document.getElementById('typeTenseBadge'),
  form:     document.getElementById('typeForm'),
  input:    document.getElementById('typeInput'),
  feedback: document.getElementById('typeFeedback'),
  score:    document.getElementById('typeScore'),
  streak:   document.getElementById('typeStreak'),
  best:     document.getElementById('typeBest')
};

function normalize(s) {
  return String(s || '')
    .toLowerCase()
    .trim()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, ' ');
}

function updateTypeStats() {
  setText(typeRefs.score, `${typeScore}/${typeTotal}`);
  setText(typeRefs.streak, String(typeStreak));
  setText(typeRefs.best, String(Number(localStorage.getItem(KEY_TYPE) || 0)));
}

function renderType() {
  const tense = typeRefs.tense.value;
  const verb  = pick(VERBS);
  const pIdx  = Math.floor(Math.random() * 6);
  typeCurrent = { verb, tense, pIdx, correct: verb[tense][pIdx] };

  setText(typeRefs.pronoun, PRONOUNS[pIdx]);
  setText(typeRefs.verb,    `(${verb.infinitive}) — ${verb.en}`);
  setText(typeRefs.badge,   TENSE_LABELS[tense]);
  typeRefs.badge.className  = `conj-tense-badge conj-tense-${tense}`;
  typeRefs.input.value = '';
  typeRefs.input.focus();
  setText(typeRefs.feedback, '');
  updateTypeStats();
}

function checkType(e) {
  e.preventDefault();
  if (!typeCurrent) return;
  const answer   = normalize(typeRefs.input.value);
  const expected = normalize(typeCurrent.correct);
  typeTotal += 1;
  if (answer === expected) {
    typeScore += 1; typeStreak += 1; dailyBump(); bumpBestStreak(typeStreak);
    const best = Number(localStorage.getItem(KEY_TYPE) || 0);
    if (typeStreak > best) localStorage.setItem(KEY_TYPE, String(typeStreak));
    setText(typeRefs.feedback, `✅ Parfait ! "${typeCurrent.correct}"`);
    setTimeout(renderType, 700);
  } else {
    typeStreak = 0;
    setText(typeRefs.feedback, `❌ La bonne forme : "${typeCurrent.correct}" (${typeCurrent.verb.en}).`);
  }
  updateTypeStats();
}

// ======================================================================
// TAB NAV
// ======================================================================
function initTabs() {
  const btns   = document.querySelectorAll('.game-tab');
  const panels = document.querySelectorAll('.game-tab-panel');
  btns.forEach(btn => {
    btn.addEventListener('click', () => {
      const t = btn.dataset.tab;
      btns.forEach(b => b.classList.toggle('is-active', b.dataset.tab === t));
      panels.forEach(p => p.classList.toggle('is-active', p.id === `tab-${t}`));
    });
  });
}

// ======================================================================
// INIT
// ======================================================================
function init() {
  repaintGlobal();
  updateWheelStats();
  spinWheel();

  blitzReady('Lance le blitz quand tu es pret.');
  updateBlitzStats();

  renderMeaning();
  renderInfer();
  renderPp();
  renderAux();
  renderVprep();
  renderType();

  initTabs();

  // Events
  wheelRefs.spinBtn?.addEventListener('click', spinWheel);
  wheelRefs.tense?.addEventListener('change', spinWheel);
  wheelRefs.group?.addEventListener('change', spinWheel);

  blitzRefs.start?.addEventListener('click', blitzStart);
  blitzRefs.tense?.addEventListener('change', () => blitzReady('Parametres changes. Lance un nouveau blitz.'));
  blitzRefs.group?.addEventListener('change', () => blitzReady('Parametres changes. Lance un nouveau blitz.'));

  meaningRefs.newBtn?.addEventListener('click', renderMeaning);
  meaningRefs.dir?.addEventListener('change', renderMeaning);
  inferRefs.newBtn?.addEventListener('click', renderInfer);
  ppRefs.newBtn?.addEventListener('click', renderPp);
  auxRefs.newBtn?.addEventListener('click', renderAux);
  vprepRefs.newBtn?.addEventListener('click', renderVprep);
  typeRefs.newBtn?.addEventListener('click', renderType);
  typeRefs.tense?.addEventListener('change', renderType);
  typeRefs.form?.addEventListener('submit', checkType);

  // Keyboard shortcuts (1-4) only on mini-game panels with prep-options
  document.addEventListener('keydown', e => {
    if (!['1','2','3','4'].includes(e.key)) return;
    if (document.activeElement === typeRefs.input) return;
    const panel = document.querySelector('.game-tab-panel.is-active');
    if (!panel) return;
    const btns = panel.querySelectorAll('.answer-btn');
    const idx = Number(e.key) - 1;
    if (btns[idx] && !btns[idx].disabled) btns[idx].click();
  });
}

init();
