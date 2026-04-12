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
const SPRINT_MS_BASE    = 8000;   // Start at 8 s
const SPRINT_MS_MIN     = 2500;   // Floor at 2.5 s
const SPRINT_MS_STEP    = 300;    // Lose 300 ms every 3 correct in streak
const COMBO_THRESHOLD   = 5;      // Streak needed for combo badge

const PREPOSITION_QUESTIONS = [
  { sentence: 'Je vais __ la bibliotheque apres les cours.',          answer: 'a',    options: ['a', 'de', 'chez', 'sur']       },
  { sentence: 'On parle souvent __ ce sujet en classe.',              answer: 'de',   options: ['de', 'a', 'pour', 'dans']      },
  { sentence: 'Elle habite __ France depuis un an.',                  answer: 'en',   options: ['en', 'a', 'chez', 'sur']       },
  { sentence: 'Je laisse mon sac __ la table.',                       answer: 'sur',  options: ['sur', 'dans', 'chez', 'de']    },
  { sentence: 'Il travaille __ un hopital a Paris.',                  answer: 'dans', options: ['dans', 'en', 'de', 'a']        },
  { sentence: 'Nous allons __ Paul ce soir.',                         answer: 'chez', options: ['chez', 'dans', 'pour', 'sur']  },
  { sentence: 'Je fais cet exercice __ progresser en francais.',      answer: 'pour', options: ['pour', 'de', 'a', 'en']        },
  { sentence: 'Son appartement est __ le troisieme etage.',           answer: 'au',   options: ['au', 'dans', 'sur', 'de']      },
  { sentence: 'Je rentre __ l\'ecole a 17h.',                         answer: 'de',   options: ['de', 'a', 'en', 'dans']        },
  { sentence: 'Elle est bonne __ mathematiques.',                     answer: 'en',   options: ['en', 'a', 'de', 'pour']        },
  { sentence: 'On se retrouve __ le cafe du campus.',                 answer: 'devant', options: ['devant', 'dans', 'chez', 'sur'] },
  { sentence: 'Je suis interesse __ la culture francaise.',           answer: 'par',  options: ['par', 'a', 'de', 'en']         },
  { sentence: 'Il a besoin __ aide pour son devoir.',                 answer: 'd\'',  options: ['d\'', 'a', 'en', 'sur']        },
  { sentence: 'Elle est sortie __ son ami apres le cours.',           answer: 'avec', options: ['avec', 'chez', 'pour', 'de']   },
  { sentence: 'Je pense souvent __ mes projets d\'avenir.',           answer: 'a',    options: ['a', 'de', 'sur', 'dans']       },
  { sentence: 'Il est parti __ vacances la semaine derniere.',        answer: 'en',   options: ['en', 'a', 'dans', 'sur']       },
  { sentence: 'Nous avons discute __ probleme toute la soiree.',      answer: 'du',   options: ['du', 'au', 'dans', 'sur']      },
  { sentence: 'Elle habite __ cote __ la fac.',                       answer: 'a cote de', options: ['a cote de', 'loin de', 'proche a', 'autour de'] },
  { sentence: 'Je reviens __ Espagne demain matin.',                  answer: 'd\'',  options: ['d\'', 'a', 'en', 'de la']      },
  { sentence: 'Ils se retrouvent toujours __ meme endroit.',          answer: 'au',   options: ['au', 'en', 'dans', 'sur']      }
];

