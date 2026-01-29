export interface ServiceData {
  slug: string;
  title: string;
  shortTitle: string;
  icon: string;
  metaTitle: string;
  metaDescription: string;
  heroTitle: string;
  heroSubtitle: string;
  description: string;
  features: string[];
  benefits: string[];
  process: {
    title: string;
    description: string;
  }[];
  faq: {
    question: string;
    answer: string;
  }[];
}

export const services: ServiceData[] = [
  {
    slug: 'paysagisme',
    title: 'Paysagisme et Amenagement de Jardin',
    shortTitle: 'Paysagisme',
    icon: '🌳',
    metaTitle: 'Paysagiste Angers - Amenagement de Jardin | Art & Jardin',
    metaDescription:
      'Paysagiste professionnel a Angers. Conception et realisation de jardins sur mesure : terrasses, massifs, engazonnement, arrosage automatique. Devis gratuit.',
    heroTitle: 'Amenagement de Jardin a Angers',
    heroSubtitle:
      'Transformez votre exterieur en un espace de vie unique avec notre equipe de paysagistes professionnels.',
    description: `
      Art & Jardin est votre partenaire de confiance pour tous vos projets d'amenagement paysager dans la region d'Angers.
      Forts de notre experience et de notre passion pour les espaces verts, nous concevons et realisons des jardins qui
      refletent votre personnalite et s'adaptent parfaitement a votre mode de vie.

      Notre approche du paysagisme combine creativite, expertise technique et respect de l'environnement. Chaque projet
      est unique : nous prenons le temps d'ecouter vos envies, d'analyser votre terrain et de vous proposer des solutions
      sur mesure qui valorisent votre propriete.

      Que vous souhaitiez creer un jardin contemporain aux lignes epurees, un espace champetre et naturel, ou un jardin
      mediterraneen plein de couleurs, notre equipe saura donner vie a vos reves. Nous travaillons avec des vegetaux
      adaptes au climat de la Loire, selectionnes pour leur robustesse et leur beaute durable.
    `,
    features: [
      'Conception de plans paysagers personnalises',
      'Creation de terrasses et espaces de vie exterieurs',
      'Plantation de massifs, arbres et arbustes',
      'Engazonnement et creation de pelouses',
      'Installation de systemes d\'arrosage automatique',
      'Amenagement de bassins et points d\'eau',
      'Pose de clotures et bordures',
      'Eclairage de jardin',
    ],
    benefits: [
      'Valorisation de votre propriete',
      'Espace de detente personnalise',
      'Entretien facilite grace a une conception reflechie',
      'Vegetaux adaptes au climat local',
      'Respect de votre budget',
    ],
    process: [
      {
        title: 'Visite et analyse',
        description:
          'Nous nous deplacons gratuitement pour etudier votre terrain, comprendre vos besoins et vos envies.',
      },
      {
        title: 'Conception du projet',
        description:
          'Notre equipe elabore un plan detaille avec choix des vegetaux, materiaux et estimation precise.',
      },
      {
        title: 'Validation et planification',
        description:
          'Nous ajustons le projet selon vos retours et planifions les travaux a la periode ideale.',
      },
      {
        title: 'Realisation',
        description:
          'Nos equipes executent les travaux avec soin, dans le respect des delais convenus.',
      },
      {
        title: 'Suivi et conseils',
        description:
          'Nous vous accompagnons apres les travaux avec des conseils d\'entretien personnalises.',
      },
    ],
    faq: [
      {
        question: 'Quel est le cout moyen d\'un amenagement de jardin ?',
        answer:
          'Le prix varie selon la surface et la complexite du projet. Comptez entre 50 et 150€/m2 pour un amenagement complet. Nous etablissons toujours un devis detaille et gratuit avant de commencer.',
      },
      {
        question: 'Quelle est la meilleure periode pour amenager un jardin ?',
        answer:
          'L\'automne et le printemps sont ideaux pour les plantations. Cependant, nous pouvons realiser les travaux de terrassement et de maconnerie toute l\'annee.',
      },
      {
        question: 'Proposez-vous un service d\'entretien apres l\'amenagement ?',
        answer:
          'Oui, nous proposons des contrats d\'entretien annuels pour maintenir votre jardin en parfait etat. Tonte, taille, desherbage... nous nous occupons de tout.',
      },
    ],
  },
  {
    slug: 'entretien-jardin',
    title: 'Entretien de Jardin',
    shortTitle: 'Entretien',
    icon: '✂️',
    metaTitle: 'Entretien de Jardin Angers - Tonte, Taille, Desherbage | Art & Jardin',
    metaDescription:
      'Service d\'entretien de jardin a Angers. Tonte de pelouse, taille de haies, desherbage, nettoyage. Contrats annuels ou interventions ponctuelles. Devis gratuit.',
    heroTitle: 'Entretien de Jardin a Angers',
    heroSubtitle:
      'Un jardin impeccable toute l\'annee sans effort grace a notre service d\'entretien professionnel.',
    description: `
      Un beau jardin demande un entretien regulier et adapte a chaque saison. Art & Jardin vous propose un service
      d'entretien complet pour que vous puissiez profiter de votre exterieur sans contrainte.

      Notre equipe de jardiniers professionnels intervient regulierement selon un calendrier adapte a votre jardin
      et a vos besoins. Nous utilisons des equipements professionnels et des techniques respectueuses de l'environnement
      pour garantir un resultat impeccable.

      Que vous ayez un petit jardin de ville ou un grand parc, nous adaptons nos prestations a vos attentes et a votre
      budget. Nos contrats d'entretien sont flexibles : interventions hebdomadaires, bi-mensuelles ou mensuelles selon
      la saison et vos preferences.
    `,
    features: [
      'Tonte de pelouse et refection de gazon',
      'Taille de haies, arbustes et topiaires',
      'Desherbage manuel et ecologique',
      'Ramassage des feuilles mortes',
      'Bechage et preparation des massifs',
      'Traitement phytosanitaire raisonne',
      'Evacuation des dechets verts',
      'Hivernage et protection des plantes',
    ],
    benefits: [
      'Gain de temps considerable',
      'Jardin toujours impeccable',
      'Materiels professionnels fournis',
      'Conseils de jardinage inclus',
      'Tarifs degressifs en contrat annuel',
    ],
    process: [
      {
        title: 'Evaluation des besoins',
        description:
          'Nous visitons votre jardin pour evaluer les travaux necessaires et la frequence d\'intervention.',
      },
      {
        title: 'Proposition personnalisee',
        description:
          'Nous vous remettons un devis detaille avec planning d\'intervention adapte aux saisons.',
      },
      {
        title: 'Interventions regulieres',
        description:
          'Notre equipe intervient selon le calendrier etabli, avec ou sans votre presence.',
      },
      {
        title: 'Suivi qualite',
        description:
          'Nous ajustons nos prestations selon l\'evolution de votre jardin et vos retours.',
      },
    ],
    faq: [
      {
        question: 'A quelle frequence devez-vous intervenir ?',
        answer:
          'Cela depend de la surface et du type de jardin. En general, une intervention toutes les 2 semaines au printemps/ete et mensuelle en automne/hiver suffit pour un jardin standard.',
      },
      {
        question: 'Que faites-vous des dechets verts ?',
        answer:
          'Nous evacuons systematiquement tous les dechets verts vers un centre de compostage agree. L\'evacuation est incluse dans nos tarifs.',
      },
      {
        question: 'Intervenez-vous pendant les vacances ?',
        answer:
          'Oui, nous pouvons intervenir en votre absence. C\'est meme l\'ideal pour que vous retrouviez un jardin impeccable a votre retour.',
      },
    ],
  },
  {
    slug: 'elagage',
    title: 'Elagage et Taille d\'Arbres',
    shortTitle: 'Elagage',
    icon: '🪓',
    metaTitle: 'Elagage Angers - Taille d\'Arbres Professionnel | Art & Jardin',
    metaDescription:
      'Service d\'elagage professionnel a Angers. Taille d\'arbres, eclaircissage, haubanage, soin des arbres. Elagueurs certifies. Devis gratuit.',
    heroTitle: 'Elagage Professionnel a Angers',
    heroSubtitle:
      'Des arbres sains et esthetiques grace a l\'expertise de nos elagueurs certifies.',
    description: `
      L'elagage est un art qui necessite savoir-faire et precision. Chez Art & Jardin, nos elagueurs certifies
      interviennent sur tous types d'arbres pour assurer leur bonne sante, leur securite et leur esthetique.

      Un elagage bien realise permet de controler la croissance de l'arbre, d'ameliorer sa structure, de prevenir
      les risques de chute de branches et de favoriser la penetration de la lumiere. Nos techniques respectent
      la physiologie de l'arbre pour garantir une cicatrisation optimale.

      Nous intervenons aussi bien chez les particuliers que pour les coproprietes, les entreprises et les collectivites.
      Notre parc de materiel professionnel (nacelles, broyeurs) nous permet d'intervenir sur les arbres les plus
      imposants en toute securite.
    `,
    features: [
      'Taille de formation pour jeunes arbres',
      'Taille d\'entretien et eclaircissage',
      'Taille de reduction de volume',
      'Taille de securisation (branches dangereuses)',
      'Haubanage et consolidation',
      'Demontage technique',
      'Soin des arbres malades',
      'Diagnostic phytosanitaire',
    ],
    benefits: [
      'Arbres plus sains et vigoureux',
      'Reduction des risques de chute',
      'Meilleure luminosite dans le jardin',
      'Respect de la legislation (distances, hauteurs)',
      'Intervention securisee et assuree',
    ],
    process: [
      {
        title: 'Diagnostic sur place',
        description:
          'Nous examinons vos arbres pour evaluer leur etat sanitaire et les travaux necessaires.',
      },
      {
        title: 'Devis detaille',
        description:
          'Nous vous remettons un devis precisant le type de taille, les moyens utilises et le prix.',
      },
      {
        title: 'Intervention',
        description:
          'Nos elagueurs interviennent avec le materiel adapte : cordes, nacelle, broyeur...',
      },
      {
        title: 'Nettoyage complet',
        description:
          'Nous evacuons tous les dechets et laissons votre jardin propre.',
      },
    ],
    faq: [
      {
        question: 'Quand faut-il elaguer ses arbres ?',
        answer:
          'La periode ideale varie selon les especes. En general, l\'hiver (hors gel) est recommande pour la plupart des arbres, mais certains comme les cerisiers se taillent apres la floraison.',
      },
      {
        question: 'Faut-il une autorisation pour elaguer ?',
        answer:
          'Pour les arbres classés ou en zone protegee, une autorisation peut etre necessaire. Nous pouvons vous accompagner dans ces demarches administratives.',
      },
      {
        question: 'Quelle est la difference entre elagage et taille ?',
        answer:
          'L\'elagage concerne la coupe de grosses branches sur les arbres de grande taille, tandis que la taille s\'applique aux arbustes et haies. Les techniques et le materiel different.',
      },
    ],
  },
  {
    slug: 'abattage',
    title: 'Abattage d\'Arbres',
    shortTitle: 'Abattage',
    icon: '🌲',
    metaTitle: 'Abattage d\'Arbres Angers - Dessouchage | Art & Jardin',
    metaDescription:
      'Service d\'abattage d\'arbres securise a Angers. Abattage, demontage, dessouchage, evacuation. Intervention rapide. Devis gratuit.',
    heroTitle: 'Abattage d\'Arbres Securise a Angers',
    heroSubtitle:
      'Elimination sure et efficace des arbres dangereux, malades ou genants par des professionnels.',
    description: `
      L'abattage d'un arbre est une operation delicate qui ne s'improvise pas. Qu'il s'agisse d'un arbre malade,
      dangereux, mort ou simplement mal place, Art & Jardin realise l'abattage en toute securite avec les
      techniques adaptees a chaque situation.

      Nos equipes evaluent systematiquement les risques avant intervention : proximite de batiments, lignes
      electriques, acces, espace de chute... Selon le contexte, nous procedons a un abattage direct ou a un
      demontage piece par piece pour les situations les plus contraintes.

      Apres l'abattage, nous proposons egalement le dessouchage (rogneuse de souche) et l'evacuation complete
      des debris. Votre terrain est ainsi pret pour un nouvel amenagement ou une nouvelle plantation.
    `,
    features: [
      'Abattage direct en terrain degage',
      'Demontage technique en zone contrainte',
      'Abattage d\'arbres pres des batiments',
      'Intervention sur arbres dangereux (tempete)',
      'Dessouchage a la rogneuse',
      'Evacuation et valorisation du bois',
      'Debroussaillage associe',
      'Conseil pour replantation',
    ],
    benefits: [
      'Securite garantie pour les personnes et biens',
      'Intervention rapide en urgence',
      'Materiel professionnel adapte',
      'Entreprise assuree',
      'Terrain nettoye et pret a l\'emploi',
    ],
    process: [
      {
        title: 'Evaluation du chantier',
        description:
          'Nous analysons l\'arbre a abattre, son environnement et definissons la methode appropriee.',
      },
      {
        title: 'Preparation du site',
        description:
          'Mise en place de la zone de securite, protection des elements proches si necessaire.',
      },
      {
        title: 'Abattage ou demontage',
        description:
          'Realisation de l\'operation avec les techniques et equipements adaptes.',
      },
      {
        title: 'Dessouchage optionnel',
        description:
          'Elimination de la souche a la rogneuse pour liberer totalement l\'espace.',
      },
      {
        title: 'Nettoyage final',
        description:
          'Evacuation complete des debris, remise en etat du terrain.',
      },
    ],
    faq: [
      {
        question: 'Faut-il une autorisation pour abattre un arbre ?',
        answer:
          'Cela depend de votre commune et du type d\'arbre. En zone protegee ou pour les arbres classes, une autorisation est obligatoire. Nous vous aidons a faire les demarches.',
      },
      {
        question: 'Que faites-vous du bois ?',
        answer:
          'Nous proposons plusieurs options : evacuation complete, debit en buches si vous souhaitez le conserver, ou valorisation par nos soins. Le choix vous appartient.',
      },
      {
        question: 'Intervenez-vous en urgence apres tempete ?',
        answer:
          'Oui, nous disposons d\'une ligne d\'urgence pour les arbres tombes ou dangereux. Nous intervenons rapidement pour securiser les lieux.',
      },
    ],
  },
];

export function getServiceBySlug(slug: string): ServiceData | undefined {
  return services.find((s) => s.slug === slug);
}
