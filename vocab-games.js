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
  // Difficulty influences base time
  const base = (typeof DIFFICULTY !== 'undefined')
    ? (DIFFICULTY === 'hard' ? 5500 : DIFFICULTY === 'medium' ? 7000 : SPRINT_MS_BASE)
    : SPRINT_MS_BASE;
  return Math.max(SPRINT_MS_MIN, base - reductions * SPRINT_MS_STEP);
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

// ============================================================
// DIFFICULTE GLOBALE (easy / medium / hard)
// ============================================================
const DIFF_KEY = 'french_class_difficulty';
let DIFFICULTY = localStorage.getItem(DIFF_KEY) || 'easy';

function getDifficulty() { return DIFFICULTY; }

function setDifficulty(d) {
  DIFFICULTY = d;
  localStorage.setItem(DIFF_KEY, d);
  document.querySelectorAll('#difficultyToggle .diff-btn').forEach(b => {
    b.classList.toggle('is-active', b.dataset.diff === d);
  });
  // Refresh games sensitive to difficulty
  renderAnagram();
  renderMemory(true);
  renderPendu();
  renderDictee();
  renderVraiFaux();
  renderTri();
  if (typeof murmotsBuild === 'function' && document.getElementById('murmotsGrid')) murmotsBuild();
}

function initDifficulty() {
  setDifficulty(DIFFICULTY);
  document.querySelectorAll('#difficultyToggle .diff-btn').forEach(b => {
    b.addEventListener('click', () => setDifficulty(b.dataset.diff));
  });
}

function diffPick(easy, medium, hard) {
  return DIFFICULTY === 'hard' ? hard : DIFFICULTY === 'medium' ? medium : easy;
}

