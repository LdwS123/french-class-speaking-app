const LIAISON_DATA = window.FrenchClassData;
const LIAISON_TOPICS = LIAISON_DATA.topics;
const CURRENT_TOPIC_KEY_L = "french_class_current_topic";

const liaisonEls = {
  liaisonTopicTitle: document.getElementById("liaisonTopicTitle"),
  liaisonDrillList: document.getElementById("liaisonDrillList"),
  liaisonPhraseList: document.getElementById("liaisonPhraseList"),
  newLiaisonSetBtn: document.getElementById("newLiaisonSetBtn")
};

function chooseTopic() {
  const currentId = localStorage.getItem(CURRENT_TOPIC_KEY_L);
  const current = LIAISON_TOPICS.find((topic) => topic.id === currentId);
  if (current) {
    return current;
  }
  return LIAISON_TOPICS[Math.floor(Math.random() * LIAISON_TOPICS.length)];
}

function markLiaison(text) {
  return text.replaceAll("_", '<span class="liaison-mark">_</span>');
}

function buildDrills(topic) {
  return [
    `Les_etudiants parlent de ${topic.category.toLowerCase()}.`,
    "Vous_avez une idee interessante.",
    "Ils_ont un exemple simple.",
    `Dans_un debat sur ${topic.title.toLowerCase()}, on peut nuancer.`,
    "Nous_avons aussi une solution."
  ];
}

function buildPhrases(topic) {
  return [
    `Je pense que ${topic.title.toLowerCase()} est un sujet important.`,
    "Parce que dans la vie quotidienne, cela change beaucoup de choses.",
    "Par exemple, dans mon experience, je vois souvent ce probleme.",
    "Donc, a mon avis, il faut une solution simple."
  ];
}

function renderLiaisonPage() {
  const topic = chooseTopic();
  liaisonEls.liaisonTopicTitle.textContent = topic.title;

  liaisonEls.liaisonDrillList.innerHTML = buildDrills(topic)
    .map((line, index) => `<div class="coach-step"><strong>${index + 1}.</strong> ${markLiaison(line)}</div>`)
    .join("");

  liaisonEls.liaisonPhraseList.innerHTML = buildPhrases(topic)
    .map((line, index) => `<div class="coach-step"><strong>Phrase ${index + 1}.</strong> ${line}</div>`)
    .join("");
}

liaisonEls.newLiaisonSetBtn.addEventListener("click", renderLiaisonPage);
renderLiaisonPage();