// Each question has a tense tag so the tense-filter select can restrict the pool
const CONJUGATION_QUESTIONS = [
  // ── Présent ────────────────────────────────────────────────
  { tense: 'present', label: 'Présent',          sentence: 'Elle ___ (aller) au marche ce matin.',              answer: 'va',          hint: 'aller : je vais, tu vas, il va',           options: ['va', 'vais', 'allons', 'allez']           },
  { tense: 'present', label: 'Présent',          sentence: 'Nous ___ (finir) nos devoirs ce soir.',             answer: 'finissons',   hint: 'finir : je finis, nous finissons',         options: ['finissons', 'finissez', 'finit', 'finis']  },
  { tense: 'present', label: 'Présent',          sentence: 'Je ___ (vouloir) apprendre le francais.',           answer: 'veux',        hint: 'vouloir : je veux, tu veux, il veut',      options: ['veux', 'veut', 'voulons', 'voulez']        },
  { tense: 'present', label: 'Présent',          sentence: 'Ils ___ (avoir) un examen demain.',                 answer: 'ont',         hint: 'avoir : j\'ai, tu as, il a, ils ont',      options: ['ont', 'a', 'avons', 'avez']                },
  { tense: 'present', label: 'Présent',          sentence: 'Tu ___ (etre) en retard pour le cours.',            answer: 'es',          hint: 'etre : je suis, tu es, il est',            options: ['es', 'est', 'sommes', 'etes']              },
  { tense: 'present', label: 'Présent',          sentence: 'Vous ___ (pouvoir) partir apres le cours.',         answer: 'pouvez',      hint: 'pouvoir : je peux, tu peux, vous pouvez',  options: ['pouvez', 'peut', 'peuvent', 'peux']        },
  { tense: 'present', label: 'Présent',          sentence: 'On ___ (devoir) etudier pour l\'examen.',           answer: 'doit',        hint: 'devoir : je dois, il doit, ils doivent',   options: ['doit', 'dois', 'doivent', 'devons']        },
  { tense: 'present', label: 'Présent',          sentence: 'Elle ___ (prendre) le bus chaque matin.',           answer: 'prend',       hint: 'prendre : je prends, il prend',            options: ['prend', 'prends', 'prenons', 'prendre']    },
  { tense: 'present', label: 'Présent',          sentence: 'Nous ___ (faire) du sport le mardi.',               answer: 'faisons',     hint: 'faire : je fais, nous faisons, ils font',  options: ['faisons', 'faites', 'font', 'fais']        },
  { tense: 'present', label: 'Présent',          sentence: 'Ils ___ (venir) a la reunion ce soir.',             answer: 'viennent',    hint: 'venir : je viens, il vient, ils viennent', options: ['viennent', 'vient', 'venons', 'venu']      },
  { tense: 'present', label: 'Présent',          sentence: 'Je ___ (dire) toujours la verite.',                 answer: 'dis',         hint: 'dire : je dis, tu dis, il dit',            options: ['dis', 'dit', 'disons', 'dire']             },
  { tense: 'present', label: 'Présent',          sentence: 'Il ___ (mettre) son manteau avant de sortir.',      answer: 'met',         hint: 'mettre : je mets, tu mets, il met',        options: ['met', 'mets', 'mettons', 'mettre']         },

  // ── Passé composé ─────────────────────────────────────────
  { tense: 'passe',   label: 'Passé composé',    sentence: 'Hier, elle ___ (aller) au marche.',                 answer: 'est allee',   hint: 'aller → etre + allé(e) : elle est allée',  options: ['est allee', 'a alle', 'allait', 'est alle']    },
  { tense: 'passe',   label: 'Passé composé',    sentence: 'Ils ___ (finir) leur projet hier soir.',            answer: 'ont fini',    hint: 'finir → avoir + fini',                     options: ['ont fini', 'sont finis', 'finissaient', 'ont finis'] },
  { tense: 'passe',   label: 'Passé composé',    sentence: 'Tu ___ (voir) ce film la semaine derniere ?',       answer: 'as vu',       hint: 'voir → avoir + vu',                        options: ['as vu', 'avais vu', 'a vu', 'es vu']          },
  { tense: 'passe',   label: 'Passé composé',    sentence: 'Nous ___ (faire) du sport ce matin.',               answer: 'avons fait',  hint: 'faire → avoir + fait',                     options: ['avons fait', 'avons fais', 'avons faisait', 'sommes faits'] },
  { tense: 'passe',   label: 'Passé composé',    sentence: 'Il ___ (venir) a la reunion hier.',                 answer: 'est venu',    hint: 'venir → etre + venu',                      options: ['est venu', 'a venu', 'venait', 'est venue']   },
  { tense: 'passe',   label: 'Passé composé',    sentence: 'J\'___ (manger) une pizza ce midi.',                answer: 'ai mange',    hint: 'manger → avoir + mange',                   options: ['ai mange', 'suis mange', 'ai mangee', 'mangeais'] },
  { tense: 'passe',   label: 'Passé composé',    sentence: 'Vous ___ (prendre) le bus ce matin ?',              answer: 'avez pris',   hint: 'prendre → avoir + pris',                   options: ['avez pris', 'avez prend', 'etes pris', 'avez prit'] },
  { tense: 'passe',   label: 'Passé composé',    sentence: 'Elle ___ (partir) en voyage la semaine derniere.',  answer: 'est partie',  hint: 'partir → etre + parti(e) : elle est partie', options: ['est partie', 'a partie', 'est parti', 'a parti']  },
  { tense: 'passe',   label: 'Passé composé',    sentence: 'Ils ___ (sortir) avec leurs amis hier soir.',       answer: 'sont sortis', hint: 'sortir → etre + sorti(s) : ils sont sortis', options: ['sont sortis', 'ont sortis', 'sont sorties', 'ont sort'] },
  { tense: 'passe',   label: 'Passé composé',    sentence: 'Je ___ (ecrire) un email a mon professeur.',        answer: 'ai ecrit',    hint: 'ecrire → avoir + ecrit',                   options: ['ai ecrit', 'ai ecris', 'suis ecrit', 'ai ecrire']   },
  { tense: 'passe',   label: 'Passé composé',    sentence: 'Nous ___ (rentrer) tard hier soir.',                answer: 'sommes rentres', hint: 'rentrer → etre + rentre(s)',             options: ['sommes rentres', 'avons rentres', 'sommes rentre', 'avons rentre'] },

  // ── Imparfait ─────────────────────────────────────────────
  { tense: 'imparfait', label: 'Imparfait',      sentence: 'Quand j\'etais jeune, je ___ (jouer) au foot.',     answer: 'jouais',      hint: 'jouer (imparfait) : je jouais, tu jouais',  options: ['jouais', 'joue', 'ai joue', 'jouait']          },
  { tense: 'imparfait', label: 'Imparfait',      sentence: 'Elle ___ (etudier) chaque soir au lycee.',          answer: 'etudiait',    hint: 'etudier : il/elle etudiait',                options: ['etudiait', 'etudie', 'a etudie', 'etudiais']   },
  { tense: 'imparfait', label: 'Imparfait',      sentence: 'Nous ___ (prendre) toujours le meme bus.',          answer: 'prenions',    hint: 'prendre (imparfait) : nous prenions',        options: ['prenions', 'prenez', 'avons pris', 'prend']    },
  { tense: 'imparfait', label: 'Imparfait',      sentence: 'Il ___ (faire) beau quand je suis parti.',          answer: 'faisait',     hint: 'faire : il faisait (temps, contexte passé)', options: ['faisait', 'fait', 'a fait', 'ferait']          },
  { tense: 'imparfait', label: 'Imparfait',      sentence: 'Tu ___ (aimer) lire quand tu etais petit ?',        answer: 'aimais',      hint: 'aimer (imparfait) : tu aimais',              options: ['aimais', 'aimait', 'as aime', 'aime']          },
  { tense: 'imparfait', label: 'Imparfait',      sentence: 'Ils ___ (aller) souvent au cinema ensemble.',       answer: 'allaient',    hint: 'aller (imparfait) : ils allaient',           options: ['allaient', 'allait', 'sont alles', 'vont']     },
  { tense: 'imparfait', label: 'Imparfait',      sentence: 'Elle ___ (vouloir) devenir medecin.',               answer: 'voulait',     hint: 'vouloir : il/elle voulait',                  options: ['voulait', 'voulais', 'a voulu', 'veut']        },
  { tense: 'imparfait', label: 'Imparfait',      sentence: 'Vous ___ (vivre) a Paris a cette epoque ?',         answer: 'viviez',      hint: 'vivre (imparfait) : vous viviez',            options: ['viviez', 'vivez', 'avez vecu', 'vivait']       },
  { tense: 'imparfait', label: 'Imparfait',      sentence: 'Je ne ___ (savoir) pas encore la reponse.',         answer: 'savais',      hint: 'savoir : je savais (état dans le passé)',   options: ['savais', 'sais', 'ai su', 'savait']            },
  { tense: 'imparfait', label: 'Imparfait',      sentence: 'On ___ (parler) francais tout le temps.',           answer: 'parlait',     hint: 'parler : on parlait (habitude passée)',     options: ['parlait', 'parle', 'a parle', 'parlait']       },
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
  sprintLevelSelect:   document.getElementById('sprintLevelSelect'),
  sprintModeLabel:     document.getElementById('sprintModeLabel'),
  startSprintBtn:      document.getElementById('startSprintBtn'),
  sprintReady:         document.getElementById('sprintReady'),
  sprintStreak:        document.getElementById('sprintStreak'),
  sprintLivesDisplay:  document.getElementById('sprintLivesDisplay'),
  sprintRound:         document.getElementById('sprintRound'),
  sprintSeconds:       document.getElementById('sprintSeconds'),
  sprintTimerFill:     document.getElementById('sprintTimerFill'),
  sprintQuestion:      document.getElementById('sprintQuestion'),
  sprintWordMeta:      document.getElementById('sprintWordMeta'),
  sprintCombo:         document.getElementById('sprintCombo'),
  sprintOptions:       document.getElementById('sprintOptions'),
  sprintFeedback:      document.getElementById('sprintFeedback'),
  sprintScore:         document.getElementById('sprintScore'),
  sprintSpeedLabel:    document.getElementById('sprintSpeedLabel'),

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
  prepStreak:          document.getElementById('prepStreak'),
  prepBest:            document.getElementById('prepBest'),

  // Conjugaison
  newConjugaisonBtn:   document.getElementById('newConjugaisonBtn'),
  conjugaisonTense:    document.getElementById('conjugaisonTense'),
  conjugaisonTenseBadge: document.getElementById('conjugaisonTenseBadge'),
  conjugaisonScore:    document.getElementById('conjugaisonScore'),
  conjugaisonStreak:   document.getElementById('conjugaisonStreak'),
  conjugaisonBest:     document.getElementById('conjugaisonBest'),
  conjugaisonQuestion: document.getElementById('conjugaisonQuestion'),
  conjugaisonOptions:  document.getElementById('conjugaisonOptions'),
  conjugaisonFeedback: document.getElementById('conjugaisonFeedback'),
  conjugaisonHint:     document.getElementById('conjugaisonHint'),

  // Intrus
  newIntrusBtn:        document.getElementById('newIntrusBtn'),
  intrusDifficulty:    document.getElementById('intrusDifficulty'),
  intrusInstruction:   document.getElementById('intrusInstruction'),
  intrusOptions:       document.getElementById('intrusOptions'),
  intrusFeedback:      document.getElementById('intrusFeedback'),
  intrusScore:         document.getElementById('intrusScore'),
  intrusSource:        document.getElementById('intrusSource'),

  // Mission
  newMissionBtn:       document.getElementById('newMissionBtn'),
  missionTitle:        document.getElementById('missionTitle'),
  missionQuestion:     document.getElementById('missionQuestion'),
  missionExpressions:  document.getElementById('missionExpressions'),
  missionSteps:        document.getElementById('missionSteps'),
  missionTimer:        document.getElementById('missionTimer'),
  missionTimerFill:    document.getElementById('missionTimerFill'),
  startMissionBtn:     document.getElementById('startMissionBtn'),

  // Construis la phrase
  newPhraseBtn:        document.getElementById('newPhraseBtn'),
  phraseHint:          document.getElementById('phraseHint'),
  phraseTranslation:   document.getElementById('phraseTranslation'),
  phraseDropZone:      document.getElementById('phraseDropZone'),
  phraseWordBank:      document.getElementById('phraseWordBank'),
  phraseFeedback:      document.getElementById('phraseFeedback'),
  phraseCheckBtn:      document.getElementById('phraseCheckBtn'),
  phraseScore:         document.getElementById('phraseScore')
};