function normalizeText(s) {
  return String(s || '')
    .toLowerCase()
    .trim()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[\s'-]+/g, ' ')
    .replace(/[^a-z\s]/g, '');
}

// ============================================================
// JEU : ANAGRAMMES
// ============================================================
const ANAGRAM_BEST_KEY = 'french_class_anagram_best';
let anagramScore = 0, anagramTotal = 0, anagramStreak = 0;
let anagramWord = null, anagramSlot = [], anagramHintUsed = false;

const aRefs = {
  newBtn:    document.getElementById('newAnagramBtn'),
  hintP:     document.getElementById('anagramHint'),
  en:        document.getElementById('anagramEn'),
  meta:      document.getElementById('anagramMeta'),
  letters:   document.getElementById('anagramLetters'),
  slot:      document.getElementById('anagramSlot'),
  clearBtn:  document.getElementById('anagramClearBtn'),
  hintBtn:   document.getElementById('anagramHintBtn'),
  checkBtn:  document.getElementById('anagramCheckBtn'),
  feedback:  document.getElementById('anagramFeedback'),
  score:     document.getElementById('anagramScore'),
  streak:    document.getElementById('anagramStreak'),
  best:      document.getElementById('anagramBest')
};

function pickAnagramWord() {
  const words = buildPoolWords().filter(w => {
    const fr = w.fr.replace(/[^a-zA-ZàâäéèêëîïôöùûüÿçÀÂÄÉÈÊËÎÏÔÖÙÛÜŸÇ]/g, '');
    if (fr.length < 4 || fr.length > 14) return false;
    if (fr.includes(' ')) return false;
    return true;
  });
  if (!words.length) return null;
  const lenRange = diffPick([4, 6], [6, 9], [8, 14]);
  const inRange  = words.filter(w => {
    const len = w.fr.replace(/[^a-zA-Z]/g, '').length;
    return len >= lenRange[0] && len <= lenRange[1];
  });
  return pick(shuffle(inRange.length ? inRange : words));
}

function refreshAnagramSlot() {
  clear(aRefs.slot);
  if (!anagramSlot.length) {
    aRefs.slot.appendChild(el('span', 'phrase-placeholder', 'Clique les lettres ici...'));
    return;
  }
  anagramSlot.forEach((entry, idx) => {
    const tile = el('button', 'letter-tile letter-tile-placed', entry.letter);
    tile.addEventListener('click', () => {
      anagramSlot.splice(idx, 1);
      const src = entry.btn;
      if (src) { src.disabled = false; src.classList.remove('used'); }
      refreshAnagramSlot();
    });
    aRefs.slot.appendChild(tile);
  });
}

function updateAnagramStats() {
  setText(aRefs.score, `${anagramScore}/${anagramTotal}`);
  setText(aRefs.streak, String(anagramStreak));
  setText(aRefs.best, String(Number(localStorage.getItem(ANAGRAM_BEST_KEY) || 0)));
}

function renderAnagram() {
  if (!aRefs.letters) return;
  anagramWord = pickAnagramWord();
  anagramSlot = [];
  anagramHintUsed = false;
  setText(aRefs.feedback, '');

  if (!anagramWord) {
    setText(aRefs.en, 'Aucun mot disponible.');
    setText(aRefs.meta, '');
    clear(aRefs.letters);
    refreshAnagramSlot();
    return;
  }

  const showEn = DIFFICULTY !== 'hard';
  setText(aRefs.en, showEn ? `${anagramWord.en}` : '?? indice cache (mode difficile)');
  setText(aRefs.meta, `${anagramWord.topicTitle} · ${anagramWord.level} · ${anagramWord.fr.length} lettres`);

  const letters = shuffle(anagramWord.fr.split(''));
  clear(aRefs.letters);
  letters.forEach(letter => {
    const btn = el('button', 'letter-tile', letter);
    btn.addEventListener('click', () => {
      if (btn.disabled) return;
      btn.disabled = true; btn.classList.add('used');
      anagramSlot.push({ letter, btn });
      refreshAnagramSlot();
    });
    aRefs.letters.appendChild(btn);
  });
  refreshAnagramSlot();
  updateAnagramStats();
}

function checkAnagram() {
  if (!anagramWord) return;
  const guess = anagramSlot.map(s => s.letter).join('');
  anagramTotal += 1;
  if (guess === anagramWord.fr) {
    anagramScore += anagramHintUsed ? Math.max(0, 1) : 2;
    anagramStreak += 1;
    if (anagramStreak > Number(localStorage.getItem(ANAGRAM_BEST_KEY) || 0)) {
      localStorage.setItem(ANAGRAM_BEST_KEY, String(anagramStreak));
    }
    markKnown(anagramWord);
    setText(aRefs.feedback, `✅ Bravo ! "${anagramWord.fr}" = ${anagramWord.en}`);
    setTimeout(renderAnagram, 1200);
  } else {
    anagramStreak = 0;
    setText(aRefs.feedback, `❌ Pas encore. La bonne reponse : "${anagramWord.fr}".`);
  }
  updateAnagramStats();
}

function clearAnagram() {
  anagramSlot.forEach(s => { if (s.btn) { s.btn.disabled = false; s.btn.classList.remove('used'); } });
  anagramSlot = [];
  refreshAnagramSlot();
}

function hintAnagram() {
  if (!anagramWord || anagramHintUsed) return;
  anagramHintUsed = true;
  const first = anagramWord.fr[0];
  const tiles = aRefs.letters.querySelectorAll('.letter-tile');
  for (const tile of tiles) {
    if (!tile.disabled && tile.textContent === first) {
      tile.click();
      break;
    }
  }
  setText(aRefs.feedback, `💡 Indice : la 1ere lettre est "${first}" (-1 point).`);
}

// ============================================================
// JEU : MEMORY (paires FR ↔ EN)
// ============================================================
const MEMORY_BEST_KEY = 'french_class_memory_best';
let memoryDeck = [], memoryFlipped = [], memoryMoves = 0, memoryPairs = 0, memoryTotalPairs = 0;
let memoryStartTime = 0, memoryTimer = null, memoryLocked = false;

const mRefs = {
  newBtn:   document.getElementById('newMemoryBtn'),
  grid:     document.getElementById('memoryGrid'),
  moves:    document.getElementById('memoryMoves'),
  pairs:    document.getElementById('memoryPairs'),
  time:     document.getElementById('memoryTime'),
  best:     document.getElementById('memoryBest'),
  feedback: document.getElementById('memoryFeedback')
};

function memoryStopTimer() {
  if (memoryTimer) { clearInterval(memoryTimer); memoryTimer = null; }
}

function memoryUpdateMeta() {
  setText(mRefs.moves, String(memoryMoves));
  setText(mRefs.pairs, `${memoryPairs}/${memoryTotalPairs}`);
  const elapsed = memoryStartTime ? Math.floor((Date.now() - memoryStartTime) / 1000) : 0;
  setText(mRefs.time, `${elapsed}s`);
  const best = localStorage.getItem(MEMORY_BEST_KEY);
  setText(mRefs.best, best ? `${best} coups` : '—');
}

function renderMemory(restart = false) {
  if (!mRefs.grid) return;
  memoryStopTimer();
  memoryFlipped = [];
  memoryMoves   = 0;
  memoryPairs   = 0;
  memoryLocked  = false;
  setText(mRefs.feedback, '');

  const pairCount = diffPick(6, 8, 12);
  memoryTotalPairs = pairCount;
  const wordsAll = shuffle(buildPoolWords()).slice(0, pairCount);
  if (wordsAll.length < pairCount) {
    clear(mRefs.grid);
    mRefs.grid.appendChild(el('span', 'phrase-placeholder', 'Pas assez de mots pour cette difficulte.'));
    memoryUpdateMeta();
    return;
  }
  memoryDeck = shuffle(wordsAll.flatMap((w, i) => [
    { id: `f-${i}`, pairId: i, side: 'fr', text: w.fr, mate: w.en },
    { id: `e-${i}`, pairId: i, side: 'en', text: w.en, mate: w.fr, word: w }
  ]));

  // Adjust columns based on count
  const cols = pairCount <= 6 ? 4 : pairCount <= 8 ? 4 : 6;
  mRefs.grid.style.gridTemplateColumns = `repeat(${cols}, minmax(0, 1fr))`;

  clear(mRefs.grid);
  memoryDeck.forEach(card => {
    const btn = el('button', `memory-card memory-card-${card.side}`);
    btn.dataset.id = card.id;
    btn.dataset.pair = String(card.pairId);
    btn.appendChild(el('span', 'memory-back', '?'));
    btn.appendChild(el('span', 'memory-front', card.text));
    btn.addEventListener('click', () => flipMemoryCard(btn, card));
    mRefs.grid.appendChild(btn);
  });

  memoryStartTime = Date.now();
  memoryTimer = setInterval(memoryUpdateMeta, 1000);
  memoryUpdateMeta();
}

function flipMemoryCard(btn, card) {
  if (memoryLocked) return;
  if (btn.classList.contains('is-flipped') || btn.classList.contains('is-matched')) return;
  if (memoryFlipped.length === 2) return;
  btn.classList.add('is-flipped');
  memoryFlipped.push({ btn, card });

  if (memoryFlipped.length === 2) {
    memoryMoves += 1;
    memoryUpdateMeta();
    const [a, b] = memoryFlipped;
    if (a.card.pairId === b.card.pairId) {
      memoryLocked = true;
      setTimeout(() => {
        a.btn.classList.add('is-matched');
        b.btn.classList.add('is-matched');
        memoryFlipped = [];
        memoryPairs += 1;
        memoryLocked = false;
        memoryUpdateMeta();
        const matchedWord = a.card.word || b.card.word;
        if (matchedWord) markKnown(matchedWord);
        if (memoryPairs === memoryTotalPairs) memoryWin();
      }, 350);
    } else {
      memoryLocked = true;
      setTimeout(() => {
        a.btn.classList.remove('is-flipped');
        b.btn.classList.remove('is-flipped');
        memoryFlipped = [];
        memoryLocked = false;
      }, 850);
    }
  }
}

function memoryWin() {
  memoryStopTimer();
  const best = Number(localStorage.getItem(MEMORY_BEST_KEY) || 0);
  if (!best || memoryMoves < best) {
    localStorage.setItem(MEMORY_BEST_KEY, String(memoryMoves));
  }
  const elapsed = Math.floor((Date.now() - memoryStartTime) / 1000);
  setText(mRefs.feedback, `🎉 Termine en ${memoryMoves} coups (${elapsed}s) !`);
  memoryUpdateMeta();
  if (window.Achievements && typeof window.Achievements.bump === 'function') {
    window.Achievements.bump('french_class_memory_wins', 1);
  }
  if (window.FrenchSounds) window.FrenchSounds.play('level');
}

// ============================================================
// JEU : PENDU
// ============================================================
const PENDU_BEST_KEY = 'french_class_pendu_best';
const PENDU_FRAMES = [
`  +---+
  |   |
      |
      |
      |
      |
=========`,
`  +---+
  |   |
  O   |
      |
      |
      |
=========`,
`  +---+
  |   |
  O   |
  |   |
      |
      |
=========`,
`  +---+
  |   |
  O   |
 /|   |
      |
      |
=========`,
`  +---+
  |   |
  O   |
 /|\\  |
      |
      |
=========`,
`  +---+
  |   |
  O   |
 /|\\  |
 /    |
      |
=========`,
`  +---+
  |   |
  O   |
 /|\\  |
 / \\  |
      |
=========`
];

let penduWord = null, penduRevealed = [], penduUsed = new Set(), penduWrong = 0, penduMaxLives = 6;
let penduWon = 0, penduStreak = 0, penduOver = false;

const pRefs = {
  newBtn:   document.getElementById('newPenduBtn'),
  clue:     document.getElementById('penduClue'),
  fig:      document.getElementById('penduFigure'),
  word:     document.getElementById('penduWord'),
  lives:    document.getElementById('penduLives'),
  wrong:    document.getElementById('penduWrong'),
  kbd:      document.getElementById('penduKeyboard'),
  feedback: document.getElementById('penduFeedback'),
  won:      document.getElementById('penduWon'),
  streak:   document.getElementById('penduStreak'),
  best:     document.getElementById('penduBest')
};

function penduUpdate() {
  if (!pRefs.word) return;
  const display = penduWord.fr.split('').map(ch => {
    if (ch === ' ' || ch === '-') return ch;
    const norm = ch.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
    return penduRevealed.includes(norm) ? ch : '_';
  }).join(' ');
  setText(pRefs.word, display);
  setText(pRefs.lives, String(penduMaxLives - penduWrong));
  setText(pRefs.wrong, [...penduUsed].filter(l => !penduRevealed.includes(l)).join(' ') || '—');
  pRefs.fig.textContent = PENDU_FRAMES[Math.min(penduWrong, PENDU_FRAMES.length - 1)];
  setText(pRefs.won, String(penduWon));
  setText(pRefs.streak, String(penduStreak));
  setText(pRefs.best, String(Number(localStorage.getItem(PENDU_BEST_KEY) || 0)));
}

function buildPenduKeyboard() {
  clear(pRefs.kbd);
  const rows = ['azertyuiop', 'qsdfghjklm', 'wxcvbn'];
  rows.forEach(row => {
    const rowEl = el('div', 'pendu-kbd-row');
    row.split('').forEach(ch => {
      const btn = el('button', 'pendu-key', ch);
      btn.dataset.letter = ch;
      btn.addEventListener('click', () => penduGuess(ch));
      rowEl.appendChild(btn);
    });
    pRefs.kbd.appendChild(rowEl);
  });
}

function penduGuess(letter) {
  if (penduOver || !penduWord) return;
  letter = letter.toLowerCase();
  if (penduUsed.has(letter)) return;
  penduUsed.add(letter);

  const btn = pRefs.kbd.querySelector(`[data-letter="${letter}"]`);
  const frNorm = penduWord.fr.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
  if (frNorm.includes(letter)) {
    penduRevealed.push(letter);
    if (btn) btn.classList.add('correct');
    const allRevealed = penduWord.fr.split('').every(ch => {
      if (ch === ' ' || ch === '-') return true;
      const n = ch.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
      return penduRevealed.includes(n);
    });
    if (allRevealed) penduWin();
  } else {
    penduWrong += 1;
    if (btn) btn.classList.add('wrong');
    if (penduWrong >= penduMaxLives) penduLose();
  }
  penduUpdate();
}

function penduWin() {
  penduOver = true;
  penduWon  += 1;
  penduStreak += 1;
  if (penduStreak > Number(localStorage.getItem(PENDU_BEST_KEY) || 0)) {
    localStorage.setItem(PENDU_BEST_KEY, String(penduStreak));
  }
  markKnown(penduWord);
  setText(pRefs.feedback, `🎉 Gagne ! "${penduWord.fr}" = ${penduWord.en}`);
  if (window.Achievements && typeof window.Achievements.bump === 'function') {
    window.Achievements.bump('french_class_pendu_wins', 1);
  }
  if (window.FrenchSounds) window.FrenchSounds.play('correct');
  setTimeout(renderPendu, 1500);
}

function penduLose() {
  penduOver = true;
  penduStreak = 0;
  setText(pRefs.feedback, `💀 Perdu. Le mot etait "${penduWord.fr}" (${penduWord.en}).`);
}

function renderPendu() {
  if (!pRefs.word) return;
  penduMaxLives = diffPick(8, 6, 5);
  const minLen  = diffPick(4, 6, 7);
  const maxLen  = diffPick(8, 11, 14);
  const showEn  = DIFFICULTY !== 'hard';

  const words = buildPoolWords().filter(w => {
    const fr = w.fr;
    return !fr.includes("'") && fr.length >= minLen && fr.length <= maxLen && !fr.includes(' ');
  });
  if (!words.length) {
    setText(pRefs.clue, 'Aucun mot disponible pour cette difficulte.');
    setText(pRefs.word, '—');
    if (pRefs.kbd) clear(pRefs.kbd);
    return;
  }
  penduWord = pick(shuffle(words));
  penduRevealed = [];
  penduUsed = new Set();
  penduWrong = 0;
  penduOver = false;

  // Reveal hint letters in easy mode
  if (DIFFICULTY === 'easy') {
    const uniq = [...new Set(penduWord.fr.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().split('').filter(c => /[a-z]/.test(c)))];
    shuffle(uniq).slice(0, 2).forEach(l => penduRevealed.push(l));
  }

  setText(pRefs.clue, showEn ? `Indice : ${penduWord.en} · ${penduWord.topicTitle} · ${penduWord.level}` : `${penduWord.topicTitle} · ${penduWord.level}`);
  setText(pRefs.feedback, '');
  buildPenduKeyboard();
  penduUpdate();
}

document.addEventListener('keydown', e => {
  const panel = document.querySelector('.game-tab-panel.is-active');
  if (!panel || panel.id !== 'tab-pendu') return;
  const k = e.key.toLowerCase();
  if (k.length === 1 && /[a-z]/.test(k)) penduGuess(k);
});

// ============================================================
// JEU : DICTEE (type the translation)
// ============================================================
const DICTEE_BEST_KEY = 'french_class_dictee_best';
let dicteeWord = null, dicteeScore = 0, dicteeTotal = 0, dicteeStreak = 0;

const dRefs = {
  dir:      document.getElementById('dicteeDir'),
  newBtn:   document.getElementById('newDicteeBtn'),
  tag:      document.getElementById('dicteeTag'),
  word:     document.getElementById('dicteeWord'),
  meta:     document.getElementById('dicteeMeta'),
  form:     document.getElementById('dicteeForm'),
  input:    document.getElementById('dicteeInput'),
  feedback: document.getElementById('dicteeFeedback'),
  score:    document.getElementById('dicteeScore'),
  streak:   document.getElementById('dicteeStreak'),
  best:     document.getElementById('dicteeBest')
};

function updateDicteeStats() {
  setText(dRefs.score, `${dicteeScore}/${dicteeTotal}`);
  setText(dRefs.streak, String(dicteeStreak));
  setText(dRefs.best, String(Number(localStorage.getItem(DICTEE_BEST_KEY) || 0)));
}

function renderDictee() {
  if (!dRefs.word) return;
  const words = buildPoolWords();
  if (!words.length) { setText(dRefs.word, '—'); return; }
  dicteeWord = pick(shuffle(words));

  const dir = dRefs.dir.value;
  const showSource = dir === 'en-fr';
  setText(dRefs.tag, showSource ? 'EN' : 'FR');
  const prompt = dir === 'en-fr' ? dicteeWord.en : dicteeWord.fr;
  let displayed = prompt;
  if (DIFFICULTY === 'easy') {
    const target = dir === 'en-fr' ? dicteeWord.fr : dicteeWord.en;
    displayed = `${prompt}  (commence par "${target[0]}…")`;
  }
  setText(dRefs.word, displayed);
  setText(dRefs.meta, DIFFICULTY === 'hard' ? 'aucune aide' : `${dicteeWord.topicTitle} · ${dicteeWord.level}`);
  if (dRefs.input) { dRefs.input.value = ''; dRefs.input.focus(); }
  setText(dRefs.feedback, '');
  updateDicteeStats();
}

function checkDictee(e) {
  e.preventDefault();
  if (!dicteeWord) return;
  const dir      = dRefs.dir.value;
  const target   = dir === 'en-fr' ? dicteeWord.fr : dicteeWord.en;
  const answer   = normalizeText(dRefs.input.value);
  const expected = normalizeText(target);
  dicteeTotal += 1;
  if (answer === expected) {
    dicteeScore += 1; dicteeStreak += 1;
    markKnown(dicteeWord);
    if (dicteeStreak > Number(localStorage.getItem(DICTEE_BEST_KEY) || 0)) {
      localStorage.setItem(DICTEE_BEST_KEY, String(dicteeStreak));
    }
    setText(dRefs.feedback, `✅ Parfait ! "${target}"`);
    setTimeout(renderDictee, 800);
  } else {
    dicteeStreak = 0;
    setText(dRefs.feedback, `❌ La bonne reponse : "${target}".`);
  }
  updateDicteeStats();
}

// ============================================================
// JEU : VRAI OU FAUX
// ============================================================
const VF_BEST_KEY = 'french_class_vf_best';
let vfWord = null, vfShownEn = '', vfIsTrue = true, vfLocked = false;
let vfScore = 0, vfTotal = 0, vfStreak = 0;

const vfRefs = {
  newBtn:   document.getElementById('newVraiFauxBtn'),
  fr:       document.getElementById('vfFr'),
  en:       document.getElementById('vfEn'),
  trueBtn:  document.getElementById('vfTrueBtn'),
  falseBtn: document.getElementById('vfFalseBtn'),
  feedback: document.getElementById('vfFeedback'),
  score:    document.getElementById('vfScore'),
  streak:   document.getElementById('vfStreak'),
  best:     document.getElementById('vfBest')
};

function updateVfStats() {
  setText(vfRefs.score, `${vfScore}/${vfTotal}`);
  setText(vfRefs.streak, String(vfStreak));
  setText(vfRefs.best, String(Number(localStorage.getItem(VF_BEST_KEY) || 0)));
}

function renderVraiFaux() {
  if (!vfRefs.fr) return;
  const words = buildPoolWords();
  if (words.length < 4) { setText(vfRefs.fr, '—'); return; }
  vfWord  = pick(shuffle(words));
  vfLocked = false;
  vfIsTrue = Math.random() < 0.5;

  if (vfIsTrue) {
    vfShownEn = vfWord.en;
  } else {
    let pool = words.filter(w => w.en !== vfWord.en);
    if (DIFFICULTY === 'medium') {
      const same = pool.filter(w => w.topicId === vfWord.topicId);
      if (same.length) pool = same;
    } else if (DIFFICULTY === 'hard') {
      const same = pool.filter(w => w.topicId === vfWord.topicId && w.level === vfWord.level);
      if (same.length) pool = same;
    }
    vfShownEn = pick(shuffle(pool)).en;
  }

  setText(vfRefs.fr, vfWord.fr);
  setText(vfRefs.en, vfShownEn);
  vfRefs.trueBtn.disabled  = false;
  vfRefs.falseBtn.disabled = false;
  vfRefs.trueBtn.classList.remove('correct', 'wrong');
  vfRefs.falseBtn.classList.remove('correct', 'wrong');
  setText(vfRefs.feedback, '');
  updateVfStats();
}

function answerVf(saidTrue) {
  if (vfLocked || !vfWord) return;
  vfLocked = true;
  vfTotal += 1;
  const correct = (saidTrue && vfIsTrue) || (!saidTrue && !vfIsTrue);
  vfRefs.trueBtn.disabled = true;
  vfRefs.falseBtn.disabled = true;
  if (correct) {
    vfScore += 1; vfStreak += 1;
    markKnown(vfWord);
    if (vfStreak > Number(localStorage.getItem(VF_BEST_KEY) || 0)) {
      localStorage.setItem(VF_BEST_KEY, String(vfStreak));
    }
    (saidTrue ? vfRefs.trueBtn : vfRefs.falseBtn).classList.add('correct');
    setText(vfRefs.feedback, `✅ ${vfIsTrue ? 'Vrai' : 'Faux'} — la bonne traduction de "${vfWord.fr}" est "${vfWord.en}".`);
  } else {
    vfStreak = 0;
    (saidTrue ? vfRefs.trueBtn : vfRefs.falseBtn).classList.add('wrong');
    (vfIsTrue ? vfRefs.trueBtn : vfRefs.falseBtn).classList.add('correct');
    setText(vfRefs.feedback, `❌ C'etait ${vfIsTrue ? 'vrai' : 'faux'}. "${vfWord.fr}" = "${vfWord.en}".`);
  }
  updateVfStats();
  setTimeout(renderVraiFaux, 1300);
}

// ============================================================
// JEU : TRI PAR THEME
// ============================================================
let triCorrect = 0, triWrong = 0, triRounds = 0;
let triCategories = [], triBank = [], triSelected = null;

const tRefs = {
  newBtn:   document.getElementById('newTriBtn'),
  bank:     document.getElementById('triBank'),
  cats:     document.getElementById('triCategories'),
  feedback: document.getElementById('triFeedback'),
  correct:  document.getElementById('triCorrect'),
  wrong:    document.getElementById('triWrong'),
  rounds:   document.getElementById('triRounds')
};

function updateTriStats() {
  setText(tRefs.correct, String(triCorrect));
  setText(tRefs.wrong, String(triWrong));
  setText(tRefs.rounds, String(triRounds));
}

function renderTri() {
  if (!tRefs.bank) return;
  const catCount    = diffPick(2, 3, 4);
  const wordsPerCat = diffPick(3, 3, 3);

  let topics = shuffle(GAME_TOPICS);
  if (DIFFICULTY === 'hard') {
    // Pick topics from the SAME category to make it tricky
    const groups = {};
    topics.forEach(t => { (groups[t.category] ||= []).push(t); });
    const bigGroup = Object.values(groups).find(g => g.length >= catCount);
    if (bigGroup) topics = shuffle(bigGroup);
  }
  triCategories = topics.slice(0, catCount).map(t => ({
    id: t.id,
    title: t.title,
    items: shuffle(['B1', 'B2', 'C1'].flatMap(level =>
      (t.levels[level] || []).map(raw => ({ fr: raw.split('|')[0], topicId: t.id }))
    )).slice(0, wordsPerCat),
    placed: []
  }));

  triBank = shuffle(triCategories.flatMap(c => c.items));
  triSelected = null;
  setText(tRefs.feedback, 'Choisis un mot, puis clique sur la bonne categorie.');

  // Bank
  clear(tRefs.bank);
  triBank.forEach(item => {
    const btn = el('button', 'tri-word');
    setText(btn, item.fr);
    btn.dataset.id = `${item.topicId}__${item.fr}`;
    btn.addEventListener('click', () => selectTriWord(btn, item));
    tRefs.bank.appendChild(btn);
  });

  // Categories
  clear(tRefs.cats);
  triCategories.forEach(c => {
    const box = el('div', 'tri-category');
    box.appendChild(el('h3', 'tri-cat-title', c.title));
    const slot = el('div', 'tri-cat-slot');
    slot.dataset.id = c.id;
    slot.addEventListener('click', () => placeTriWord(c, slot));
    box.appendChild(slot);
    tRefs.cats.appendChild(box);
  });
  updateTriStats();
}

function selectTriWord(btn, item) {
  document.querySelectorAll('.tri-word.is-selected').forEach(b => b.classList.remove('is-selected'));
  btn.classList.add('is-selected');
  triSelected = { btn, item };
}

function placeTriWord(category, slot) {
  if (!triSelected) {
    setText(tRefs.feedback, 'Choisis d\'abord un mot dans la banque.');
    return;
  }
  const { btn, item } = triSelected;
  if (item.topicId === category.id) {
    triCorrect += 1;
    const chip = el('span', 'tri-chip tri-chip-ok');
    setText(chip, item.fr);
    slot.appendChild(chip);
    btn.remove();
    setText(tRefs.feedback, `✅ "${item.fr}" → ${category.title}`);
    if (!tRefs.bank.querySelector('.tri-word')) {
      triRounds += 1;
      setText(tRefs.feedback, `🎉 Manche terminee — ${triCorrect} bons / ${triWrong} faux.`);
      setTimeout(renderTri, 1400);
    }
  } else {
    triWrong += 1;
    btn.classList.remove('is-selected');
    btn.classList.add('shake');
    setTimeout(() => btn.classList.remove('shake'), 500);
    setText(tRefs.feedback, `❌ "${item.fr}" ne vient pas de "${category.title}".`);
  }
  triSelected = null;
  updateTriStats();
}

// ============================================================
// JEUX PREMIUM : PHRASE XL + CHAINE + GEMMES
// Utilise les donnees de theme-gems.js
// ============================================================
const GEMS = (window.ThemeGems && window.ThemeGems.THEMES) || [];

// ------------------------------------------------------------
// Phrase XL : phrases multi-trous avec combo/multiplicateur
// ------------------------------------------------------------
const PXL_BEST_KEY = 'french_class_pxl_best';
let pxlScore = 0, pxlDone = 0, pxlStreak = 0, pxlCombo = 1;
let pxlItem = null, pxlBlanks = [], pxlActiveIdx = 0, pxlPerfectRun = 0;

const pxl = {
  theme:    document.getElementById('pxlTheme'),
  newBtn:   document.getElementById('pxlNewBtn'),
  hint:     document.getElementById('pxlHint'),
  sentence: document.getElementById('pxlSentence'),
  banks:    document.getElementById('pxlBanks'),
  feedback: document.getElementById('pxlFeedback'),
  score:    document.getElementById('pxlScore'),
  doneEl:   document.getElementById('pxlDone'),
  streak:   document.getElementById('pxlStreak'),
  best:     document.getElementById('pxlBest'),
  combo:    document.getElementById('pxlCombo')
};

function pxlThemePool() {
  const value = pxl.theme?.value || 'all';
  if (value === 'all') return GEMS.flatMap(t => t.prepositions.map(p => ({ ...p, theme: t })));
  const theme = GEMS.find(t => t.id === value);
  return theme ? theme.prepositions.map(p => ({ ...p, theme })) : [];
}

function pxlUpdateCombo() {
  if (!pxl.combo) return;
  const label = `x${pxlCombo}`;
  pxl.combo.textContent = label;
  pxl.combo.classList.toggle('is-big', pxlCombo >= 2);
  pxl.combo.classList.toggle('is-huge', pxlCombo >= 3);
}

function pxlUpdateStats() {
  setText(pxl.score, String(pxlScore));
  setText(pxl.doneEl, String(pxlDone));
  setText(pxl.streak, String(pxlStreak));
  setText(pxl.best, String(Number(localStorage.getItem(PXL_BEST_KEY) || 0)));
  pxlUpdateCombo();
}

function renderPhraseXL() {
  if (!pxl.sentence) return;
  const pool = pxlThemePool();
  if (!pool.length) { setText(pxl.sentence, 'Aucune phrase pour ce theme.'); return; }
  pxlItem     = pick(shuffle(pool));
  pxlBlanks   = pxlItem.blanks.map(b => ({ ...b, state: 'open', given: null }));
  pxlActiveIdx = 0;
  renderPxlSentence();
  renderPxlBanks();
  setText(pxl.feedback, '');
  setText(pxl.hint, `Theme : ${pxlItem.theme.icon} ${pxlItem.theme.title} · ${pxlBlanks.length} trous`);
  pxlUpdateStats();
}

function renderPxlSentence() {
  clear(pxl.sentence);
  const parts = pxlItem.text.split(/(__\d+)/g);
  parts.forEach(seg => {
    const m = seg.match(/__(\d+)/);
    if (m) {
      const idx = Number(m[1]);
      const slot = el('span', 'pxl-slot');
      slot.dataset.idx = String(idx);
      const b = pxlBlanks[idx];
      if (b.state === 'open')        { slot.textContent = '____'; }
      if (b.state === 'good')        { slot.classList.add('is-good');  slot.textContent = b.given; }
      if (b.state === 'bad')         { slot.classList.add('is-bad');   slot.textContent = b.given; }
      if (b.state === 'recovered')   { slot.classList.add('is-recov'); slot.textContent = b.given; }
      if (idx === pxlActiveIdx && b.state === 'open') slot.classList.add('is-active');
      slot.addEventListener('click', () => { if (b.state === 'open') { pxlActiveIdx = idx; renderPxlSentence(); renderPxlBanks(); } });
      pxl.sentence.appendChild(slot);
    } else {
      pxl.sentence.appendChild(document.createTextNode(seg));
    }
  });
}

function renderPxlBanks() {
  clear(pxl.banks);
  pxlBlanks.forEach((b, idx) => {
    if (b.state !== 'open') return;
    const box = el('div', 'pxl-bank');
    if (idx === pxlActiveIdx) box.classList.add('is-active');
    box.appendChild(el('span', 'pxl-bank-label', `Trou ${idx + 1}`));
    const row = el('div', 'pxl-bank-row');
    shuffle([...b.options]).forEach(opt => {
      const btn = el('button', 'pxl-opt', opt);
      btn.addEventListener('click', () => pxlAnswer(idx, opt, btn));
      row.appendChild(btn);
    });
    box.appendChild(row);
    pxl.banks.appendChild(box);
  });
}

function pxlAnswer(idx, opt, btn) {
  const b = pxlBlanks[idx];
  if (b.state !== 'open') return;
  if (opt === b.answer) {
    b.state = b.triedWrong ? 'recovered' : 'good';
    b.given = opt;
    btn.classList.add('correct');
    // pick next open blank
    const nextOpen = pxlBlanks.findIndex(x => x.state === 'open');
    pxlActiveIdx = nextOpen >= 0 ? nextOpen : idx;
    renderPxlSentence();
    renderPxlBanks();

    // Check finished
    if (!pxlBlanks.some(x => x.state === 'open')) pxlFinishSentence();
  } else {
    b.triedWrong = true;
    btn.classList.add('wrong');
    setTimeout(() => btn.classList.remove('wrong'), 380);
    // Reset combo on error
    pxlCombo = 1;
    pxlPerfectRun = 0;
    pxlUpdateCombo();
    setText(pxl.feedback, `❌ "${opt}" n'est pas la bonne. Reessaie.`);
  }
}

function pxlFinishSentence() {
  pxlDone += 1;
  const perfect = pxlBlanks.every(b => b.state === 'good');
  let gained = pxlBlanks.filter(b => b.state === 'good').length * 2;
  if (perfect) gained += 5;
  gained *= pxlCombo;
  pxlScore += gained;

  if (perfect) {
    pxlStreak += 1;
    pxlPerfectRun += 1;
    if (pxlPerfectRun >= 6)      pxlCombo = 4;
    else if (pxlPerfectRun >= 4) pxlCombo = 3;
    else if (pxlPerfectRun >= 2) pxlCombo = 2;
    if (pxlStreak > Number(localStorage.getItem(PXL_BEST_KEY) || 0)) {
      localStorage.setItem(PXL_BEST_KEY, String(pxlStreak));
    }
    setText(pxl.feedback, `🎉 Parfait ! +${gained} points (combo x${pxlCombo})`);
  } else {
    pxlStreak = 0;
    pxlPerfectRun = 0;
    pxlCombo = 1;
    setText(pxl.feedback, `OK. +${gained} points. Les bonnes reponses : ${pxlBlanks.map(b => `"${b.answer}"`).join(', ')}.`);
  }
  pxlUpdateStats();
  setTimeout(renderPhraseXL, perfect ? 950 : 1800);
}

function initPxlTheme() {
  if (!pxl.theme) return;
  GEMS.forEach(t => {
    const opt = el('option', '', `${t.icon} ${t.title}`);
    opt.value = t.id;
    pxl.theme.appendChild(opt);
  });
  pxl.theme.addEventListener('change', renderPhraseXL);
}

// ------------------------------------------------------------
// Chaine : bâtir une phrase choix par choix
// ------------------------------------------------------------
const CHAINE_BEST_KEY = 'french_class_chaine_best';
let chaineTheme = null, chaineNode = null, chaineTrail = [], chainePoints = 0;

const ch = {
  theme:    document.getElementById('chaineTheme'),
  newBtn:   document.getElementById('chaineNewBtn'),
  sentence: document.getElementById('chaineSentence'),
  options:  document.getElementById('chaineOptions'),
  feedback: document.getElementById('chaineFeedback'),
  lenEl:    document.getElementById('chaineLen'),
  points:   document.getElementById('chainePoints'),
  best:     document.getElementById('chaineBest')
};

function initChaineTheme() {
  if (!ch.theme) return;
  GEMS.forEach(t => {
    const opt = el('option', '', `${t.icon} ${t.title}`);
    opt.value = t.id;
    ch.theme.appendChild(opt);
  });
  ch.theme.addEventListener('change', renderChaine);
}

function renderChaine() {
  if (!ch.sentence) return;
  const selected = ch.theme?.value || GEMS[0]?.id;
  chaineTheme = GEMS.find(t => t.id === selected) || GEMS[0];
  if (!chaineTheme || !chaineTheme.chain) { setText(ch.sentence, 'Theme indisponible.'); return; }
  chaineNode = chaineTheme.chain[0];
  chaineTrail = [];
  chainePoints = 0;
  setText(ch.feedback, 'Commence la phrase.');
  renderChaineStep();
  updateChaineStats();
}

function updateChaineStats() {
  setText(ch.lenEl, String(chaineTrail.length));
  setText(ch.points, String(chainePoints));
  setText(ch.best, String(Number(localStorage.getItem(CHAINE_BEST_KEY) || 0)));
}

function renderChaineStep() {
  // Sentence so far
  clear(ch.sentence);
  if (!chaineTrail.length) {
    ch.sentence.appendChild(el('span', 'chaine-placeholder', '(clique une brique pour commencer)'));
  } else {
    chaineTrail.forEach(token => {
      ch.sentence.appendChild(el('span', 'chaine-chip', token));
    });
  }
  // Options
  clear(ch.options);
  if (!chaineNode) {
    const endBtn = el('button', 'btn btn-primary', '🔁 Nouvelle phrase');
    endBtn.addEventListener('click', renderChaine);
    ch.options.appendChild(endBtn);
    return;
  }
  chaineNode.options.forEach(op => {
    const btn = el('button', op.end ? 'chaine-brick chaine-brick-end' : 'chaine-brick');
    setText(btn, op.end ? `${op.text} · fin` : op.text);
    btn.addEventListener('click', () => chaineChoose(op));
    ch.options.appendChild(btn);
  });
}

function chaineChoose(op) {
  chaineTrail.push(op.text);
  chainePoints += 5;
  if (op.end) {
    chainePoints += 10;
    chaineNode = null;
    const len = chaineTrail.length;
    const bestKey = Number(localStorage.getItem(CHAINE_BEST_KEY) || 0);
    if (chainePoints > bestKey) localStorage.setItem(CHAINE_BEST_KEY, String(chainePoints));
    setText(ch.feedback, `✅ Phrase terminee (${len} briques, ${chainePoints} pts). Bien joue !`);
  } else if (op.next && op.next.length) {
    chaineNode = op.next[0];
    setText(ch.feedback, `+5 pts. Continue !`);
  } else {
    chaineNode = null;
    setText(ch.feedback, `+5 pts. Fin de chaine.`);
  }
  renderChaineStep();
  updateChaineStats();
}

// ------------------------------------------------------------
// GEMMES : collection themed
// ------------------------------------------------------------
const GEM_KEY = 'french_class_gems_unlocked_v1';
const GEM_BEST_KEY = 'french_class_gems_best_streak';
let gemMode = 'fr-en';    // or 'en-fr'
let gemTheme = null;
let gemWord  = null;
let gemStreak = 0;
let gemLocked = false;

const gm = {
  count:      document.getElementById('gemCount'),
  themesDone: document.getElementById('gemThemesDone'),
  title:      document.getElementById('gemPlayTitle'),
  modeBtn:    document.getElementById('gemModeBtn'),
  resetBtn:   document.getElementById('gemResetBtn'),
  prompt:     document.getElementById('gemPrompt'),
  options:    document.getElementById('gemOptions'),
  feedback:   document.getElementById('gemFeedback'),
  streak:     document.getElementById('gemStreak'),
  best:       document.getElementById('gemBest'),
  progress:   document.getElementById('gemProgress'),
  themeList:  document.getElementById('gemThemeList')
};

function loadGemUnlocks() {
  try { return JSON.parse(localStorage.getItem(GEM_KEY) || '{}'); } catch { return {}; }
}
function saveGemUnlocks(state) { localStorage.setItem(GEM_KEY, JSON.stringify(state)); }

function gemKey(themeId, frWord) { return `${themeId}::${frWord}`; }

function totalGemsUnlocked(state) {
  return Object.values(state).reduce((acc, arr) => acc + (arr?.length || 0), 0);
}
function themeComplete(state, theme) {
  const list = state[theme.id] || [];
  return list.length >= theme.gems.length;
}
function themesDoneCount(state) {
  return GEMS.filter(t => themeComplete(state, t)).length;
}

function updateGemGlobal() {
  const state = loadGemUnlocks();
  setText(gm.count, String(totalGemsUnlocked(state)));
  setText(gm.themesDone, `${themesDoneCount(state)} / ${GEMS.length}`);
}

function renderGemThemeList() {
  if (!gm.themeList) return;
  const state = loadGemUnlocks();
  clear(gm.themeList);
  GEMS.forEach(t => {
    const unlocked = (state[t.id] || []).length;
    const total    = t.gems.length;
    const pct      = Math.round((unlocked / total) * 100);
    const card = el('button', 'gem-theme-btn');
    card.style.setProperty('--accent', t.accent);
    const h = el('div', 'gem-theme-head');
    h.appendChild(el('span', 'gem-theme-icon', t.icon));
    h.appendChild(el('span', 'gem-theme-title', t.title));
    card.appendChild(h);
    const bar = el('div', 'gem-bar');
    const fill = el('div', 'gem-bar-fill');
    fill.style.width = `${pct}%`;
    bar.appendChild(fill);
    card.appendChild(bar);
    const meta = el('span', 'gem-theme-meta', `${unlocked}/${total} gemmes${themeComplete(state, t) ? ' · ✓' : ''}`);
    card.appendChild(meta);
    if (gemTheme?.id === t.id) card.classList.add('is-active');
    card.addEventListener('click', () => selectGemTheme(t));
    gm.themeList.appendChild(card);
  });
}

function selectGemTheme(theme) {
  gemTheme = theme;
  gemStreak = 0;
  nextGemQuestion();
  renderGemThemeList();
}

function updateGemProgress() {
  const state = loadGemUnlocks();
  const unlocked = (state[gemTheme?.id] || []).length;
  const total = gemTheme?.gems.length || 0;
  setText(gm.progress, gemTheme ? `${unlocked}/${total}` : '—');
  setText(gm.streak, String(gemStreak));
  setText(gm.best, String(Number(localStorage.getItem(GEM_BEST_KEY) || 0)));
}

function nextGemQuestion() {
  gemLocked = false;
  if (!gemTheme) return;
  const state = loadGemUnlocks();
  const unlockedSet = new Set(state[gemTheme.id] || []);
  const remaining = gemTheme.gems.filter(g => !unlockedSet.has(g.fr));
  setText(gm.title, `${gemTheme.icon} ${gemTheme.title}`);

  if (!remaining.length) {
    setText(gm.prompt, '🎉 Collection complete pour ce theme !');
    clear(gm.options);
    setText(gm.feedback, 'Choisis un autre theme pour continuer.');
    updateGemProgress();
    return;
  }
  gemWord = pick(shuffle(remaining));
  const targetSide = gemMode === 'fr-en' ? 'fr' : 'en';
  const shownSide  = gemMode === 'fr-en' ? 'en' : 'fr';
  setText(gm.prompt, `Que signifie "${gemWord[targetSide]}" en ${gemMode === 'fr-en' ? 'anglais' : 'francais'} ?`);
  const distractors = shuffle(gemTheme.gems.filter(g => g.fr !== gemWord.fr)).slice(0, 3).map(g => g[shownSide]);
  const opts = shuffle([gemWord[shownSide], ...distractors]);

  clear(gm.options);
  opts.forEach(txt => {
    const btn = el('button', 'gem-opt', txt);
    btn.addEventListener('click', () => answerGem(btn, txt));
    gm.options.appendChild(btn);
  });
  setText(gm.feedback, `Serie : ${gemStreak} · gemmes restantes : ${remaining.length}`);
  updateGemProgress();
}

function answerGem(btn, txt) {
  if (gemLocked || !gemWord) return;
  gemLocked = true;
  const shownSide = gemMode === 'fr-en' ? 'en' : 'fr';
  const correct = txt === gemWord[shownSide];
  [...gm.options.children].forEach(b => {
    b.disabled = true;
    if (b.textContent === gemWord[shownSide]) b.classList.add('correct');
  });
  if (correct) {
    btn.classList.add('correct');
    gemStreak += 1;
    if (gemStreak > Number(localStorage.getItem(GEM_BEST_KEY) || 0)) {
      localStorage.setItem(GEM_BEST_KEY, String(gemStreak));
    }
    const state = loadGemUnlocks();
    const list  = new Set(state[gemTheme.id] || []);
    list.add(gemWord.fr);
    state[gemTheme.id] = [...list];
    saveGemUnlocks(state);
    setText(gm.feedback, `💎 +1 gemme : "${gemWord.fr}" = ${gemWord.en}`);
    updateGemGlobal();
    renderGemThemeList();
    setTimeout(nextGemQuestion, 700);
  } else {
    btn.classList.add('wrong');
    gemStreak = 0;
    setText(gm.feedback, `❌ "${gemWord.fr}" = ${gemWord.en}. Pas de gemme cette fois.`);
    setTimeout(nextGemQuestion, 1400);
  }
  updateGemProgress();
}

function toggleGemMode() {
  gemMode = (gemMode === 'fr-en') ? 'en-fr' : 'fr-en';
  if (gm.modeBtn) gm.modeBtn.textContent = `Mode : ${gemMode === 'fr-en' ? 'FR → EN' : 'EN → FR'}`;
  if (gemTheme) nextGemQuestion();
}

function resetGemTheme() {
  if (!gemTheme) return;
  const state = loadGemUnlocks();
  delete state[gemTheme.id];
  saveGemUnlocks(state);
  gemStreak = 0;
  updateGemGlobal();
  renderGemThemeList();
  nextGemQuestion();
}

function initGems() {
  if (!gm.themeList) return;
  updateGemGlobal();
  renderGemThemeList();
  // auto-select first theme
  if (GEMS[0]) selectGemTheme(GEMS[0]);
  gm.modeBtn?.addEventListener('click', toggleGemMode);
  gm.resetBtn?.addEventListener('click', resetGemTheme);
}

// ============================================================
// JEU : BINGO DES PREPOSITIONS
// ============================================================
const BINGO_PREPS = ['a','de','en','dans','sur','sous','pour','par','avec','chez','vers','depuis','pendant','avant','apres','entre','contre','sans','jusqu\'a','autour','aupres','grace a','malgre','d\'','au'];
const BINGO_BEST_KEY = 'french_class_bingo_best';

let bingoGrid = [], bingoMarked = new Set(), bingoCurrent = null, bingoCalledHistory = [];
let bingoLines = 0, bingoWins = 0;

const bg = {
  newBtn:  document.getElementById('bingoNewBtn'),
  callBtn: document.getElementById('bingoCallBtn'),
  hint:    document.getElementById('bingoHint'),
  call:    document.getElementById('bingoCall'),
  grid:    document.getElementById('bingoGrid'),
  feedback:document.getElementById('bingoFeedback'),
  marked:  document.getElementById('bingoMarked'),
  lines:   document.getElementById('bingoLines'),
  wins:    document.getElementById('bingoWins')
};

function bingoAllSentences() {
  // Use prep questions from theme-gems + verbs-data if loaded
  const out = [];
  if (window.ThemeGems) {
    window.ThemeGems.THEMES.forEach(t => {
      t.prepositions.forEach(s => {
        s.blanks.forEach((b, i) => {
          // Build a single-blank version of the sentence using ___
          const text = s.text.replace(new RegExp(`__${i}\\b`, 'g'), '___')
                              .replace(/__\d+/g, b => {
                                const idx = Number(b.match(/\d+/)[0]);
                                return s.blanks[idx].answer;
                              });
          out.push({ sentence: text, answer: b.answer });
        });
      });
    });
  }
  if (window.FrenchVerbs && window.FrenchVerbs.VERB_PREPOSITIONS) {
    window.FrenchVerbs.VERB_PREPOSITIONS.forEach(p => {
      out.push({ sentence: p.sentence.replace('___', '___'), answer: p.answer });
    });
  }
  return out;
}

function bingoBuild() {
  // Build a 5x5 grid: pick 24 random preps that COULD be answers + center FREE
  const sentences = bingoAllSentences();
  const allAnswers = [...new Set(sentences.map(s => s.answer))];
  const pool = shuffle([...new Set([...allAnswers, ...BINGO_PREPS])]).slice(0, 24);
  bingoGrid = [];
  let idx = 0;
  for (let r = 0; r < 5; r++) {
    const row = [];
    for (let c = 0; c < 5; c++) {
      if (r === 2 && c === 2) row.push({ text: '★', isFree: true, marked: true });
      else row.push({ text: pool[idx++], isFree: false, marked: false });
    }
    bingoGrid.push(row);
  }
  bingoMarked = new Set(['2-2']);
  bingoCalledHistory = [];
  bingoLines = 0;
  renderBingoGrid();
  setText(bg.call, 'Clique "Tirer une phrase" pour commencer.');
  setText(bg.feedback, '');
  bingoUpdateStats();
}

function renderBingoGrid() {
  if (!bg.grid) return;
  clear(bg.grid);
  bingoGrid.forEach((row, r) => {
    row.forEach((cell, c) => {
      const btn = el('button', 'bingo-cell');
      if (cell.isFree) btn.classList.add('is-free', 'is-marked');
      if (cell.marked) btn.classList.add('is-marked');
      btn.textContent = cell.text;
      btn.addEventListener('click', () => bingoCellClick(r, c, btn));
      bg.grid.appendChild(btn);
    });
  });
}

function bingoCellClick(r, c, btn) {
  if (!bingoCurrent) {
    setText(bg.feedback, 'Tire d\'abord une phrase.');
    return;
  }
  const cell = bingoGrid[r][c];
  if (cell.marked) return;
  if (cell.text === bingoCurrent.answer) {
    cell.marked = true;
    bingoMarked.add(`${r}-${c}`);
    btn.classList.add('is-marked');
    setText(bg.feedback, `✅ "${bingoCurrent.answer}" trouve !`);
    bingoCurrent = null;
    bingoCheckLines();
  } else {
    btn.classList.add('shake');
    setTimeout(() => btn.classList.remove('shake'), 400);
    setText(bg.feedback, `❌ Ce n'est pas "${cell.text}". Cherche encore.`);
  }
  bingoUpdateStats();
}

function bingoCheckLines() {
  let count = 0;
  // rows
  for (let r = 0; r < 5; r++) if (bingoGrid[r].every(x => x.marked)) count++;
  // cols
  for (let c = 0; c < 5; c++) if (bingoGrid.every(row => row[c].marked)) count++;
  // diagonals
  if ([0,1,2,3,4].every(i => bingoGrid[i][i].marked)) count++;
  if ([0,1,2,3,4].every(i => bingoGrid[i][4-i].marked)) count++;
  if (count > bingoLines) {
    const new_ones = count - bingoLines;
    bingoLines = count;
    bingoWins += new_ones;
    setText(bg.feedback, `🎉 BINGO ! +${new_ones} ligne${new_ones>1?'s':''} (total ${bingoLines})`);
    if (bingoWins > Number(localStorage.getItem(BINGO_BEST_KEY) || 0)) {
      localStorage.setItem(BINGO_BEST_KEY, String(bingoWins));
    }
  }
}

function bingoCall() {
  const sentences = bingoAllSentences();
  if (!sentences.length) { setText(bg.call, 'Aucune phrase disponible.'); return; }
  // pick a sentence whose answer is on the unmarked grid
  const onGrid = new Set();
  bingoGrid.forEach(row => row.forEach(c => { if (!c.marked && !c.isFree) onGrid.add(c.text); }));
  const valid = sentences.filter(s => onGrid.has(s.answer) && !bingoCalledHistory.includes(s.sentence));
  bingoCurrent = pick(shuffle(valid.length ? valid : sentences));
  bingoCalledHistory.push(bingoCurrent.sentence);
  setText(bg.call, `📢 ${bingoCurrent.sentence}`);
  setText(bg.feedback, 'Trouve la preposition manquante sur la grille.');
}

function bingoUpdateStats() {
  setText(bg.marked, `${bingoMarked.size}/25`);
  setText(bg.lines, String(bingoLines));
  setText(bg.wins, `${bingoWins} (record ${localStorage.getItem(BINGO_BEST_KEY) || 0})`);
}

// ============================================================
// JEU : PYRAMIDE DE MOTS
// ============================================================
const PYRAMIDE_BEST_KEY = 'french_class_pyramide_best';
const PYR_LEVELS = 6;
let pyrLevel = 1, pyrWords = [], pyrIdxInLevel = 0, pyrDir = 'en-fr';
let pyrLives = 3, pyrScore = 0, pyrLocked = false;

const py = {
  level:    document.getElementById('pyramideLevel'),
  restart:  document.getElementById('pyramideRestartBtn'),
  stack:    document.getElementById('pyramideStack'),
  dir:      document.getElementById('pyramideDir'),
  prompt:   document.getElementById('pyramidePrompt'),
  answers:  document.getElementById('pyramideAnswers'),
  feedback: document.getElementById('pyramideFeedback'),
  step:     document.getElementById('pyramideStep'),
  lives:    document.getElementById('pyramideLives'),
  score:    document.getElementById('pyramideScore'),
  best:     document.getElementById('pyramideBest')
};

function pyramideRestart() {
  pyrLevel = 1; pyrLives = 3; pyrScore = 0;
  pyrIdxInLevel = 0;
  pyrPickWordsForLevel();
  renderPyramideStack();
  pyramideAsk();
  pyramideUpdateStats();
}

function pyramidePool() {
  const all = buildPoolWords();
  // Filter out empty/garbage
  return all.filter(w => w.fr && w.en && w.fr.length >= 2 && w.fr.length <= 22);
}

function pyrPickWordsForLevel() {
  pyrDir = Math.random() < 0.5 ? 'en-fr' : 'fr-en';
  const pool = pyramidePool();
  pyrWords = shuffle(pool).slice(0, pyrLevel);
  pyrIdxInLevel = 0;
}

function renderPyramideStack() {
  if (!py.stack) return;
  clear(py.stack);
  for (let i = PYR_LEVELS; i >= 1; i--) {
    const row = el('div', `pyramide-row pyramide-row-${i}`);
    if (i < pyrLevel) row.classList.add('is-cleared');
    if (i === pyrLevel) row.classList.add('is-current');
    if (i > pyrLevel) row.classList.add('is-locked');
    for (let k = 0; k < i; k++) {
      const block = el('span', 'pyramide-block');
      if (i < pyrLevel) block.textContent = '✓';
      else if (i === pyrLevel) block.textContent = k < pyrIdxInLevel ? '✓' : (k === pyrIdxInLevel ? '?' : '·');
      else block.textContent = '·';
      row.appendChild(block);
    }
    py.stack.appendChild(row);
  }
  setText(py.level, `Niveau ${pyrLevel}/${PYR_LEVELS}`);
  setText(py.step, `${pyrIdxInLevel}/${pyrLevel}`);
}

function pyramideAsk() {
  pyrLocked = false;
  if (pyrIdxInLevel >= pyrLevel) {
    pyrScore += pyrLevel * 5;
    if (pyrLevel >= PYR_LEVELS) {
      pyrScore += 50;
      pyramideUpdateStats();
      setText(py.feedback, `🏆 PYRAMIDE COMPLETE ! +50 bonus. Score final : ${pyrScore}`);
      clear(py.answers);
      const restartBtn = el('button', 'btn btn-primary', '🔁 Recommencer');
      restartBtn.addEventListener('click', pyramideRestart);
      py.answers.appendChild(restartBtn);
      if (pyrScore > Number(localStorage.getItem(PYRAMIDE_BEST_KEY) || 0)) {
        localStorage.setItem(PYRAMIDE_BEST_KEY, String(pyrScore));
      }
      return;
    }
    pyrLevel += 1;
    pyrPickWordsForLevel();
    renderPyramideStack();
    setText(py.feedback, `🎉 Niveau ${pyrLevel - 1} reussi ! +${(pyrLevel-1)*5} pts`);
    setTimeout(pyramideAsk, 700);
    pyramideUpdateStats();
    return;
  }
  const w = pyrWords[pyrIdxInLevel];
  setText(py.dir, pyrDir === 'en-fr' ? 'EN → FR' : 'FR → EN');
  const promptText = pyrDir === 'en-fr' ? w.en : w.fr;
  const answerText = pyrDir === 'en-fr' ? w.fr : w.en;
  setText(py.prompt, promptText);
  // 3 distractors from pool
  const pool = pyramidePool().filter(x => x.fr !== w.fr);
  const distractors = shuffle(pool).slice(0, 3).map(x => pyrDir === 'en-fr' ? x.fr : x.en);
  const opts = shuffle([answerText, ...distractors]);
  clear(py.answers);
  opts.forEach(opt => {
    const btn = el('button', 'pyramide-answer', opt);
    btn.addEventListener('click', () => pyramideAnswer(btn, opt, answerText, w));
    py.answers.appendChild(btn);
  });
  renderPyramideStack();
  pyramideUpdateStats();
}

function pyramideAnswer(btn, opt, target, word) {
  if (pyrLocked) return;
  pyrLocked = true;
  [...py.answers.children].forEach(b => {
    b.disabled = true;
    if (b.textContent === target) b.classList.add('correct');
  });
  if (opt === target) {
    btn.classList.add('correct');
    markKnown(word);
    pyrIdxInLevel += 1;
    setText(py.feedback, `✅ "${word.fr}" = ${word.en}`);
    setTimeout(pyramideAsk, 600);
  } else {
    btn.classList.add('wrong');
    pyrLives -= 1;
    setText(py.feedback, `❌ ${word.fr} = ${word.en}. Plus que ${pyrLives} vie(s).`);
    if (pyrLives <= 0) {
      setTimeout(() => {
        setText(py.feedback, `💥 La pyramide s'ecroule au niveau ${pyrLevel}. Score : ${pyrScore}`);
        if (pyrScore > Number(localStorage.getItem(PYRAMIDE_BEST_KEY) || 0)) {
          localStorage.setItem(PYRAMIDE_BEST_KEY, String(pyrScore));
        }
        clear(py.answers);
        const restartBtn = el('button', 'btn btn-primary', '🔁 Recommencer');
        restartBtn.addEventListener('click', pyramideRestart);
        py.answers.appendChild(restartBtn);
        pyramideUpdateStats();
      }, 900);
    } else {
      setTimeout(pyramideAsk, 1200);
    }
  }
  pyramideUpdateStats();
}

function pyramideUpdateStats() {
  setText(py.lives, '♥'.repeat(Math.max(0, pyrLives)) + '♡'.repeat(Math.max(0, 3 - pyrLives)));
  setText(py.score, String(pyrScore));
  setText(py.best, String(Number(localStorage.getItem(PYRAMIDE_BEST_KEY) || 0)));
}

// ============================================================
// JEU : MUR DE MOTS (word search)
// ============================================================
const MURMOTS_BEST_KEY = 'french_class_murmots_best';
let murSize = 8, murGrid = [], murWords = [], murFound = [];
let murFirstCell = null, murStart = 0, murTimer = null;

const mu = {
  newBtn:   document.getElementById('murmotsNewBtn'),
  grid:     document.getElementById('murmotsGrid'),
  feedback: document.getElementById('murmotsFeedback'),
  found:    document.getElementById('murmotsFound'),
  time:     document.getElementById('murmotsTime'),
  best:     document.getElementById('murmotsBest'),
  list:     document.getElementById('murmotsList')
};

function murCleanWord(s) {
  return String(s || '')
    .toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z]/g, '');
}

