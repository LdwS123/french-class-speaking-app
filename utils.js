/**
 * FrUtils — shared DOM + logic utilities
 * Used by: app.js, vocab-games.js, vocab-explorer.js, expressions.js
 */
window.FrUtils = (() => {

  // ─── Array helpers ────────────────────────────────────────
  function shuffle(arr) {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  function pick(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  // ─── Storage helpers ──────────────────────────────────────
  function storeGet(key, fallback) {
    try { return JSON.parse(localStorage.getItem(key) ?? JSON.stringify(fallback)); }
    catch { return fallback; }
  }

  function storeSet(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  }

  // ─── DOM helpers ──────────────────────────────────────────

  /** Clear all children from an element */
  function clear(el) {
    while (el.firstChild) el.removeChild(el.firstChild);
  }

  /**
   * Create a DOM element.
   * el('div', 'my-class', child1, 'text', child2)
   */
  function el(tag, className, ...children) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    for (const child of children.flat(2)) {
      if (child === null || child === undefined) continue;
      if (typeof child === 'string' || typeof child === 'number') {
        node.appendChild(document.createTextNode(String(child)));
      } else if (child instanceof Node) {
        node.appendChild(child);
      }
    }
    return node;
  }

  /** Set text content (safe, no HTML) */
  function setText(node, text) {
    node.textContent = String(text);
  }

  /** Append multiple children to a node */
  function appendAll(parent, ...children) {
    for (const child of children.flat(2)) {
      if (!child) continue;
      parent.appendChild(child);
    }
    return parent;
  }

  // ─── Component helpers ────────────────────────────────────

  /**
   * Create a vocabulary chip from "fr|en" string or separate fr/en
   */
  function vocabChip(raw, withEn = true) {
    const parts = String(raw).split('|');
    const fr = parts[0]?.trim() ?? '';
    const en = parts[1]?.trim() ?? '';
    const span = el('span', 'chip');
    span.appendChild(el('span', 'chip-fr', fr));
    if (en && withEn) span.appendChild(el('span', 'chip-en', en));
    return span;
  }

  /** Create a simple text chip */
  function textChip(text, extraClass) {
    return el('span', extraClass ? `chip ${extraClass}` : 'chip', String(text));
  }

  /** Create a coach step: bold index + text */
  function coachStep(index, text) {
    const div = el('div', 'coach-step');
    div.appendChild(el('strong', '', `${index}.`));
    div.appendChild(document.createTextNode(' ' + text));
    return div;
  }

  /** Create a pill badge */
  function pill(text) {
    return el('span', 'pill', String(text));
  }

  // ─── Render helpers ───────────────────────────────────────

  /** Render vocab chips (fr|en) into target, clearing first */
  function renderVocab(target, items, withEn = true) {
    clear(target);
    items.forEach(item => target.appendChild(vocabChip(item, withEn)));
  }

  /** Render simple text chips into target, clearing first */
  function renderChips(target, items) {
    clear(target);
    items.forEach(item => target.appendChild(textChip(item)));
  }

  /** Render coach steps into target, clearing first */
  function renderCoach(target, items) {
    clear(target);
    items.forEach((item, i) => target.appendChild(coachStep(i + 1, item)));
  }

  /** Render a recent-item list */
  function renderRecent(target, items) {
    clear(target);
    if (!items.length) {
      target.appendChild(el('span', 'recent-item', 'Aucun sujet vu'));
      return;
    }
    items.forEach(item => target.appendChild(el('span', 'recent-item', item)));
  }

  /**
   * Build answer buttons into a container.
   * options: [{text, isCorrect, key?}]
   * onAnswer: (btn, isCorrect) => void
   */
  function renderAnswerBtns(container, options, onAnswer, extraClass = '') {
    clear(container);
    options.forEach(opt => {
      const btn = el('button', `answer-btn answer-btn-large${extraClass ? ' ' + extraClass : ''}`, opt.text);
      btn.type = 'button';
      btn.dataset.correct = String(opt.isCorrect);
      btn.addEventListener('click', () => onAnswer(btn, opt.isCorrect));
      container.appendChild(btn);
    });
  }

  /** Lock or unlock all answer buttons in a container */
  function lockBtns(container) {
    container.querySelectorAll('.answer-btn').forEach(b => { b.disabled = true; });
  }

  /** Highlight the correct answer button in a container */
  function showCorrect(container) {
    container.querySelectorAll('.answer-btn').forEach(b => {
      if (b.dataset.correct === 'true') b.classList.add('correct');
    });
  }

  return {
    shuffle, pick,
    storeGet, storeSet,
    clear, el, setText, appendAll,
    vocabChip, textChip, coachStep, pill,
    renderVocab, renderChips, renderCoach, renderRecent,
    renderAnswerBtns, lockBtns, showCorrect
  };
})();