const CONJ_BEST_KEY = 'french_class_conj_best';
const PREP_BEST_KEY = 'french_class_prep_best';
const MISSION_MS    = 90000; // 90 s

// ─── State ────────────────────────────────────────────────────
let flashWord        = null;

// Sprint
let sprintStreak     = 0;
let sprintLives      = 3;
let sprintRound      = 0;
let sprintLocked     = false;
let sprintStarted    = false;
let sprintTimer      = null;
let sprintDeadline   = 0;
let sprintCorrect    = 0;
let sprintTotal      = 0;

// Conjugaison
let conjugaisonCorrect = 0;
let conjugaisonTotal   = 0;
let conjugaisonStreak  = 0;

// Prépositions
let prepStreak  = 0;
let prepBestVal = 0;

// Intrus
let intrusRound  = null;
let intrusCorrect = 0;
let intrusTotal   = 0;

// Mission
let missionTimer    = null;
let missionDeadline = 0;
let missionRunning  = false;

// Phrase builder
let currentPhrase  = null;
let placedParts    = [];
let placedBtns     = [];
let phraseCorrect  = 0;
let phraseTotal    = 0;

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
function getSprintLevel() { return g.sprintLevelSelect?.value ?? 'all'; }

function buildPoolWords() {
  const topics = getPoolSources();
  const level  = getSprintLevel();
  const topicWords = topics.flatMap(t => {
    if (level === 'all') return flattenSource(t);
    const raw = t.levels[level] ?? [];
    return raw.map(r => {
      const [fr, en] = r.split('|');
      return { key: `${t.id}:${level}:${fr}`, topicId: t.id, topicTitle: t.title,
               category: t.category, level, fr, en };
    });
  });
  const packWords = GAME_PACKS.flatMap(p => {
    if (level === 'all') return flattenSource(p);
    const raw = p.levels[level] ?? [];
    return raw.map(r => {
      const [fr, en] = r.split('|');
      return { key: `${p.id}:${level}:${fr}`, topicId: p.id, topicTitle: p.title,
               category: p.category, level, fr, en };
    });
  });
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

function getSprintMs() {
  const reductions = Math.floor(sprintStreak / 3);
  return Math.max(SPRINT_MS_MIN, SPRINT_MS_BASE - reductions * SPRINT_MS_STEP);
}

function updateSprintStats() {
  if (g.sprintStreak)       setText(g.sprintStreak,       String(sprintStreak));
  if (g.sprintLivesDisplay) setText(g.sprintLivesDisplay, livesDisplay(sprintLives));
  if (g.sprintRound)        setText(g.sprintRound,        String(sprintRound));
  if (g.sprintScore)        setText(g.sprintScore,        `${sprintCorrect}/${sprintTotal}`);

  // Speed label
  if (g.sprintSpeedLabel) {
    const ms = getSprintMs();
    if (ms <= 3000)      setText(g.sprintSpeedLabel, '🔴 Rapide');
    else if (ms <= 5500) setText(g.sprintSpeedLabel, '🟠 Moyen');
    else                 setText(g.sprintSpeedLabel, '🟢 Normal');
  }

  // Combo badge
  if (g.sprintCombo) {
    if (sprintStreak >= COMBO_THRESHOLD) {
      setText(g.sprintCombo, `🔥 Combo ×${sprintStreak}`);
      g.sprintCombo.classList.remove('hidden');
    } else {
      g.sprintCombo.classList.add('hidden');
    }
  }

  updateBest();
}

function getSprintMode() { return g.sprintModeSelect?.value ?? 'mix'; }

function updateSprintModeLabel() {
  const labels = { 'en-fr': 'Anglais → Francais', 'fr-en': 'Francais → Anglais', mix: 'Mixte (FR ↔ EN)' };
  if (g.sprintModeLabel) setText(g.sprintModeLabel, labels[getSprintMode()] ?? 'Mixte');
}

function paintTimer(ratio, ms) {
  if (!g.sprintTimerFill) return;
  g.sprintTimerFill.style.width = `${Math.max(0, Math.min(1, ratio)) * 100}%`;
  const hue = Math.round(ratio * 120);
  g.sprintTimerFill.style.background = `hsl(${hue}, 80%, 48%)`;
  const currentMs = ms ?? SPRINT_MS_BASE;
  if (g.sprintSeconds) setText(g.sprintSeconds, `${Math.max(0, Math.ceil(currentMs * ratio / 1000))}s`);
  // Pulse animation when below 30%
  if (g.sprintTimerFill) {
    g.sprintTimerFill.classList.toggle('is-urgent', ratio > 0 && ratio < 0.3);
  }
}

function clearSprintTimer() {
  if (sprintTimer) { clearInterval(sprintTimer); sprintTimer = null; }
}

function startCountdown(onTimeout) {
  clearSprintTimer();
  const ms = getSprintMs();
  sprintDeadline = Date.now() + ms;
  paintTimer(1, ms);
  sprintTimer = setInterval(() => {
    const left = sprintDeadline - Date.now();
    if (left <= 0) { clearSprintTimer(); paintTimer(0, ms); onTimeout(); return; }
    paintTimer(left / ms, ms);
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
  const accuracy = sprintTotal > 0 ? Math.round((sprintCorrect / sprintTotal) * 100) : 0;
  showSprintReady(`Partie terminee — ${sprintCorrect}/${sprintTotal} (${accuracy}%) · Meilleure serie : ${getBest()}.`);
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
  if (g.sprintWordMeta) setText(g.sprintWordMeta, `${correct.topicTitle} · ${correct.level}`);
  if (g.sprintFeedback) setText(g.sprintFeedback, '');

  renderAnswerBtns(g.sprintOptions,
    options.map(o => ({ text: direction === 'en-fr' ? o.fr : o.en, isCorrect: o.key === correct.key })),
    (btn, isCorrect) => {
      if (sprintLocked) return;
      sprintLocked = true;
      clearSprintTimer();
      sprintTotal += 1;

      lockBtns(g.sprintOptions);
      showCorrect(g.sprintOptions);

      if (isCorrect) {
        btn.classList.add('correct');
        sprintStreak  += 1;
        sprintCorrect += 1;
        markKnown(correct);
        if (sprintStreak > getBest()) saveBest(sprintStreak);
        updateSprintStats();
        const comboMsg = sprintStreak >= COMBO_THRESHOLD ? ` 🔥 ×${sprintStreak}` : '';
        if (g.sprintFeedback) setText(g.sprintFeedback, `Correct !${comboMsg}`);
        scheduleNext();
      } else {
        btn.classList.add('wrong');
        sprintStreak  = 0;
        sprintLives  -= 1;
        updateSprintStats();
        const ans = direction === 'en-fr' ? correct.fr : correct.en;
        if (g.sprintFeedback) setText(g.sprintFeedback,
          sprintLives > 0 ? `Rate — "${ans}"` : 'Plus de vies. Fin du sprint.');
        if (sprintLives > 0) scheduleNext(); else finishSprint();
      }
    }
  );

  startCountdown(() => {
    if (sprintLocked) return;
    sprintLocked  = true;
    sprintStreak  = 0;
    sprintTotal  += 1;
    sprintLives  -= 1;
    lockBtns(g.sprintOptions);
    showCorrect(g.sprintOptions);
    updateSprintStats();
    if (g.sprintFeedback) setText(g.sprintFeedback,
      sprintLives > 0 ? 'Temps ecoule !' : 'Temps ecoule. Fin du sprint.');
    if (sprintLives > 0) scheduleNext(); else finishSprint();
  });
}

function startSprint() {
  sprintStreak  = 0;
  sprintLives   = 3;
  sprintRound   = 0;
  sprintCorrect = 0;
  sprintTotal   = 0;
  sprintStarted = true;
  sprintLocked  = false;
  updateSprintStats();
  if (g.sprintReady)    g.sprintReady.classList.add('hidden');
  if (g.sprintCombo)    g.sprintCombo.classList.add('hidden');
  if (g.sprintWordMeta) setText(g.sprintWordMeta, '');
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
function updatePrepStats() {
  if (g.prepStreak) setText(g.prepStreak, String(prepStreak));
  if (g.prepBest)   setText(g.prepBest,   String(prepBestVal));
}

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
        prepStreak += 1;
        if (prepStreak > prepBestVal) prepBestVal = prepStreak;
        if (g.prepositionFeedback) setText(g.prepositionFeedback, `Correct ! "${item.answer}" · Serie : ${prepStreak}`);
      } else {
        btn.classList.add('wrong');
        prepStreak = 0;
        if (g.prepositionFeedback) setText(g.prepositionFeedback, `La bonne reponse etait "${item.answer}".`);
      }
      updatePrepStats();
    },
    'prep-btn'
  );
}

