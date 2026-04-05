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
