// Defi du jour : selectionne un mini-defi different chaque jour
// (rotation deterministe basee sur la date) et permet de le marquer comme fait.

(function () {
  'use strict';

  const COUNT_KEY = 'french_class_defi_count';
  const DONE_KEY  = 'french_class_defi_done_'; // + YYYYMMDD

  const DEFIS = [
    { icon: '⚡', titre: 'Sprint 10 mots', desc: 'Reussis 10 mots en mode Sprint, sans te tromper.', href: './vocab-games.html#sprint' },
    { icon: '🧩', titre: 'Phrase XL parfaite', desc: 'Termine une phrase XL sans aucune erreur.', href: './vocab-games.html#phrasexl' },
    { icon: '🎡', titre: 'Roue des verbes (5)', desc: 'Conjugue 5 verbes correctement a la roue.', href: './verbes.html#wheel' },
    { icon: '🃏', titre: 'Memory : une partie', desc: 'Termine une grille de Memory.', href: './vocab-games.html#memory' },
    { icon: '🪢', titre: 'Pendu : sauve un mot', desc: 'Gagne au moins une partie de Pendu.', href: './vocab-games.html#pendu' },
    { icon: '🎯', titre: 'Prepositions express', desc: 'Trouve 8 prepositions correctes a la suite.', href: './vocab-games.html#preposition' },
    { icon: '⌨️', titre: 'Tape la conjugaison', desc: 'Tape correctement 10 conjugaisons.', href: './verbes.html#typing' },
    { icon: '🔺', titre: 'Pyramide niveau 2', desc: 'Atteins au moins 30 points en Pyramide.', href: './vocab-games.html#pyramide' },
    { icon: '🎱', titre: 'Bingo de prepositions', desc: 'Gagne une grille de Bingo.', href: './vocab-games.html#bingo' },
    { icon: '🔍', titre: 'Mur de mots', desc: 'Trouve tous les mots du Mur (mode Facile).', href: './vocab-games.html#murmots' },
    { icon: '💎', titre: 'Collection de gemmes', desc: 'Debloque 3 nouvelles gemmes dans un theme.', href: './vocab-games.html#gemmes' },
    { icon: '🔗', titre: 'Construis une chaine', desc: 'Termine une chaine de phrase complete.', href: './vocab-games.html#chaine' },
    { icon: '🎤', titre: 'Discute avec Koka', desc: 'Echange au moins 5 messages avec Koka.', href: './koka.html' },
    { icon: '📚', titre: '5 nouveaux mots', desc: 'Marque 5 nouveaux mots comme connus.', href: './vocabulaire.html' }
  ];

  function todayKey() {
    const d = new Date();
    return `${d.getFullYear()}${String(d.getMonth()+1).padStart(2,'0')}${String(d.getDate()).padStart(2,'0')}`;
  }
  function todaySeed() {
    const d = new Date();
    // Jours depuis epoch -> rotation deterministe.
    return Math.floor(d.getTime() / 86400000);
  }
  function defiOfDay() { return DEFIS[todaySeed() % DEFIS.length]; }
  function isDoneToday() { return localStorage.getItem(DONE_KEY + todayKey()) === '1'; }
  function markDone() {
    if (isDoneToday()) return false;
    localStorage.setItem(DONE_KEY + todayKey(), '1');
    const n = Number(localStorage.getItem(COUNT_KEY) || 0) + 1;
    localStorage.setItem(COUNT_KEY, String(n));
    if (window.Achievements) window.Achievements.check();
    if (window.FrenchSounds) window.FrenchSounds.play('level');
    return true;
  }

  function makeEl(tag, cls, text) {
    const e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text != null) e.textContent = text;
    return e;
  }

  function render(host) {
    if (!host) return;
    host.textContent = '';
    const def = defiOfDay();
    const done = isDoneToday();

    const eyebrow = makeEl('div', 'defi-eyebrow', 'Defi du jour');
    const card = makeEl('div', 'defi-card' + (done ? ' is-done' : ''));

    const icon = makeEl('div', 'defi-icon', def.icon);
    card.appendChild(icon);

    const body = makeEl('div', 'defi-body');
    body.appendChild(makeEl('div', 'defi-title', def.titre));
    body.appendChild(makeEl('div', 'defi-desc', def.desc));

    const meta = makeEl('div', 'defi-meta');
    const count = Number(localStorage.getItem(COUNT_KEY) || 0);
    meta.appendChild(makeEl('span', 'defi-streak', `🔥 ${count} defis faits`));
    body.appendChild(meta);

    card.appendChild(body);

    const actions = makeEl('div', 'defi-actions');
    const playLink = makeEl('a', 'btn small');
    playLink.textContent = done ? 'Revoir' : 'Jouer';
    playLink.href = def.href;
    actions.appendChild(playLink);

    const doneBtn = makeEl('button', 'btn btn-secondary small');
    doneBtn.textContent = done ? '✓ Fait aujourd\'hui' : 'Marquer comme fait';
    doneBtn.disabled = done;
    doneBtn.addEventListener('click', () => {
      if (markDone()) render(host);
    });
    actions.appendChild(doneBtn);
    card.appendChild(actions);

    host.appendChild(eyebrow);
    host.appendChild(card);
  }

  function init() {
    const host = document.getElementById('defiJour');
    if (host) render(host);
  }

  window.DefiDuJour = { render, init, markDone, defiOfDay, isDoneToday };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