// ─── Conjugaison ─────────────────────────────────────────────
function getConjTense() { return g.conjugaisonTense?.value ?? 'all'; }

function updateConjStats() {
  if (g.conjugaisonScore)  setText(g.conjugaisonScore,  `${conjugaisonCorrect} / ${conjugaisonTotal}`);
  if (g.conjugaisonStreak) setText(g.conjugaisonStreak, String(conjugaisonStreak));
  const best = Number(localStorage.getItem(CONJ_BEST_KEY) || 0);
  if (g.conjugaisonBest) setText(g.conjugaisonBest, String(best));
}

function renderConjugaisonGame() {
  if (!g.conjugaisonQuestion || !g.conjugaisonOptions) return;

  const tense = getConjTense();
  const pool  = tense === 'all'
    ? CONJUGATION_QUESTIONS
    : CONJUGATION_QUESTIONS.filter(q => q.tense === tense);
  if (!pool.length) return;

  const item = pick(shuffle(pool));

  if (g.conjugaisonTenseBadge) {
    setText(g.conjugaisonTenseBadge, item.label);
    g.conjugaisonTenseBadge.className = `conj-tense-badge conj-tense-${item.tense}`;
  }
  setText(g.conjugaisonQuestion, item.sentence.replace('___', '______'));
  if (g.conjugaisonHint)     setText(g.conjugaisonHint,     '');
  if (g.conjugaisonFeedback) setText(g.conjugaisonFeedback, 'Choisis la bonne forme du verbe.');

  renderAnswerBtns(g.conjugaisonOptions,
    shuffle(item.options).map(opt => ({ text: opt, isCorrect: opt === item.answer })),
    (btn, isCorrect) => {
      conjugaisonTotal += 1;
      lockBtns(g.conjugaisonOptions);
      showCorrect(g.conjugaisonOptions);
      if (isCorrect) {
        btn.classList.add('correct');
        conjugaisonCorrect += 1;
        conjugaisonStreak  += 1;
        const best = Number(localStorage.getItem(CONJ_BEST_KEY) || 0);
        if (conjugaisonStreak > best) localStorage.setItem(CONJ_BEST_KEY, String(conjugaisonStreak));
        if (g.conjugaisonFeedback) setText(g.conjugaisonFeedback, `Parfait ! Serie : ${conjugaisonStreak}`);
        if (g.conjugaisonHint) setText(g.conjugaisonHint, '');
      } else {
        btn.classList.add('wrong');
        conjugaisonStreak = 0;
        if (g.conjugaisonFeedback) setText(g.conjugaisonFeedback, `La bonne reponse etait "${item.answer}".`);
        if (g.conjugaisonHint) setText(g.conjugaisonHint, `Aide : ${item.hint}`);
      }
      updateConjStats();
    },
    'conj-btn'
  );
}

