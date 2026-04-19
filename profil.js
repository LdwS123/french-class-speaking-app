// Page profil : aggrege toutes les stats stockees dans localStorage et
// affiche le tableau de bord, les records et la grille de badges.

(function () {
  'use strict';

  const RANKS = [
    { min: 0,    title: 'Apprenti',     icon: '🌱' },
    { min: 50,   title: 'Curieux',      icon: '🌿' },
    { min: 150,  title: 'Pratiquant',   icon: '🌳' },
    { min: 350,  title: 'Confirme',     icon: '🎓' },
    { min: 700,  title: 'Avance',       icon: '🏆' },
    { min: 1200, title: 'Expert',       icon: '👑' },
    { min: 2000, title: 'Maitre',       icon: '🌟' }
  ];

  const RECORDS = [
    { key: 'french_class_sprint_best',         icon: '⚡',  label: 'Sprint',          unit: 'mots' },
    { key: 'french_class_pxl_best',            icon: '🧩',  label: 'Phrase XL',       unit: 'serie parfaite' },
    { key: 'french_class_chaine_best',         icon: '🔗',  label: 'Chaine',          unit: 'points' },
    { key: 'french_class_anagram_best',        icon: '🔤',  label: 'Anagrammes',      unit: 'serie' },
    { key: 'french_class_dictee_best',         icon: '✍️',  label: 'Dictee',          unit: 'serie' },
    { key: 'french_class_vf_best',             icon: '✓',   label: 'Vrai/Faux',       unit: 'serie' },
    { key: 'french_class_verbs_wheel_best',    icon: '🎡',  label: 'Roue verbes',     unit: 'verbes' },
    { key: 'french_class_verbs_blitz_best',    icon: '⏱️',  label: 'Blitz',           unit: 'reponses' },
    { key: 'french_class_verbs_type_best',     icon: '⌨️',  label: 'Tape conjug.',    unit: 'conjugaisons' },
    { key: 'french_class_pyramide_best',       icon: '🔺',  label: 'Pyramide',        unit: 'meilleur score' },
    { key: 'french_class_bingo_best',          icon: '🎱',  label: 'Bingo',           unit: 'parties gagnees' },
    { key: 'french_class_memory_wins',         icon: '🃏',  label: 'Memory',          unit: 'parties gagnees' },
    { key: 'french_class_pendu_wins',          icon: '🪢',  label: 'Pendu',           unit: 'parties gagnees' },
    { key: 'french_class_murmots_wins',        icon: '🔍',  label: 'Mur de mots',     unit: 'grilles finies' },
    { key: 'french_class_defi_count',          icon: '📅',  label: 'Defi du jour',    unit: 'defis faits' }
  ];

  function readNum(key) { return Number(localStorage.getItem(key) || 0); }
  function setText(id, txt) { const el = document.getElementById(id); if (el) el.textContent = txt; }

  function readKnown() {
    try { const arr = JSON.parse(localStorage.getItem('french_class_known_words') || '[]'); return Array.isArray(arr) ? arr.length : 0; }
    catch (_) { return 0; }
  }
  function readGems() {
    try {
      const obj = JSON.parse(localStorage.getItem('french_class_gems_unlocked_v1') || '{}');
      return Object.values(obj || {}).reduce((s, a) => s + (Array.isArray(a) ? a.length : 0), 0);
    } catch (_) { return 0; }
  }

  // XP global = somme ponderee des stats (a peu pres correle a l'effort).
  function computeXp() {
    let xp = 0;
    xp += readKnown() * 2;
    xp += readGems() * 4;
    xp += readNum('french_class_sprint_best') * 3;
    xp += readNum('french_class_pxl_best') * 6;
    xp += readNum('french_class_chaine_best') * 1;
    xp += readNum('french_class_verbs_wheel_best') * 3;
    xp += readNum('french_class_verbs_blitz_best') * 2;
    xp += readNum('french_class_verbs_type_best') * 3;
    xp += readNum('french_class_pyramide_best');
    xp += readNum('french_class_bingo_best') * 15;
    xp += readNum('french_class_memory_wins') * 10;
    xp += readNum('french_class_pendu_wins') * 8;
    xp += readNum('french_class_murmots_wins') * 18;
    xp += readNum('french_class_defi_count') * 20;
    if (window.Achievements) {
      const list = window.Achievements.list();
      xp += list.filter(b => b.unlocked).length * 25;
    }
    return xp;
  }

  function rankFor(xp) {
    let cur = RANKS[0], next = null;
    for (let i = 0; i < RANKS.length; i++) {
      if (xp >= RANKS[i].min) cur = RANKS[i];
      if (RANKS[i].min > xp) { next = RANKS[i]; break; }
    }
    return { cur, next };
  }

  function makeEl(tag, cls, text) {
    const e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text != null) e.textContent = text;
    return e;
  }

  function renderHero(xp) {
    const { cur, next } = rankFor(xp);
    setText('rankIcon', cur.icon);
    setText('rankTitle', cur.title);
    setText('rankXp', xp);
    const fill = document.getElementById('rankBarFill');
    const foot = document.getElementById('rankFoot');
    if (next) {
      const span = next.min - cur.min;
      const pct  = Math.max(0, Math.min(100, Math.round(((xp - cur.min) / span) * 100)));
      if (fill) fill.style.width = pct + '%';
      if (foot) foot.textContent = `Encore ${next.min - xp} XP avant "${next.title}".`;
    } else {
      if (fill) fill.style.width = '100%';
      if (foot) foot.textContent = 'Niveau maximum atteint, bravo !';
    }
  }

  function renderStats() {
    setText('statKnown',  readKnown());
    setText('statGems',   readGems());
    setText('statDefis',  readNum('french_class_defi_count'));
    if (window.Achievements) {
      const list = window.Achievements.list();
      setText('statBadges', list.filter(b => b.unlocked).length);
    }
  }

  function renderRecords() {
    const host = document.getElementById('recordsGrid');
    if (!host) return;
    host.textContent = '';
    RECORDS.forEach(r => {
      const v = readNum(r.key);
      const card = makeEl('article', 'profile-record-card');
      card.appendChild(makeEl('div', 'profile-record-icon', r.icon));
      const meta = makeEl('div', 'profile-record-meta');
      meta.appendChild(makeEl('div', 'profile-record-label', r.label));
      meta.appendChild(makeEl('div', 'profile-record-value', String(v)));
      meta.appendChild(makeEl('div', 'profile-record-unit', r.unit));
      card.appendChild(meta);
      if (v <= 0) card.classList.add('is-empty');
      host.appendChild(card);
    });
  }

  function renderBadges() {
    if (!window.Achievements) return;
    const list = window.Achievements.list();
    const host = document.getElementById('badgesGrid');
    if (!host) return;
    host.textContent = '';
    list.forEach(b => {
      const card = makeEl('article', 'profile-badge-card' + (b.unlocked ? ' is-unlocked' : ' is-locked'));
      card.appendChild(makeEl('div', 'profile-badge-icon', b.unlocked ? b.icon : '🔒'));
      const meta = makeEl('div', 'profile-badge-meta');
      meta.appendChild(makeEl('div', 'profile-badge-title', b.title));
      meta.appendChild(makeEl('div', 'profile-badge-hint', b.hint));
      if (b.unlocked && b.unlockedAt) {
        const d = new Date(b.unlockedAt);
        const dd = String(d.getDate()).padStart(2, '0');
        const mm = String(d.getMonth() + 1).padStart(2, '0');
        meta.appendChild(makeEl('div', 'profile-badge-date', `Debloque le ${dd}/${mm}`));
      }
      card.appendChild(meta);
      host.appendChild(card);
    });
    const unlocked = list.filter(b => b.unlocked).length;
    setText('badgesProgress', `${unlocked} / ${list.length}`);
  }

  function refresh() {
    if (window.Achievements) window.Achievements.check();
    const xp = computeXp();
    renderHero(xp);
    renderStats();
    renderRecords();
    renderBadges();
  }

  function bindReset() {
    const btn = document.getElementById('profileReset');
    if (!btn) return;
    btn.addEventListener('click', () => {
      const ok = confirm('Tout effacer ? (mots connus, scores, badges, gemmes...) Cette action est definitive.');
      if (!ok) return;
      const keys = [];
      for (let i = 0; i < localStorage.length; i++) {
        const k = localStorage.key(i);
        if (k && (k.startsWith('french_class_') || k.startsWith('fco-'))) keys.push(k);
      }
      keys.forEach(k => localStorage.removeItem(k));
      refresh();
      alert('Tout est efface. Bonne reprise !');
    });
  }

  function init() {
    bindReset();
    refresh();
    // Re-render quand un autre onglet modifie le storage.
    window.addEventListener('storage', refresh);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
