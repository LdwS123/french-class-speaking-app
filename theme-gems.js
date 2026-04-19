// ============================================================
// THEME GEMS — 10 themed vocabulary packs with real sentences
// Used by:  Phrase XL, Chaine, Collection de gemmes
// No AI — pure curated data.
// ============================================================
(function () {

  // Each theme contains:
  //   icon, title, accent (color), rarity hint,
  //   gems:     array of { fr, en, kind }   (vocabulary "gems")
  //   prepositions: [{ text, blanks: [{before, answer, options}] }]  multi-blank sentences
  //   chain:    starter chains for the Chaine game
  //     each chain step: { prompt, options:[{text, next?}] }
  const THEMES = [

    // ───────────────────────── 1. EMOTIONS ─────────────────────────
    {
      id: 'emotions', icon: '💗', title: 'Emotions & sentiments',
      accent: '#ef4135',
      gems: [
        { fr: 'la joie',        en: 'joy',         kind: 'nom' },
        { fr: 'la tristesse',   en: 'sadness',     kind: 'nom' },
        { fr: 'la colere',      en: 'anger',       kind: 'nom' },
        { fr: 'la peur',        en: 'fear',        kind: 'nom' },
        { fr: 'la jalousie',    en: 'jealousy',    kind: 'nom' },
        { fr: 'la honte',       en: 'shame',       kind: 'nom' },
        { fr: 'la fierte',      en: 'pride',       kind: 'nom' },
        { fr: 'la surprise',    en: 'surprise',    kind: 'nom' },
        { fr: 'l\'angoisse',    en: 'anxiety',     kind: 'nom' },
        { fr: 'le soulagement', en: 'relief',      kind: 'nom' },
        { fr: 'la tendresse',   en: 'tenderness',  kind: 'nom' },
        { fr: 'la nostalgie',   en: 'nostalgia',   kind: 'nom' },
        { fr: 'emouvant',       en: 'moving',      kind: 'adj' },
        { fr: 'bouleverse',     en: 'overwhelmed', kind: 'adj' },
        { fr: 'rassure',        en: 'reassured',   kind: 'adj' }
      ],
      prepositions: [
        { text: 'Je suis tres fier __0 mon frere __1 son exam.',
          blanks: [
            { answer: 'de', options: ['de', 'pour', 'avec'] },
            { answer: 'pour', options: ['de', 'pour', 'a'] }
          ]},
        { text: 'Elle a peur __0 l\'avion et elle pense __1 ce voyage tout le temps.',
          blanks: [
            { answer: 'de', options: ['de', 'a', 'pour'] },
            { answer: 'a', options: ['de', 'a', 'sur'] }
          ]},
        { text: 'Il s\'est excuse __0 sa colere __1 moi.',
          blanks: [
            { answer: 'de', options: ['de', 'pour', 'a'] },
            { answer: 'aupres de', options: ['aupres de', 'avec', 'sur'] }
          ]},
        { text: 'Nous sommes heureux __0 partager ce moment __1 vous.',
          blanks: [
            { answer: 'de', options: ['de', 'a', 'pour'] },
            { answer: 'avec', options: ['avec', 'pour', 'de'] }
          ]}
      ],
      chain: [
        { prompt: 'Je suis content...',
          options: [
            { text: 'de', next: [
              { prompt: '...de...', options: [
                { text: 'te voir', next: [
                  { prompt: '...te voir...', options: [
                    { text: 'ici', end: true },
                    { text: 'aujourd\'hui', end: true },
                    { text: 'enfin', end: true }
                  ]}
                ]},
                { text: 'commencer', next: [
                  { prompt: '...commencer...', options: [
                    { text: 'ce projet', end: true },
                    { text: 'une nouvelle vie', end: true }
                  ]}
                ]}
              ]}
            ]},
            { text: 'que', next: [
              { prompt: '...que...', options: [
                { text: 'tu sois la', end: true },
                { text: 'ca marche', end: true }
              ]}
            ]}
          ]}
      ]
    },

    // ───────────────────────── 2. VOYAGE ───────────────────────────
    {
      id: 'voyage', icon: '✈️', title: 'Voyage & aventure',
      accent: '#0055a4',
      gems: [
        { fr: 'un aeroport',    en: 'airport',        kind: 'nom' },
        { fr: 'une valise',     en: 'suitcase',       kind: 'nom' },
        { fr: 'un billet',      en: 'ticket',         kind: 'nom' },
        { fr: 'un passeport',   en: 'passport',       kind: 'nom' },
        { fr: 'une frontiere',  en: 'border',         kind: 'nom' },
        { fr: 'un hebergement', en: 'accommodation',  kind: 'nom' },
        { fr: 'une auberge',    en: 'hostel',         kind: 'nom' },
        { fr: 'un decalage',    en: 'jet lag',        kind: 'nom' },
        { fr: 'une escale',     en: 'stopover',       kind: 'nom' },
        { fr: 'embarquer',      en: 'to board',       kind: 'verbe' },
        { fr: 'decouvrir',      en: 'to discover',    kind: 'verbe' },
        { fr: 'depayser',       en: 'to disorient',   kind: 'verbe' },
        { fr: 'exotique',       en: 'exotic',         kind: 'adj' },
        { fr: 'inoubliable',    en: 'unforgettable',  kind: 'adj' }
      ],
      prepositions: [
        { text: 'Je pars __0 Paris __1 avion __2 trois jours.',
          blanks: [
            { answer: 'pour', options: ['pour', 'a', 'de'] },
            { answer: 'en', options: ['en', 'par', 'avec'] },
            { answer: 'pendant', options: ['pendant', 'pour', 'depuis'] }
          ]},
        { text: 'Elle habite __0 Lisbonne __1 six mois et elle revient __2 France dimanche.',
          blanks: [
            { answer: 'a', options: ['a', 'en', 'au'] },
            { answer: 'depuis', options: ['depuis', 'pendant', 'pour'] },
            { answer: 'en', options: ['en', 'a', 'au'] }
          ]},
        { text: 'On va __0 Japon __1 avril __2 voir les cerisiers.',
          blanks: [
            { answer: 'au', options: ['au', 'en', 'a'] },
            { answer: 'en', options: ['en', 'au', 'a'] },
            { answer: 'pour', options: ['pour', 'de', 'a'] }
          ]},
        { text: 'Il est arrive __0 l\'aeroport __1 bus __2 la deuxieme fois.',
          blanks: [
            { answer: 'a', options: ['a', 'de', 'sur'] },
            { answer: 'en', options: ['en', 'par', 'avec'] },
            { answer: 'pour', options: ['pour', 'a', 'de'] }
          ]}
      ],
      chain: [
        { prompt: 'Je pars...',
          options: [
            { text: 'en', next: [
              { prompt: 'Je pars en...', options: [
                { text: 'France', next: [{ prompt: 'Je pars en France...', options: [
                  { text: 'en avion', end: true },
                  { text: 'pour deux semaines', end: true },
                  { text: 'avec mes amis', end: true }
                ]}]},
                { text: 'vacances', next: [{ prompt: 'Je pars en vacances...', options: [
                  { text: 'a la mer', end: true },
                  { text: 'au Japon', end: true },
                  { text: 'avec ma famille', end: true }
                ]}]}
              ]}
            ]},
            { text: 'pour', next: [
              { prompt: 'Je pars pour...', options: [
                { text: 'Rome', next: [{ prompt: 'Je pars pour Rome...', options: [
                  { text: 'demain matin', end: true },
                  { text: 'en train', end: true }
                ]}]},
                { text: 'un long voyage', end: true }
              ]}
            ]}
          ]}
      ]
    },

    // ───────────────────────── 3. GASTRONOMIE ──────────────────────
    {
      id: 'cuisine', icon: '🍳', title: 'Cuisine & gastronomie',
      accent: '#d68c26',
      gems: [
        { fr: 'une recette',    en: 'recipe',       kind: 'nom' },
        { fr: 'un ingredient',  en: 'ingredient',   kind: 'nom' },
        { fr: 'une poele',      en: 'frying pan',   kind: 'nom' },
        { fr: 'une casserole',  en: 'saucepan',     kind: 'nom' },
        { fr: 'un four',        en: 'oven',         kind: 'nom' },
        { fr: 'une epice',      en: 'spice',        kind: 'nom' },
        { fr: 'une sauce',      en: 'sauce',        kind: 'nom' },
        { fr: 'un dessert',     en: 'dessert',      kind: 'nom' },
        { fr: 'une patisserie', en: 'pastry',       kind: 'nom' },
        { fr: 'mijoter',        en: 'to simmer',    kind: 'verbe' },
        { fr: 'gouter',         en: 'to taste',     kind: 'verbe' },
        { fr: 'assaisonner',    en: 'to season',    kind: 'verbe' },
        { fr: 'savoureux',      en: 'tasty',        kind: 'adj' },
        { fr: 'fade',           en: 'bland',        kind: 'adj' },
        { fr: 'croustillant',   en: 'crunchy',      kind: 'adj' }
      ],
      prepositions: [
        { text: 'Je prepare un gateau __0 chocolat __1 l\'anniversaire __2 ma mere.',
          blanks: [
            { answer: 'au', options: ['au', 'de', 'en'] },
            { answer: 'pour', options: ['pour', 'a', 'de'] },
            { answer: 'de', options: ['de', 'a', 'pour'] }
          ]},
        { text: 'Ajoute une pincee __0 sel __1 la casserole __2 cuire.',
          blanks: [
            { answer: 'de', options: ['de', 'a', 'du'] },
            { answer: 'dans', options: ['dans', 'a', 'sur'] },
            { answer: 'avant de', options: ['avant de', 'pour', 'apres'] }
          ]},
        { text: 'Ce plat est delicieux __0 une sauce __1 champignons.',
          blanks: [
            { answer: 'avec', options: ['avec', 'pour', 'de'] },
            { answer: 'aux', options: ['aux', 'de', 'en'] }
          ]},
        { text: 'Elle a appris __0 cuisiner __1 sa grand-mere __2 Lyon.',
          blanks: [
            { answer: 'a', options: ['a', 'de', 'pour'] },
            { answer: 'avec', options: ['avec', 'aupres de', 'chez'] },
            { answer: 'a', options: ['a', 'en', 'dans'] }
          ]}
      ],
      chain: [
        { prompt: 'Je mange...',
          options: [
            { text: 'de la', next: [{ prompt: 'Je mange de la...', options: [
              { text: 'soupe', next: [{ prompt: 'Je mange de la soupe...', options: [
                { text: 'au poulet', end: true },
                { text: 'aux legumes', end: true },
                { text: 'avec du pain', end: true }
              ]}]},
              { text: 'salade', next: [{ prompt: 'Je mange de la salade...', options: [
                { text: 'avec une vinaigrette', end: true },
                { text: 'au fromage', end: true }
              ]}]}
            ]}]},
            { text: 'un', next: [{ prompt: 'Je mange un...', options: [
              { text: 'gateau', next: [{ prompt: 'Je mange un gateau...', options: [
                { text: 'au chocolat', end: true },
                { text: 'fait maison', end: true }
              ]}]},
              { text: 'sandwich', next: [{ prompt: 'Je mange un sandwich...', options: [
                { text: 'au jambon', end: true },
                { text: 'avec du beurre', end: true }
              ]}]}
            ]}]}
          ]}
      ]
    },

    // ───────────────────────── 4. NATURE ───────────────────────────
    {
      id: 'nature', icon: '🌿', title: 'Nature & climat',
      accent: '#2ea056',
      gems: [
        { fr: 'une foret',     en: 'forest',      kind: 'nom' },
        { fr: 'une montagne',  en: 'mountain',    kind: 'nom' },
        { fr: 'une riviere',   en: 'river',       kind: 'nom' },
        { fr: 'une vague',     en: 'wave',        kind: 'nom' },
        { fr: 'un orage',      en: 'thunderstorm',kind: 'nom' },
        { fr: 'un eclair',     en: 'lightning',   kind: 'nom' },
        { fr: 'une rosee',     en: 'dew',         kind: 'nom' },
        { fr: 'la brume',      en: 'mist',        kind: 'nom' },
        { fr: 'un papillon',   en: 'butterfly',   kind: 'nom' },
        { fr: 'une abeille',   en: 'bee',         kind: 'nom' },
        { fr: 'fleurir',       en: 'to bloom',    kind: 'verbe' },
        { fr: 'pousser',       en: 'to grow',     kind: 'verbe' },
        { fr: 'paisible',      en: 'peaceful',    kind: 'adj' },
        { fr: 'sauvage',       en: 'wild',        kind: 'adj' },
        { fr: 'eblouissant',   en: 'dazzling',    kind: 'adj' }
      ],
      prepositions: [
        { text: 'On marche __0 la foret __1 chercher __2 champignons.',
          blanks: [
            { answer: 'dans', options: ['dans', 'a', 'sur'] },
            { answer: 'pour', options: ['pour', 'a', 'en'] },
            { answer: 'des', options: ['des', 'de', 'les'] }
          ]},
        { text: 'Il y a une vue __0 la vallee __1 le sommet __2 la montagne.',
          blanks: [
            { answer: 'sur', options: ['sur', 'de', 'a'] },
            { answer: 'depuis', options: ['depuis', 'a', 'sur'] },
            { answer: 'de', options: ['de', 'du', 'a'] }
          ]},
        { text: 'Les fleurs poussent __0 le jardin __1 mai __2 septembre.',
          blanks: [
            { answer: 'dans', options: ['dans', 'a', 'sur'] },
            { answer: 'de', options: ['de', 'en', 'a'] },
            { answer: 'a', options: ['a', 'jusqu\'a', 'en'] }
          ]},
        { text: 'Je pars __0 la montagne __1 skier __2 deux semaines.',
          blanks: [
            { answer: 'a', options: ['a', 'dans', 'en'] },
            { answer: 'pour', options: ['pour', 'a', 'de'] },
            { answer: 'pendant', options: ['pendant', 'pour', 'depuis'] }
          ]}
      ],
      chain: [
        { prompt: 'Je me promene...',
          options: [
            { text: 'dans', next: [{ prompt: 'Je me promene dans...', options: [
              { text: 'la foret', next: [{ prompt: 'Je me promene dans la foret...', options: [
                { text: 'avec mon chien', end: true },
                { text: 'en automne', end: true },
                { text: 'pour me detendre', end: true }
              ]}]},
              { text: 'le parc', next: [{ prompt: 'Je me promene dans le parc...', options: [
                { text: 'le matin', end: true },
                { text: 'avec ma famille', end: true }
              ]}]}
            ]}]},
            { text: 'au', next: [{ prompt: 'Je me promene au...', options: [
              { text: 'bord de la mer', end: true },
              { text: 'sommet de la montagne', end: true }
            ]}]}
          ]}
      ]
    },

    // ───────────────────────── 5. ECOLE & ETUDES ───────────────────
    {
      id: 'ecole', icon: '🎓', title: 'Ecole & etudes',
      accent: '#7a3df0',
      gems: [
        { fr: 'un eleve',       en: 'pupil',         kind: 'nom' },
        { fr: 'un etudiant',    en: 'student',       kind: 'nom' },
        { fr: 'une bourse',     en: 'scholarship',   kind: 'nom' },
        { fr: 'un diplome',     en: 'diploma',       kind: 'nom' },
        { fr: 'une matiere',    en: 'subject',       kind: 'nom' },
        { fr: 'un examen',      en: 'exam',          kind: 'nom' },
        { fr: 'une dissertation',en: 'essay',        kind: 'nom' },
        { fr: 'une faculte',    en: 'faculty',       kind: 'nom' },
        { fr: 'un devoir',      en: 'homework',      kind: 'nom' },
        { fr: 'reviser',        en: 'to revise',     kind: 'verbe' },
        { fr: 'reussir',        en: 'to succeed',    kind: 'verbe' },
        { fr: 'echouer',        en: 'to fail',       kind: 'verbe' },
        { fr: 'rigoureux',      en: 'rigorous',      kind: 'adj' },
        { fr: 'motive',         en: 'motivated',     kind: 'adj' }
      ],
      prepositions: [
        { text: 'Je prepare un memoire __0 histoire __1 mon prof __2 trois mois.',
          blanks: [
            { answer: 'd\'', options: ['d\'', 'de', 'en'] },
            { answer: 'avec', options: ['avec', 'pour', 'a'] },
            { answer: 'depuis', options: ['depuis', 'pendant', 'pour'] }
          ]},
        { text: 'Il a reussi __0 son examen __1 travailler beaucoup.',
          blanks: [
            { answer: 'a', options: ['a', 'de', 'pour'] },
            { answer: 'en', options: ['en', 'a', 'apres'] }
          ]},
        { text: 'On commence __0 reviser __1 le bac __2 vendredi.',
          blanks: [
            { answer: 'a', options: ['a', 'de', 'pour'] },
            { answer: 'pour', options: ['pour', 'a', 'de'] },
            { answer: 'des', options: ['des', 'depuis', 'avant'] }
          ]},
        { text: 'Elle reve __0 etudier __1 Paris __2 l\'annee prochaine.',
          blanks: [
            { answer: 'd\'', options: ['d\'', 'de', 'a'] },
            { answer: 'a', options: ['a', 'en', 'dans'] },
            { answer: 'l\'', options: ['l\'', 'en', 'a'] }
          ]}
      ],
      chain: [
        { prompt: 'Je revise...',
          options: [
            { text: 'pour', next: [{ prompt: 'Je revise pour...', options: [
              { text: 'mon examen', next: [{ prompt: 'Je revise pour mon examen...', options: [
                { text: 'de maths', end: true },
                { text: 'avec mon ami', end: true },
                { text: 'toute la nuit', end: true }
              ]}]},
              { text: 'le bac', next: [{ prompt: 'Je revise pour le bac...', options: [
                { text: 'depuis deux mois', end: true },
                { text: 'a la bibliotheque', end: true }
              ]}]}
            ]}]},
            { text: 'avec', next: [{ prompt: 'Je revise avec...', options: [
              { text: 'mes notes', end: true },
              { text: 'un camarade', end: true }
            ]}]}
          ]}
      ]
    },

    // ───────────────────────── 6. TRAVAIL ──────────────────────────
    {
      id: 'travail', icon: '💼', title: 'Travail & carriere',
      accent: '#205088',
      gems: [
        { fr: 'un entretien',    en: 'interview',        kind: 'nom' },
        { fr: 'un contrat',      en: 'contract',         kind: 'nom' },
        { fr: 'un salaire',      en: 'salary',           kind: 'nom' },
        { fr: 'une reunion',     en: 'meeting',          kind: 'nom' },
        { fr: 'un stage',        en: 'internship',       kind: 'nom' },
        { fr: 'un employeur',    en: 'employer',         kind: 'nom' },
        { fr: 'une collegue',    en: 'colleague',        kind: 'nom' },
        { fr: 'une promotion',   en: 'promotion',        kind: 'nom' },
        { fr: 'une mission',     en: 'assignment',       kind: 'nom' },
        { fr: 'postuler',        en: 'to apply',         kind: 'verbe' },
        { fr: 'embaucher',       en: 'to hire',          kind: 'verbe' },
        { fr: 'demissionner',    en: 'to resign',        kind: 'verbe' },
        { fr: 'qualifie',        en: 'qualified',        kind: 'adj' },
        { fr: 'exigeant',        en: 'demanding',        kind: 'adj' }
      ],
      prepositions: [
        { text: 'Je travaille __0 une start-up __1 Paris __2 deux ans.',
          blanks: [
            { answer: 'dans', options: ['dans', 'a', 'chez'] },
            { answer: 'a', options: ['a', 'en', 'dans'] },
            { answer: 'depuis', options: ['depuis', 'pendant', 'pour'] }
          ]},
        { text: 'Il a postule __0 ce poste __1 lettre __2 motivation.',
          blanks: [
            { answer: 'a', options: ['a', 'pour', 'de'] },
            { answer: 'par', options: ['par', 'avec', 'en'] },
            { answer: 'de', options: ['de', 'pour', 'en'] }
          ]},
        { text: 'Je parle __0 mon chef __1 mon augmentation __2 demain.',
          blanks: [
            { answer: 'a', options: ['a', 'avec', 'pour'] },
            { answer: 'de', options: ['de', 'pour', 'a'] },
            { answer: 'des', options: ['des', 'a', 'depuis'] }
          ]},
        { text: 'Elle s\'occupe __0 clients __1 matin __2 soir.',
          blanks: [
            { answer: 'des', options: ['des', 'de', 'les'] },
            { answer: 'du', options: ['du', 'le', 'de'] },
            { answer: 'au', options: ['au', 'a', 'le'] }
          ]}
      ],
      chain: [
        { prompt: 'Je travaille...',
          options: [
            { text: 'dans', next: [{ prompt: 'Je travaille dans...', options: [
              { text: 'une banque', next: [{ prompt: 'Je travaille dans une banque...', options: [
                { text: 'a Paris', end: true },
                { text: 'depuis trois ans', end: true },
                { text: 'comme conseiller', end: true }
              ]}]},
              { text: 'le marketing', next: [{ prompt: 'Je travaille dans le marketing...', options: [
                { text: 'pour une grande marque', end: true },
                { text: 'avec une equipe geniale', end: true }
              ]}]}
            ]}]},
            { text: 'chez', next: [{ prompt: 'Je travaille chez...', options: [
              { text: 'Renault', next: [{ prompt: 'Je travaille chez Renault...', options: [
                { text: 'a Boulogne', end: true },
                { text: 'depuis janvier', end: true }
              ]}]},
              { text: 'un avocat', end: true }
            ]}]}
          ]}
      ]
    },

    // ───────────────────────── 7. VILLE & URBANISME ────────────────
    {
      id: 'ville', icon: '🏙️', title: 'Ville & urbanisme',
      accent: '#1565c8',
      gems: [
        { fr: 'un quartier',     en: 'neighbourhood', kind: 'nom' },
        { fr: 'une mairie',      en: 'town hall',     kind: 'nom' },
        { fr: 'un trottoir',     en: 'sidewalk',      kind: 'nom' },
        { fr: 'un carrefour',    en: 'crossroads',    kind: 'nom' },
        { fr: 'un embouteillage',en: 'traffic jam',   kind: 'nom' },
        { fr: 'un immeuble',     en: 'building',      kind: 'nom' },
        { fr: 'une place',       en: 'square',        kind: 'nom' },
        { fr: 'un piéton',       en: 'pedestrian',    kind: 'nom' },
        { fr: 'un reverbere',    en: 'streetlamp',    kind: 'nom' },
        { fr: 'une ruelle',      en: 'alley',         kind: 'nom' },
        { fr: 'se deplacer',     en: 'to commute',    kind: 'verbe' },
        { fr: 'anime',           en: 'lively',        kind: 'adj' },
        { fr: 'bruyant',         en: 'noisy',         kind: 'adj' },
        { fr: 'pietonnier',      en: 'pedestrian(ad)',kind: 'adj' }
      ],
      prepositions: [
        { text: 'J\'habite __0 un quartier anime __1 centre-ville __2 Lyon.',
          blanks: [
            { answer: 'dans', options: ['dans', 'a', 'chez'] },
            { answer: 'du', options: ['du', 'de', 'au'] },
            { answer: 'de', options: ['de', 'a', 'en'] }
          ]},
        { text: 'Le bus passe __0 la mairie __1 cinq minutes __2 partir __3 sept heures.',
          blanks: [
            { answer: 'devant', options: ['devant', 'a', 'dans'] },
            { answer: 'toutes les', options: ['toutes les', 'chaque', 'les'] },
            { answer: 'a', options: ['a', 'de', 'pour'] },
            { answer: 'de', options: ['de', 'a', 'des'] }
          ]},
        { text: 'On se retrouve __0 la place __1 metro __2 dix-neuf heures.',
          blanks: [
            { answer: 'sur', options: ['sur', 'a', 'dans'] },
            { answer: 'du', options: ['du', 'de', 'au'] },
            { answer: 'a', options: ['a', 'vers', 'pour'] }
          ]}
      ],
      chain: [
        { prompt: 'J\'habite...',
          options: [
            { text: 'a', next: [{ prompt: 'J\'habite a...', options: [
              { text: 'Paris', next: [{ prompt: 'J\'habite a Paris...', options: [
                { text: 'dans le 15e', end: true },
                { text: 'depuis cinq ans', end: true },
                { text: 'avec mon chat', end: true }
              ]}]},
              { text: 'la campagne', end: true }
            ]}]},
            { text: 'dans', next: [{ prompt: 'J\'habite dans...', options: [
              { text: 'un immeuble', next: [{ prompt: 'J\'habite dans un immeuble...', options: [
                { text: 'au 4e etage', end: true },
                { text: 'en centre-ville', end: true }
              ]}]},
              { text: 'une petite ville', end: true }
            ]}]}
          ]}
      ]
    },

    // ───────────────────────── 8. SANTE ────────────────────────────
    {
      id: 'sante', icon: '🩺', title: 'Sante & bien-etre',
      accent: '#15a489',
      gems: [
        { fr: 'un medecin',      en: 'doctor',         kind: 'nom' },
        { fr: 'une ordonnance',  en: 'prescription',   kind: 'nom' },
        { fr: 'un rhume',        en: 'cold',           kind: 'nom' },
        { fr: 'une grippe',      en: 'flu',            kind: 'nom' },
        { fr: 'une fievre',      en: 'fever',          kind: 'nom' },
        { fr: 'une douleur',     en: 'pain',           kind: 'nom' },
        { fr: 'un traitement',   en: 'treatment',      kind: 'nom' },
        { fr: 'une guerison',    en: 'recovery',       kind: 'nom' },
        { fr: 'souffrir',        en: 'to suffer',      kind: 'verbe' },
        { fr: 'se reposer',      en: 'to rest',        kind: 'verbe' },
        { fr: 'guerir',          en: 'to heal',        kind: 'verbe' },
        { fr: 'fragile',         en: 'fragile',        kind: 'adj' },
        { fr: 'en forme',        en: 'fit',            kind: 'expr' }
      ],
      prepositions: [
        { text: 'Je prends rendez-vous __0 le medecin __1 jeudi __2 dix heures.',
          blanks: [
            { answer: 'chez', options: ['chez', 'avec', 'a'] },
            { answer: 'pour', options: ['pour', 'a', 'de'] },
            { answer: 'a', options: ['a', 'en', 'vers'] }
          ]},
        { text: 'Elle souffre __0 son dos __1 longtemps.',
          blanks: [
            { answer: 'de', options: ['de', 'a', 'pour'] },
            { answer: 'depuis', options: ['depuis', 'pendant', 'pour'] }
          ]},
        { text: 'Il faut se reposer __0 la grippe __1 deux jours __2 reprendre le travail.',
          blanks: [
            { answer: 'apres', options: ['apres', 'pour', 'de'] },
            { answer: 'pendant', options: ['pendant', 'pour', 'depuis'] },
            { answer: 'avant de', options: ['avant de', 'pour', 'apres'] }
          ]}
      ],
      chain: [
        { prompt: 'Je vais...',
          options: [
            { text: 'chez', next: [{ prompt: 'Je vais chez...', options: [
              { text: 'le medecin', next: [{ prompt: 'Je vais chez le medecin...', options: [
                { text: 'demain matin', end: true },
                { text: 'pour un controle', end: true }
              ]}]},
              { text: 'le dentiste', end: true }
            ]}]},
            { text: 'a', next: [{ prompt: 'Je vais a...', options: [
              { text: 'la pharmacie', next: [{ prompt: 'Je vais a la pharmacie...', options: [
                { text: 'acheter des medicaments', end: true },
                { text: 'pour une ordonnance', end: true }
              ]}]},
              { text: 'l\'hopital', end: true }
            ]}]}
          ]}
      ]
    },

    // ───────────────────────── 9. SPORT ────────────────────────────
    {
      id: 'sport', icon: '⚽', title: 'Sport & competition',
      accent: '#c53225',
      gems: [
        { fr: 'un entrainement',  en: 'training',   kind: 'nom' },
        { fr: 'un match',         en: 'match',      kind: 'nom' },
        { fr: 'un terrain',       en: 'field',      kind: 'nom' },
        { fr: 'une equipe',       en: 'team',       kind: 'nom' },
        { fr: 'un adversaire',    en: 'opponent',   kind: 'nom' },
        { fr: 'une medaille',     en: 'medal',      kind: 'nom' },
        { fr: 'une defaite',      en: 'defeat',     kind: 'nom' },
        { fr: 'une victoire',     en: 'victory',    kind: 'nom' },
        { fr: 'un arbitre',       en: 'referee',    kind: 'nom' },
        { fr: 'gagner',           en: 'to win',     kind: 'verbe' },
        { fr: 'perdre',           en: 'to lose',    kind: 'verbe' },
        { fr: 'soutenir',         en: 'to support', kind: 'verbe' },
        { fr: 'epuisant',         en: 'exhausting', kind: 'adj' },
        { fr: 'en forme',         en: 'fit',        kind: 'expr' }
      ],
      prepositions: [
        { text: 'On joue __0 le foot __1 le parc __2 dimanche matin.',
          blanks: [
            { answer: 'au', options: ['au', 'le', 'a'] },
            { answer: 'dans', options: ['dans', 'a', 'sur'] },
            { answer: 'le', options: ['le', 'a', 'ce'] }
          ]},
        { text: 'Il s\'entraine __0 le marathon __1 six mois __2 un coach.',
          blanks: [
            { answer: 'pour', options: ['pour', 'a', 'de'] },
            { answer: 'depuis', options: ['depuis', 'pendant', 'pour'] },
            { answer: 'avec', options: ['avec', 'chez', 'de'] }
          ]},
        { text: 'Le match commence __0 vingt heures __1 France 2 __2 mardi.',
          blanks: [
            { answer: 'a', options: ['a', 'en', 'de'] },
            { answer: 'sur', options: ['sur', 'a', 'dans'] },
            { answer: 'ce', options: ['ce', 'le', 'a'] }
          ]}
      ],
      chain: [
        { prompt: 'Je joue...',
          options: [
            { text: 'au', next: [{ prompt: 'Je joue au...', options: [
              { text: 'foot', next: [{ prompt: 'Je joue au foot...', options: [
                { text: 'avec mes amis', end: true },
                { text: 'le dimanche', end: true },
                { text: 'dans un club', end: true }
              ]}]},
              { text: 'tennis', next: [{ prompt: 'Je joue au tennis...', options: [
                { text: 'contre mon frere', end: true },
                { text: 'le samedi matin', end: true }
              ]}]}
            ]}]},
            { text: 'de la', next: [{ prompt: 'Je joue de la...', options: [
              { text: 'guitare', end: true }, { text: 'batterie', end: true }
            ]}]}
          ]}
      ]
    },

    // ───────────────────────── 10. ART & CULTURE ───────────────────
    {
      id: 'art', icon: '🎨', title: 'Art & culture',
      accent: '#c07fe0',
      gems: [
        { fr: 'un tableau',       en: 'painting',     kind: 'nom' },
        { fr: 'un musee',         en: 'museum',       kind: 'nom' },
        { fr: 'une piece',        en: 'play',         kind: 'nom' },
        { fr: 'un roman',         en: 'novel',        kind: 'nom' },
        { fr: 'une nouvelle',     en: 'short story',  kind: 'nom' },
        { fr: 'un chef-d\'oeuvre',en: 'masterpiece',  kind: 'nom' },
        { fr: 'un acteur',        en: 'actor',        kind: 'nom' },
        { fr: 'une exposition',   en: 'exhibition',   kind: 'nom' },
        { fr: 'un spectacle',     en: 'show',         kind: 'nom' },
        { fr: 'un festival',      en: 'festival',     kind: 'nom' },
        { fr: 'peindre',          en: 'to paint',     kind: 'verbe' },
        { fr: 'publier',          en: 'to publish',   kind: 'verbe' },
        { fr: 'applaudir',        en: 'to applaud',   kind: 'verbe' },
        { fr: 'envoutant',        en: 'enchanting',   kind: 'adj' },
        { fr: 'original',         en: 'original',     kind: 'adj' }
      ],
      prepositions: [
        { text: 'On va __0 une exposition __1 Picasso __2 musee __3 samedi.',
          blanks: [
            { answer: 'a', options: ['a', 'dans', 'en'] },
            { answer: 'de', options: ['de', 'a', 'sur'] },
            { answer: 'au', options: ['au', 'a', 'dans'] },
            { answer: 'ce', options: ['ce', 'le', 'a'] }
          ]},
        { text: 'Elle parle __0 son nouveau roman __1 une interview __2 la radio.',
          blanks: [
            { answer: 'de', options: ['de', 'a', 'pour'] },
            { answer: 'dans', options: ['dans', 'a', 'sur'] },
            { answer: 'a', options: ['a', 'dans', 'sur'] }
          ]},
        { text: 'Ce film a ete tourne __0 Paris __1 2021 __2 un petit budget.',
          blanks: [
            { answer: 'a', options: ['a', 'en', 'dans'] },
            { answer: 'en', options: ['en', 'a', 'pour'] },
            { answer: 'avec', options: ['avec', 'pour', 'de'] }
          ]}
      ],
      chain: [
        { prompt: 'Je vais...',
          options: [
            { text: 'au', next: [{ prompt: 'Je vais au...', options: [
              { text: 'cinema', next: [{ prompt: 'Je vais au cinema...', options: [
                { text: 'avec Sophie', end: true },
                { text: 'ce soir', end: true },
                { text: 'pour voir le dernier film', end: true }
              ]}]},
              { text: 'musee', next: [{ prompt: 'Je vais au musee...', options: [
                { text: 'd\'art moderne', end: true },
                { text: 'avec ma classe', end: true }
              ]}]}
            ]}]},
            { text: 'a', next: [{ prompt: 'Je vais a...', options: [
              { text: 'un concert', next: [{ prompt: 'Je vais a un concert...', options: [
                { text: 'de jazz', end: true },
                { text: 'samedi soir', end: true }
              ]}]},
              { text: 'une expo', end: true }
            ]}]}
          ]}
      ]
    }

  ];

  window.ThemeGems = { THEMES };
})();