// ─── Intrus ───────────────────────────────────────────────────
function buildIntrusRound() {
  const difficulty = g.intrusDifficulty?.value ?? 'easy';
  const topics     = shuffle(GAME_TOPICS);
  const goodTopic  = topics[0];
  const goodLevel  = pick(['B1', 'B2', 'C1']);

  let badTopic;
  if (difficulty === 'hard') {
    // Same category, different topic — harder to spot
    const sameCat = topics.filter(t => t.category === goodTopic.category && t.id !== goodTopic.id);
    badTopic = sameCat.length ? pick(sameCat) : topics[1];
  } else {
    // Different category — easier
    const diffCat = topics.filter(t => t.category !== goodTopic.category);
    badTopic = diffCat.length ? pick(diffCat) : topics[1];
  }

  const goodWords = shuffle(goodTopic.levels[goodLevel]).slice(0, 3).map(r => r.split('|')[0]);
  const intruder  = pick(shuffle(badTopic.levels[goodLevel])).split('|')[0];

  return {
    options: shuffle([...goodWords, intruder]),
    intruder,
    intruderTopic: badTopic.title,
    category: goodTopic.title,
    level: goodLevel
  };
}

function updateIntrusScore() {
  if (g.intrusScore) setText(g.intrusScore, `${intrusCorrect} / ${intrusTotal}`);
}

