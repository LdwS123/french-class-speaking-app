const { clear, el, setText, vocabChip, pill } = window.FrUtils;

const EXPLORER_DATA   = window.FrenchClassData;
const EXPLORER_TOPICS = EXPLORER_DATA.topics;
const EXPLORER_PACKS  = EXPLORER_DATA.globalVocabPacks || [];

const xEls = {
  categoryFilter: document.getElementById('categoryFilter'),
  levelFilter:    document.getElementById('levelFilter'),
  searchInput:    document.getElementById('searchInput'),
  vocabGrid:      document.getElementById('vocabGrid'),
  vocabTotal:     document.getElementById('vocabTotal'),
  categoryCount:  document.getElementById('categoryCount'),
};

// ─── Data helpers ─────────────────────────────────────────────
function getAllSources() {
  return [
    ...EXPLORER_TOPICS.map(t => ({ ...t, sourceType: 'topic', sourceLabel: t.title })),
    ...EXPLORER_PACKS.map(p  => ({ ...p, sourceType: 'pack',  sourceLabel: p.title })),
  ];
}

function flattenSource(source) {
  return ['B1', 'B2', 'C1'].flatMap(level =>
    source.levels[level].map(raw => {
      const [fr, en] = String(raw).split('|');
      return { source, level, fr: fr?.trim() ?? '', en: en?.trim() ?? '' };
    })
  );
}

function getCategories() {
  return [...new Set(getAllSources().map(s => s.category))].sort((a, b) => a.localeCompare(b, 'fr'));
}

// ─── Category filter init ─────────────────────────────────────
function buildCategoryOptions() {
  const cats = getCategories();
  clear(xEls.categoryFilter);
  const defaultOpt = document.createElement('option');
  defaultOpt.value = 'ALL';
  defaultOpt.textContent = 'Tous les themes';
  xEls.categoryFilter.appendChild(defaultOpt);
  cats.forEach(cat => {
    const opt = document.createElement('option');
    opt.value = cat;
    opt.textContent = cat;
    xEls.categoryFilter.appendChild(opt);
  });
  if (xEls.categoryCount) setText(xEls.categoryCount, String(cats.length));
}

// ─── Word card ────────────────────────────────────────────────
function buildWordCard(item) {
  const card = el('article', 'word-card');

  const top = el('div', 'word-card-top');
  top.appendChild(pill(item.source.category));
  top.appendChild(pill(item.level));
  card.appendChild(top);

  card.appendChild(el('h3', '', item.fr));
  card.appendChild(el('p', '', item.en));

  const sourceLabel = item.source.sourceType === 'pack'
    ? `Pack · ${item.source.sourceLabel}`
    : item.source.sourceLabel;
  card.appendChild(el('span', 'word-topic', sourceLabel));
  return card;
}

// ─── Render grid ──────────────────────────────────────────────
function renderExplorer() {
  const category = xEls.categoryFilter?.value ?? 'ALL';
  const level    = xEls.levelFilter?.value    ?? 'ALL';
  const query    = (xEls.searchInput?.value ?? '').trim().toLowerCase();

  const words = getAllSources()
    .filter(s => category === 'ALL' || s.category === category)
    .flatMap(flattenSource)
    .filter(item => level === 'ALL' || item.level === level)
    .filter(item => {
      if (!query) return true;
      return [item.fr, item.en, item.source.sourceLabel, item.source.category]
        .some(v => v.toLowerCase().includes(query));
    });

  if (xEls.vocabTotal) setText(xEls.vocabTotal, String(words.length));
  clear(xEls.vocabGrid);

  if (!words.length) {
    const empty = el('article', 'panel-card empty-state');
    empty.appendChild(el('h3', '', 'Aucun resultat'));
    empty.appendChild(el('p', 'subhelp', 'Essaie un autre mot en francais ou en anglais.'));
    xEls.vocabGrid.appendChild(empty);
    return;
  }

  words.forEach(item => xEls.vocabGrid.appendChild(buildWordCard(item)));
}

// ─── Events ───────────────────────────────────────────────────
xEls.categoryFilter?.addEventListener('change', renderExplorer);
xEls.levelFilter?.addEventListener('change', renderExplorer);
xEls.searchInput?.addEventListener('input', renderExplorer);

// ─── Init ─────────────────────────────────────────────────────
buildCategoryOptions();
renderExplorer();
