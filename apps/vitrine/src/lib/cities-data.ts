export interface CityData {
  slug: string;
  name: string;
  department: string;
  postalCode: string;
  population?: string;
  distance?: string; // from Angers
  description: string;
  specificContent: string;
  neighborhoods?: string[];
}

export interface ServiceCityData {
  service: 'paysagiste' | 'elagage' | 'entretien-jardin' | 'abattage';
  serviceTitle: string;
  serviceTitlePlural: string;
  serviceDescription: string;
  metaTitleTemplate: string;
  metaDescriptionTemplate: string;
  features: string[];
}

export const serviceTypes: ServiceCityData[] = [
  {
    service: 'paysagiste',
    serviceTitle: 'Paysagiste',
    serviceTitlePlural: 'Paysagistes',
    serviceDescription: 'aménagement et création de jardins',
    metaTitleTemplate: 'Paysagiste {city} - Aménagement Jardin | Art des Jardins',
    metaDescriptionTemplate:
      'Paysagiste professionnel à {city}. Aménagement de jardin, terrasse, engazonnement, plantation. Devis gratuit sous 48h.',
    features: [
      'Conception de jardins sur mesure',
      'Création de terrasses et allées',
      'Plantation d\'arbres et arbustes',
      'Engazonnement et pelouse',
      'Arrosage automatique',
      'Éclairage de jardin',
    ],
  },
  {
    service: 'elagage',
    serviceTitle: 'Élagage',
    serviceTitlePlural: 'Services d\'élagage',
    serviceDescription: 'taille et soins des arbres',
    metaTitleTemplate: 'Élagage {city} - Taille d\'Arbres | Art des Jardins',
    metaDescriptionTemplate:
      'Élagueur professionnel à {city}. Taille d\'arbres, éclaircissage, taille de sécurisation. Élagueurs certifiés. Devis gratuit.',
    features: [
      'Taille de formation et d\'entretien',
      'Éclaircissage de couronne',
      'Taille de réduction',
      'Taille de sécurisation',
      'Haubanage',
      'Diagnostic phytosanitaire',
    ],
  },
  {
    service: 'entretien-jardin',
    serviceTitle: 'Entretien de jardin',
    serviceTitlePlural: 'Services d\'entretien',
    serviceDescription: 'entretien régulier de jardins',
    metaTitleTemplate: 'Entretien Jardin {city} - Tonte, Taille | Art des Jardins',
    metaDescriptionTemplate:
      'Entretien de jardin à {city}. Tonte pelouse, taille haies, désherbage. Contrat annuel ou ponctuel. Devis gratuit.',
    features: [
      'Tonte de pelouse',
      'Taille de haies et arbustes',
      'Désherbage écologique',
      'Ramassage des feuilles',
      'Traitement phytosanitaire',
      'Évacuation des déchets verts',
    ],
  },
  {
    service: 'abattage',
    serviceTitle: 'Abattage',
    serviceTitlePlural: 'Services d\'abattage',
    serviceDescription: 'abattage et dessouchage d\'arbres',
    metaTitleTemplate: 'Abattage Arbres {city} - Dessouchage | Art des Jardins',
    metaDescriptionTemplate:
      'Abattage d\'arbres sécurisé à {city}. Démontage technique, dessouchage, évacuation. Intervention urgence. Devis gratuit.',
    features: [
      'Abattage direct',
      'Démontage technique',
      'Dessouchage à la rogneuse',
      'Évacuation du bois',
      'Intervention d\'urgence',
      'Sécurisation après tempête',
    ],
  },
];

