// Systeme de succes (badges) pour Francais Oral.
// - Definitions de badges avec critere base sur localStorage.
// - API : Achievements.unlock(id), Achievements.check(), Achievements.list().
// - Toast notification visuelle quand un badge se debloque.

(function () {
  'use strict';

  const STORAGE_KEY = 'french_class_achievements_v1';

  // Cles des stats existantes (definies dans vocab-games.js / verbes.js / autres).
  const K = {
    KNOWN: 'french_class_known_words',
    SPRINT: 'french_class_sprint_best',
    PXL: 'french_class_pxl_best',
    WHEEL: 'french_class_verbs_wheel_best',
    BLITZ: 'french_class_verbs_blitz_best',
    TYPE: 'french_class_verbs_type_best',
    PYR: 'french_class_pyramide_best',
    MEM_WINS: 'french_class_memory_wins',
    PENDU_WINS: 'french_class_pendu_wins',
    BINGO_WINS: 'french_class_bingo_best', // cumulatif (nombre de bingos)
    MUR_WINS: 'french_class_murmots_wins',
    GEMS: 'french_class_gems_unlocked_v1',
    DEFI_COUNT: 'french_class_defi_count'
  };

  function readNum(key) { return Number(localStorage.getItem(key) || 0); }

  function readKnownCount() {
    try {
      const arr = JSON.parse(localStorage.getItem(K.KNOWN) || '[]');
      return Array.isArray(arr) ? arr.length : 0;
    } catch (_) { return 0; }
  }

  function readGemsCount() {
    try {
      const obj = JSON.parse(localStorage.getItem(K.GEMS) || '{}');
      return Object.values(obj || {}).reduce((s, a) => s + (Array.isArray(a) ? a.length : 0), 0);
    } catch (_) { return 0; }
  }

  // Definitions des badges.
  const DEFS = [
    { id: 'vocab10',  icon: '🌱', title: 'Premier pas',         hint: 'Marquer 10 mots comme connus',
      check: () => readKnownCount() >= 10 },
    { id: 'vocab50',  icon: '🌿', title: 'Vocab grandissant',   hint: 'Marquer 50 mots comme connus',
      check: () => readKnownCount() >= 50 },
    { id: 'vocab100', icon: '🌳', title: 'Centenaire',          hint: 'Marquer 100 mots comme connus',
      check: () => readKnownCount() >= 100 },
    { id: 'vocab250', icon: '🏛️', title: 'Erudit',              hint: 'Marquer 250 mots comme connus',
      check: () => readKnownCount() >= 250 },

    { id: 'sprint10', icon: '⚡', title: 'Sprint 10',           hint: 'Reussir 10 mots en mode Sprint',
      check: () => readNum(K.SPRINT) >= 10 },
    { id: 'sprint20', icon: '🏃', title: 'Sprint 20',           hint: 'Reussir 20 mots en mode Sprint',
      check: () => readNum(K.SPRINT) >= 20 },
    { id: 'sprint35', icon: '🚀', title: 'Sprint legendaire',   hint: 'Reussir 35 mots en mode Sprint',
      check: () => readNum(K.SPRINT) >= 35 },

    { id: 'pxl5',     icon: '🧩', title: 'Constructeur',        hint: '5 phrases parfaites en Phrase XL',
      check: () => readNum(K.PXL) >= 5 },
    { id: 'pxl10',    icon: '🎯', title: 'Maitre des prepositions', hint: '10 phrases parfaites en Phrase XL',
      check: () => readNum(K.PXL) >= 10 },

    { id: 'wheel10',  icon: '🎡', title: 'Roue qui tourne',     hint: '10 verbes corrects (Roue des verbes)',
      check: () => readNum(K.WHEEL) >= 10 },
    { id: 'blitz15',  icon: '⏱️', title: 'Blitz solide',        hint: '15 conjugaisons en Blitz',
      check: () => readNum(K.BLITZ) >= 15 },
    { id: 'type20',   icon: '⌨️', title: 'Tape vite',           hint: '20 conjugaisons tapees correctement',
      check: () => readNum(K.TYPE) >= 20 },

    { id: 'pyr50',    icon: '🔺', title: 'Pyramide solide',     hint: '50 points en Pyramide',
      check: () => readNum(K.PYR) >= 50 },
    { id: 'pyr150',   icon: '🏔️', title: 'Sommet pyramidal',   hint: '150 points en Pyramide',
      check: () => readNum(K.PYR) >= 150 },

    { id: 'memWin',   icon: '🃏', title: 'Memoire ok',          hint: 'Gagner une partie de Memory',
      check: () => readNum(K.MEM_WINS) >= 1 },
    { id: 'memPro',   icon: '🧠', title: 'Memoire de fer',      hint: 'Gagner 10 parties de Memory',
      check: () => readNum(K.MEM_WINS) >= 10 },
    { id: 'penduWin', icon: '🪢', title: 'Sauve la peau',       hint: 'Gagner une partie de Pendu',
      check: () => readNum(K.PENDU_WINS) >= 1 },
    { id: 'pendu5',   icon: '🎩', title: 'Pendu virtuose',      hint: 'Gagner 5 parties de Pendu',
      check: () => readNum(K.PENDU_WINS) >= 5 },

    { id: 'bingoWin', icon: '🎱', title: 'Bingo !',             hint: 'Gagner une grille de Bingo',
      check: () => readNum(K.BINGO_WINS) >= 1 },
    { id: 'bingo3',   icon: '🎰', title: 'Bingo addict',        hint: 'Gagner 3 grilles de Bingo',
      check: () => readNum(K.BINGO_WINS) >= 3 },
    { id: 'murWin',   icon: '🔍', title: 'Detective de mots',   hint: 'Trouver tous les mots du Mur',
      check: () => readNum(K.MUR_WINS) >= 1 },

    { id: 'gem1',     icon: '💎', title: 'Premiere gemme',     hint: 'Debloquer 1 gemme',
      check: () => readGemsCount() >= 1 },
    { id: 'gem25',    icon: '✨', title: 'Collection brillante', hint: 'Debloquer 25 gemmes',
      check: () => readGemsCount() >= 25 },
    { id: 'gem75',    icon: '🌟', title: 'Tresor lexical',      hint: 'Debloquer 75 gemmes',
      check: () => readGemsCount() >= 75 },

    { id: 'defi3',    icon: '📅', title: 'Routine',             hint: 'Faire 3 defis du jour',
      check: () => readNum(K.DEFI_COUNT) >= 3 },
    { id: 'defi7',    icon: '🔥', title: 'Une semaine !',       hint: 'Faire 7 defis du jour',
      check: () => readNum(K.DEFI_COUNT) >= 7 },

    { id: 'half',     icon: '🥈', title: 'Mi-chemin',           hint: 'Debloquer la moitie des badges',
      check: () => unlockedCount() >= Math.ceil(DEFS.length / 2) - 1 },
    { id: 'allbadges',icon: '🏆', title: 'Le grand chelem',     hint: 'Debloquer tous les autres badges',
      check: () => unlockedCount() >= DEFS.length - 1 }
  ];

  function loadUnlocked() {
    try {
      const obj = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
      return (obj && typeof obj === 'object') ? obj : {};
    } catch (_) { return {}; }
  }
  function saveUnlocked(state) {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch (_) {}
  }
  function unlockedCount() {
    return Object.keys(loadUnlocked()).length;
  }

  function ensureToastHost() {
    let host = document.getElementById('achv-toast-host');
    if (host) return host;
    host = document.createElement('div');
    host.id = 'achv-toast-host';
    host.className = 'achv-toast-host';
    document.body.appendChild(host);
    return host;
  }

  function makeDiv(cls, text) {
    const d = document.createElement('div');
    if (cls) d.className = cls;
    if (text != null) d.textContent = text;
    return d;
  }

  function showToast(def) {
    const host = ensureToastHost();
    const wrap = makeDiv('achv-toast');
    wrap.appendChild(makeDiv('achv-toast-icon', def.icon));
    const body = makeDiv('achv-toast-body');
    body.appendChild(makeDiv('achv-toast-eyebrow', 'Badge debloque !'));
    body.appendChild(makeDiv('achv-toast-title', def.title));
    body.appendChild(makeDiv('achv-toast-hint', def.hint));
    wrap.appendChild(body);
    host.appendChild(wrap);
    requestAnimationFrame(() => wrap.classList.add('show'));
    setTimeout(() => {
      wrap.classList.remove('show');
      setTimeout(() => wrap.remove(), 400);
    }, 4200);
    if (window.FrenchSounds && typeof window.FrenchSounds.play === 'function') {
      window.FrenchSounds.play('badge');
    }
  }

  function check() {
    const state = loadUnlocked();
    const newly = [];
    for (const def of DEFS) {
      if (state[def.id]) continue;
      let ok = false;
      try { ok = !!def.check(); } catch (_) { ok = false; }
      if (ok) {
        state[def.id] = { at: Date.now() };
        newly.push(def);
      }
    }
    if (newly.length) {
      saveUnlocked(state);
      newly.forEach((def, i) => setTimeout(() => showToast(def), i * 700));
    }
    return newly;
  }

  function list() {
    const state = loadUnlocked();
    return DEFS.map(d => ({ ...d, unlocked: !!state[d.id], unlockedAt: state[d.id]?.at || null }));
  }

  function unlock(id) {
    const def = DEFS.find(d => d.id === id);
    if (!def) return false;
    const state = loadUnlocked();
    if (state[id]) return false;
    state[id] = { at: Date.now() };
    saveUnlocked(state);
    showToast(def);
    return true;
  }

  function init() {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => setTimeout(check, 200));
    } else {
      setTimeout(check, 200);
    }
  }

  // Helpers exposes pour les jeux : incrementer un compteur cumulatif simple.
  function bump(key, by) {
    const v = readNum(key) + (by || 1);
    localStorage.setItem(key, String(v));
    setTimeout(check, 50);
    return v;
  }

  window.Achievements = { check, list, unlock, bump, DEFS, STORAGE_KEY, KEYS: K };
  init();
})();
