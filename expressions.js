const METHOD_DATA = window.FrenchClassData;
const EXPRESSION_BANKS = METHOD_DATA.expressionBanks || [];
const EXPRESSION_GAME_ITEMS = [
  {
    expression: "C'est l'hopital qui se fout de la charite.",
    answer: "Quelqu'un critique un defaut qu'il a aussi.",
    options: [
      "Quelqu'un critique un defaut qu'il a aussi.",
      "Quelqu'un veut aider tout le monde.",
      "Quelqu'un va souvent a l'hopital."
    ]
  },
  {
    expression: "Tourner autour du pot.",
    answer: "Ne pas dire les choses clairement.",
    options: [
      "Ne pas dire les choses clairement.",
      "Changer souvent d'avis.",
      "Parler tres vite."
    ]
  },
  {
    expression: "Ca ne tient pas debout.",
    answer: "Ce n'est pas credible.",
    options: [
      "Ce n'est pas credible.",
      "C'est une tres bonne idee.",
      "C'est trop difficile physiquement."
    ]
  },
  {
    expression: "En avoir marre.",
    answer: "Etre fatigue ou agace.",
    options: [
      "Etre fatigue ou agace.",
      "Avoir tres faim.",
      "Avoir besoin d'aide."
    ]
  },
  {
    expression: "Mettre la charrue avant les boeufs.",
    answer: "Faire les choses dans le mauvais ordre.",
    options: [
      "Faire les choses dans le mauvais ordre.",
      "Travailler tres lentement.",
      "Refuser de changer."
    ]
  },
  {
    expression: "Avoir un coup de coeur.",
    answer: "Aimer vraiment quelque chose ou quelqu'un.",
    options: [
      "Aimer vraiment quelque chose ou quelqu'un.",
      "Se mettre en colere.",
      "Changer de sujet."
    ]
  }
];

const methodEls = {
  expressionGrid: document.getElementById("expressionGrid"),
  survivalCombo: document.getElementById("survivalCombo"),
  survivalModel: document.getElementById("survivalModel"),
  refreshComboBtn: document.getElementById("refreshComboBtn"),
  expressionFamilyCount: document.getElementById("expressionFamilyCount"),
  expressionCount: document.getElementById("expressionCount"),
  newExpressionGameBtn: document.getElementById("newExpressionGameBtn"),
  expressionGameQuestion: document.getElementById("expressionGameQuestion"),
  expressionGameOptions: document.getElementById("expressionGameOptions"),
  expressionGameFeedback: document.getElementById("expressionGameFeedback"),
  expressionGameScore: document.getElementById("expressionGameScore"),
  expressionGameTotal: document.getElementById("expressionGameTotal")
};

let expressionGameScore = 0;
let expressionGameTotal = 0;

function methodShuffle(list) {
  const copy = [...list];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function splitExpression(item) {
  const [fr, en] = item.split("|");
  return { fr, en };
}

function renderExpressionGrid() {
  methodEls.expressionGrid.innerHTML = EXPRESSION_BANKS.map((bank) => `
    <article class="feature-card expression-bank">
      <h3>${bank.title}</h3>
      <p class="expression-bank-tip">${bank.tip}</p>
      <div class="chip-wrap">
        ${bank.items.map((item) => {
          const expression = splitExpression(item);
          return `<span class="chip"><span class="chip-fr">${expression.fr}</span></span>`;
        }).join("")}
      </div>
    </article>
  `).join("");
}

function pickFromBank(bankId) {
  const bank = EXPRESSION_BANKS.find((item) => item.id === bankId);
  if (!bank) {
    return null;
  }
  return splitExpression(methodShuffle(bank.items)[0]);
}

function renderSurvivalCombo() {
  const combo = [
    pickFromBank("opinion"),
    pickFromBank("reason"),
    pickFromBank("example"),
    pickFromBank("conclusion")
  ].filter(Boolean);

  methodEls.survivalCombo.innerHTML = combo.map((item) => (
    `<span class="chip"><span class="chip-fr">${item.fr}</span></span>`
  )).join("");

  const opinion = combo[0] ? combo[0].fr : "Je pense que...";
  const reason = combo[1] ? combo[1].fr : "Parce que...";
  const example = combo[2] ? combo[2].fr : "Par exemple...";
  const conclusion = combo[3] ? combo[3].fr : "Donc...";

  methodEls.survivalModel.innerHTML = [
    `${opinion} ce sujet est tres present dans la vie des etudiants.`,
    `${reason} il influence les habitudes, le temps ou le budget.`,
    `${example} dans mon ecole, on voit souvent ce type de situation.`,
    `${conclusion} il faut une regle simple ou un bon equilibre.`
  ].map((line, index) => `<div class="coach-step"><strong>${index + 1}.</strong> ${line}</div>`).join("");
}

function renderMethodStats() {
  const totalExpressions = EXPRESSION_BANKS.reduce((sum, bank) => sum + bank.items.length, 0);
  methodEls.expressionFamilyCount.textContent = String(EXPRESSION_BANKS.length);
  methodEls.expressionCount.textContent = String(totalExpressions);
}

function renderExpressionGame() {
  if (!methodEls.expressionGameQuestion || !methodEls.expressionGameOptions) {
    return;
  }

  const item = methodShuffle(EXPRESSION_GAME_ITEMS)[0];
  methodEls.expressionGameQuestion.textContent = item.expression;
  methodEls.expressionGameOptions.innerHTML = methodShuffle(item.options).map((option) => (
    `<button class="answer-btn" data-correct="${option === item.answer}">${option}</button>`
  )).join("");
  methodEls.expressionGameFeedback.innerHTML = `Score: <span id="expressionGameScore">${expressionGameScore}</span> / <span id="expressionGameTotal">${expressionGameTotal}</span>`;

  methodEls.expressionGameOptions.querySelectorAll(".answer-btn").forEach((button) => {
    button.addEventListener("click", () => {
      const isCorrect = button.dataset.correct === "true";
      expressionGameTotal += 1;
      if (isCorrect) {
        expressionGameScore += 1;
        button.classList.add("correct");
      } else {
        button.classList.add("wrong");
      }

      methodEls.expressionGameOptions.querySelectorAll(".answer-btn").forEach((other) => {
        other.disabled = true;
        if (other.dataset.correct === "true") {
          other.classList.add("correct");
        }
      });

      methodEls.expressionGameFeedback.innerHTML = isCorrect
        ? `Bien joue. Score: <span id="expressionGameScore">${expressionGameScore}</span> / <span id="expressionGameTotal">${expressionGameTotal}</span>`
        : `Pas tout a fait. Score: <span id="expressionGameScore">${expressionGameScore}</span> / <span id="expressionGameTotal">${expressionGameTotal}</span>`;
    });
  });
}

if (methodEls.expressionGrid) {
  renderExpressionGrid();
  renderSurvivalCombo();
  renderMethodStats();
  methodEls.refreshComboBtn.addEventListener("click", renderSurvivalCombo);
  renderExpressionGame();
  methodEls.newExpressionGameBtn.addEventListener("click", renderExpressionGame);
}
