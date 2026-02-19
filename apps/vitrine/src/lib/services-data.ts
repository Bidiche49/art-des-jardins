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
  priceRange: {
    lowPrice: number;
    highPrice: number;
    unit: string;
    label: string;
  };
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
    title: 'Aménagement Paysager et Création de Jardin',
    shortTitle: 'Aménagement paysager',
    icon: '🌳',
    metaTitle: 'Paysagiste Angers - Aménagement de Jardin | Art des Jardins',
    metaDescription:
      'Paysagiste professionnel à Angers. Conception et réalisation de jardins sur mesure : terrasses, massifs, engazonnement, arrosage automatique. Devis gratuit.',
    heroTitle: 'Aménagement de Jardin à Angers',
    heroSubtitle:
      'Transformez votre extérieur en un espace de vie unique avec notre équipe de paysagistes professionnels.',
    description: `
      Art des Jardins est votre partenaire de confiance pour tous vos projets d'aménagement paysager dans la région d'Angers.
      Forts de notre expérience et de notre passion pour les espaces verts, nous concevons et réalisons des jardins qui
      reflètent votre personnalité et s'adaptent parfaitement à votre mode de vie.

      Notre approche de l'aménagement paysager combine créativité, expertise technique et respect de l'environnement. Chaque projet
      est unique : nous prenons le temps d'écouter vos envies, d'analyser votre terrain et de vous proposer des solutions
      sur mesure qui valorisent votre propriété.

      Que vous souhaitiez créer un jardin contemporain aux lignes épurées, un espace champêtre et naturel, ou un jardin
      méditerranéen plein de couleurs, notre équipe saura donner vie à vos rêves. Nous travaillons avec des végétaux
      adaptés au climat de la Loire, sélectionnés pour leur robustesse et leur beauté durable.
    `,
    features: [
      'Conception de plans paysagers personnalisés',
      'Création de terrasses et espaces de vie extérieurs',
      'Plantation de massifs, arbres et arbustes',
      'Engazonnement et création de pelouses',
      'Installation de systèmes d\'arrosage automatique',
      'Aménagement de bassins et points d\'eau',
      'Pose de clôtures et bordures',
      'Éclairage de jardin',
    ],
    benefits: [
      'Valorisation de votre propriété',
      'Espace de détente personnalisé',
      'Entretien facilité grâce à une conception réfléchie',
      'Végétaux adaptés au climat local',
      'Respect de votre budget',
    ],
    priceRange: {
      lowPrice: 50,
      highPrice: 150,
      unit: '/m²',
      label: '50 € – 150 € / m²',
    },
    process: [
      {
        title: 'Visite et analyse',
        description:
          'Nous nous déplaçons gratuitement pour étudier votre terrain, comprendre vos besoins et vos envies.',
      },
      {
        title: 'Conception du projet',
        description:
          'Notre équipe élabore un plan détaillé avec choix des végétaux, matériaux et estimation précise.',
      },
      {
        title: 'Validation et planification',
        description:
          'Nous ajustons le projet selon vos retours et planifions les travaux à la période idéale.',
      },
      {
        title: 'Réalisation',
        description:
          'Nos équipes exécutent les travaux avec soin, dans le respect des délais convenus.',
      },
      {
        title: 'Suivi et conseils',
        description:
          'Nous vous accompagnons après les travaux avec des conseils d\'entretien personnalisés.',
      },
    ],
    faq: [
      {
        question: 'Quel est le coût moyen d\'un aménagement de jardin ?',
        answer:
          'Le prix varie selon la surface et la complexité du projet. Comptez entre 50 et 150€/m2 pour un aménagement complet. Nous établissons toujours un devis détaillé et gratuit avant de commencer.',
      },
      {
        question: 'Quelle est la meilleure période pour aménager un jardin ?',
        answer:
          'L\'automne et le printemps sont idéaux pour les plantations. Cependant, nous pouvons réaliser les travaux de terrassement et de maçonnerie toute l\'année.',
      },
      {
        question: 'Proposez-vous un service d\'entretien après l\'aménagement ?',
        answer:
          'Oui, nous proposons des contrats d\'entretien annuels pour maintenir votre jardin en parfait état. Tonte, taille, désherbage... nous nous occupons de tout.',
      },
    ],
  },
  {
    slug: 'entretien-jardin',
    title: 'Entretien de Jardin',
    shortTitle: 'Entretien',
    icon: '✂️',
    metaTitle: 'Entretien de Jardin Angers - Tonte, Taille, Désherbage | Art des Jardins',
    metaDescription:
      'Service d\'entretien de jardin à Angers. Tonte de pelouse, taille de haies, désherbage, nettoyage. Contrats annuels ou interventions ponctuelles. Devis gratuit.',
    heroTitle: 'Entretien de Jardin à Angers',
    heroSubtitle:
      'Un jardin impeccable toute l\'année sans effort grâce à notre service d\'entretien professionnel.',
    description: `
      Un beau jardin demande un entretien régulier et adapté à chaque saison. Art des Jardins vous propose un service
      d'entretien complet pour que vous puissiez profiter de votre extérieur sans contrainte.

      Notre équipe de jardiniers professionnels intervient régulièrement selon un calendrier adapté à votre jardin
      et à vos besoins. Nous utilisons des équipements professionnels et des techniques respectueuses de l'environnement
      pour garantir un résultat impeccable.

      Que vous ayez un petit jardin de ville ou un grand parc, nous adaptons nos prestations à vos attentes et à votre
      budget. Nos contrats d'entretien sont flexibles : interventions hebdomadaires, bi-mensuelles ou mensuelles selon
      la saison et vos préférences.
    `,
    features: [
      'Tonte de pelouse et réfection de gazon',
      'Taille de haies, arbustes et topiaires',
      'Désherbage manuel et écologique',
      'Ramassage des feuilles mortes',
      'Bêchage et préparation des massifs',
      'Traitement phytosanitaire raisonné',
      'Évacuation des déchets verts',
      'Hivernage et protection des plantes',
    ],
    benefits: [
      'Gain de temps considérable',
      'Jardin toujours impeccable',
      'Matériels professionnels fournis',
      'Conseils de jardinage inclus',
      'Tarifs dégressifs en contrat annuel',
    ],
    priceRange: {
      lowPrice: 30,
      highPrice: 60,
      unit: '/heure',
      label: '30 € – 60 € / heure',
    },
    process: [
      {
        title: 'Évaluation des besoins',
        description:
          'Nous visitons votre jardin pour évaluer les travaux nécessaires et la fréquence d\'intervention.',
      },
      {
        title: 'Proposition personnalisée',
        description:
          'Nous vous remettons un devis détaillé avec planning d\'intervention adapté aux saisons.',
      },
      {
        title: 'Interventions régulières',
        description:
          'Notre équipe intervient selon le calendrier établi, avec ou sans votre présence.',
      },
      {
        title: 'Suivi qualité',
        description:
          'Nous ajustons nos prestations selon l\'évolution de votre jardin et vos retours.',
      },
    ],
    faq: [
      {
        question: 'À quelle fréquence devez-vous intervenir ?',
        answer:
          'Cela dépend de la surface et du type de jardin. En général, une intervention toutes les 2 semaines au printemps/été et mensuelle en automne/hiver suffit pour un jardin standard.',
      },
      {
        question: 'Que faites-vous des déchets verts ?',
        answer:
          'Nous évacuons systématiquement tous les déchets verts vers un centre de compostage agréé. L\'évacuation est incluse dans nos tarifs.',
      },
      {
        question: 'Intervenez-vous pendant les vacances ?',
        answer:
          'Oui, nous pouvons intervenir en votre absence. C\'est même l\'idéal pour que vous retrouviez un jardin impeccable à votre retour.',
      },
    ],
  },
  {
    slug: 'elagage',
    title: 'Élagage et Taille d\'Arbres',
    shortTitle: 'Élagage',
    icon: '🪓',
    metaTitle: 'Élagage Angers - Taille d\'Arbres Professionnel | Art des Jardins',
    metaDescription:
      'Service d\'élagage professionnel à Angers. Taille d\'arbres, éclaircissage, haubanage, soin des arbres. Élagueurs certifiés. Devis gratuit.',
    heroTitle: 'Élagage Professionnel à Angers',
    heroSubtitle:
      'Des arbres sains et esthétiques grâce à l\'expertise de nos élagueurs certifiés.',
    description: `
      L'élagage est un art qui nécessite savoir-faire et précision. Chez Art des Jardins, nos élagueurs certifiés
      interviennent sur tous types d'arbres pour assurer leur bonne santé, leur sécurité et leur esthétique.

      Un élagage bien réalisé permet de contrôler la croissance de l'arbre, d'améliorer sa structure, de prévenir
      les risques de chute de branches et de favoriser la pénétration de la lumière. Nos techniques respectent
      la physiologie de l'arbre pour garantir une cicatrisation optimale.

      Nous intervenons aussi bien chez les particuliers que pour les copropriétés, les entreprises et les collectivités.
      Notre parc de matériel professionnel (nacelles, broyeurs) nous permet d'intervenir sur les arbres les plus
      imposants en toute sécurité.
    `,
    features: [
      'Taille de formation pour jeunes arbres',
      'Taille d\'entretien et éclaircissage',
      'Taille de réduction de volume',
      'Taille de sécurisation (branches dangereuses)',
      'Haubanage et consolidation',
      'Démontage technique',
      'Soin des arbres malades',
      'Diagnostic phytosanitaire',
    ],
    benefits: [
      'Arbres plus sains et vigoureux',
      'Réduction des risques de chute',
      'Meilleure luminosité dans le jardin',
      'Respect de la législation (distances, hauteurs)',
      'Intervention sécurisée et assurée',
    ],
    priceRange: {
      lowPrice: 100,
      highPrice: 800,
      unit: '/arbre',
      label: '100 € – 800 € / arbre',
    },
    process: [
      {
        title: 'Diagnostic sur place',
        description:
          'Nous examinons vos arbres pour évaluer leur état sanitaire et les travaux nécessaires.',
      },
      {
        title: 'Devis détaillé',
        description:
          'Nous vous remettons un devis précisant le type de taille, les moyens utilisés et le prix.',
      },
      {
        title: 'Intervention',
        description:
          'Nos élagueurs interviennent avec le matériel adapté : cordes, nacelle, broyeur...',
      },
      {
        title: 'Nettoyage complet',
        description:
          'Nous évacuons tous les déchets et laissons votre jardin propre.',
      },
    ],
    faq: [
      {
        question: 'Quand faut-il élaguer ses arbres ?',
        answer:
          'La période idéale varie selon les espèces. En général, l\'hiver (hors gel) est recommandé pour la plupart des arbres, mais certains comme les cerisiers se taillent après la floraison.',
      },
      {
        question: 'Faut-il une autorisation pour élaguer ?',
        answer:
          'Pour les arbres classés ou en zone protégée, une autorisation peut être nécessaire. Nous pouvons vous accompagner dans ces démarches administratives.',
      },
      {
        question: 'Quelle est la différence entre élagage et taille ?',
        answer:
          'L\'élagage concerne la coupe de grosses branches sur les arbres de grande taille, tandis que la taille s\'applique aux arbustes et haies. Les techniques et le matériel diffèrent.',
      },
    ],
  },
  {
    slug: 'abattage',
    title: 'Abattage d\'Arbres',
    shortTitle: 'Abattage',
    icon: '🌲',
    metaTitle: 'Abattage d\'Arbres Angers - Dessouchage | Art des Jardins',
    metaDescription:
      'Service d\'abattage d\'arbres sécurisé à Angers. Abattage, démontage, dessouchage, évacuation. Intervention rapide. Devis gratuit.',
    heroTitle: 'Abattage d\'Arbres Sécurisé à Angers',
    heroSubtitle:
      'Élimination sûre et efficace des arbres dangereux, malades ou gênants par des professionnels.',
    description: `
      L'abattage d'un arbre est une opération délicate qui ne s'improvise pas. Qu'il s'agisse d'un arbre malade,
      dangereux, mort ou simplement mal placé, Art des Jardins réalise l'abattage en toute sécurité avec les
      techniques adaptées à chaque situation.

      Nos équipes évaluent systématiquement les risques avant intervention : proximité de bâtiments, lignes
      électriques, accès, espace de chute... Selon le contexte, nous procédons à un abattage direct ou à un
      démontage pièce par pièce pour les situations les plus contraintes.

      Après l'abattage, nous proposons également le dessouchage (rogneuse de souche) et l'évacuation complète
      des débris. Votre terrain est ainsi prêt pour un nouvel aménagement ou une nouvelle plantation.
    `,
    features: [
      'Abattage direct en terrain dégagé',
      'Démontage technique en zone contrainte',
      'Abattage d\'arbres près des bâtiments',
      'Intervention sur arbres dangereux (tempête)',
      'Dessouchage à la rogneuse',
      'Évacuation et valorisation du bois',
      'Débroussaillage associé',
      'Conseil pour replantation',
    ],
    benefits: [
      'Sécurité garantie pour les personnes et biens',
      'Intervention rapide en urgence',
      'Matériel professionnel adapté',
      'Entreprise assurée',
      'Terrain nettoyé et prêt à l\'emploi',
    ],
    priceRange: {
      lowPrice: 300,
      highPrice: 2000,
      unit: '/arbre',
      label: '300 € – 2 000 € / arbre',
    },
    process: [
      {
        title: 'Évaluation du chantier',
        description:
          'Nous analysons l\'arbre à abattre, son environnement et définissons la méthode appropriée.',
      },
      {
        title: 'Préparation du site',
        description:
          'Mise en place de la zone de sécurité, protection des éléments proches si nécessaire.',
      },
      {
        title: 'Abattage ou démontage',
        description:
          'Réalisation de l\'opération avec les techniques et équipements adaptés.',
      },
      {
        title: 'Dessouchage optionnel',
        description:
          'Élimination de la souche à la rogneuse pour libérer totalement l\'espace.',
      },
      {
        title: 'Nettoyage final',
        description:
          'Évacuation complète des débris, remise en état du terrain.',
      },
    ],
    faq: [
      {
        question: 'Faut-il une autorisation pour abattre un arbre ?',
        answer:
          'Cela dépend de votre commune et du type d\'arbre. En zone protégée ou pour les arbres classés, une autorisation est obligatoire. Nous vous aidons à faire les démarches.',
      },
      {
        question: 'Que faites-vous du bois ?',
        answer:
          'Nous proposons plusieurs options : évacuation complète, débit en bûches si vous souhaitez le conserver, ou valorisation par nos soins. Le choix vous appartient.',
      },
      {
        question: 'Intervenez-vous en urgence après tempête ?',
        answer:
          'Oui, nous disposons d\'une ligne d\'urgence pour les arbres tombés ou dangereux. Nous intervenons rapidement pour sécuriser les lieux.',
      },
    ],
  },
];

export function getServiceBySlug(slug: string): ServiceData | undefined {
  return services.find((s) => s.slug === slug);
}
