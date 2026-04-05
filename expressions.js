const { shuffle, pick, storeGet, clear, el, setText,
        renderCoach, renderAnswerBtns, lockBtns, showCorrect } = window.FrUtils;

const METHOD_DATA       = window.FrenchClassData;
const EXPRESSION_BANKS  = METHOD_DATA.expressionBanks || [];
const EXPRESSION_QUIZ   = METHOD_DATA.expressionQuizItems || [
  { expression: "C'est l'hopital qui se fout de la charite.",
    answer: 'Quelqu\'un critique un defaut qu\'il a aussi.',
    options: ['Quelqu\'un critique un defaut qu\'il a aussi.', 'Quelqu\'un veut aider tout le monde.', 'Quelqu\'un va souvent a l\'hopital.'] },
  { expression: 'Tourner autour du pot.',
    answer: 'Ne pas dire les choses clairement.',
    options: ['Ne pas dire les choses clairement.', 'Changer souvent d\'avis.', 'Parler tres vite.'] },
  { expression: 'Ca ne tient pas debout.',
    answer: 'Ce n\'est pas credible.',
    options: ['Ce n\'est pas credible.', 'C\'est une tres bonne idee.', 'C\'est trop difficile physiquement.'] },
  { expression: 'En avoir marre.',
    answer: 'Etre fatigue ou agace.',
    options: ['Etre fatigue ou agace.', 'Avoir tres faim.', 'Avoir besoin d\'aide.'] },
  { expression: 'Mettre la charrue avant les boeufs.',
    answer: 'Faire les choses dans le mauvais ordre.',
    options: ['Faire les choses dans le mauvais ordre.', 'Travailler tres lentement.', 'Refuser de changer.'] },
  { expression: 'Avoir un coup de coeur.',
    answer: 'Aimer vraiment quelque chose.',
    options: ['Aimer vraiment quelque chose.', 'Se mettre en colere.', 'Changer de sujet.'] },
];

const m = {
  expressionGrid:       document.getElementById('expressionGrid'),
  survivalCombo:        document.getElementById('survivalCombo'),
  survivalModel:        document.getElementById('survivalModel'),
  refreshComboBtn:      document.getElementById('refreshComboBtn'),
  expressionFamilyCount:document.getElementById('expressionFamilyCount'),
  expressionCount:      document.getElementById('expressionCount'),
  newExpressionGameBtn: document.getElementById('newExpressionGameBtn'),
  expressionGameQuestion:document.getElementById('expressionGameQuestion'),
  expressionGameOptions: document.getElementById('expressionGameOptions'),
  expressionGameFeedback:document.getElementById('expressionGameFeedback'),
  expressionGameScore:   document.getElementById('expressionGameScore'),
  expressionGameTotal:   document.getElementById('expressionGameTotal'),
};

let quizScore = 0;
let quizTotal = 0;

// ─── Expression bank grid ─────────────────────────────────────
function renderExpressionGrid() {
  if (!m.expressionGrid) return;
  clear(m.expressionGrid);

  EXPRESSION_BANKS.forEach(bank => {
    const card = el('article', 'feature-card expression-bank');
    card.appendChild(el('h3', '', bank.title));
    card.appendChild(el('p', 'expression-bank-tip', bank.tip));

    const chipWrap = el('div', 'chip-wrap');
    bank.items.forEach(raw => {
      const [fr] = String(raw).split('|');
      const chip = el('span', 'chip');
      chip.appendChild(el('span', 'chip-fr', fr.trim()));
      chipWrap.appendChild(chip);
    });
    card.appendChild(chipWrap);
    m.expressionGrid.appendChild(card);
  });
}

// ─── Survival combo ───────────────────────────────────────────
function pickFromBank(bankId) {
  const bank = EXPRESSION_BANKS.find(b => b.id === bankId);
  if (!bank) return null;
  const [fr] = pick(shuffle(bank.items)).split('|');
  return fr.trim();
}

function renderSurvivalCombo() {
  const combo = ['opinion', 'reason', 'example', 'conclusion']
    .map(pickFromBank).filter(Boolean);

  if (m.survivalCombo) {
    clear(m.survivalCombo);
    combo.forEach(fr => {
      const chip = el('span', 'chip');
      chip.appendChild(el('span', 'chip-fr', fr));
      m.survivalCombo.appendChild(chip);
    });
  }

  if (m.survivalModel) {
    const [op, re, ex, co] = combo;
    renderCoach(m.survivalModel, [
      `${op ?? 'Je pense que...'} ce sujet est tres present dans la vie des etudiants.`,
      `${re ?? 'Parce que...'} il influence les habitudes, le temps ou le budget.`,
      `${ex ?? 'Par exemple...'} dans mon ecole, on voit souvent ce type de situation.`,
      `${co ?? 'Donc...'} il faut une regle simple ou un bon equilibre.`
    ]);
  }
}

// ─── Stats ────────────────────────────────────────────────────
function renderMethodStats() {
  const total = EXPRESSION_BANKS.reduce((sum, b) => sum + b.items.length, 0);
  if (m.expressionFamilyCount) setText(m.expressionFamilyCount, String(EXPRESSION_BANKS.length));
  if (m.expressionCount)       setText(m.expressionCount,       String(total));
}

// ─── Expression quiz ──────────────────────────────────────────
function updateQuizScore() {
  if (m.expressionGameScore) setText(m.expressionGameScore, String(quizScore));
  if (m.expressionGameTotal) setText(m.expressionGameTotal, String(quizTotal));
}

function renderExpressionGame() {
  if (!m.expressionGameQuestion || !m.expressionGameOptions) return;
  const item = pick(shuffle(EXPRESSION_QUIZ));
  setText(m.expressionGameQuestion, item.expression);
  if (m.expressionGameFeedback) setText(m.expressionGameFeedback, 'Choisis le bon sens.');

  renderAnswerBtns(m.expressionGameOptions,
    shuffle(item.options).map(opt => ({ text: opt, isCorrect: opt === item.answer })),
    (btn, isCorrect) => {
      quizTotal += 1;
      lockBtns(m.expressionGameOptions);
      showCorrect(m.expressionGameOptions);
      if (isCorrect) {
        btn.classList.add('correct');
        quizScore += 1;
        if (m.expressionGameFeedback) setText(m.expressionGameFeedback, 'Bien joue !');
      } else {
        btn.classList.add('wrong');
        if (m.expressionGameFeedback) setText(m.expressionGameFeedback, `Pas tout a fait. La bonne reponse : "${item.answer}"`);
      }
      updateQuizScore();
    }
  );
  updateQuizScore();
}

// ─── Events ───────────────────────────────────────────────────
m.refreshComboBtn?.addEventListener('click', renderSurvivalCombo);
m.newExpressionGameBtn?.addEventListener('click', renderExpressionGame);

// ─── Init ─────────────────────────────────────────────────────
renderExpressionGrid();
renderSurvivalCombo();
renderMethodStats();
renderExpressionGame();