function murmotsBuild() {
  if (!mu.grid) return;
  if (murTimer) { clearInterval(murTimer); murTimer = null; }
  murSize = (typeof DIFFICULTY !== 'undefined')
    ? (DIFFICULTY === 'hard' ? 12 : DIFFICULTY === 'medium' ? 10 : 8)
    : 8;
  const wordCount = (typeof DIFFICULTY !== 'undefined')
    ? (DIFFICULTY === 'hard' ? 10 : DIFFICULTY === 'medium' ? 7 : 5)
    : 5;
  const allowDiagonals = (typeof DIFFICULTY !== 'undefined') ? (DIFFICULTY !== 'easy') : false;
  const allowReverse   = (typeof DIFFICULTY !== 'undefined') ? (DIFFICULTY === 'hard') : false;

  // Pick words that fit in the grid
  const pool = (typeof buildPoolWords === 'function' ? buildPoolWords() : []).filter(w => {
    const c = murCleanWord(w.fr);
    return c.length >= 4 && c.length <= murSize;
  });
  if (!pool.length) {
    clear(mu.grid);
    setText(mu.feedback, 'Pas assez de mots disponibles.');
    return;
  }

  // Init empty grid
  murGrid = Array.from({length: murSize}, () => Array(murSize).fill(null));
  murFound = [];
  murWords = [];

  const directions = [[0,1],[1,0]]; // horizontal, vertical
  if (allowDiagonals) directions.push([1,1], [1,-1]);

  const tries = pool.slice(); shuffle(tries);
  for (const word of tries) {
    if (murWords.length >= wordCount) break;
    if (placeWord(word, directions, allowReverse)) murWords.push(word);
  }
  // Fill empty with random letters
  const letters = 'abcdefghijklmnopqrstuvwxyz';
  for (let r = 0; r < murSize; r++) for (let c = 0; c < murSize; c++) {
    if (murGrid[r][c] === null) murGrid[r][c] = letters[Math.floor(Math.random() * letters.length)];
  }
  renderMurGrid();
  renderMurWordList();
  murStart = Date.now();
  murTimer = setInterval(murUpdateStats, 1000);
  setText(mu.feedback, `Trouve les ${murWords.length} mots !`);
  murFirstCell = null;
  murUpdateStats();
}

