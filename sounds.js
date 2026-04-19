// Petits effets sonores generes par WebAudio (pas de fichier audio).
// API : FrenchSounds.play('correct'|'wrong'|'badge'|'tick'|'level').
// Toggle via FrenchSounds.toggle() ou bouton avec data-sound-toggle.

(function () {
  'use strict';

  const KEY = 'fco-sound-on';
  let enabled = (localStorage.getItem(KEY) || '1') === '1';
  let ctx = null;

  function ensureCtx() {
    if (ctx) return ctx;
    try {
      const Ctx = window.AudioContext || window.webkitAudioContext;
      if (!Ctx) return null;
      ctx = new Ctx();
      return ctx;
    } catch (_) { return null; }
  }

  // Helper : note breve avec enveloppe ADSR simple.
  function beep(freq, durMs, type, gain) {
    if (!enabled) return;
    const c = ensureCtx();
    if (!c) return;
    if (c.state === 'suspended') { try { c.resume(); } catch (_) {} }
    const osc = c.createOscillator();
    const g   = c.createGain();
    osc.type = type || 'sine';
    osc.frequency.value = freq;
    osc.connect(g);
    g.connect(c.destination);
    const now = c.currentTime;
    const peak = (gain == null ? 0.08 : gain);
    g.gain.setValueAtTime(0.0001, now);
    g.gain.exponentialRampToValueAtTime(peak, now + 0.01);
    g.gain.exponentialRampToValueAtTime(0.0001, now + (durMs / 1000));
    osc.start(now);
    osc.stop(now + (durMs / 1000) + 0.02);
  }

  function play(name) {
    switch (name) {
      case 'correct': beep(880, 110, 'triangle', 0.07); setTimeout(() => beep(1320, 90, 'triangle', 0.06), 70); break;
      case 'wrong':   beep(180, 220, 'sawtooth', 0.05); break;
      case 'tick':    beep(620, 50,  'sine',     0.04); break;
      case 'level':   beep(523, 90,  'triangle', 0.07); setTimeout(() => beep(659, 90, 'triangle', 0.07), 80); setTimeout(() => beep(784, 140, 'triangle', 0.07), 160); break;
      case 'badge':   beep(1046, 90, 'triangle', 0.08); setTimeout(() => beep(1318, 90, 'triangle', 0.08), 90); setTimeout(() => beep(1568, 180, 'triangle', 0.08), 180); break;
      default: beep(660, 80, 'sine', 0.05);
    }
  }

  function isOn() { return enabled; }
  function set(on) {
    enabled = !!on;
    localStorage.setItem(KEY, enabled ? '1' : '0');
    syncToggleButtons();
  }
  function toggle() { set(!enabled); return enabled; }

  function syncToggleButtons() {
    const btns = document.querySelectorAll('[data-sound-toggle]');
    btns.forEach(b => {
      b.setAttribute('aria-pressed', enabled ? 'true' : 'false');
      b.textContent = enabled ? '🔊 Son' : '🔇 Muet';
      b.classList.toggle('is-off', !enabled);
    });
  }

  function init() {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', wire);
    } else {
      wire();
    }
  }

  function wire() {
    syncToggleButtons();
    document.addEventListener('click', (e) => {
      const t = e.target.closest('[data-sound-toggle]');
      if (!t) return;
      e.preventDefault();
      toggle();
    });
  }

  window.FrenchSounds = { play, isOn, set, toggle };
  init();
})();
