const EXPLORER_DATA = window.FrenchClassData;
const EXPLORER_TOPICS = EXPLORER_DATA.topics;

const explorerEls = {
  categoryFilter: document.getElementById("categoryFilter"),
  levelFilter: document.getElementById("levelFilter"),
  searchInput: document.getElementById("searchInput"),
  vocabGrid: document.getElementById("vocabGrid"),
  vocabTotal: document.getElementById("vocabTotal"),
  categoryCount: document.getElementById("categoryCount")
};

function getCategories() {
  return [...new Set(EXPLORER_TOPICS.map((topic) => topic.category))].sort((a, b) => a.localeCompare(b, "fr"));
}

function flattenTopicWords(topic) {
  return ["B1", "B2", "C1"].flatMap((level) =>
    topic.levels[level].map((item) => {
      const [fr, en] = item.split("|");
      return { topic, level, fr, en };
    })
  );
}

function renderCategoryOptions() {
  const categories = getCategories();
  explorerEls.categoryFilter.innerHTML = ['<option value="ALL">Tous les themes</option>']
    .concat(categories.map((category) => `<option value="${category}">${category}</option>`))
    .join("");
  explorerEls.categoryCount.textContent = String(categories.length);
}

function renderExplorer() {
  const category = explorerEls.categoryFilter.value;
  const level = explorerEls.levelFilter.value;
  const query = explorerEls.searchInput.value.trim().toLowerCase();

  const words = EXPLORER_TOPICS
    .filter((topic) => category === "ALL" || topic.category === category)
    .flatMap(flattenTopicWords)
    .filter((item) => level === "ALL" || item.level === level)
    .filter((item) => {
      if (!query) {
        return true;
      }

      return [
        item.fr,
        item.en,
        item.topic.title,
        item.topic.category
      ].some((value) => value.toLowerCase().includes(query));
    });

  explorerEls.vocabTotal.textContent = String(words.length);
  explorerEls.vocabGrid.innerHTML = words.length ? words.map((item) => `
    <article class="word-card">
      <div class="word-card-top">
        <span class="pill">${item.topic.category}</span>
        <span class="pill">${item.level}</span>
      </div>
      <h3>${item.fr}</h3>
      <p>${item.en}</p>
      <span class="word-topic">${item.topic.title}</span>
    </article>
  `).join("") : `
    <article class="panel-card empty-state">
      <h3>Aucun resultat</h3>
      <p class="subhelp">Essaie un autre mot en francais ou en anglais.</p>
    </article>
  `;
}

explorerEls.categoryFilter.addEventListener("change", renderExplorer);
explorerEls.levelFilter.addEventListener("change", renderExplorer);
explorerEls.searchInput.addEventListener("input", renderExplorer);

renderCategoryOptions();
renderExplorer();