function placeWord(word, directions, allowReverse) {
  const cleaned = murCleanWord(word.fr);
  if (cleaned.length > murSize) return false;
  const dirs = allowReverse
    ? directions.flatMap(([dr,dc]) => [[dr,dc],[-dr,-dc]])
    : directions;
  for (let attempt = 0; attempt < 60; attempt++) {
    const [dr, dc] = pick(dirs);
    const r0 = Math.floor(Math.random() * murSize);
    const c0 = Math.floor(Math.random() * murSize);
    const rEnd = r0 + dr * (cleaned.length - 1);
    const cEnd = c0 + dc * (cleaned.length - 1);
    if (rEnd < 0 || rEnd >= murSize || cEnd < 0 || cEnd >= murSize) continue;
    let ok = true;
    for (let i = 0; i < cleaned.length; i++) {
      const r = r0 + dr * i, c = c0 + dc * i;
      const cur = murGrid[r][c];
      if (cur !== null && cur !== cleaned[i]) { ok = false; break; }
    }
    if (!ok) continue;
    for (let i = 0; i < cleaned.length; i++) {
      const r = r0 + dr * i, c = c0 + dc * i;
      murGrid[r][c] = cleaned[i];
    }
    word.__placement = { r0, c0, dr, dc, len: cleaned.length, cleaned };
    return true;
  }
  return false;
}