export const cities: CityData[] = [
  {
    slug: 'angers',
    name: 'Angers',
    department: 'Maine-et-Loire',
    postalCode: '49000',
    population: '155 000',
    description:
      'Capitale du Maine-et-Loire, Angers est une ville verte aux nombreux parcs et jardins. Connue pour son château et ses ardoises, elle offre un cadre de vie agréable avec un patrimoine végétal exceptionnel.',
    specificContent: `
      Angers, ville d'art et d'histoire, possède un patrimoine végétal remarquable avec plus de 600 hectares d'espaces verts.
      Du jardin des Plantes au parc de la Garenne, les Angevins sont particulièrement attachés à leur cadre de vie verdoyant.

      Art des Jardins intervient dans tous les quartiers d'Angers : La Doutre, Saint-Serge, Belle-Beille, Monplaisir, Roseraie,
      Les Hauts de Saint-Aubin, et dans le centre historique. Nous connaissons parfaitement les réglementations locales,
      notamment en ce qui concerne les arbres classés et les zones protégées du secteur sauvegardé.

      Le climat angevin, doux et humide, est propice à une grande variété de végétaux. Nous sélectionnons des espèces
      adaptées à ce terroir particulier : hortensias, camellias, magnolias... qui font la réputation des jardins angevins.

      Notre équipe intervient aussi bien pour les jardins de maisons de maître que pour les petits espaces des quartiers
      plus denses. Nous adaptons nos prestations à chaque projet, avec le même souci de qualité et de durabilité.
    `,
    neighborhoods: [
      'La Doutre',
      'Saint-Serge',
      'Belle-Beille',
      'Monplaisir',
      'Roseraie',
      'Les Hauts de Saint-Aubin',
      'Centre-ville',
      'Lac de Maine',
    ],
  },
  {
    slug: 'avrille',
    name: 'Avrillé',
    department: 'Maine-et-Loire',
    postalCode: '49240',
    population: '14 000',
    distance: '5 km',
    description:
      'Commune résidentielle au nord d\'Angers, Avrillé est appréciée pour son cadre de vie verdoyant et ses nombreux espaces naturels.',
    specificContent: `
      Avrillé, commune limitrophe d'Angers, offre un cadre de vie particulièrement agréable avec ses nombreux espaces verts
      et son caractère résidentiel. Les habitants y possèdent souvent des jardins de belle superficie qui nécessitent
      un entretien adapté.

      Art des Jardins connaît parfaitement Avrillé et ses quartiers : la Perrière, l'Adezière, le bourg historique...
      Nous intervenons régulièrement dans cette commune où les jardins sont généralement bien exposés et propices
      à de belles réalisations paysagères.

      La proximité d'Angers nous permet d'intervenir rapidement et fréquemment, que ce soit pour un entretien régulier
      ou des travaux ponctuels d'aménagement ou d'élagage. Nous proposons des contrats d'entretien adaptés aux
      spécificités des jardins avrillais.
    `,
    neighborhoods: ['Centre-bourg', 'La Perrière', 'L\'Adezière'],
  },
  {
    slug: 'beaucouze',
    name: 'Beaucouzé',
    department: 'Maine-et-Loire',
    postalCode: '49070',
    population: '5 500',
    distance: '7 km',
    description:
      'Commune de l\'ouest angevin, Beaucouzé allie zones résidentielles et commerciales avec de nombreux espaces verts à entretenir.',
    specificContent: `
      Beaucouzé, située à l'ouest d'Angers, est une commune dynamique qui mélange zones résidentielles et commerciales.
      Les quartiers résidentiels offrent des jardins souvent spacieux qui bénéficient d'un bon ensoleillement.

      Notre équipe intervient régulièrement à Beaucouzé, aussi bien pour les particuliers que pour les entreprises
      de la zone commerciale Atoll. Nous proposons des solutions adaptées à chaque type de client : contrats d'entretien
      pour les particuliers, interventions ponctuelles ou régulières pour les professionnels.

      Les jardins de Beaucouzé présentent souvent des arbres de belle taille qui nécessitent un élagage régulier.
      Nos élagueurs certifiés interviennent dans le respect des règles de l'art pour garantir la santé et l'esthétique
      de vos arbres.
    `,
    neighborhoods: ['Centre-bourg', 'Zone Atoll'],
  },
  {
    slug: 'bouchemaine',
    name: 'Bouchemaine',
    department: 'Maine-et-Loire',
    postalCode: '49080',
    population: '6 800',
    distance: '8 km',
    description:
      'Au confluent de la Maine et de la Loire, Bouchemaine offre des paysages exceptionnels et des jardins souvent en bord de rivière.',
    specificContent: `
      Bouchemaine, au confluent de la Maine et de la Loire, jouit d'une situation privilégiée qui en fait une commune
      très prisée. Les jardins y sont souvent remarquables, avec des vues sur l'eau et une végétation luxuriante
      favorisée par la proximité des cours d'eau.

      Art des Jardins connaît bien les spécificités des jardins de Bouchemaine : sols souvent humides, risque d'inondation
      dans certaines zones, végétation de bord de rivière... Nous sélectionnons des végétaux adaptés à ces conditions
      particulières : saules, aulnes, iris d'eau...

      L'entretien des jardins en zone inondable demande une expertise particulière. Nous intervenons en respectant
      les cycles naturels et en privilégiant des aménagements résilients qui supportent les crues occasionnelles.
    `,
    neighborhoods: ['Bourg', 'La Pointe', 'Pruneaux'],
  },
  {
    slug: 'saint-barthelemy-anjou',
    name: 'Saint-Barthélemy-d\'Anjou',
    department: 'Maine-et-Loire',
    postalCode: '49124',
    population: '9 500',
    distance: '4 km',
    description:
      'Commune de l\'est angevin en plein développement, Saint-Barthélemy offre un mix de quartiers résidentiels et de zones d\'activités.',
    specificContent: `
      Saint-Barthélemy-d'Anjou, à l'est d'Angers, connaît un fort développement avec de nombreux programmes immobiliers.
      Les jardins y sont souvent récents et nécessitent des aménagements pour créer de véritables espaces de vie.

      Art des Jardins accompagne de nombreux propriétaires barthéloméens dans la création de leur jardin : conception,
      plantation, engazonnement... Nous réalisons des jardins clés en main qui correspondent à vos envies et à votre
      mode de vie.

      Pour les jardins déjà établis, nous proposons des contrats d'entretien adaptés. La commune présentant de nombreux
      lotissements avec des jardins de taille moyenne, nous avons développé des offres spécifiques pour ce type de
      propriétés.
    `,
    neighborhoods: ['Bourg', 'Les Music\'Halles', 'Zone des Music\'Halles'],
  },
  {
    slug: 'trelaze',
    name: 'Trélazé',
    department: 'Maine-et-Loire',
    postalCode: '49800',
    population: '14 000',
    distance: '5 km',
    description:
      'Ancienne cité ardoisière, Trélazé est une commune populaire avec un riche patrimoine industriel et de nombreux jardins ouvriers.',
    specificContent: `
      Trélazé, ancienne capitale de l'ardoise, possède un patrimoine unique avec ses buttes d'ardoise et ses anciennes
      carrières transformées en espaces naturels. Les jardins y ont une histoire particulière, avec une tradition
      de jardins ouvriers qui perdure.

      Art des Jardins intervient dans tous les quartiers de Trélazé : le centre, les Music'Halles, Petit Trélazé...
      Nous connaissons les particularités du sol trélazéen, souvent schisteux, et sélectionnons des végétaux adaptés.

      Les espaces résiduels des anciennes carrières offrent des opportunités d'aménagement originales. Nous savons
      tirer parti de ces terrains atypiques pour créer des jardins uniques qui respectent l'identité de la commune.
    `,
    neighborhoods: ['Centre-ville', 'Les Music\'Halles', 'Petit Trélazé'],
  },
  {
    slug: 'les-ponts-de-ce',
    name: 'Les Ponts-de-Cé',
    department: 'Maine-et-Loire',
    postalCode: '49130',
    population: '12 500',
    distance: '7 km',
    description:
      'Ville insulaire sur la Loire, Les Ponts-de-Cé possède un patrimoine remarquable et des jardins au caractère ligérien prononcé.',
    specificContent: `
      Les Ponts-de-Cé, cité insulaire sur la Loire, offre un cadre de vie exceptionnel avec ses îles, ses bras de Loire
      et son patrimoine architectural. Les jardins y ont un caractère ligérien prononcé, avec une végétation adaptée
      aux sols sablonneux et aux crues.

      Art des Jardins connaît parfaitement les contraintes des jardins ponts-de-céais : sols filtrants, exposition au vent,
      risque d'inondation... Nous concevons des aménagements adaptés à ces conditions spécifiques, avec des végétaux
      résistants et des solutions techniques appropriées.

      L'élagage des nombreux arbres de bord de Loire nécessite une expertise particulière. Nos élagueurs interviennent
      régulièrement pour sécuriser les arbres tout en préservant leur caractère naturel qui fait le charme de la ville.
    `,
    neighborhoods: ['Centre', 'Saint-Aubin', 'Saint-Maurille', 'Sorges'],
  },
  {
    slug: 'ecouflant',
    name: 'Écouflant',
    department: 'Maine-et-Loire',
    postalCode: '49000',
    population: '4 500',
    distance: '6 km',
    description:
      'Commune au nord d\'Angers entre Sarthe et basses vallées angevines, Écouflant offre un cadre naturel préservé avec de nombreux jardins.',
    specificContent: `
      Écouflant, nichée entre la Sarthe et les basses vallées angevines, bénéficie d'un environnement naturel
      exceptionnel. Les jardins y sont souvent généreux et permettent de belles réalisations paysagères dans un
      cadre champêtre.

      Art des Jardins intervient régulièrement à Écouflant, où les propriétés offrent souvent des surfaces importantes.
      Nous réalisons des aménagements qui s'intègrent harmonieusement dans ce paysage de bords de Sarthe, en utilisant
      des végétaux locaux et des matériaux naturels.

      L'entretien des grands jardins écouflantais nécessite une organisation rigoureuse. Nous proposons des contrats
      adaptés qui permettent de maintenir ces espaces en parfait état tout au long de l'année.
    `,
    neighborhoods: ['Bourg', 'Basse-Île', 'Éventard'],
  },
  {
    slug: 'cantenay-epinard',
    name: 'Cantenay-Épinard',
    department: 'Maine-et-Loire',
    postalCode: '49460',
    population: '2 400',
    distance: '10 km',
    description:
      'Village rural au nord d\'Angers, Cantenay-Épinard conserve un caractère authentique avec ses fermes rénovées et leurs grands jardins.',
    specificContent: `
      Cantenay-Épinard, commune rurale au nord d'Angers, a su conserver son caractère authentique. Les anciennes
      fermes rénovées y possèdent souvent de grands terrains qui offrent de belles opportunités d'aménagement.

      Art des Jardins intervient à Cantenay-Épinard pour des projets variés : création de jardins pour les nouvelles
      constructions, rénovation de parcs autour des demeures anciennes, entretien de grands espaces...

      Le caractère rural de la commune nous inspire des aménagements naturels qui s'intègrent dans le paysage :
      haies champêtres, vergers, prairies fleuries... Nous privilégions des solutions écologiques adaptées à
      l'esprit du lieu.
    `,
    neighborhoods: ['Bourg', 'Cantenay', 'Épinard'],
  },
  {
    slug: 'murs-erigne',
    name: 'Mûrs-Érigné',
    department: 'Maine-et-Loire',
    postalCode: '49610',
    population: '5 500',
    distance: '10 km',
    description:
      'Commune viticole au sud-ouest d\'Angers, Mûrs-Érigné est appréciée pour son cadre de vie entre vignes et Loire.',
    specificContent: `
      Mûrs-Érigné, commune viticole des coteaux de Loire, offre un cadre de vie privilégié entre vignobles et fleuve.
      Les jardins y bénéficient d'une exposition favorable et d'un microclimat propice à de nombreuses espèces
      méditerranéennes.

      Art des Jardins connaît bien les particularités des terrains de Mûrs-Érigné : coteaux schisteux, exposition sud,
      sols parfois calcaires... Nous sélectionnons des végétaux adaptés à ces conditions : lavandes, romarins,
      oliviers... qui s'épanouissent dans ce terroir viticole.

      Les propriétés avec vue sur Loire sont nombreuses et méritent des aménagements à la hauteur du paysage.
      Nous concevons des jardins qui tirent parti de ces panoramas exceptionnels tout en respectant l'intimité
      des propriétaires.
    `,
    neighborhoods: ['Mûrs', 'Érigné'],
  },
];

export function getCityBySlug(slug: string): CityData | undefined {
  return cities.find((c) => c.slug === slug);
}

export function getServiceBySlugSeo(slug: string): ServiceCityData | undefined {
  return serviceTypes.find((s) => s.service === slug);
}

// Generate all service-city combinations
export function getAllServiceCityPaths(): { service: string; city: string }[] {
  const paths: { service: string; city: string }[] = [];
  for (const service of serviceTypes) {
    for (const city of cities) {
      paths.push({ service: service.service, city: city.slug });
    }
  }
  return paths;
}

// Main service pages (service-angers format)
export function getMainServicePages(): { slug: string; service: ServiceCityData; city: CityData }[] {
  return serviceTypes.map((service) => ({
    slug: `${service.service}-angers`,
    service,
    city: cities[0], // Angers
  }));
}