function renderIntrusGame() {
  if (!g.intrusOptions) return;
  intrusRound = buildIntrusRound();

  if (g.intrusInstruction) {
    setText(g.intrusInstruction,
      `3 mots viennent de "${intrusRound.category}" (${intrusRound.level}). Lequel vient d'ailleurs ?`);
  }
  if (g.intrusFeedback) setText(g.intrusFeedback, 'Clique sur le mot qui ne va pas.');
  if (g.intrusSource)   setText(g.intrusSource,   '');

  renderAnswerBtns(g.intrusOptions,
    intrusRound.options.map(word => ({ text: word, isCorrect: word === intrusRound.intruder })),
    (btn, isCorrect) => {
      intrusTotal += 1;
      lockBtns(g.intrusOptions);
      showCorrect(g.intrusOptions);
      if (isCorrect) {
        btn.classList.add('correct');
        intrusCorrect += 1;
        if (g.intrusFeedback) setText(g.intrusFeedback, `Bien vu ! Serie : ${intrusCorrect}/${intrusTotal}`);
      } else {
        btn.classList.add('wrong');
        if (g.intrusFeedback) setText(g.intrusFeedback, `L'intrus etait "${intrusRound.intruder}".`);
      }
      if (g.intrusSource) {
        setText(g.intrusSource, `"${intrusRound.intruder}" vient du sujet : ${intrusRound.intruderTopic}`);
      }
      updateIntrusScore();
    },
    'intrus-btn'
  );
}

