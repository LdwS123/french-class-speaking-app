(function attachFrenchClassExtensions() {
  const data = window.FrenchClassData;

  if (!data || data.__contentExtended) {
    return;
  }

  data.__contentExtended = true;

  const extraPacks = [
    {
      id: "essential-verbs",
      title: "Verbes utiles",
      category: "Verbes utiles",
      levels: {
        B1: [
          "penser|to think",
          "croire|to believe",
          "aimer|to like",
          "parler|to speak",
          "changer|to change",
          "choisir|to choose",
          "payer|to pay"
        ],
        B2: [
          "expliquer|to explain",
          "comparer|to compare",
          "proposer|to suggest",
          "partager|to share",
          "eviter|to avoid",
          "reussir|to succeed",
          "organiser|to organize"
        ],
        C1: [
          "nuancer|to nuance",
          "justifier|to justify",
          "souligner|to highlight",
          "reformuler|to rephrase",
          "negocier|to negotiate",
          "ameliorer|to improve",
          "encourager|to encourage"
        ]
      }
    },
    {
      id: "conversation-tools",
      title: "Mots de conversation",
      category: "Conversation",
      levels: {
        B1: [
          "d'abord|first",
          "ensuite|then",
          "aussi|also",
          "souvent|often",
          "parfois|sometimes",
          "simple|simple",
          "important|important"
        ],
        B2: [
          "cependant|however",
          "par contre|on the other hand",
          "en general|in general",
          "par exemple|for example",
          "en fait|actually",
          "au final|in the end",
          "dans mon cas|in my case"
        ],
        C1: [
          "dans une certaine mesure|to a certain extent",
          "cela depend du contexte|it depends on the context",
          "si on regarde de plus pres|if we look more closely",
          "le point principal|the main point",
          "a long terme|in the long term",
          "en pratique|in practice",
          "en revanche|by contrast"
        ]
      }
    },
    {
      id: "prepositions-core",
      title: "Prepositions frequentes",
      category: "Prepositions",
      levels: {
        B1: [
          "a la fac|at university",
          "en ville|in town",
          "avec des amis|with friends",
          "pour les cours|for classes",
          "dans la chambre|in the room",
          "sur la table|on the table",
          "chez moi|at my place"
        ],
        B2: [
          "avant le cours|before class",
          "apres le travail|after work",
          "pendant la semaine|during the week",
          "grace a|thanks to",
          "a cause de|because of",
          "autour du campus|around campus",
          "pres de chez moi|near my home"
        ],
        C1: [
          "au lieu de|instead of",
          "par rapport a|compared with",
          "a partir de|starting from",
          "au sein de|within",
          "en fonction de|depending on",
          "a force de|from doing too much",
          "faute de temps|for lack of time"
        ]
      }
    },
    {
      id: "campus-life-pack",
      title: "Vie de campus",
      category: "Vie de campus",
      levels: {
        B1: [
          "un cours|class",
          "un prof|teacher",
          "un examen|exam",
          "la bibliotheque|library",
          "le campus|campus",
          "la cafet|cafeteria",
          "un devoir|assignment"
        ],
        B2: [
          "un job etudiant|student job",
          "une colocation|shared flat",
          "une bourse|scholarship",
          "un emploi du temps|schedule",
          "une charge de travail|workload",
          "la vie etudiante|student life",
          "un trajet quotidien|daily commute"
        ],
        C1: [
          "un rythme de travail|work rhythm",
          "un bon equilibre|good balance",
          "la pression universitaire|academic pressure",
          "un espace de travail|workspace",
          "un cadre de vie|living environment",
          "une contrainte financiere|financial constraint",
          "une habitude durable|sustainable habit"
        ]
      }
    },
    {
      id: "natural-french-pack",
      title: "Francais naturel",
      category: "Francais naturel",
      levels: {
        B1: [
          "ca marche|that works",
          "pas mal|not bad",
          "ca depend|it depends",
          "franchement|honestly",
          "ca aide|it helps",
          "j'avoue|I admit",
          "ca change|it changes things"
        ],
        B2: [
          "je suis creve|I am exhausted",
          "ca vaut le coup|it is worth it",
          "je suis a fond|I am fully into it",
          "ca me prend la tete|it annoys me",
          "je suis plutot pour|I am more in favor",
          "ca fait gagner du temps|it saves time",
          "on s'organise|we organize ourselves"
        ],
        C1: [
          "ce n'est pas l'ideal|it is not ideal",
          "ca pose un vrai probleme|it creates a real problem",
          "je vois ou tu veux en venir|I see what you mean",
          "on finit par s'habituer|you end up getting used to it",
          "ca change la donne|it changes the game",
          "c'est loin d'etre simple|it is far from simple",
          "ca demande de l'organisation|it requires organization"
        ]
      }
    }
  ];

  const extraTopics = [
    {
      id: "job-campus",
      category: "Vie etudiante",
      date: "2026",
      title: "Avoir un job sur le campus",
      lead: "Beaucoup d'etudiants cherchent un petit travail pour payer leurs depenses, mais cela peut aussi prendre du temps et de l'energie.",
      question: "Avoir un job sur le campus est-il une bonne idee ?",
      mission: "Parle du budget, du temps et du stress.",
      goalEn: "Talk about money, time and stress with a campus job.",
      rules: ["parle d'un avantage", "parle d'une limite", "donne ton avis"],
      starters: ["Pour moi, un job etudiant...", "C'est utile parce que...", "Le risque, c'est..."],
      angles: ["budget", "fatigue", "experience"],
      levels: {
        B1: ["un job|job", "gagner de l'argent|to earn money", "fatigue|tiredness", "utile|useful"],
        B2: ["payer ses depenses|to pay expenses", "manquer de temps|to run out of time", "une bonne experience|good experience", "etre stressant|to be stressful"],
        C1: ["un equilibre fragile|fragile balance", "une experience professionnelle|work experience", "une pression supplementaire|extra pressure", "un choix raisonnable|reasonable choice"]
      },
      coach: ["Give one advantage.", "Talk about money.", "Talk about one limit.", "End with your view."],
      accent: "#ff9b7e",
      accent2: "#7acbff"
    },
    {
      id: "roommate-bruit",
      category: "Colocation",
      date: "2026",
      title: "Un colocataire trop bruyant",
      lead: "En colocation, le bruit peut vite devenir un probleme, surtout quand les horaires ou les habitudes sont tres differents.",
      question: "Que faut-il faire avec un colocataire trop bruyant ?",
      mission: "Parle du respect, du dialogue et d'une solution simple.",
      goalEn: "Talk about respect, discussion and a simple solution with a noisy roommate.",
      rules: ["parle du probleme", "propose une solution", "reste calme"],
      starters: ["Le probleme principal...", "Je pense qu'il faut...", "Une bonne solution serait..."],
      angles: ["respect", "sommeil", "dialogue"],
      levels: {
        B1: ["un colocataire|roommate", "du bruit|noise", "dormir|to sleep", "parler|to talk"],
        B2: ["respecter les horaires|to respect schedules", "faire moins de bruit|to make less noise", "trouver un accord|to find an agreement", "rester calme|to stay calm"],
        C1: ["une regle commune|shared rule", "un probleme de cohabitation|cohabitation issue", "une discussion utile|useful conversation", "un compromis simple|simple compromise"]
      },
      coach: ["Describe the problem.", "Suggest a calm talk.", "Give one rule.", "End with a practical solution."],
      accent: "#8fd5c8",
      accent2: "#ff9f86"
    },
    {
      id: "covoiturage-campus",
      category: "Transport",
      date: "2026",
      title: "Faire du covoiturage pour aller en cours",
      lead: "Le covoiturage peut couter moins cher et etre pratique, mais il demande aussi de l'organisation et de la ponctualite.",
      question: "Le covoiturage est-il une bonne solution pour les etudiants ?",
      mission: "Compare le prix, l'organisation et la flexibilite.",
      goalEn: "Compare price, organization and flexibility with carpooling.",
      rules: ["compare deux points", "parle du prix", "donne ton avis"],
      starters: ["Le covoiturage peut etre...", "C'est interessant si...", "Mais ce n'est pas ideal quand..."],
      angles: ["prix", "horaires", "organisation"],
      levels: {
        B1: ["la voiture|car", "partager|to share", "moins cher|cheaper", "arriver|to arrive"],
        B2: ["partager les frais|to share costs", "respecter l'horaire|to respect the schedule", "etre pratique|to be practical", "gagner du temps|to save time"],
        C1: ["une solution economique|cost-effective solution", "une organisation precise|precise organization", "une flexibilite limitee|limited flexibility", "un choix collectif|collective choice"]
      },
      coach: ["Talk about cost.", "Talk about schedules.", "Give one limit.", "End with your opinion."],
      accent: "#7ab7ff",
      accent2: "#ffb56c"
    },
    {
      id: "meteo-humeur",
      category: "Vie quotidienne",
      date: "2026",
      title: "La meteo change-t-elle l'humeur ?",
      lead: "Certaines personnes disent qu'elles sont plus motivees quand il fait beau, alors que d'autres pensent que la meteo ne change pas grand-chose.",
      question: "La meteo influence-t-elle vraiment l'humeur ?",
      mission: "Parle de ton experience et donne un exemple simple.",
      goalEn: "Talk about how weather can affect mood and routine.",
      rules: ["donne ton experience", "donne un exemple", "termine clairement"],
      starters: ["Quand il fait beau...", "Dans mon cas...", "Je remarque que..."],
      angles: ["energie", "motivation", "routine"],
      levels: {
        B1: ["la pluie|rain", "le soleil|sun", "content|happy", "fatigue|tired"],
        B2: ["avoir plus d'energie|to have more energy", "etre motive|to be motivated", "changer l'humeur|to change mood", "rester chez soi|to stay home"],
        C1: ["un effet sur le moral|effect on mood", "une motivation variable|changing motivation", "une influence reelle|real influence", "une routine quotidienne|daily routine"]
      },
      coach: ["Start with your own experience.", "Give one example.", "Compare two weather situations.", "End with your view."],
      accent: "#8ee3ff",
      accent2: "#ffd279"
    },
    {
      id: "cuisine-maison",
      category: "Alimentation",
      date: "2026",
      title: "Cuisiner chez soi ou acheter dehors",
      lead: "Pour beaucoup d'etudiants, cuisiner prend du temps, mais acheter dehors coute vite cher et n'est pas toujours tres sain.",
      question: "Vaut-il mieux cuisiner chez soi ?",
      mission: "Parle du prix, du temps et de la sante.",
      goalEn: "Talk about cost, time and health with cooking at home.",
      rules: ["parle du prix", "parle du temps", "donne ton choix"],
      starters: ["Cuisiner chez soi...", "Acheter dehors, c'est...", "Pour moi, le plus important..."],
      angles: ["budget", "temps", "sante"],
      levels: {
        B1: ["cuisiner|to cook", "manger dehors|to eat out", "cher|expensive", "rapide|fast"],
        B2: ["preparer un repas|to prepare a meal", "faire des economies|to save money", "gagner du temps|to save time", "manger plus sainement|to eat more healthily"],
        C1: ["une habitude alimentaire|eating habit", "un choix economique|budget-friendly choice", "une organisation simple|simple organization", "un meilleur equilibre|better balance"]
      },
      coach: ["Talk about cost.", "Talk about time.", "Talk about health.", "End with your choice."],
      accent: "#ff9e73",
      accent2: "#9ad995"
    },
    {
      id: "dating-apps",
      category: "Societe numerique",
      date: "2026",
      title: "Les applications de rencontre",
      lead: "Les applis de rencontre sont tres presentes chez les jeunes adultes, mais tout le monde n'a pas la meme opinion sur leur utilite.",
      question: "Les applis de rencontre facilitent-elles vraiment les relations ?",
      mission: "Parle d'un avantage, d'un risque et d'une limite.",
      goalEn: "Talk about one benefit, one risk and one limit of dating apps.",
      rules: ["donne un avantage", "donne un risque", "reste general"],
      starters: ["Ces applis peuvent...", "Le probleme possible...", "Je pense que..."],
      angles: ["rencontre", "confiance", "image"],
      levels: {
        B1: ["une appli|app", "rencontrer|to meet", "parler|to talk", "profiler|profile"],
        B2: ["faire connaissance|to get to know someone", "gagner du temps|to save time", "faire attention|to be careful", "donner une bonne image|to give a good image"],
        C1: ["une relation serieuse|serious relationship", "une premiere impression|first impression", "une confiance limitee|limited trust", "une rencontre reelle|real-life meeting"]
      },
      coach: ["Give one positive point.", "Give one risk.", "Stay general.", "End with a balanced opinion."],
      accent: "#ff8db1",
      accent2: "#8bc8ff"
    },
    {
      id: "sport-apres-cours",
      category: "Sante",
      date: "2026",
      title: "Faire du sport apres les cours",
      lead: "Apres une longue journee, certaines personnes vont a la salle ou courent un peu, alors que d'autres preferent se reposer.",
      question: "Faire du sport apres les cours aide-t-il vraiment ?",
      mission: "Parle de l'energie, du temps et du bien-etre.",
      goalEn: "Talk about energy, time and well-being after class.",
      rules: ["parle d'un avantage", "parle d'une limite", "donne ton experience"],
      starters: ["Apres les cours, le sport...", "Cela aide parce que...", "Mais parfois..."],
      angles: ["energie", "fatigue", "habitude"],
      levels: {
        B1: ["le sport|sport", "courir|to run", "fatigue|tiredness", "se reposer|to rest"],
        B2: ["se sentir mieux|to feel better", "avoir moins de stress|to have less stress", "manquer d'energie|to lack energy", "prendre une bonne habitude|to build a good habit"],
        C1: ["un meilleur bien-etre|better well-being", "une routine utile|useful routine", "une limite physique|physical limit", "un bon rythme|good rhythm"]
      },
      coach: ["Talk about one benefit.", "Talk about time or energy.", "Use a personal example.", "End with your opinion."],
      accent: "#7fcfff",
      accent2: "#ffb370"
    },
    {
      id: "weekend-ville",
      category: "Loisirs",
      date: "2026",
      title: "Sortir ou rester tranquille le week-end",
      lead: "Le week-end, certains aiment sortir beaucoup, alors que d'autres preferent se reposer, cuisiner ou voir quelques amis calmement.",
      question: "Faut-il sortir pour profiter du week-end ?",
      mission: "Compare l'energie, le budget et le repos.",
      goalEn: "Compare going out and resting during the weekend.",
      rules: ["compare deux habitudes", "parle du budget", "donne ton choix"],
      starters: ["Le week-end, j'aime...", "Sortir peut etre bien parce que...", "Mais rester calme permet aussi de..."],
      angles: ["budget", "repos", "amis"],
      levels: {
        B1: ["sortir|to go out", "rester chez soi|to stay home", "se reposer|to rest", "des amis|friends"],
        B2: ["profiter du week-end|to enjoy the weekend", "depenser de l'argent|to spend money", "prendre du repos|to get rest", "voir du monde|to see people"],
        C1: ["un bon equilibre social|good social balance", "une depense evitable|avoidable expense", "un besoin de repos|need for rest", "une activite simple|simple activity"]
      },
      coach: ["Compare the two styles.", "Talk about budget.", "Talk about energy.", "End with your choice."],
      accent: "#ffae6a",
      accent2: "#8fc6ff"
    },
    {
      id: "retours-ligne",
      category: "Consommation",
      date: "2026",
      title: "Commander puis renvoyer en ligne",
      lead: "Certaines personnes commandent plusieurs articles, essaient chez elles puis renvoient ce qu'elles n'aiment pas.",
      question: "Renvoyer souvent des achats en ligne est-il normal ?",
      mission: "Parle du confort, du prix et des habitudes.",
      goalEn: "Talk about convenience, cost and habits with online returns.",
      rules: ["parle de la praticite", "parle d'une limite", "donne ton avis"],
      starters: ["C'est pratique quand...", "Mais renvoyer souvent...", "Je pense que..."],
      angles: ["praticite", "habitude", "cout"],
      levels: {
        B1: ["commander|to order", "renvoyer|to return", "facile|easy", "choisir|to choose"],
        B2: ["essayer chez soi|to try at home", "faire attention|to be careful", "un achat inutile|useless purchase", "prendre une habitude|to build a habit"],
        C1: ["une habitude de consommation|consumer habit", "un confort excessif|too much convenience", "un choix raisonnable|reasonable choice", "une pratique banale|common practice"]
      },
      coach: ["Talk about convenience.", "Give one limit.", "Talk about habits.", "End with your opinion."],
      accent: "#ff8fa0",
      accent2: "#8fd7ff"
    },
    {
      id: "retards-bus",
      category: "Transport",
      date: "2026",
      title: "Les retards de bus ou de metro",
      lead: "Quand les transports ont du retard, toute la journee peut devenir plus stressante, surtout pour les etudiants qui ont un cours ou un examen.",
      question: "Les retards de transport changent-ils vraiment la journee ?",
      mission: "Parle du stress, du temps et d'une solution.",
      goalEn: "Talk about stress, time and one solution when transport is late.",
      rules: ["parle du probleme", "parle du temps", "propose une solution"],
      starters: ["Quand le bus est en retard...", "Le probleme, c'est...", "Une bonne solution serait..."],
      angles: ["stress", "temps", "organisation"],
      levels: {
        B1: ["le bus|bus", "en retard|late", "attendre|to wait", "stresse|stressed"],
        B2: ["perdre du temps|to lose time", "arriver en retard|to arrive late", "partir plus tot|to leave earlier", "mieux s'organiser|to organize better"],
        C1: ["une source de stress|source of stress", "un contretemps|setback", "une marge de securite|safety margin", "une mauvaise surprise|bad surprise"]
      },
      coach: ["Describe the problem.", "Talk about time.", "Suggest one solution.", "End with a simple conclusion."],
      accent: "#7ebcff",
      accent2: "#ffb870"
    },
    {
      id: "musique-etudes",
      category: "Etudes",
      date: "2026",
      title: "Ecouter de la musique pour etudier",
      lead: "Pour certaines personnes, la musique aide a se concentrer. Pour d'autres, elle distrait et ralentit le travail.",
      question: "La musique aide-t-elle vraiment a etudier ?",
      mission: "Parle de la concentration, du type de musique et de ton experience.",
      goalEn: "Talk about concentration, music type and your own study habits.",
      rules: ["parle d'un avantage", "parle d'une limite", "donne un exemple"],
      starters: ["Quand j'etudie...", "La musique aide si...", "Mais cela distrait quand..."],
      angles: ["concentration", "habitude", "ambiance"],
      levels: {
        B1: ["la musique|music", "etudier|to study", "calme|calm", "ecouter|to listen"],
        B2: ["se concentrer|to focus", "une musique douce|soft music", "etre distrait|to be distracted", "travailler plus vite|to work faster"],
        C1: ["une ambiance de travail|study atmosphere", "un niveau de concentration|level of focus", "une habitude efficace|effective habit", "une distraction possible|possible distraction"]
      },
      coach: ["Talk about your own habit.", "Mention music style.", "Give one limit.", "End with your opinion."],
      accent: "#9c8cff",
      accent2: "#ffb089"
    },
    {
      id: "sorties-couteuses",
      category: "Budget",
      date: "2026",
      title: "Les sorties qui coutent trop cher",
      lead: "Entre restaurants, concerts et cafes, certaines sorties peuvent vite couter cher pour un etudiant.",
      question: "Faut-il limiter les sorties pour proteger son budget ?",
      mission: "Parle du plaisir, du budget et d'une bonne limite.",
      goalEn: "Talk about fun, money and setting limits on spending.",
      rules: ["parle du plaisir", "parle de l'argent", "donne une limite"],
      starters: ["Sortir, c'est important parce que...", "Mais cela coute cher quand...", "Pour moi, il faut..."],
      angles: ["plaisir", "depenses", "equilibre"],
      levels: {
        B1: ["sortir|to go out", "cher|expensive", "payer|to pay", "limiter|to limit"],
        B2: ["faire attention au budget|to watch the budget", "depenser trop|to spend too much", "se faire plaisir|to treat yourself", "garder un equilibre|to keep balance"],
        C1: ["une depense de loisir|leisure expense", "une limite raisonnable|reasonable limit", "un choix de priorite|priority choice", "un budget serre|tight budget"]
      },
      coach: ["Talk about fun.", "Talk about cost.", "Give one limit.", "End with your view."],
      accent: "#ff9d71",
      accent2: "#8fd4d4"
    },
    {
      id: "voyage-petit-budget",
      category: "Voyage",
      date: "2026",
      title: "Voyager avec un petit budget",
      lead: "Beaucoup d'etudiants aiment voyager un peu, mais ils doivent souvent chercher des solutions moins cheres pour partir.",
      question: "Peut-on vraiment bien voyager avec un petit budget ?",
      mission: "Parle du prix, de l'organisation et des compromis.",
      goalEn: "Talk about price, planning and compromises in budget travel.",
      rules: ["parle du prix", "parle d'un compromis", "donne un exemple"],
      starters: ["Avec un petit budget...", "Il faut souvent...", "Un bon compromis, c'est..."],
      angles: ["prix", "transport", "organisation"],
      levels: {
        B1: ["voyager|to travel", "un billet|ticket", "pas cher|cheap", "dormir|to sleep"],
        B2: ["chercher une bonne offre|to look for a good deal", "reserver tot|to book early", "accepter un compromis|to accept a compromise", "faire un petit budget|to make a small budget"],
        C1: ["une organisation en avance|early planning", "un sejour modeste|modest trip", "une depense controlee|controlled spending", "une experience reussie|successful experience"]
      },
      coach: ["Talk about cost.", "Talk about planning.", "Mention one compromise.", "End with your opinion."],
      accent: "#8fd7ff",
      accent2: "#ffbf74"
    },
    {
      id: "courses-supermarche",
      category: "Vie quotidienne",
      date: "2026",
      title: "Faire les courses une fois par semaine",
      lead: "Certaines personnes preferent faire de grosses courses une seule fois, alors que d'autres achetent un peu chaque jour.",
      question: "Faire les courses une fois par semaine est-il plus pratique ?",
      mission: "Compare le temps, le budget et l'organisation.",
      goalEn: "Compare time, money and organization with weekly shopping.",
      rules: ["compare deux habitudes", "parle du budget", "donne ton choix"],
      starters: ["Faire les courses une fois par semaine...", "Acheter un peu chaque jour...", "Pour moi, le plus pratique..."],
      angles: ["temps", "budget", "organisation"],
      levels: {
        B1: ["les courses|shopping", "une liste|list", "pratique|practical", "acheter|to buy"],
        B2: ["gagner du temps|to save time", "depenser moins|to spend less", "mieux s'organiser|to organize better", "oublier un produit|to forget an item"],
        C1: ["une habitude utile|useful habit", "une organisation stable|stable organization", "une depense mieux controlee|better controlled spending", "un achat inutile|unnecessary purchase"]
      },
      coach: ["Compare two habits.", "Talk about time.", "Talk about money.", "End with your choice."],
      accent: "#9be08d",
      accent2: "#7dbfff"
    },
    {
      id: "linge-coloc",
      category: "Colocation",
      date: "2026",
      title: "Partager les taches a la maison",
      lead: "En colocation, le menage, la cuisine ou la lessive peuvent vite devenir des sujets sensibles si les regles ne sont pas claires.",
      question: "Faut-il un planning pour les taches en colocation ?",
      mission: "Parle de l'organisation, du respect et d'une regle simple.",
      goalEn: "Talk about organization, respect and house rules in a shared flat.",
      rules: ["parle d'une regle", "parle du respect", "donne une solution"],
      starters: ["En colocation, il faut...", "Un planning peut aider parce que...", "La regle la plus utile..."],
      angles: ["organisation", "respect", "routine"],
      levels: {
        B1: ["le menage|cleaning", "la cuisine|cooking", "la lessive|laundry", "partager|to share"],
        B2: ["faire sa part|to do your part", "respecter les regles|to respect the rules", "avoir un planning|to have a schedule", "eviter les conflits|to avoid conflict"],
        C1: ["une regle de vie commune|shared living rule", "une source de tension|source of tension", "une organisation claire|clear organization", "un cadre utile|useful framework"]
      },
      coach: ["Talk about chores.", "Suggest one rule.", "Talk about respect.", "End with a practical solution."],
      accent: "#ff9f88",
      accent2: "#90d3ff"
    },
    {
      id: "reseaux-sociaux-bonheur",
      category: "Societe numerique",
      date: "2026",
      title: "Les reseaux sociaux rendent-ils heureux ?",
      lead: "On passe de plus en plus de temps sur les reseaux. Certains disent que cela amuse et connecte, d'autres pensent que cela rend anxieux.",
      question: "Les reseaux sociaux rendent-ils vraiment les jeunes heureux ?",
      mission: "Parle d'un bon cote, d'un mauvais cote et donne un conseil.",
      goalEn: "Share one upside, one downside and give a simple piece of advice.",
      rules: ["parle d'un plaisir", "parle d'un risque", "donne un conseil"],
      starters: ["Sur les reseaux, j'aime...", "Ce qui me derange, c'est...", "Mon conseil serait..."],
      angles: ["comparaison", "amitie en ligne", "temps d'ecran"],
      levels: {
        B1: ["un reseau social|social media", "une photo|photo", "suivre|to follow", "comparer|to compare"],
        B2: ["passer trop de temps|to spend too much time", "se comparer aux autres|to compare yourself", "un contenu positif|positive content", "une amitie en ligne|online friendship"],
        C1: ["une dependance emotionnelle|emotional dependency", "un bien-etre numerique|digital well-being", "une identite en ligne|online identity", "une pression sociale|social pressure"]
      },
      coach: ["Share one pleasure.", "Share one risk.", "Use a short example.", "End with a healthy habit."],
      accent: "#f37aa6",
      accent2: "#7fe2d0"
    },
    {
      id: "intelligence-artificielle-metiers",
      category: "Technologie",
      date: "2026",
      title: "L'IA va-t-elle remplacer certains metiers ?",
      lead: "L'IA fait deja des traductions, ecrit des textes et aide a coder. Beaucoup de jeunes se demandent quels metiers vont changer ou disparaitre.",
      question: "Faut-il avoir peur de l'IA pour son futur metier ?",
      mission: "Choisis un metier, dis ce que l'IA va changer, et propose une competence humaine a garder.",
      goalEn: "Pick a job, say what AI will change, and name one human skill that stays.",
      rules: ["nomme un metier", "dis un impact", "donne une competence humaine"],
      starters: ["Pour le metier de...", "L'IA va surement...", "Ce que l'humain garde, c'est..."],
      angles: ["traduction", "service client", "creativite"],
      levels: {
        B1: ["un metier|job", "remplacer|to replace", "utile|useful", "un ordinateur|computer"],
        B2: ["automatiser une tache|to automate a task", "perdre son travail|to lose your job", "une competence utile|useful skill", "s'adapter|to adapt"],
        C1: ["une transformation du marche|market transformation", "une competence humaine|human skill", "une reconversion professionnelle|career change", "un avantage competitif|competitive advantage"]
      },
      coach: ["Pick one job.", "Say what AI changes.", "Give a human skill.", "End with advice."],
      accent: "#7fb9ff",
      accent2: "#ffc174"
    },
    {
      id: "lire-ou-regarder",
      category: "Culture",
      date: "2026",
      title: "Lire un livre ou regarder l'adaptation",
      lead: "Beaucoup de films et series sont adaptes de livres. Certains preferent lire d'abord, d'autres foncent sur l'ecran.",
      question: "Est-il mieux de lire le livre avant de voir l'adaptation ?",
      mission: "Compare les deux experiences et donne ta preference.",
      goalEn: "Compare book and film/show, and share your preference.",
      rules: ["compare deux formats", "parle de l'imagination", "donne un exemple precis"],
      starters: ["Dans un livre...", "Dans un film...", "Je prefere... parce que..."],
      angles: ["imagination", "rythme", "fidelite"],
      levels: {
        B1: ["un livre|book", "un film|movie", "une serie|series", "imaginer|to imagine"],
        B2: ["une adaptation|adaptation", "changer l'histoire|to change the story", "prendre son temps|to take your time", "etre fidele|to be faithful"],
        C1: ["une fidelite a l'oeuvre|faithful to the source", "un rythme narratif|narrative pace", "une liberte creative|creative freedom", "une richesse du texte|richness of the text"]
      },
      coach: ["Compare the two.", "Talk about imagination.", "Use a precise example.", "End with your preference."],
      accent: "#c88fff",
      accent2: "#ffd67a"
    },
    {
      id: "sommeil-etudiants",
      category: "Sante",
      date: "2026",
      title: "Les etudiants dorment-ils assez ?",
      lead: "Entre les devoirs, les ecrans et les sorties, beaucoup d'etudiants dorment moins de 7 heures. Cela touche la concentration et l'humeur.",
      question: "Pourquoi est-il si difficile pour un etudiant de bien dormir ?",
      mission: "Donne trois causes et une solution simple.",
      goalEn: "Give three causes and one simple fix.",
      rules: ["donne trois causes", "parle de la concentration", "propose une solution"],
      starters: ["Dormir est difficile quand...", "La premiere cause, c'est...", "Une solution simple serait..."],
      angles: ["ecrans", "stress", "horaires"],
      levels: {
        B1: ["dormir|to sleep", "fatigue|tired", "un ecran|screen", "une heure|hour"],
        B2: ["se coucher tard|to go to bed late", "manquer de sommeil|to lack sleep", "avoir du mal a dormir|to struggle to sleep", "une bonne habitude|good habit"],
        C1: ["un cycle de sommeil|sleep cycle", "une dette de sommeil|sleep debt", "une routine du soir|evening routine", "un impact sur la concentration|impact on focus"]
      },
      coach: ["Give three causes.", "Mention focus.", "Give one fix.", "End with a short rule."],
      accent: "#8ad1f4",
      accent2: "#ffb87e"
    },
    {
      id: "cash-ou-carte",
      category: "Argent",
      date: "2026",
      title: "Payer en cash ou en carte",
      lead: "La carte est partout, mais certaines personnes disent qu'elles depensent trop quand elles ne voient pas l'argent.",
      question: "Vaut-il mieux payer en cash ou en carte pour son budget ?",
      mission: "Compare les deux et dis quand chacun est mieux.",
      goalEn: "Compare cash and card, and say when each is better.",
      rules: ["compare les deux", "parle du budget", "donne un exemple"],
      starters: ["En cash, on...", "Avec la carte, on...", "Pour moi, le mieux, c'est..."],
      angles: ["controle", "rapidite", "securite"],
      levels: {
        B1: ["payer|to pay", "une carte|card", "de l'argent|money", "une depense|expense"],
        B2: ["suivre son budget|to follow your budget", "depenser trop|to overspend", "etre pratique|to be convenient", "perdre de l'argent|to lose money"],
        C1: ["une consommation impulsive|impulsive spending", "un controle budgetaire|budget control", "une securite financiere|financial security", "un suivi precis|precise tracking"]
      },
      coach: ["Compare both.", "Talk about budget.", "Give one example.", "End with your choice."],
      accent: "#9be08d",
      accent2: "#ffcc6f"
    },
    {
      id: "sport-en-salle",
      category: "Sport",
      date: "2026",
      title: "S'inscrire a une salle de sport",
      lead: "Beaucoup de gens prennent un abonnement en janvier puis arretent en fevrier. Est-ce vraiment utile ?",
      question: "Vaut-il la peine de s'inscrire dans une salle de sport ?",
      mission: "Parle du prix, de la motivation et propose une alternative.",
      goalEn: "Talk about cost, motivation and propose one alternative.",
      rules: ["parle du prix", "parle de la motivation", "propose une alternative"],
      starters: ["L'abonnement coute...", "Le probleme de motivation...", "Une autre solution serait..."],
      angles: ["prix", "regularite", "communaute"],
      levels: {
        B1: ["le sport|sport", "une salle|gym", "payer|to pay", "s'entrainer|to work out"],
        B2: ["prendre un abonnement|to take a subscription", "manquer de motivation|to lack motivation", "etre regulier|to be consistent", "gagner du muscle|to build muscle"],
        C1: ["une routine sportive|fitness routine", "un investissement a long terme|long-term investment", "une assiduite difficile|hard consistency", "un cadre motivant|motivating environment"]
      },
      coach: ["Talk about price.", "Talk about regularity.", "Propose an alternative.", "End with your view."],
      accent: "#ff9f6b",
      accent2: "#8fd9c2"
    },
    {
      id: "amitie-distance",
      category: "Relations",
      date: "2026",
      title: "Garder ses amis a distance",
      lead: "Avec les etudes, beaucoup d'etudiants vivent loin de leur famille et des amis d'enfance. Garder le lien demande de l'effort.",
      question: "Comment rester proche d'un ami quand on vit loin ?",
      mission: "Donne deux idees concretes pour maintenir l'amitie.",
      goalEn: "Give two concrete ideas to maintain a long-distance friendship.",
      rules: ["donne deux idees", "parle de la regularite", "termine avec un conseil"],
      starters: ["Pour rester proche...", "Une idee qui marche bien...", "Mon meilleur conseil..."],
      angles: ["appels", "visites", "souvenirs"],
      levels: {
        B1: ["un ami|friend", "appeler|to call", "loin|far", "voir|to see"],
        B2: ["garder contact|to stay in touch", "s'envoyer des messages|to send messages", "prevoir une visite|to plan a visit", "manquer a quelqu'un|to miss someone"],
        C1: ["entretenir un lien|to maintain a bond", "une amitie durable|lasting friendship", "une distance geographique|geographic distance", "un moment partage|shared moment"]
      },
      coach: ["Give two ideas.", "Talk about regularity.", "Use an example.", "End with advice."],
      accent: "#f4a5ff",
      accent2: "#9adcff"
    },
    {
      id: "ecologie-etudiant",
      category: "Environnement",
      date: "2026",
      title: "L'ecologie au quotidien",
      lead: "Trier ses dechets, prendre le velo, manger moins de viande : beaucoup de petits gestes sont possibles, mais ils demandent du temps.",
      question: "Un etudiant peut-il vraiment agir pour la planete au quotidien ?",
      mission: "Propose trois gestes simples et explique celui qui est le plus efficace.",
      goalEn: "Propose three simple actions and say which one matters most.",
      rules: ["donne trois gestes", "parle de l'impact", "donne ton avis"],
      starters: ["Un premier geste, c'est...", "Ensuite, on peut...", "Pour moi, le plus utile..."],
      angles: ["transport", "alimentation", "dechets"],
      levels: {
        B1: ["le velo|bike", "trier|to sort", "la planete|planet", "proteger|to protect"],
        B2: ["reduire ses dechets|to reduce waste", "limiter la voiture|to limit car use", "consommer local|to buy local", "eviter le plastique|to avoid plastic"],
        C1: ["un impact environnemental|environmental impact", "une consommation responsable|responsible consumption", "une empreinte carbone|carbon footprint", "un changement durable|sustainable change"]
      },
      coach: ["Give three actions.", "Explain one impact.", "Share your opinion.", "End clearly."],
      accent: "#9be48d",
      accent2: "#7fb9ff"
    },
    {
      id: "fete-nationale",
      category: "Culture",
      date: "2026",
      title: "Feter une fete de son pays a l'etranger",
      lead: "Quand on vit a l'etranger, fetes et traditions peuvent manquer. Certains organisent un petit repas, d'autres oublient la date.",
      question: "Faut-il continuer de feter les fetes de son pays quand on vit ailleurs ?",
      mission: "Parle d'une fete, de ce qui manque, et de ce que tu ferais.",
      goalEn: "Talk about a holiday, what's missing abroad, and what you would do.",
      rules: ["nomme une fete", "parle d'une tradition", "donne ton choix"],
      starters: ["Dans mon pays, on fete...", "Ce qui me manque, c'est...", "Ici, je pourrais..."],
      angles: ["famille", "nourriture", "identite"],
      levels: {
        B1: ["une fete|holiday", "une tradition|tradition", "la famille|family", "manger|to eat"],
        B2: ["preparer un repas|to prepare a meal", "garder les traditions|to keep traditions", "partager avec des amis|to share with friends", "se sentir chez soi|to feel at home"],
        C1: ["un heritage culturel|cultural heritage", "une identite personnelle|personal identity", "un rituel annuel|yearly ritual", "une adaptation a l'etranger|adapting abroad"]
      },
      coach: ["Name one holiday.", "Mention a tradition.", "Say what's missing.", "End with your plan."],
      accent: "#ffb47a",
      accent2: "#b29eff"
    },
    {
      id: "prof-severe",
      category: "Ecole",
      date: "2026",
      title: "Un prof severe ou cool ?",
      lead: "Certains preferent un prof tres strict qui pousse a travailler, d'autres preferent un prof decontracte qui met a l'aise.",
      question: "Un prof severe fait-il vraiment mieux progresser ?",
      mission: "Compare les deux styles et dis lequel a marche pour toi.",
      goalEn: "Compare strict and relaxed teachers and say which worked for you.",
      rules: ["compare deux styles", "parle de la motivation", "donne un exemple"],
      starters: ["Avec un prof severe...", "Avec un prof cool...", "Dans mon cas..."],
      angles: ["discipline", "confiance", "progres"],
      levels: {
        B1: ["un prof|teacher", "severe|strict", "cool|relaxed", "apprendre|to learn"],
        B2: ["mettre la pression|to put pressure", "mettre a l'aise|to make comfortable", "progresser vite|to progress fast", "manquer de serieux|to lack seriousness"],
        C1: ["une exigence elevee|high expectations", "un climat bienveillant|supportive climate", "une autorite naturelle|natural authority", "un impact sur la motivation|impact on motivation"]
      },
      coach: ["Compare the two.", "Talk about motivation.", "Use an example.", "End with your opinion."],
      accent: "#ff8ca3",
      accent2: "#9dd9ff"
    },
    {
      id: "voyage-solo",
      category: "Voyage",
      date: "2026",
      title: "Voyager seul pour la premiere fois",
      lead: "Voyager seul fait parfois peur, mais aussi grandir. On choisit ses horaires, on rencontre des gens et on sort de sa zone de confort.",
      question: "Voyager seul est-il une bonne idee pour un jeune ?",
      mission: "Parle d'un avantage, d'une peur et donne un conseil de securite.",
      goalEn: "Talk about a benefit, a fear and give one safety tip.",
      rules: ["parle d'un avantage", "parle d'une peur", "donne un conseil"],
      starters: ["Voyager seul permet de...", "Ce qui fait peur, c'est...", "Mon conseil, c'est..."],
      angles: ["autonomie", "securite", "rencontres"],
      levels: {
        B1: ["voyager|to travel", "seul|alone", "peur|fear", "decouvrir|to discover"],
        B2: ["gagner en autonomie|to gain independence", "sortir de sa zone|to leave your comfort zone", "rencontrer des gens|to meet people", "etre prudent|to be careful"],
        C1: ["un sentiment de liberte|feeling of freedom", "une prise de confiance|confidence boost", "une precaution de securite|safety precaution", "une experience formatrice|formative experience"]
      },
      coach: ["Give one upside.", "Name one fear.", "Add a safety tip.", "End with a clear take."],
      accent: "#8ce0d0",
      accent2: "#ffb37a"
    },
    {
      id: "apprendre-cuisiner",
      category: "Vie quotidienne",
      date: "2026",
      title: "Apprendre a cuisiner quand on est etudiant",
      lead: "Cuisiner fait economiser de l'argent et mieux manger, mais beaucoup d'etudiants manquent de temps ou d'envie.",
      question: "Faut-il absolument apprendre a cuisiner quand on est etudiant ?",
      mission: "Parle du budget, de la sante et propose un premier plat a essayer.",
      goalEn: "Talk about budget, health and propose a first dish to try.",
      rules: ["parle du budget", "parle de la sante", "propose un plat"],
      starters: ["Cuisiner soi-meme permet de...", "Pour la sante...", "Un plat facile a commencer..."],
      angles: ["economies", "sante", "motivation"],
      levels: {
        B1: ["cuisiner|to cook", "un plat|dish", "facile|easy", "acheter|to buy"],
        B2: ["preparer un repas|to prepare a meal", "suivre une recette|to follow a recipe", "manger equilibre|to eat balanced", "gagner du temps|to save time"],
        C1: ["une alimentation equilibree|balanced diet", "une autonomie alimentaire|food self-sufficiency", "un gout du fait-maison|love of homemade", "une gestion du temps|time management"]
      },
      coach: ["Talk about money.", "Talk about health.", "Propose one dish.", "End with advice."],
      accent: "#ffcf6f",
      accent2: "#9be2a8"
    },
    {
      id: "ecrans-enfants",
      category: "Societe numerique",
      date: "2026",
      title: "Les enfants et les ecrans",
      lead: "Certains parents donnent tres tot une tablette aux enfants, d'autres attendent plus longtemps. Ce debat divise les familles.",
      question: "A quel age faut-il donner un ecran a un enfant ?",
      mission: "Propose un age et justifie avec deux raisons simples.",
      goalEn: "Suggest an age and defend it with two simple reasons.",
      rules: ["propose un age", "donne deux raisons", "nuance ta position"],
      starters: ["Je pense qu'avant... ans...", "La premiere raison, c'est...", "Mais cela depend aussi de..."],
      angles: ["developpement", "controle parental", "usages educatifs"],
      levels: {
        B1: ["un enfant|child", "un ecran|screen", "jouer|to play", "limiter|to limit"],
        B2: ["passer du temps|to spend time", "trouver un equilibre|to find a balance", "un contenu adapte|suitable content", "etre surveille|to be supervised"],
        C1: ["un usage encadre|supervised use", "un developpement cognitif|cognitive development", "une exposition precoce|early exposure", "une limite raisonnable|reasonable limit"]
      },
      coach: ["Give an age.", "Give two reasons.", "Nuance your view.", "End with advice."],
      accent: "#7fcaff",
      accent2: "#ffad8d"
    },
    {
      id: "benevolat",
      category: "Engagement",
      date: "2026",
      title: "Faire du benevolat pendant ses etudes",
      lead: "Le benevolat peut donner du sens, developper des competences et aider les autres, mais il demande aussi du temps.",
      question: "Le benevolat vaut-il la peine pendant les etudes ?",
      mission: "Nomme une cause, parle d'un apprentissage et d'une contrainte.",
      goalEn: "Name a cause, speak about one lesson learned and one constraint.",
      rules: ["nomme une cause", "parle d'un apprentissage", "parle d'une contrainte"],
      starters: ["J'aimerais aider...", "On y apprend...", "Le probleme principal, c'est..."],
      angles: ["sens", "competences", "temps"],
      levels: {
        B1: ["aider|to help", "les autres|others", "une association|organization", "du temps|time"],
        B2: ["s'engager dans une cause|to commit to a cause", "gagner de l'experience|to gain experience", "manquer de temps|to lack time", "rencontrer des gens|to meet people"],
        C1: ["un engagement associatif|community engagement", "une competence transversale|transferable skill", "un impact social|social impact", "une gestion du temps|time management"]
      },
      coach: ["Name one cause.", "Say what you learn.", "Mention a limit.", "End with your view."],
      accent: "#e7a6ff",
      accent2: "#9be8a8"
    },
    {
      id: "musees-jeunes",
      category: "Culture",
      date: "2026",
      title: "Les musees interessent-ils les jeunes ?",
      lead: "Certains trouvent les musees lents et fatigants, mais d'autres y vont pour des expositions originales ou gratuites.",
      question: "Comment rendre les musees plus attractifs pour les jeunes ?",
      mission: "Propose deux idees pour moderniser la visite d'un musee.",
      goalEn: "Propose two ideas to make museum visits more appealing.",
      rules: ["donne deux idees", "parle d'un exemple", "utilise un mot culturel"],
      starters: ["Un musee pourrait...", "Par exemple...", "Les jeunes aimeraient si..."],
      angles: ["numerique", "gratuit", "interactif"],
      levels: {
        B1: ["un musee|museum", "visiter|to visit", "l'art|art", "interessant|interesting"],
        B2: ["une exposition|exhibition", "attirer les jeunes|to attract young people", "etre gratuit|to be free", "proposer un atelier|to offer a workshop"],
        C1: ["une mediation culturelle|cultural mediation", "une experience immersive|immersive experience", "un parcours interactif|interactive tour", "une accessibilite elargie|broader access"]
      },
      coach: ["Give two ideas.", "Use a concrete example.", "Explain the appeal.", "End with your preference."],
      accent: "#c99dff",
      accent2: "#ffc67a"
    },
    {
      id: "verite-ou-mensonge",
      category: "Ethique",
      date: "2026",
      title: "Un petit mensonge peut-il etre utile ?",
      lead: "Dire la verite est souvent une valeur forte, mais parfois un petit mensonge peut eviter un conflit ou rassurer quelqu'un.",
      question: "Faut-il toujours dire la verite, meme quand cela blesse ?",
      mission: "Donne ta position, un cas ou mentir peut aider et une limite claire.",
      goalEn: "State your view, give a case where lying helps and set a clear limit.",
      rules: ["donne ta position", "donne un cas concret", "pose une limite"],
      starters: ["En general, je pense...", "Par exemple, si...", "Mais il y a une limite..."],
      angles: ["respect", "gentillesse", "honnetete"],
      levels: {
        B1: ["mentir|to lie", "la verite|truth", "gentil|kind", "aider|to help"],
        B2: ["eviter un conflit|to avoid a conflict", "dire la verite|to tell the truth", "rassurer quelqu'un|to reassure someone", "cacher une information|to hide information"],
        C1: ["une honnetete totale|complete honesty", "un mensonge pieux|white lie", "une nuance morale|moral nuance", "une relation de confiance|relationship of trust"]
      },
      coach: ["State your view.", "Give one case.", "Set a limit.", "End with a simple rule."],
      accent: "#ffa285",
      accent2: "#a4c8ff"
    },
    {
      id: "uniforme-scolaire",
      category: "Ecole",
      date: "2026",
      title: "L'uniforme scolaire, bonne idee ?",
      lead: "Dans certains pays, l'uniforme est obligatoire ; dans d'autres, il n'existe pas. Le debat revient souvent en France.",
      question: "Faut-il mettre un uniforme dans les lycees francais ?",
      mission: "Donne un pour, un contre et une solution moyenne.",
      goalEn: "Give one pro, one con and a middle-ground solution.",
      rules: ["donne un pour", "donne un contre", "propose un compromis"],
      starters: ["Un avantage, c'est...", "Mais le probleme...", "Un compromis possible..."],
      angles: ["egalite", "identite", "budget"],
      levels: {
        B1: ["un uniforme|uniform", "l'ecole|school", "habiller|to dress", "pareil|the same"],
        B2: ["reduire les inegalites|to reduce inequality", "limiter la liberte|to limit freedom", "simplifier le matin|to simplify mornings", "exprimer son style|to express your style"],
        C1: ["un sentiment d'appartenance|sense of belonging", "une uniformisation scolaire|school standardization", "une pression vestimentaire|clothing pressure", "un compromis raisonnable|reasonable compromise"]
      },
      coach: ["Give a pro.", "Give a con.", "Propose a middle.", "End with your view."],
      accent: "#8fb7ff",
      accent2: "#ffd082"
    },
    {
      id: "applis-dating",
      category: "Relations",
      date: "2026",
      title: "Les applis de rencontre pour les jeunes",
      lead: "Les applis de rencontre sont tres utilisees, mais beaucoup disent qu'elles sont fatigantes ou superficielles.",
      question: "Les applis de rencontre aident-elles vraiment a trouver l'amour ?",
      mission: "Parle d'un bon cote, d'un piege et d'un conseil.",
      goalEn: "Mention one positive, one pitfall and one piece of advice.",
      rules: ["parle d'un avantage", "parle d'un piege", "donne un conseil"],
      starters: ["Ce qui est pratique...", "Mais le piege, c'est...", "Mon conseil serait..."],
      angles: ["variete", "superficiel", "securite"],
      levels: {
        B1: ["rencontrer|to meet", "une appli|app", "ecrire|to write", "un profil|profile"],
        B2: ["trouver quelqu'un|to find someone", "perdre du temps|to waste time", "etre superficiel|to be superficial", "faire attention|to be careful"],
        C1: ["une relation serieuse|serious relationship", "une fatigue numerique|digital fatigue", "une consommation affective|emotional consumption", "un profil honnete|honest profile"]
      },
      coach: ["Give one upside.", "Name a pitfall.", "Add advice.", "End with your view."],
      accent: "#ff7faa",
      accent2: "#a4d0ff"
    },
    {
      id: "meta-cerveau",
      category: "Sante",
      date: "2026",
      title: "Entrainer son cerveau",
      lead: "Mots croises, lecture, meditation, sport : beaucoup de choses sont presentees comme bonnes pour le cerveau.",
      question: "Comment bien entrainer son cerveau au quotidien ?",
      mission: "Nomme deux activites et explique leur effet.",
      goalEn: "Name two activities and explain their effect on the brain.",
      rules: ["nomme deux activites", "explique un effet", "propose un petit defi"],
      starters: ["Une premiere activite...", "Une deuxieme, c'est...", "Je me lancerais..."],
      angles: ["memoire", "concentration", "stress"],
      levels: {
        B1: ["le cerveau|brain", "lire|to read", "jouer|to play", "memoire|memory"],
        B2: ["ameliorer la memoire|to improve memory", "se concentrer|to focus", "reduire le stress|to reduce stress", "stimuler l'esprit|to stimulate the mind"],
        C1: ["une plasticite cerebrale|brain plasticity", "une activite cognitive|cognitive activity", "un exercice mental|mental exercise", "une hygiene mentale|mental hygiene"]
      },
      coach: ["Name two activities.", "Explain one effect.", "Suggest a challenge.", "End with a tip."],
      accent: "#a2f0c2",
      accent2: "#ffbd7a"
    }
  ];

  const extraExpressionItems = {
    opinion: [
      "De mon point de vue...|From my point of view...",
      "J'ai l'impression que...|I have the impression that..."
    ],
    disagreement: [
      "Je ne vois pas les choses comme ca.|I do not see it that way.",
      "Je ne suis pas convaincu.|I am not convinced."
    ],
    reason: [
      "Tout simplement parce que...|Quite simply because...",
      "On peut l'expliquer facilement...|It can be explained easily..."
    ],
    example: [
      "Si je prends mon universite...|If I take my university as an example...",
      "Autour de moi, je vois que...|Around me, I see that..."
    ],
    fillers: [
      "Si tu veux...|If you want...",
      "Disons que...|Let's say that..."
    ],
    idioms: [
      "Ca me saoule.|It really annoys me.",
      "Ce n'est pas top.|It is not great."
    ]
  };

  const extraExpressionBanks = [
    {
      id: "repair",
      title: "Se corriger et rebondir",
      tip: "Pour continuer meme quand tu bloques ou quand tu veux reformuler.",
      items: [
        "Je reformule...|Let me rephrase...",
        "Je voulais dire...|What I meant was...",
        "Plus simplement...|More simply...",
        "En d'autres termes...|In other words...",
        "Je corrige ma phrase...|Let me correct my sentence...",
        "L'idee, c'est surtout...|The main idea is..."
      ]
    }
  ];

  const expressionQuizItems = [
    {
      expression: "C'est l'hopital qui se fout de la charite.",
      answer: "Quelqu'un critique un defaut qu'il a aussi.",
      options: [
        "Quelqu'un critique un defaut qu'il a aussi.",
        "Quelqu'un aide beaucoup les autres.",
        "Quelqu'un parle d'un hopital moderne."
      ]
    },
    {
      expression: "Tourner autour du pot.",
      answer: "Ne pas parler clairement.",
      options: [
        "Ne pas parler clairement.",
        "Parler tres vite.",
        "Changer de place."
      ]
    },
    {
      expression: "Ca ne tient pas debout.",
      answer: "Ce n'est pas credible.",
      options: [
        "Ce n'est pas credible.",
        "C'est tres solide.",
        "C'est une bonne excuse."
      ]
    },
    {
      expression: "En avoir marre.",
      answer: "Etre agace ou fatigue.",
      options: [
        "Etre agace ou fatigue.",
        "Avoir envie de manger.",
        "Vouloir sortir avec des amis."
      ]
    },
    {
      expression: "Avoir un coup de coeur.",
      answer: "Aimer quelque chose tres vite et tres fort.",
      options: [
        "Aimer quelque chose tres vite et tres fort.",
        "Avoir mal au coeur.",
        "Ne pas savoir choisir."
      ]
    },
    {
      expression: "Ca vaut le coup.",
      answer: "C'est utile ou interessant.",
      options: [
        "C'est utile ou interessant.",
        "C'est dangereux.",
        "C'est trop complique."
      ]
    },
    {
      expression: "Ce n'est pas top.",
      answer: "Ce n'est pas tres bien.",
      options: [
        "Ce n'est pas tres bien.",
        "C'est excellent.",
        "C'est tres difficile a comprendre."
      ]
    },
    {
      expression: "Ca me saoule.",
      answer: "Ca m'enerve.",
      options: [
        "Ca m'enerve.",
        "Ca me donne faim.",
        "Ca me surprend."
      ]
    },
    {
      expression: "Je ne suis pas convaincu.",
      answer: "Je ne crois pas vraiment a cette idee.",
      options: [
        "Je ne crois pas vraiment a cette idee.",
        "Je suis totalement d'accord.",
        "Je veux plus d'exemples personnels."
      ]
    },
    {
      expression: "Je reformule...",
      answer: "Je vais expliquer autrement.",
      options: [
        "Je vais expliquer autrement.",
        "Je veux changer de sujet.",
        "Je ne veux plus parler."
      ]
    }
  ];

  const kokaSuggestions = [
    "Pose-moi une question simple sur la vie etudiante.",
    "Corrige ma reponse en francais, puis explique en anglais.",
    "Donne-moi 5 mots utiles pour parler du budget.",
    "Fais un mini debat sur les telephones en classe.",
    "Pose-moi une question B1, puis une version B2.",
    "Aide-moi a parler pendant 30 secondes sur un sujet facile."
  ];

  const kokaModes = [
    { id: "simple", label: "Reponds plus simple" },
    { id: "correct", label: "Corrige-moi" },
    { id: "vocab", label: "Donne-moi du vocabulaire" },
    { id: "question", label: "Pose-moi une autre question" }
  ];

  data.globalVocabPacks = [...(data.globalVocabPacks || []), ...extraPacks];
  data.topics.push(...extraTopics);

  Object.entries(extraExpressionItems).forEach(([bankId, items]) => {
    const bank = data.expressionBanks.find((entry) => entry.id === bankId);
    if (!bank) {
      return;
    }

    items.forEach((item) => {
      if (!bank.items.includes(item)) {
        bank.items.push(item);
      }
    });
  });

  extraExpressionBanks.forEach((bank) => {
    if (!data.expressionBanks.some((entry) => entry.id === bank.id)) {
      data.expressionBanks.push(bank);
    }
  });

  data.expressionQuizItems = expressionQuizItems;
  data.kokaSuggestions = kokaSuggestions;
  data.kokaModes = kokaModes;
})();
