/**
 * FrenchVerbs — banque de verbes conjugues.
 * Chaque verbe a :
 *  - infinitive  : infinitif francais
 *  - en          : traduction anglaise
 *  - group       : "1" (-er), "2" (-ir + -issons), "3" (irregulier ou 3e groupe)
 *  - aux         : "avoir" ou "etre" (passe compose)
 *  - pp          : participe passe (forme masculin singulier)
 *  - irregular   : true si irregulier
 *  - pronominal  : true pour les verbes pronominaux
 *  - tenses      : { present, imparfait, futur, conditionnel, subjonctif } — tous en {je, tu, il, nous, vous, ils}
 *  - prep        : preposition typique ("a", "de", null) — pour le jeu prepositions
 *
 * Les 6 personnes suivent l'ordre : je, tu, il/elle, nous, vous, ils/elles.
 * L'imparfait, le futur, le conditionnel et le subjonctif sont inclus.
 */
window.FrenchVerbs = (() => {

  // Formes tres frequentes partagees (pour ne pas repeter)
  const PRONOUNS = ['je', 'tu', 'il', 'nous', 'vous', 'ils'];

  const VERBS = [
    // ─── Auxiliaires & essentiels ──────────────────────────────
    {
      infinitive: "etre", en: "to be", group: "3", aux: "avoir", pp: "ete",
      irregular: true,
      present:       ["suis", "es", "est", "sommes", "etes", "sont"],
      imparfait:     ["etais", "etais", "etait", "etions", "etiez", "etaient"],
      futur:         ["serai", "seras", "sera", "serons", "serez", "seront"],
      conditionnel:  ["serais", "serais", "serait", "serions", "seriez", "seraient"],
      subjonctif:    ["sois", "sois", "soit", "soyons", "soyez", "soient"],
      imperatif:     ["sois", "soyons", "soyez"]
    },
    {
      infinitive: "avoir", en: "to have", group: "3", aux: "avoir", pp: "eu",
      irregular: true,
      present:       ["ai", "as", "a", "avons", "avez", "ont"],
      imparfait:     ["avais", "avais", "avait", "avions", "aviez", "avaient"],
      futur:         ["aurai", "auras", "aura", "aurons", "aurez", "auront"],
      conditionnel:  ["aurais", "aurais", "aurait", "aurions", "auriez", "auraient"],
      subjonctif:    ["aie", "aies", "ait", "ayons", "ayez", "aient"],
      imperatif:     ["aie", "ayons", "ayez"]
    },
    {
      infinitive: "aller", en: "to go", group: "3", aux: "etre", pp: "alle",
      irregular: true,
      present:       ["vais", "vas", "va", "allons", "allez", "vont"],
      imparfait:     ["allais", "allais", "allait", "allions", "alliez", "allaient"],
      futur:         ["irai", "iras", "ira", "irons", "irez", "iront"],
      conditionnel:  ["irais", "irais", "irait", "irions", "iriez", "iraient"],
      subjonctif:    ["aille", "ailles", "aille", "allions", "alliez", "aillent"]
    },
    {
      infinitive: "faire", en: "to do / to make", group: "3", aux: "avoir", pp: "fait",
      irregular: true,
      present:       ["fais", "fais", "fait", "faisons", "faites", "font"],
      imparfait:     ["faisais", "faisais", "faisait", "faisions", "faisiez", "faisaient"],
      futur:         ["ferai", "feras", "fera", "ferons", "ferez", "feront"],
      conditionnel:  ["ferais", "ferais", "ferait", "ferions", "feriez", "feraient"],
      subjonctif:    ["fasse", "fasses", "fasse", "fassions", "fassiez", "fassent"]
    },
    {
      infinitive: "dire", en: "to say", group: "3", aux: "avoir", pp: "dit",
      irregular: true,
      present:       ["dis", "dis", "dit", "disons", "dites", "disent"],
      imparfait:     ["disais", "disais", "disait", "disions", "disiez", "disaient"],
      futur:         ["dirai", "diras", "dira", "dirons", "direz", "diront"],
      conditionnel:  ["dirais", "dirais", "dirait", "dirions", "diriez", "diraient"],
      subjonctif:    ["dise", "dises", "dise", "disions", "disiez", "disent"]
    },
    {
      infinitive: "pouvoir", en: "can / to be able", group: "3", aux: "avoir", pp: "pu",
      irregular: true,
      present:       ["peux", "peux", "peut", "pouvons", "pouvez", "peuvent"],
      imparfait:     ["pouvais", "pouvais", "pouvait", "pouvions", "pouviez", "pouvaient"],
      futur:         ["pourrai", "pourras", "pourra", "pourrons", "pourrez", "pourront"],
      conditionnel:  ["pourrais", "pourrais", "pourrait", "pourrions", "pourriez", "pourraient"],
      subjonctif:    ["puisse", "puisses", "puisse", "puissions", "puissiez", "puissent"]
    },
    {
      infinitive: "vouloir", en: "to want", group: "3", aux: "avoir", pp: "voulu",
      irregular: true,
      present:       ["veux", "veux", "veut", "voulons", "voulez", "veulent"],
      imparfait:     ["voulais", "voulais", "voulait", "voulions", "vouliez", "voulaient"],
      futur:         ["voudrai", "voudras", "voudra", "voudrons", "voudrez", "voudront"],
      conditionnel:  ["voudrais", "voudrais", "voudrait", "voudrions", "voudriez", "voudraient"],
      subjonctif:    ["veuille", "veuilles", "veuille", "voulions", "vouliez", "veuillent"]
    },
    {
      infinitive: "devoir", en: "must / to have to", group: "3", aux: "avoir", pp: "du",
      irregular: true,
      present:       ["dois", "dois", "doit", "devons", "devez", "doivent"],
      imparfait:     ["devais", "devais", "devait", "devions", "deviez", "devaient"],
      futur:         ["devrai", "devras", "devra", "devrons", "devrez", "devront"],
      conditionnel:  ["devrais", "devrais", "devrait", "devrions", "devriez", "devraient"],
      subjonctif:    ["doive", "doives", "doive", "devions", "deviez", "doivent"]
    },
    {
      infinitive: "savoir", en: "to know (fact)", group: "3", aux: "avoir", pp: "su",
      irregular: true,
      present:       ["sais", "sais", "sait", "savons", "savez", "savent"],
      imparfait:     ["savais", "savais", "savait", "savions", "saviez", "savaient"],
      futur:         ["saurai", "sauras", "saura", "saurons", "saurez", "sauront"],
      conditionnel:  ["saurais", "saurais", "saurait", "saurions", "sauriez", "sauraient"],
      subjonctif:    ["sache", "saches", "sache", "sachions", "sachiez", "sachent"]
    },
    {
      infinitive: "connaitre", en: "to know (person/place)", group: "3", aux: "avoir", pp: "connu",
      irregular: true,
      present:       ["connais", "connais", "connait", "connaissons", "connaissez", "connaissent"],
      imparfait:     ["connaissais", "connaissais", "connaissait", "connaissions", "connaissiez", "connaissaient"],
      futur:         ["connaitrai", "connaitras", "connaitra", "connaitrons", "connaitrez", "connaitront"],
      conditionnel:  ["connaitrais", "connaitrais", "connaitrait", "connaitrions", "connaitriez", "connaitraient"],
      subjonctif:    ["connaisse", "connaisses", "connaisse", "connaissions", "connaissiez", "connaissent"]
    },
    {
      infinitive: "voir", en: "to see", group: "3", aux: "avoir", pp: "vu",
      irregular: true,
      present:       ["vois", "vois", "voit", "voyons", "voyez", "voient"],
      imparfait:     ["voyais", "voyais", "voyait", "voyions", "voyiez", "voyaient"],
      futur:         ["verrai", "verras", "verra", "verrons", "verrez", "verront"],
      conditionnel:  ["verrais", "verrais", "verrait", "verrions", "verriez", "verraient"],
      subjonctif:    ["voie", "voies", "voie", "voyions", "voyiez", "voient"]
    },
    {
      infinitive: "venir", en: "to come", group: "3", aux: "etre", pp: "venu",
      irregular: true,
      present:       ["viens", "viens", "vient", "venons", "venez", "viennent"],
      imparfait:     ["venais", "venais", "venait", "venions", "veniez", "venaient"],
      futur:         ["viendrai", "viendras", "viendra", "viendrons", "viendrez", "viendront"],
      conditionnel:  ["viendrais", "viendrais", "viendrait", "viendrions", "viendriez", "viendraient"],
      subjonctif:    ["vienne", "viennes", "vienne", "venions", "veniez", "viennent"]
    },
    {
      infinitive: "prendre", en: "to take", group: "3", aux: "avoir", pp: "pris",
      irregular: true,
      present:       ["prends", "prends", "prend", "prenons", "prenez", "prennent"],
      imparfait:     ["prenais", "prenais", "prenait", "prenions", "preniez", "prenaient"],
      futur:         ["prendrai", "prendras", "prendra", "prendrons", "prendrez", "prendront"],
      conditionnel:  ["prendrais", "prendrais", "prendrait", "prendrions", "prendriez", "prendraient"],
      subjonctif:    ["prenne", "prennes", "prenne", "prenions", "preniez", "prennent"]
    },
    {
      infinitive: "mettre", en: "to put", group: "3", aux: "avoir", pp: "mis",
      irregular: true,
      present:       ["mets", "mets", "met", "mettons", "mettez", "mettent"],
      imparfait:     ["mettais", "mettais", "mettait", "mettions", "mettiez", "mettaient"],
      futur:         ["mettrai", "mettras", "mettra", "mettrons", "mettrez", "mettront"],
      conditionnel:  ["mettrais", "mettrais", "mettrait", "mettrions", "mettriez", "mettraient"],
      subjonctif:    ["mette", "mettes", "mette", "mettions", "mettiez", "mettent"]
    },
    {
      infinitive: "partir", en: "to leave", group: "3", aux: "etre", pp: "parti",
      irregular: true,
      present:       ["pars", "pars", "part", "partons", "partez", "partent"],
      imparfait:     ["partais", "partais", "partait", "partions", "partiez", "partaient"],
      futur:         ["partirai", "partiras", "partira", "partirons", "partirez", "partiront"],
      conditionnel:  ["partirais", "partirais", "partirait", "partirions", "partiriez", "partiraient"],
      subjonctif:    ["parte", "partes", "parte", "partions", "partiez", "partent"]
    },
    {
      infinitive: "sortir", en: "to go out", group: "3", aux: "etre", pp: "sorti",
      irregular: true,
      present:       ["sors", "sors", "sort", "sortons", "sortez", "sortent"],
      imparfait:     ["sortais", "sortais", "sortait", "sortions", "sortiez", "sortaient"],
      futur:         ["sortirai", "sortiras", "sortira", "sortirons", "sortirez", "sortiront"],
      conditionnel:  ["sortirais", "sortirais", "sortirait", "sortirions", "sortiriez", "sortiraient"],
      subjonctif:    ["sorte", "sortes", "sorte", "sortions", "sortiez", "sortent"]
    },
    {
      infinitive: "lire", en: "to read", group: "3", aux: "avoir", pp: "lu",
      irregular: true,
      present:       ["lis", "lis", "lit", "lisons", "lisez", "lisent"],
      imparfait:     ["lisais", "lisais", "lisait", "lisions", "lisiez", "lisaient"],
      futur:         ["lirai", "liras", "lira", "lirons", "lirez", "liront"],
      conditionnel:  ["lirais", "lirais", "lirait", "lirions", "liriez", "liraient"],
      subjonctif:    ["lise", "lises", "lise", "lisions", "lisiez", "lisent"]
    },
    {
      infinitive: "ecrire", en: "to write", group: "3", aux: "avoir", pp: "ecrit",
      irregular: true,
      present:       ["ecris", "ecris", "ecrit", "ecrivons", "ecrivez", "ecrivent"],
      imparfait:     ["ecrivais", "ecrivais", "ecrivait", "ecrivions", "ecriviez", "ecrivaient"],
      futur:         ["ecrirai", "ecriras", "ecrira", "ecrirons", "ecrirez", "ecriront"],
      conditionnel:  ["ecrirais", "ecrirais", "ecrirait", "ecririons", "ecririez", "ecriraient"],
      subjonctif:    ["ecrive", "ecrives", "ecrive", "ecrivions", "ecriviez", "ecrivent"]
    },
    {
      infinitive: "boire", en: "to drink", group: "3", aux: "avoir", pp: "bu",
      irregular: true,
      present:       ["bois", "bois", "boit", "buvons", "buvez", "boivent"],
      imparfait:     ["buvais", "buvais", "buvait", "buvions", "buviez", "buvaient"],
      futur:         ["boirai", "boiras", "boira", "boirons", "boirez", "boiront"],
      conditionnel:  ["boirais", "boirais", "boirait", "boirions", "boiriez", "boiraient"],
      subjonctif:    ["boive", "boives", "boive", "buvions", "buviez", "boivent"]
    },
    {
      infinitive: "croire", en: "to believe", group: "3", aux: "avoir", pp: "cru",
      irregular: true,
      present:       ["crois", "crois", "croit", "croyons", "croyez", "croient"],
      imparfait:     ["croyais", "croyais", "croyait", "croyions", "croyiez", "croyaient"],
      futur:         ["croirai", "croiras", "croira", "croirons", "croirez", "croiront"],
      conditionnel:  ["croirais", "croirais", "croirait", "croirions", "croiriez", "croiraient"],
      subjonctif:    ["croie", "croies", "croie", "croyions", "croyiez", "croient"]
    },
    {
      infinitive: "recevoir", en: "to receive", group: "3", aux: "avoir", pp: "recu",
      irregular: true,
      present:       ["recois", "recois", "recoit", "recevons", "recevez", "recoivent"],
      imparfait:     ["recevais", "recevais", "recevait", "recevions", "receviez", "recevaient"],
      futur:         ["recevrai", "recevras", "recevra", "recevrons", "recevrez", "recevront"],
      conditionnel:  ["recevrais", "recevrais", "recevrait", "recevrions", "recevriez", "recevraient"],
      subjonctif:    ["recoive", "recoives", "recoive", "recevions", "receviez", "recoivent"]
    },
    {
      infinitive: "vivre", en: "to live", group: "3", aux: "avoir", pp: "vecu",
      irregular: true,
      present:       ["vis", "vis", "vit", "vivons", "vivez", "vivent"],
      imparfait:     ["vivais", "vivais", "vivait", "vivions", "viviez", "vivaient"],
      futur:         ["vivrai", "vivras", "vivra", "vivrons", "vivrez", "vivront"],
      conditionnel:  ["vivrais", "vivrais", "vivrait", "vivrions", "vivriez", "vivraient"],
      subjonctif:    ["vive", "vives", "vive", "vivions", "viviez", "vivent"]
    },
    {
      infinitive: "ouvrir", en: "to open", group: "3", aux: "avoir", pp: "ouvert",
      irregular: true,
      present:       ["ouvre", "ouvres", "ouvre", "ouvrons", "ouvrez", "ouvrent"],
      imparfait:     ["ouvrais", "ouvrais", "ouvrait", "ouvrions", "ouvriez", "ouvraient"],
      futur:         ["ouvrirai", "ouvriras", "ouvrira", "ouvrirons", "ouvrirez", "ouvriront"],
      conditionnel:  ["ouvrirais", "ouvrirais", "ouvrirait", "ouvririons", "ouvririez", "ouvriraient"],
      subjonctif:    ["ouvre", "ouvres", "ouvre", "ouvrions", "ouvriez", "ouvrent"]
    },
    {
      infinitive: "apprendre", en: "to learn", group: "3", aux: "avoir", pp: "appris",
      irregular: true,
      present:       ["apprends", "apprends", "apprend", "apprenons", "apprenez", "apprennent"],
      imparfait:     ["apprenais", "apprenais", "apprenait", "apprenions", "appreniez", "apprenaient"],
      futur:         ["apprendrai", "apprendras", "apprendra", "apprendrons", "apprendrez", "apprendront"],
      conditionnel:  ["apprendrais", "apprendrais", "apprendrait", "apprendrions", "apprendriez", "apprendraient"],
      subjonctif:    ["apprenne", "apprennes", "apprenne", "apprenions", "appreniez", "apprennent"]
    },
    {
      infinitive: "comprendre", en: "to understand", group: "3", aux: "avoir", pp: "compris",
      irregular: true,
      present:       ["comprends", "comprends", "comprend", "comprenons", "comprenez", "comprennent"],
      imparfait:     ["comprenais", "comprenais", "comprenait", "comprenions", "compreniez", "comprenaient"],
      futur:         ["comprendrai", "comprendras", "comprendra", "comprendrons", "comprendrez", "comprendront"],
      conditionnel:  ["comprendrais", "comprendrais", "comprendrait", "comprendrions", "comprendriez", "comprendraient"],
      subjonctif:    ["comprenne", "comprennes", "comprenne", "comprenions", "compreniez", "comprennent"]
    },
    {
      infinitive: "tenir", en: "to hold", group: "3", aux: "avoir", pp: "tenu",
      irregular: true,
      present:       ["tiens", "tiens", "tient", "tenons", "tenez", "tiennent"],
      imparfait:     ["tenais", "tenais", "tenait", "tenions", "teniez", "tenaient"],
      futur:         ["tiendrai", "tiendras", "tiendra", "tiendrons", "tiendrez", "tiendront"],
      conditionnel:  ["tiendrais", "tiendrais", "tiendrait", "tiendrions", "tiendriez", "tiendraient"],
      subjonctif:    ["tienne", "tiennes", "tienne", "tenions", "teniez", "tiennent"]
    },
    {
      infinitive: "devenir", en: "to become", group: "3", aux: "etre", pp: "devenu",
      irregular: true,
      present:       ["deviens", "deviens", "devient", "devenons", "devenez", "deviennent"],
      imparfait:     ["devenais", "devenais", "devenait", "devenions", "deveniez", "devenaient"],
      futur:         ["deviendrai", "deviendras", "deviendra", "deviendrons", "deviendrez", "deviendront"],
      conditionnel:  ["deviendrais", "deviendrais", "deviendrait", "deviendrions", "deviendriez", "deviendraient"],
      subjonctif:    ["devienne", "deviennes", "devienne", "devenions", "deveniez", "deviennent"]
    },

    // ─── 15 verbes irreguliers en plus ─────────────────────────
    {
      infinitive: "courir", en: "to run", group: "3", aux: "avoir", pp: "couru",
      irregular: true,
      present:       ["cours", "cours", "court", "courons", "courez", "courent"],
      imparfait:     ["courais", "courais", "courait", "courions", "couriez", "couraient"],
      futur:         ["courrai", "courras", "courra", "courrons", "courrez", "courront"],
      conditionnel:  ["courrais", "courrais", "courrait", "courrions", "courriez", "courraient"],
      subjonctif:    ["coure", "coures", "coure", "courions", "couriez", "courent"]
    },
    {
      infinitive: "mourir", en: "to die", group: "3", aux: "etre", pp: "mort",
      irregular: true,
      present:       ["meurs", "meurs", "meurt", "mourons", "mourez", "meurent"],
      imparfait:     ["mourais", "mourais", "mourait", "mourions", "mouriez", "mouraient"],
      futur:         ["mourrai", "mourras", "mourra", "mourrons", "mourrez", "mourront"],
      conditionnel:  ["mourrais", "mourrais", "mourrait", "mourrions", "mourriez", "mourraient"],
      subjonctif:    ["meure", "meures", "meure", "mourions", "mouriez", "meurent"]
    },
    {
      infinitive: "naitre", en: "to be born", group: "3", aux: "etre", pp: "ne",
      irregular: true,
      present:       ["nais", "nais", "nait", "naissons", "naissez", "naissent"],
      imparfait:     ["naissais", "naissais", "naissait", "naissions", "naissiez", "naissaient"],
      futur:         ["naitrai", "naitras", "naitra", "naitrons", "naitrez", "naitront"],
      conditionnel:  ["naitrais", "naitrais", "naitrait", "naitrions", "naitriez", "naitraient"],
      subjonctif:    ["naisse", "naisses", "naisse", "naissions", "naissiez", "naissent"]
    },
    {
      infinitive: "suivre", en: "to follow", group: "3", aux: "avoir", pp: "suivi",
      irregular: true,
      present:       ["suis", "suis", "suit", "suivons", "suivez", "suivent"],
      imparfait:     ["suivais", "suivais", "suivait", "suivions", "suiviez", "suivaient"],
      futur:         ["suivrai", "suivras", "suivra", "suivrons", "suivrez", "suivront"],
      conditionnel:  ["suivrais", "suivrais", "suivrait", "suivrions", "suivriez", "suivraient"],
      subjonctif:    ["suive", "suives", "suive", "suivions", "suiviez", "suivent"]
    },
    {
      infinitive: "rire", en: "to laugh", group: "3", aux: "avoir", pp: "ri",
      irregular: true,
      present:       ["ris", "ris", "rit", "rions", "riez", "rient"],
      imparfait:     ["riais", "riais", "riait", "riions", "riiez", "riaient"],
      futur:         ["rirai", "riras", "rira", "rirons", "rirez", "riront"],
      conditionnel:  ["rirais", "rirais", "rirait", "ririons", "ririez", "riraient"],
      subjonctif:    ["rie", "ries", "rie", "riions", "riiez", "rient"]
    },
    {
      infinitive: "perdre", en: "to lose", group: "3", aux: "avoir", pp: "perdu",
      irregular: true,
      present:       ["perds", "perds", "perd", "perdons", "perdez", "perdent"],
      imparfait:     ["perdais", "perdais", "perdait", "perdions", "perdiez", "perdaient"],
      futur:         ["perdrai", "perdras", "perdra", "perdrons", "perdrez", "perdront"],
      conditionnel:  ["perdrais", "perdrais", "perdrait", "perdrions", "perdriez", "perdraient"],
      subjonctif:    ["perde", "perdes", "perde", "perdions", "perdiez", "perdent"]
    },
    {
      infinitive: "vendre", en: "to sell", group: "3", aux: "avoir", pp: "vendu",
      irregular: true,
      present:       ["vends", "vends", "vend", "vendons", "vendez", "vendent"],
      imparfait:     ["vendais", "vendais", "vendait", "vendions", "vendiez", "vendaient"],
      futur:         ["vendrai", "vendras", "vendra", "vendrons", "vendrez", "vendront"],
      conditionnel:  ["vendrais", "vendrais", "vendrait", "vendrions", "vendriez", "vendraient"],
      subjonctif:    ["vende", "vendes", "vende", "vendions", "vendiez", "vendent"]
    },
    {
      infinitive: "attendre", en: "to wait", group: "3", aux: "avoir", pp: "attendu",
      irregular: true,
      present:       ["attends", "attends", "attend", "attendons", "attendez", "attendent"],
      imparfait:     ["attendais", "attendais", "attendait", "attendions", "attendiez", "attendaient"],
      futur:         ["attendrai", "attendras", "attendra", "attendrons", "attendrez", "attendront"],
      conditionnel:  ["attendrais", "attendrais", "attendrait", "attendrions", "attendriez", "attendraient"],
      subjonctif:    ["attende", "attendes", "attende", "attendions", "attendiez", "attendent"]
    },
    {
      infinitive: "repondre", en: "to answer", group: "3", aux: "avoir", pp: "repondu",
      irregular: true,
      present:       ["reponds", "reponds", "repond", "repondons", "repondez", "repondent"],
      imparfait:     ["repondais", "repondais", "repondait", "repondions", "repondiez", "repondaient"],
      futur:         ["repondrai", "repondras", "repondra", "repondrons", "repondrez", "repondront"],
      conditionnel:  ["repondrais", "repondrais", "repondrait", "repondrions", "repondriez", "repondraient"],
      subjonctif:    ["reponde", "repondes", "reponde", "repondions", "repondiez", "repondent"]
    },
    {
      infinitive: "entendre", en: "to hear", group: "3", aux: "avoir", pp: "entendu",
      irregular: true,
      present:       ["entends", "entends", "entend", "entendons", "entendez", "entendent"],
      imparfait:     ["entendais", "entendais", "entendait", "entendions", "entendiez", "entendaient"],
      futur:         ["entendrai", "entendras", "entendra", "entendrons", "entendrez", "entendront"],
      conditionnel:  ["entendrais", "entendrais", "entendrait", "entendrions", "entendriez", "entendraient"],
      subjonctif:    ["entende", "entendes", "entende", "entendions", "entendiez", "entendent"]
    },
    {
      infinitive: "dormir", en: "to sleep", group: "3", aux: "avoir", pp: "dormi",
      irregular: true,
      present:       ["dors", "dors", "dort", "dormons", "dormez", "dorment"],
      imparfait:     ["dormais", "dormais", "dormait", "dormions", "dormiez", "dormaient"],
      futur:         ["dormirai", "dormiras", "dormira", "dormirons", "dormirez", "dormiront"],
      conditionnel:  ["dormirais", "dormirais", "dormirait", "dormirions", "dormiriez", "dormiraient"],
      subjonctif:    ["dorme", "dormes", "dorme", "dormions", "dormiez", "dorment"]
    },
    {
      infinitive: "servir", en: "to serve", group: "3", aux: "avoir", pp: "servi",
      irregular: true,
      present:       ["sers", "sers", "sert", "servons", "servez", "servent"],
      imparfait:     ["servais", "servais", "servait", "servions", "serviez", "servaient"],
      futur:         ["servirai", "serviras", "servira", "servirons", "servirez", "serviront"],
      conditionnel:  ["servirais", "servirais", "servirait", "servirions", "serviriez", "serviraient"],
      subjonctif:    ["serve", "serves", "serve", "servions", "serviez", "servent"]
    },
    {
      infinitive: "sentir", en: "to feel / to smell", group: "3", aux: "avoir", pp: "senti",
      irregular: true,
      present:       ["sens", "sens", "sent", "sentons", "sentez", "sentent"],
      imparfait:     ["sentais", "sentais", "sentait", "sentions", "sentiez", "sentaient"],
      futur:         ["sentirai", "sentiras", "sentira", "sentirons", "sentirez", "sentiront"],
      conditionnel:  ["sentirais", "sentirais", "sentirait", "sentirions", "sentiriez", "sentiraient"],
      subjonctif:    ["sente", "sentes", "sente", "sentions", "sentiez", "sentent"]
    },
    {
      infinitive: "plaire", en: "to please", group: "3", aux: "avoir", pp: "plu",
      irregular: true,
      present:       ["plais", "plais", "plait", "plaisons", "plaisez", "plaisent"],
      imparfait:     ["plaisais", "plaisais", "plaisait", "plaisions", "plaisiez", "plaisaient"],
      futur:         ["plairai", "plairas", "plaira", "plairons", "plairez", "plairont"],
      conditionnel:  ["plairais", "plairais", "plairait", "plairions", "plairiez", "plairaient"],
      subjonctif:    ["plaise", "plaises", "plaise", "plaisions", "plaisiez", "plaisent"]
    },
    {
      infinitive: "se souvenir", en: "to remember", group: "3", aux: "etre", pp: "souvenu",
      irregular: true, pronominal: true,
      present:       ["souviens", "souviens", "souvient", "souvenons", "souvenez", "souviennent"],
      imparfait:     ["souvenais", "souvenais", "souvenait", "souvenions", "souveniez", "souvenaient"],
      futur:         ["souviendrai", "souviendras", "souviendra", "souviendrons", "souviendrez", "souviendront"],
      conditionnel:  ["souviendrais", "souviendrais", "souviendrait", "souviendrions", "souviendriez", "souviendraient"],
      subjonctif:    ["souvienne", "souviennes", "souvienne", "souvenions", "souveniez", "souviennent"]
    },

    // ─── Premier groupe (-er) ─────────────────────────────────
    {
      infinitive: "parler", en: "to speak", group: "1", aux: "avoir", pp: "parle",
      present:       ["parle", "parles", "parle", "parlons", "parlez", "parlent"],
      imparfait:     ["parlais", "parlais", "parlait", "parlions", "parliez", "parlaient"],
      futur:         ["parlerai", "parleras", "parlera", "parlerons", "parlerez", "parleront"],
      conditionnel:  ["parlerais", "parlerais", "parlerait", "parlerions", "parleriez", "parleraient"],
      subjonctif:    ["parle", "parles", "parle", "parlions", "parliez", "parlent"]
    },
    {
      infinitive: "aimer", en: "to like / to love", group: "1", aux: "avoir", pp: "aime",
      present:       ["aime", "aimes", "aime", "aimons", "aimez", "aiment"],
      imparfait:     ["aimais", "aimais", "aimait", "aimions", "aimiez", "aimaient"],
      futur:         ["aimerai", "aimeras", "aimera", "aimerons", "aimerez", "aimeront"],
      conditionnel:  ["aimerais", "aimerais", "aimerait", "aimerions", "aimeriez", "aimeraient"],
      subjonctif:    ["aime", "aimes", "aime", "aimions", "aimiez", "aiment"]
    },
    {
      infinitive: "regarder", en: "to watch", group: "1", aux: "avoir", pp: "regarde",
      present:       ["regarde", "regardes", "regarde", "regardons", "regardez", "regardent"],
      imparfait:     ["regardais", "regardais", "regardait", "regardions", "regardiez", "regardaient"],
      futur:         ["regarderai", "regarderas", "regardera", "regarderons", "regarderez", "regarderont"],
      conditionnel:  ["regarderais", "regarderais", "regarderait", "regarderions", "regarderiez", "regarderaient"],
      subjonctif:    ["regarde", "regardes", "regarde", "regardions", "regardiez", "regardent"]
    },
    {
      infinitive: "ecouter", en: "to listen", group: "1", aux: "avoir", pp: "ecoute",
      present:       ["ecoute", "ecoutes", "ecoute", "ecoutons", "ecoutez", "ecoutent"],
      imparfait:     ["ecoutais", "ecoutais", "ecoutait", "ecoutions", "ecoutiez", "ecoutaient"],
      futur:         ["ecouterai", "ecouteras", "ecoutera", "ecouterons", "ecouterez", "ecouteront"],
      conditionnel:  ["ecouterais", "ecouterais", "ecouterait", "ecouterions", "ecouteriez", "ecouteraient"],
      subjonctif:    ["ecoute", "ecoutes", "ecoute", "ecoutions", "ecoutiez", "ecoutent"]
    },
    {
      infinitive: "manger", en: "to eat", group: "1", aux: "avoir", pp: "mange",
      present:       ["mange", "manges", "mange", "mangeons", "mangez", "mangent"],
      imparfait:     ["mangeais", "mangeais", "mangeait", "mangions", "mangiez", "mangeaient"],
      futur:         ["mangerai", "mangeras", "mangera", "mangerons", "mangerez", "mangeront"],
      conditionnel:  ["mangerais", "mangerais", "mangerait", "mangerions", "mangeriez", "mangeraient"],
      subjonctif:    ["mange", "manges", "mange", "mangions", "mangiez", "mangent"]
    },
    {
      infinitive: "travailler", en: "to work", group: "1", aux: "avoir", pp: "travaille",
      present:       ["travaille", "travailles", "travaille", "travaillons", "travaillez", "travaillent"],
      imparfait:     ["travaillais", "travaillais", "travaillait", "travaillions", "travailliez", "travaillaient"],
      futur:         ["travaillerai", "travailleras", "travaillera", "travaillerons", "travaillerez", "travailleront"],
      conditionnel:  ["travaillerais", "travaillerais", "travaillerait", "travaillerions", "travailleriez", "travailleraient"],
      subjonctif:    ["travaille", "travailles", "travaille", "travaillions", "travailliez", "travaillent"]
    },
    {
      infinitive: "acheter", en: "to buy", group: "1", aux: "avoir", pp: "achete",
      present:       ["achete", "achetes", "achete", "achetons", "achetez", "achetent"],
      imparfait:     ["achetais", "achetais", "achetait", "achetions", "achetiez", "achetaient"],
      futur:         ["acheterai", "acheteras", "achetera", "acheterons", "acheterez", "acheteront"],
      conditionnel:  ["acheterais", "acheterais", "acheterait", "acheterions", "acheteriez", "acheteraient"],
      subjonctif:    ["achete", "achetes", "achete", "achetions", "achetiez", "achetent"]
    },
    {
      infinitive: "commencer", en: "to begin", group: "1", aux: "avoir", pp: "commence",
      present:       ["commence", "commences", "commence", "commencons", "commencez", "commencent"],
      imparfait:     ["commencais", "commencais", "commencait", "commencions", "commenciez", "commencaient"],
      futur:         ["commencerai", "commenceras", "commencera", "commencerons", "commencerez", "commenceront"],
      conditionnel:  ["commencerais", "commencerais", "commencerait", "commencerions", "commenceriez", "commenceraient"],
      subjonctif:    ["commence", "commences", "commence", "commencions", "commenciez", "commencent"]
    },
    {
      infinitive: "penser", en: "to think", group: "1", aux: "avoir", pp: "pense",
      present:       ["pense", "penses", "pense", "pensons", "pensez", "pensent"],
      imparfait:     ["pensais", "pensais", "pensait", "pensions", "pensiez", "pensaient"],
      futur:         ["penserai", "penseras", "pensera", "penserons", "penserez", "penseront"],
      conditionnel:  ["penserais", "penserais", "penserait", "penserions", "penseriez", "penseraient"],
      subjonctif:    ["pense", "penses", "pense", "pensions", "pensiez", "pensent"]
    },
    {
      infinitive: "trouver", en: "to find", group: "1", aux: "avoir", pp: "trouve",
      present:       ["trouve", "trouves", "trouve", "trouvons", "trouvez", "trouvent"],
      imparfait:     ["trouvais", "trouvais", "trouvait", "trouvions", "trouviez", "trouvaient"],
      futur:         ["trouverai", "trouveras", "trouvera", "trouverons", "trouverez", "trouveront"],
      conditionnel:  ["trouverais", "trouverais", "trouverait", "trouverions", "trouveriez", "trouveraient"],
      subjonctif:    ["trouve", "trouves", "trouve", "trouvions", "trouviez", "trouvent"]
    },
    {
      infinitive: "donner", en: "to give", group: "1", aux: "avoir", pp: "donne",
      present:       ["donne", "donnes", "donne", "donnons", "donnez", "donnent"],
      imparfait:     ["donnais", "donnais", "donnait", "donnions", "donniez", "donnaient"],
      futur:         ["donnerai", "donneras", "donnera", "donnerons", "donnerez", "donneront"],
      conditionnel:  ["donnerais", "donnerais", "donnerait", "donnerions", "donneriez", "donneraient"],
      subjonctif:    ["donne", "donnes", "donne", "donnions", "donniez", "donnent"]
    },
    {
      infinitive: "appeler", en: "to call", group: "1", aux: "avoir", pp: "appele",
      present:       ["appelle", "appelles", "appelle", "appelons", "appelez", "appellent"],
      imparfait:     ["appelais", "appelais", "appelait", "appelions", "appeliez", "appelaient"],
      futur:         ["appellerai", "appelleras", "appellera", "appellerons", "appellerez", "appelleront"],
      conditionnel:  ["appellerais", "appellerais", "appellerait", "appellerions", "appelleriez", "appelleraient"],
      subjonctif:    ["appelle", "appelles", "appelle", "appelions", "appeliez", "appellent"]
    },
    {
      infinitive: "essayer", en: "to try", group: "1", aux: "avoir", pp: "essaye",
      present:       ["essaie", "essaies", "essaie", "essayons", "essayez", "essaient"],
      imparfait:     ["essayais", "essayais", "essayait", "essayions", "essayiez", "essayaient"],
      futur:         ["essaierai", "essaieras", "essaiera", "essaierons", "essaierez", "essaieront"],
      conditionnel:  ["essaierais", "essaierais", "essaierait", "essaierions", "essaieriez", "essaieraient"],
      subjonctif:    ["essaie", "essaies", "essaie", "essayions", "essayiez", "essaient"]
    },
    {
      infinitive: "payer", en: "to pay", group: "1", aux: "avoir", pp: "paye",
      present:       ["paie", "paies", "paie", "payons", "payez", "paient"],
      imparfait:     ["payais", "payais", "payait", "payions", "payiez", "payaient"],
      futur:         ["paierai", "paieras", "paiera", "paierons", "paierez", "paieront"],
      conditionnel:  ["paierais", "paierais", "paierait", "paierions", "paieriez", "paieraient"],
      subjonctif:    ["paie", "paies", "paie", "payions", "payiez", "paient"]
    },
    {
      infinitive: "voyager", en: "to travel", group: "1", aux: "avoir", pp: "voyage",
      present:       ["voyage", "voyages", "voyage", "voyageons", "voyagez", "voyagent"],
      imparfait:     ["voyageais", "voyageais", "voyageait", "voyagions", "voyagiez", "voyageaient"],
      futur:         ["voyagerai", "voyageras", "voyagera", "voyagerons", "voyagerez", "voyageront"],
      conditionnel:  ["voyagerais", "voyagerais", "voyagerait", "voyagerions", "voyageriez", "voyageraient"],
      subjonctif:    ["voyage", "voyages", "voyage", "voyagions", "voyagiez", "voyagent"]
    },

    // ─── Deuxieme groupe (-ir, -issons) ───────────────────────
    {
      infinitive: "finir", en: "to finish", group: "2", aux: "avoir", pp: "fini",
      present:       ["finis", "finis", "finit", "finissons", "finissez", "finissent"],
      imparfait:     ["finissais", "finissais", "finissait", "finissions", "finissiez", "finissaient"],
      futur:         ["finirai", "finiras", "finira", "finirons", "finirez", "finiront"],
      conditionnel:  ["finirais", "finirais", "finirait", "finirions", "finiriez", "finiraient"],
      subjonctif:    ["finisse", "finisses", "finisse", "finissions", "finissiez", "finissent"]
    },
    {
      infinitive: "choisir", en: "to choose", group: "2", aux: "avoir", pp: "choisi",
      present:       ["choisis", "choisis", "choisit", "choisissons", "choisissez", "choisissent"],
      imparfait:     ["choisissais", "choisissais", "choisissait", "choisissions", "choisissiez", "choisissaient"],
      futur:         ["choisirai", "choisiras", "choisira", "choisirons", "choisirez", "choisiront"],
      conditionnel:  ["choisirais", "choisirais", "choisirait", "choisirions", "choisiriez", "choisiraient"],
      subjonctif:    ["choisisse", "choisisses", "choisisse", "choisissions", "choisissiez", "choisissent"]
    },
    {
      infinitive: "reussir", en: "to succeed", group: "2", aux: "avoir", pp: "reussi",
      present:       ["reussis", "reussis", "reussit", "reussissons", "reussissez", "reussissent"],
      imparfait:     ["reussissais", "reussissais", "reussissait", "reussissions", "reussissiez", "reussissaient"],
      futur:         ["reussirai", "reussiras", "reussira", "reussirons", "reussirez", "reussiront"],
      conditionnel:  ["reussirais", "reussirais", "reussirait", "reussirions", "reussiriez", "reussiraient"],
      subjonctif:    ["reussisse", "reussisses", "reussisse", "reussissions", "reussissiez", "reussissent"]
    },
    {
      infinitive: "grandir", en: "to grow up", group: "2", aux: "avoir", pp: "grandi",
      present:       ["grandis", "grandis", "grandit", "grandissons", "grandissez", "grandissent"],
      imparfait:     ["grandissais", "grandissais", "grandissait", "grandissions", "grandissiez", "grandissaient"],
      futur:         ["grandirai", "grandiras", "grandira", "grandirons", "grandirez", "grandiront"],
      conditionnel:  ["grandirais", "grandirais", "grandirait", "grandirions", "grandiriez", "grandiraient"],
      subjonctif:    ["grandisse", "grandisses", "grandisse", "grandissions", "grandissiez", "grandissent"]
    },

    // ─── Pronominal ───────────────────────────────────────────
    {
      infinitive: "se lever", en: "to get up", group: "1", aux: "etre", pp: "leve",
      pronominal: true,
      present:       ["me leve", "te leves", "se leve", "nous levons", "vous levez", "se levent"],
      imparfait:     ["me levais", "te levais", "se levait", "nous levions", "vous leviez", "se levaient"],
      futur:         ["me leverai", "te leveras", "se levera", "nous leverons", "vous leverez", "se leveront"],
      conditionnel:  ["me leverais", "te leverais", "se leverait", "nous leverions", "vous leveriez", "se leveraient"],
      subjonctif:    ["me leve", "te leves", "se leve", "nous levions", "vous leviez", "se levent"]
    }
  ];

  // Verbes + prepositions : chaque entree est une phrase a completer
  const VERB_PREPOSITIONS = [
    { verb: "parler",        sentence: "Je parle ___ mon professeur.",          answer: "a",     options: ["a", "de", "avec", "chez"] },
    { verb: "parler",        sentence: "On parle souvent ___ ce sujet.",        answer: "de",    options: ["de", "a", "sur", "pour"] },
    { verb: "penser",        sentence: "Je pense ___ mes vacances.",            answer: "a",     options: ["a", "de", "sur", "pour"] },
    { verb: "penser",        sentence: "Que penses-tu ___ ce film ?",           answer: "de",    options: ["de", "a", "sur", "pour"] },
    { verb: "commencer",     sentence: "Il commence ___ pleuvoir.",             answer: "a",     options: ["a", "de", "par", "avec"] },
    { verb: "commencer",     sentence: "On commence ___ le debut.",             answer: "par",   options: ["par", "a", "de", "avec"] },
    { verb: "finir",         sentence: "On a fini ___ manger.",                 answer: "de",    options: ["de", "a", "par", "pour"] },
    { verb: "finir",         sentence: "Il a fini ___ comprendre.",             answer: "par",   options: ["par", "de", "a", "pour"] },
    { verb: "essayer",       sentence: "J'essaie ___ apprendre.",               answer: "d'",    options: ["d'", "a", "de", "pour"] },
    { verb: "decider",       sentence: "Elle a decide ___ partir.",             answer: "de",    options: ["de", "a", "pour", "par"] },
    { verb: "reussir",       sentence: "Il a reussi ___ parler en francais.",   answer: "a",     options: ["a", "de", "pour", "par"] },
    { verb: "continuer",     sentence: "Je continue ___ travailler.",           answer: "a",     options: ["a", "de", "par", "pour"] },
    { verb: "accepter",      sentence: "Elle accepte ___ aider.",               answer: "d'",    options: ["d'", "a", "pour", "sur"] },
    { verb: "refuser",       sentence: "Il refuse ___ repondre.",               answer: "de",    options: ["de", "a", "par", "pour"] },
    { verb: "oublier",       sentence: "N'oublie pas ___ fermer la porte.",     answer: "de",    options: ["de", "a", "par", "pour"] },
    { verb: "apprendre",     sentence: "J'apprends ___ conduire.",              answer: "a",     options: ["a", "de", "par", "avec"] },
    { verb: "jouer",         sentence: "On joue ___ foot le samedi.",           answer: "au",    options: ["au", "a", "du", "de"] },
    { verb: "jouer",         sentence: "Elle joue ___ piano depuis 5 ans.",     answer: "du",    options: ["du", "au", "de", "avec"] },
    { verb: "croire",        sentence: "Je crois ___ cette histoire.",          answer: "a",     options: ["a", "de", "en", "sur"] },
    { verb: "rever",         sentence: "Il reve ___ voyager partout.",          answer: "de",    options: ["de", "a", "par", "pour"] },
    { verb: "s'occuper",     sentence: "Je m'occupe ___ cette tache.",          answer: "de",    options: ["de", "a", "par", "pour"] },
    { verb: "s'interesser",  sentence: "Je m'interesse ___ la cuisine.",        answer: "a",     options: ["a", "de", "sur", "pour"] },
    { verb: "avoir besoin",  sentence: "J'ai besoin ___ repos.",                answer: "de",    options: ["de", "a", "pour", "par"] },
    { verb: "avoir envie",   sentence: "J'ai envie ___ sortir ce soir.",        answer: "de",    options: ["de", "a", "pour", "par"] }
  ];

  // Verbes + infinitif : choisir la bonne forme apres un verbe
  const VERB_INFINITIVE_QUESTIONS = [
    { sentence: "Je vais ___ mes amis demain.",            answer: "voir",      options: ["voir", "vu", "voyais", "verrai"]      },
    { sentence: "Nous devons ___ avant 18h.",              answer: "partir",    options: ["partir", "partons", "parti", "partais"]},
    { sentence: "Elle aime ___ au cinema.",                answer: "aller",     options: ["aller", "va", "allait", "allee"]      },
    { sentence: "Tu peux ___ plus fort ?",                 answer: "parler",    options: ["parler", "parles", "parle", "parlait"]},
    { sentence: "Je voudrais ___ un cafe.",                answer: "boire",     options: ["boire", "bu", "buvais", "bois"]       },
    { sentence: "Il faut ___ du sport regulierement.",     answer: "faire",     options: ["faire", "fait", "faisais", "fera"]    },
    { sentence: "Elle vient de ___ son projet.",           answer: "finir",     options: ["finir", "fini", "finit", "finira"]    },
    { sentence: "On va ___ nos vacances aujourd'hui.",     answer: "preparer",  options: ["preparer", "prepare", "prepares", "preparais"]},
    { sentence: "Tu dois ___ un peu plus souvent.",        answer: "ecouter",   options: ["ecouter", "ecoute", "ecoutais", "ecouterai"]},
    { sentence: "J'espere ___ en France l'ete prochain.",  answer: "aller",     options: ["aller", "va", "irai", "allais"]       }
  ];

  // Phrases au passe compose : deviner l'auxiliaire correct
  const AUX_QUESTIONS = [
    { verb: "aller",    sentence: "Elle ___ allee au cinema hier.",    aux: "etre",   options: ["est", "a"] },
    { verb: "manger",   sentence: "J'___ mange une pizza.",            aux: "avoir",  options: ["ai", "suis"] },
    { verb: "partir",   sentence: "Ils ___ partis tot ce matin.",      aux: "etre",   options: ["sont", "ont"] },
    { verb: "finir",    sentence: "Tu ___ fini tes devoirs ?",         aux: "avoir",  options: ["as", "es"] },
    { verb: "venir",    sentence: "Elle ___ venue avec nous.",         aux: "etre",   options: ["est", "a"] },
    { verb: "voir",     sentence: "Nous ___ vu un bon film.",          aux: "avoir",  options: ["avons", "sommes"] },
    { verb: "rentrer",  sentence: "Je ___ rentre tard hier soir.",     aux: "etre",   options: ["suis", "ai"] },
    { verb: "prendre",  sentence: "Vous ___ pris le train ?",          aux: "avoir",  options: ["avez", "etes"] },
    { verb: "rester",   sentence: "Ils ___ restes a la maison.",       aux: "etre",   options: ["sont", "ont"] },
    { verb: "ecrire",   sentence: "Elle ___ ecrit une lettre.",        aux: "avoir",  options: ["a", "est"] },
    { verb: "sortir",   sentence: "Mes amis ___ sortis hier soir.",    aux: "etre",   options: ["sont", "ont"] },
    { verb: "dire",     sentence: "Il ___ dit la verite.",             aux: "avoir",  options: ["a", "est"] },
    { verb: "tomber",   sentence: "Je ___ tombe dans la rue.",         aux: "etre",   options: ["suis", "ai"] },
    { verb: "arriver",  sentence: "Le train ___ arrive a l'heure.",    aux: "etre",   options: ["est", "a"] },
    { verb: "devenir",  sentence: "Elle ___ devenue medecin.",         aux: "etre",   options: ["est", "a"] },
    { verb: "vouloir",  sentence: "Nous ___ voulu essayer.",           aux: "avoir",  options: ["avons", "sommes"] },
    { verb: "mettre",   sentence: "Tu ___ mis ton manteau ?",          aux: "avoir",  options: ["as", "es"] },
    { verb: "naitre",   sentence: "Je ___ ne en 2005.",                aux: "etre",   options: ["suis", "ai"] }
  ];

  // ───────────────────────────────────────────────────────────
  //  TEMPS COMPOSES — generes a partir de l'auxiliaire + participe passe
  // ───────────────────────────────────────────────────────────

  const ETRE = VERBS.find(v => v.infinitive === 'etre');
  const AVOIR = VERBS.find(v => v.infinitive === 'avoir');

  // Pronoms reels affichables (pour l'accord en "etre")
  // Ordre: je, tu, il, nous, vous, ils — par defaut masculin singulier
  const PP_ENDINGS = ['', '', '', 's', 's', 's']; // pluriel = +s pour aux etre

  function applyPpAccord(pp, idx, aux) {
    if (aux !== 'etre') return pp;
    return pp + PP_ENDINGS[idx];
  }

  // elide "je", "te", "se", etc. devant voyelle
  function elide(prefix, next) {
    const startsVowel = /^[aeiouhAEIOUH]/.test(next);
    if (!startsVowel) return prefix + ' ' + next;
    if (prefix === 'je') return 'j\'' + next;
    if (prefix === 'me') return 'm\'' + next;
    if (prefix === 'te') return 't\'' + next;
    if (prefix === 'se') return 's\'' + next;
    return prefix + ' ' + next;
  }

  function compoundForm(verb, auxTense, idx) {
    const auxVerb = verb.aux === 'etre' ? ETRE : AVOIR;
    const auxConj = auxVerb[auxTense][idx];
    const pp = applyPpAccord(verb.pp, idx, verb.aux);

    // Verbes pronominaux : pronom reflechi + auxiliaire etre + participe
    if (verb.pronominal) {
      const pronouns = ['me', 'te', 'se', 'nous', 'vous', 'se'];
      const refl = pronouns[idx];
      const reflWithAux = elide(refl, auxConj);
      return reflWithAux + ' ' + pp;
    }
    // Aux + pp, avec elision je → j' devant voyelle (a, ai, etc.)
    return elide('', auxConj) === auxConj ? `${auxConj} ${pp}` : `${auxConj} ${pp}`;
  }

  // Helper: rend "je / j'" selon le verbe a l'aux
  function showWithPronoun(pronoun, form) {
    if (pronoun === 'je') {
      return /^[aeiouhAEIOUH]/.test(form) ? `j'${form}` : `je ${form}`;
    }
    return `${pronoun} ${form}`;
  }

  // Construit toutes les formes composees pour un verbe donne
  function buildCompoundTenses(verb) {
    const tenses = {};
    const map = {
      passeCompose:        'present',
      plusQueParfait:      'imparfait',
      futurAnterieur:      'futur',
      conditionnelPasse:   'conditionnel',
      subjonctifPasse:     'subjonctif'
    };
    for (const [name, auxTense] of Object.entries(map)) {
      tenses[name] = [0,1,2,3,4,5].map(i => compoundForm(verb, auxTense, i));
    }
    return tenses;
  }

  // Enrichi chaque verbe avec ses temps composes
  VERBS.forEach(v => {
    const compounds = buildCompoundTenses(v);
    Object.assign(v, compounds);
  });

  // Liste de TOUS les temps disponibles
  const ALL_TENSES = [
    { key: 'present',           label: 'Present',           type: 'simple' },
    { key: 'imparfait',         label: 'Imparfait',         type: 'simple' },
    { key: 'passeCompose',      label: 'Passe compose',     type: 'compose' },
    { key: 'plusQueParfait',    label: 'Plus-que-parfait',  type: 'compose' },
    { key: 'futur',             label: 'Futur simple',      type: 'simple' },
    { key: 'futurAnterieur',    label: 'Futur anterieur',   type: 'compose' },
    { key: 'conditionnel',      label: 'Conditionnel',      type: 'simple' },
    { key: 'conditionnelPasse', label: 'Conditionnel passe',type: 'compose' },
    { key: 'subjonctif',        label: 'Subjonctif present',type: 'simple' },
    { key: 'subjonctifPasse',   label: 'Subjonctif passe',  type: 'compose' }
  ];

  return { VERBS, PRONOUNS, VERB_PREPOSITIONS, VERB_INFINITIVE_QUESTIONS, AUX_QUESTIONS, ALL_TENSES, showWithPronoun };
})();