// ─── Mission ──────────────────────────────────────────────────
const MISSION_BANK_IDS = ['opinion', 'reason', 'example', 'nuance', 'comparison', 'conclusion', 'fillers'];

function pickFromBank(bankId) {
  const bank = EXPRESSION_BANKS.find(b => b.id === bankId);
  if (!bank) return null;
  const [fr] = pick(shuffle(bank.items)).split('|');
  return fr;
}

function stopMissionTimer() {
  if (missionTimer) { clearInterval(missionTimer); missionTimer = null; }
  missionRunning = false;
}

function paintMissionTimer(ratio) {
  if (g.missionTimerFill) {
    g.missionTimerFill.style.width = `${Math.max(0, Math.min(1, ratio)) * 100}%`;
    const hue = Math.round(ratio * 120);
    g.missionTimerFill.style.background = `hsl(${hue}, 80%, 48%)`;
    g.missionTimerFill.classList.toggle('is-urgent', ratio > 0 && ratio < 0.2);
  }
  if (g.missionTimer) {
    const secs = Math.max(0, Math.ceil(MISSION_MS * ratio / 1000));
    setText(g.missionTimer, `${secs}s`);
  }
}

function startMissionTimer() {
  stopMissionTimer();
  missionRunning  = true;
  missionDeadline = Date.now() + MISSION_MS;
  paintMissionTimer(1);
  if (g.startMissionBtn) setText(g.startMissionBtn, 'Chrono lance !');
  missionTimer = setInterval(() => {
    const left = missionDeadline - Date.now();
    if (left <= 0) {
      stopMissionTimer();
      paintMissionTimer(0);
      if (g.missionTimer) setText(g.missionTimer, 'Temps !');
      if (g.startMissionBtn) setText(g.startMissionBtn, 'Relancer');
      return;
    }
    paintMissionTimer(left / MISSION_MS);
  }, 200);
}

function renderMission() {
  stopMissionTimer();
  paintMissionTimer(1);
  if (g.missionTimer)    setText(g.missionTimer, '90s');
  if (g.startMissionBtn) setText(g.startMissionBtn, 'Lancer le chrono');

  const sources = getPoolSources();
  const topic   = pick(shuffle(sources.length ? sources : GAME_TOPICS));

  if (g.missionTitle)    setText(g.missionTitle, `${topic.title}`);
  if (g.missionQuestion) setText(g.missionQuestion, topic.question);

  // Pick 5 expressions from varied banks
  const bankIds = shuffle(MISSION_BANK_IDS).slice(0, 5);
  const exprs   = bankIds.map(pickFromBank).filter(Boolean);

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
      'Reponds directement a la question.',
      'Donne une raison claire.',
      'Ajoute un exemple concret.',
      'Nuance ou compare avec un autre point de vue.',
      'Conclus en une phrase simple.'
    ]);
  }
}

// ─── Construis la phrase ──────────────────────────────────────
function updatePhraseScore() {
  if (g.phraseScore) setText(g.phraseScore, `${phraseCorrect} / ${phraseTotal}`);
}