function renderMurGrid() {
  clear(mu.grid);
  mu.grid.style.gridTemplateColumns = `repeat(${murSize}, 1fr)`;
  for (let r = 0; r < murSize; r++) {
    for (let c = 0; c < murSize; c++) {
      const cell = el('button', 'mur-cell');
      cell.dataset.r = String(r); cell.dataset.c = String(c);
      cell.textContent = murGrid[r][c];
      cell.addEventListener('click', () => murCellClick(r, c, cell));
      mu.grid.appendChild(cell);
    }
  }
}

function renderMurWordList() {
  if (!mu.list) return;
  clear(mu.list);
  murWords.forEach(w => {
    const li = el('li', 'mur-list-item');
    li.dataset.word = w.fr;
    li.textContent = `${w.fr} (${w.en})`;
    if (murFound.includes(w.fr)) li.classList.add('is-found');
    mu.list.appendChild(li);
  });
}

function murCellClick(r, c, cell) {
  if (!murFirstCell) {
    murFirstCell = { r, c, cell };
    cell.classList.add('is-start');
    return;
  }
  // Try to validate first → second
  const r0 = murFirstCell.r, c0 = murFirstCell.c;
  const dr = Math.sign(r - r0), dc = Math.sign(c - c0);
  const len = Math.max(Math.abs(r - r0), Math.abs(c - c0)) + 1;

  // Make sure it's a straight line
  const okStraight = (dr === 0 || dc === 0 || Math.abs(r - r0) === Math.abs(c - c0));
  if (!okStraight) {
    setText(mu.feedback, 'La selection doit etre droite (ligne, colonne ou diagonale).');
    murFirstCell.cell.classList.remove('is-start');
    murFirstCell = null;
    return;
  }
  let chosen = '';
  for (let i = 0; i < len; i++) chosen += murGrid[r0 + dr*i]?.[c0 + dc*i] ?? '';

  const matched = murWords.find(w => {
    const target = murCleanWord(w.fr);
    return !murFound.includes(w.fr) && (target === chosen || target === chosen.split('').reverse().join(''));
  });

  if (matched) {
    murFound.push(matched.fr);
    // Highlight the cells
    for (let i = 0; i < len; i++) {
      const rc = mu.grid.children[(r0 + dr*i) * murSize + (c0 + dc*i)];
      rc.classList.add('is-found');
    }
    setText(mu.feedback, `✅ "${matched.fr}" trouve ! (${matched.en})`);
    if (typeof markKnown === 'function') markKnown(matched);
    if (murFound.length === murWords.length) murWin();
  } else {
    setText(mu.feedback, `❌ "${chosen}" n'est pas un mot recherche.`);
  }
  murFirstCell.cell.classList.remove('is-start');
  murFirstCell = null;
  renderMurWordList();
  murUpdateStats();
}