function refreshPhraseDropZone() {
  if (!g.phraseDropZone) return;
  clear(g.phraseDropZone);
  if (!placedParts.length) {
    g.phraseDropZone.appendChild(el('span', 'phrase-placeholder', 'Clique les mots dans le bon ordre...'));
    return;
  }
  placedParts.forEach((part, i) => {
    const chip = el('button', 'phrase-chip');
    setText(chip, part);
    chip.addEventListener('click', () => {
      const btn = placedBtns[i];
      placedParts.splice(i, 1);
      placedBtns.splice(i, 1);
      if (btn) { btn.disabled = false; btn.classList.remove('used'); }
      refreshPhraseDropZone();
      if (g.phraseCheckBtn) g.phraseCheckBtn.classList.add('hidden');
    });
    g.phraseDropZone.appendChild(chip);
  });
}

function renderPhraseGame() {
  const puzzles = (window.FrenchClassData.phrasePuzzles || []);
  if (!puzzles.length) return;
  currentPhrase = pick(shuffle(puzzles));
  placedParts   = [];
  placedBtns    = [];

  if (g.phraseHint)        setText(g.phraseHint,        currentPhrase.hint);
  if (g.phraseTranslation) setText(g.phraseTranslation, `"${currentPhrase.translation}"`);
  if (g.phraseFeedback)    setText(g.phraseFeedback,    '');
  if (g.phraseCheckBtn)    g.phraseCheckBtn.classList.add('hidden');

  refreshPhraseDropZone();

  const shuffled = shuffle([...currentPhrase.parts]);
  if (g.phraseWordBank) {
    clear(g.phraseWordBank);
    shuffled.forEach(part => {
      const btn = el('button', 'btn phrase-word-btn');
      setText(btn, part);
      btn.addEventListener('click', () => {
        if (btn.disabled) return;
        btn.disabled = true;
        btn.classList.add('used');
        placedParts.push(part);
        placedBtns.push(btn);
        refreshPhraseDropZone();
        if (placedParts.length === currentPhrase.parts.length && g.phraseCheckBtn) {
          g.phraseCheckBtn.classList.remove('hidden');
        }
      });
      g.phraseWordBank.appendChild(btn);
    });
  }
  updatePhraseScore();
}

function checkPhraseAnswer() {
  if (!currentPhrase) return;
  phraseTotal += 1;
  const isCorrect = JSON.stringify(placedParts) === JSON.stringify(currentPhrase.parts);
  const chips = g.phraseDropZone?.querySelectorAll('.phrase-chip') ?? [];

  if (isCorrect) {
    phraseCorrect += 1;
    chips.forEach(c => c.classList.add('correct'));
    if (g.phraseFeedback) setText(g.phraseFeedback, 'Parfait ! Ordre correct.');
  } else {
    chips.forEach(c => c.classList.add('wrong'));
    const ans = currentPhrase.parts.join(' ');
    if (g.phraseFeedback) setText(g.phraseFeedback, `Pas tout a fait. Correct : "${ans}"`);
  }
  if (g.phraseCheckBtn) g.phraseCheckBtn.classList.add('hidden');
  updatePhraseScore();
  setTimeout(renderPhraseGame, 2600);
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
  prepBestVal = Number(localStorage.getItem(PREP_BEST_KEY) || 0);
  updateKnownCount();
  updateBest();
  updatePoolLabel();
  updateSprintModeLabel();
  updatePrepStats();
  updateConjStats();
  updateIntrusScore();
  updatePhraseScore();
  showSprintReady('Choisis un mode et lance le sprint.');
  nextFlashcard();
  renderPrepositionGame();
  renderConjugaisonGame();
  renderIntrusGame();
  renderMission();
  renderPhraseGame();
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
g.sprintLevelSelect?.addEventListener('change', () => {
  showSprintReady('Niveau change. Lance le sprint.');
});

// Sprint keyboard shortcuts — keys 1-4 click the matching answer button
document.addEventListener('keydown', e => {
  if (!sprintStarted || sprintLocked) return;
  const idx = ['1','2','3','4'].indexOf(e.key);
  if (idx === -1) return;
  const btns = g.sprintOptions?.querySelectorAll('.answer-btn');
  if (btns?.[idx]) btns[idx].click();
});

g.revealFlashBtn?.addEventListener('click', revealFlashcard);
g.nextFlashBtn?.addEventListener('click', nextFlashcard);
g.knowFlashBtn?.addEventListener('click', () => { if (flashWord) markKnown(flashWord); nextFlashcard(); });

g.newPrepositionBtn?.addEventListener('click', renderPrepositionGame);
g.newConjugaisonBtn?.addEventListener('click', renderConjugaisonGame);
g.conjugaisonTense?.addEventListener('change', renderConjugaisonGame);
g.newIntrusBtn?.addEventListener('click', renderIntrusGame);
g.intrusDifficulty?.addEventListener('change', renderIntrusGame);
g.newMissionBtn?.addEventListener('click', renderMission);
g.startMissionBtn?.addEventListener('click', startMissionTimer);
g.newPhraseBtn?.addEventListener('click', renderPhraseGame);
g.phraseCheckBtn?.addEventListener('click', checkPhraseAnswer);

init();