function murWin() {
  if (murTimer) { clearInterval(murTimer); murTimer = null; }
  const elapsed = Math.floor((Date.now() - murStart) / 1000);
  const best = Number(localStorage.getItem(MURMOTS_BEST_KEY) || 0);
  if (!best || elapsed < best) localStorage.setItem(MURMOTS_BEST_KEY, String(elapsed));
  setText(mu.feedback, `🏆 Tous les mots trouves en ${elapsed}s !`);
  if (window.Achievements && typeof window.Achievements.bump === 'function') {
    window.Achievements.bump('french_class_murmots_wins', 1);
  }
  if (window.FrenchSounds) window.FrenchSounds.play('level');
}

function murUpdateStats() {
  setText(mu.found, `${murFound.length}/${murWords.length}`);
  const elapsed = murStart ? Math.floor((Date.now() - murStart) / 1000) : 0;
  setText(mu.time, `${elapsed}s`);
  const best = localStorage.getItem(MURMOTS_BEST_KEY);
  setText(mu.best, best ? `${best}s` : '—');
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
  initDifficulty();

  // New games
  renderAnagram();
  renderMemory();
  renderPendu();
  renderDictee();
  renderVraiFaux();
  renderTri();

  // Wire events for new games
  aRefs.newBtn?.addEventListener('click', renderAnagram);
  aRefs.clearBtn?.addEventListener('click', clearAnagram);
  aRefs.hintBtn?.addEventListener('click', hintAnagram);
  aRefs.checkBtn?.addEventListener('click', checkAnagram);

  mRefs.newBtn?.addEventListener('click', () => renderMemory(true));

  pRefs.newBtn?.addEventListener('click', renderPendu);

  dRefs.newBtn?.addEventListener('click', renderDictee);
  dRefs.dir?.addEventListener('change', renderDictee);
  dRefs.form?.addEventListener('submit', checkDictee);

  vfRefs.newBtn?.addEventListener('click', renderVraiFaux);
  vfRefs.trueBtn?.addEventListener('click', () => answerVf(true));
  vfRefs.falseBtn?.addEventListener('click', () => answerVf(false));
  document.addEventListener('keydown', e => {
    const panel = document.querySelector('.game-tab-panel.is-active');
    if (!panel || panel.id !== 'tab-vraifaux') return;
    if (document.activeElement?.tagName === 'INPUT') return;
    const k = e.key.toLowerCase();
    if (k === 'v') answerVf(true);
    if (k === 'f') answerVf(false);
  });

  tRefs.newBtn?.addEventListener('click', renderTri);

  // Phrase XL / Chaine / Gemmes
  initPxlTheme();
  initChaineTheme();
  initGems();
  renderPhraseXL();
  renderChaine();

  pxl.newBtn?.addEventListener('click', renderPhraseXL);
  ch.newBtn?.addEventListener('click', renderChaine);

  // Bingo / Pyramide / Mur de mots
  bingoBuild();
  pyramideRestart();
  murmotsBuild();

  bg.newBtn?.addEventListener('click', bingoBuild);
  bg.callBtn?.addEventListener('click', bingoCall);
  py.restart?.addEventListener('click', pyramideRestart);
  mu.newBtn?.addEventListener('click', murmotsBuild);
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
