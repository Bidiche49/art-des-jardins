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
    serviceDescription: 'amenagement et creation de jardins',
    metaTitleTemplate: 'Paysagiste {city} - Amenagement Jardin | Art des Jardins',
    metaDescriptionTemplate:
      'Paysagiste professionnel a {city}. Amenagement de jardin, terrasse, engazonnement, plantation. Devis gratuit sous 48h.',
    features: [
      'Conception de jardins sur mesure',
      'Creation de terrasses et allees',
      'Plantation d\'arbres et arbustes',
      'Engazonnement et pelouse',
      'Arrosage automatique',
      'Eclairage de jardin',
    ],
  },
  {
    service: 'elagage',
    serviceTitle: 'Elagage',
    serviceTitlePlural: 'Services d\'elagage',
    serviceDescription: 'taille et soins des arbres',
    metaTitleTemplate: 'Elagage {city} - Taille d\'Arbres | Art des Jardins',
    metaDescriptionTemplate:
      'Elagueur professionnel a {city}. Taille d\'arbres, eclaircissage, taille de securisation. Elagueurs certifies. Devis gratuit.',
    features: [
      'Taille de formation et d\'entretien',
      'Eclaircissage de couronne',
      'Taille de reduction',
      'Taille de securisation',
      'Haubanage',
      'Diagnostic phytosanitaire',
    ],
  },
  {
    service: 'entretien-jardin',
    serviceTitle: 'Entretien de jardin',
    serviceTitlePlural: 'Services d\'entretien',
    serviceDescription: 'entretien regulier de jardins',
    metaTitleTemplate: 'Entretien Jardin {city} - Tonte, Taille | Art des Jardins',
    metaDescriptionTemplate:
      'Entretien de jardin a {city}. Tonte pelouse, taille haies, desherbage. Contrat annuel ou ponctuel. Devis gratuit.',
    features: [
      'Tonte de pelouse',
      'Taille de haies et arbustes',
      'Desherbage ecologique',
      'Ramassage des feuilles',
      'Traitement phytosanitaire',
      'Evacuation des dechets verts',
    ],
  },
  {
    service: 'abattage',
    serviceTitle: 'Abattage',
    serviceTitlePlural: 'Services d\'abattage',
    serviceDescription: 'abattage et dessouchage d\'arbres',
    metaTitleTemplate: 'Abattage Arbres {city} - Dessouchage | Art des Jardins',
    metaDescriptionTemplate:
      'Abattage d\'arbres securise a {city}. Demontage technique, dessouchage, evacuation. Intervention urgence. Devis gratuit.',
    features: [
      'Abattage direct',
      'Demontage technique',
      'Dessouchage a la rogneuse',
      'Evacuation du bois',
      'Intervention d\'urgence',
      'Securisation apres tempete',
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
      'Capitale du Maine-et-Loire, Angers est une ville verte aux nombreux parcs et jardins. Connue pour son chateau et ses ardoises, elle offre un cadre de vie agreable avec un patrimoine vegetal exceptionnel.',
    specificContent: `
      Angers, ville d'art et d'histoire, possede un patrimoine vegetal remarquable avec plus de 600 hectares d'espaces verts.
      Du jardin des Plantes au parc de la Garenne, les Angevins sont particulierement attaches a leur cadre de vie verdoyant.

      Art des Jardins intervient dans tous les quartiers d'Angers : La Doutre, Saint-Serge, Belle-Beille, Monplaisir, Roseraie,
      Les Hauts de Saint-Aubin, et dans le centre historique. Nous connaissons parfaitement les reglementations locales,
      notamment en ce qui concerne les arbres classes et les zones protegees du secteur sauvegarde.

      Le climat angevin, doux et humide, est propice a une grande variete de vegetaux. Nous selectionnons des especes
      adaptees a ce terroir particulier : hortensias, camellias, magnolias... qui font la reputation des jardins angevins.

      Notre equipe intervient aussi bien pour les jardins de maisons de maitre que pour les petits espaces des quartiers
      plus denses. Nous adaptons nos prestations a chaque projet, avec le meme souci de qualite et de durabilite.
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
    name: 'Avrille',
    department: 'Maine-et-Loire',
    postalCode: '49240',
    population: '14 000',
    distance: '5 km',
    description:
      'Commune residentielle au nord d\'Angers, Avrille est appreciee pour son cadre de vie verdoyant et ses nombreux espaces naturels.',
    specificContent: `
      Avrille, commune limitrophe d'Angers, offre un cadre de vie particulierement agreable avec ses nombreux espaces verts
      et son caractere residentiel. Les habitants y possedent souvent des jardins de belle superficie qui necessitent
      un entretien adapte.

      Art des Jardins connait parfaitement Avrille et ses quartiers : la Perriere, l'Adeziere, le bourg historique...
      Nous intervenons regulierement dans cette commune ou les jardins sont generalement bien exposes et propices
      a de belles realisations paysageres.

      La proximite d'Angers nous permet d'intervenir rapidement et frequemment, que ce soit pour un entretien regulier
      ou des travaux ponctuels d'amenagement ou d'elagage. Nous proposons des contrats d'entretien adaptes aux
      specificites des jardins avrillais.
    `,
    neighborhoods: ['Centre-bourg', 'La Perriere', 'L\'Adeziere'],
  },
  {
    slug: 'beaucouze',
    name: 'Beaucouze',
    department: 'Maine-et-Loire',
    postalCode: '49070',
    population: '5 500',
    distance: '7 km',
    description:
      'Commune de l\'ouest angevin, Beaucouze allie zones residentielles et commerciales avec de nombreux espaces verts a entretenir.',
    specificContent: `
      Beaucouze, situee a l'ouest d'Angers, est une commune dynamique qui melange zones residentielles et commerciales.
      Les quartiers residentiels offrent des jardins souvent spacieux qui beneficient d'un bon ensoleillement.

      Notre equipe intervient regulierement a Beaucouze, aussi bien pour les particuliers que pour les entreprises
      de la zone commerciale Atoll. Nous proposons des solutions adaptees a chaque type de client : contrats d'entretien
      pour les particuliers, interventions ponctuelles ou regulieres pour les professionnels.

      Les jardins de Beaucouze presentent souvent des arbres de belle taille qui necessitent un elagage regulier.
      Nos elagueurs certifies interviennent dans le respect des regles de l'art pour garantir la sante et l'esthetique
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
      'Au confluent de la Maine et de la Loire, Bouchemaine offre des paysages exceptionnels et des jardins souvent en bord de riviere.',
    specificContent: `
      Bouchemaine, au confluent de la Maine et de la Loire, jouit d'une situation privilegiee qui en fait une commune
      tres prisee. Les jardins y sont souvent remarquables, avec des vues sur l'eau et une vegetation luxuriante
      favorisee par la proximite des cours d'eau.

      Art des Jardins connait bien les specificites des jardins de Bouchemaine : sols souvent humides, risque d'inondation
      dans certaines zones, vegetation de bord de riviere... Nous selectionnons des vegetaux adaptes a ces conditions
      particulieres : saules, aulnes, iris d'eau...

      L'entretien des jardins en zone inondable demande une expertise particuliere. Nous intervenons en respectant
      les cycles naturels et en privilegiant des amenagements resiliants qui supportent les crues occasionnelles.
    `,
    neighborhoods: ['Bourg', 'La Pointe', 'Pruneaux'],
  },
  {
    slug: 'saint-barthelemy-anjou',
    name: 'Saint-Barthelemy-d\'Anjou',
    department: 'Maine-et-Loire',
    postalCode: '49124',
    population: '9 500',
    distance: '4 km',
    description:
      'Commune de l\'est angevin en plein developpement, Saint-Barthelemy offre un mix de quartiers residentiels et de zones d\'activites.',
    specificContent: `
      Saint-Barthelemy-d'Anjou, a l'est d'Angers, connait un fort developpement avec de nombreux programmes immobiliers.
      Les jardins y sont souvent recents et necessitent des amenagements pour creer de veritables espaces de vie.

      Art des Jardins accompagne de nombreux proprietaires barthelomeens dans la creation de leur jardin : conception,
      plantation, engazonnement... Nous realisons des jardins cles en main qui correspondent a vos envies et a votre
      mode de vie.

      Pour les jardins deja etablis, nous proposons des contrats d'entretien adaptes. La commune presentant de nombreux
      lotissements avec des jardins de taille moyenne, nous avons developpe des offres specifiques pour ce type de
      proprietes.
    `,
    neighborhoods: ['Bourg', 'Les Music\'Halles', 'Zone des Music\'Halles'],
  },
  {
    slug: 'trelaze',
    name: 'Trelaze',
    department: 'Maine-et-Loire',
    postalCode: '49800',
    population: '14 000',
    distance: '5 km',
    description:
      'Ancienne cite ardoisiere, Trelaze est une commune populaire avec un riche patrimoine industriel et de nombreux jardins ouvriers.',
    specificContent: `
      Trelaze, ancienne capitale de l'ardoise, possede un patrimoine unique avec ses buttes d'ardoise et ses anciennes
      carrieres transformees en espaces naturels. Les jardins y ont une histoire particuliere, avec une tradition
      de jardins ouvriers qui perdure.

      Art des Jardins intervient dans tous les quartiers de Trelaze : le centre, les Music'Halles, Petit Trelaze...
      Nous connaissons les particularites du sol trelazeen, souvent schisteux, et selectionnons des vegetaux adaptes.

      Les espaces residuels des anciennes carrieres offrent des opportunites d'amenagement originales. Nous savons
      tirer parti de ces terrains atypiques pour creer des jardins uniques qui respectent l'identite de la commune.
    `,
    neighborhoods: ['Centre-ville', 'Les Music\'Halles', 'Petit Trelaze'],
  },
  {
    slug: 'les-ponts-de-ce',
    name: 'Les Ponts-de-Ce',
    department: 'Maine-et-Loire',
    postalCode: '49130',
    population: '12 500',
    distance: '7 km',
    description:
      'Ville insulaire sur la Loire, Les Ponts-de-Ce possede un patrimoine remarquable et des jardins au caractere ligérien prononce.',
    specificContent: `
      Les Ponts-de-Ce, cite insulaire sur la Loire, offre un cadre de vie exceptionnel avec ses iles, ses bras de Loire
      et son patrimoine architectural. Les jardins y ont un caractere ligerien prononce, avec une vegetation adaptee
      aux sols sablonneux et aux crues.

      Art des Jardins connait parfaitement les contraintes des jardins ponts-de-ceais : sols filtrants, exposition au vent,
      risque d'inondation... Nous concevons des amenagements adaptes a ces conditions specifiques, avec des vegetaux
      resistants et des solutions techniques appropriees.

      L'elagage des nombreux arbres de bord de Loire necessite une expertise particuliere. Nos elagueurs interviennent
      regulierement pour securiser les arbres tout en preservant leur caractere naturel qui fait le charme de la ville.
    `,
    neighborhoods: ['Centre', 'Saint-Aubin', 'Saint-Maurille', 'Sorges'],
  },
  {
    slug: 'ecouflant',
    name: 'Ecouflant',
    department: 'Maine-et-Loire',
    postalCode: '49000',
    population: '4 500',
    distance: '6 km',
    description:
      'Commune au nord d\'Angers entre Sarthe et basses vallees angevines, Ecouflant offre un cadre naturel preserve avec de nombreux jardins.',
    specificContent: `
      Ecouflant, nichee entre la Sarthe et les basses vallees angevines, beneficie d'un environnement naturel
      exceptionnel. Les jardins y sont souvent genereux et permettent de belles realisations paysageres dans un
      cadre champetre.

      Art des Jardins intervient regulierement a Ecouflant, ou les proprietes offrent souvent des surfaces importantes.
      Nous realisons des amenagements qui s'integrent harmonieusement dans ce paysage de bords de Sarthe, en utilisant
      des vegetaux locaux et des materiaux naturels.

      L'entretien des grands jardins ecouflantais necessite une organisation rigoureuse. Nous proposons des contrats
      adaptes qui permettent de maintenir ces espaces en parfait etat tout au long de l'annee.
    `,
    neighborhoods: ['Bourg', 'Basse-Ile', 'Eventard'],
  },
  {
    slug: 'cantenay-epinard',
    name: 'Cantenay-Epinard',
    department: 'Maine-et-Loire',
    postalCode: '49460',
    population: '2 400',
    distance: '10 km',
    description:
      'Village rural au nord d\'Angers, Cantenay-Epinard conserve un caractere authentique avec ses fermes renovees et leurs grands jardins.',
    specificContent: `
      Cantenay-Epinard, commune rurale au nord d'Angers, a su conserver son caractere authentique. Les anciennes
      fermes renovees y possedent souvent de grands terrains qui offrent de belles opportunites d'amenagement.

      Art des Jardins intervient a Cantenay-Epinard pour des projets varies : creation de jardins pour les nouvelles
      constructions, renovation de parcs autour des demeures anciennes, entretien de grands espaces...

      Le caractere rural de la commune nous inspire des amenagements naturels qui s'integrent dans le paysage :
      haies champetres, vergers, prairies fleuries... Nous privilegions des solutions ecologiques adaptees a
      l'esprit du lieu.
    `,
    neighborhoods: ['Bourg', 'Cantenay', 'Epinard'],
  },
  {
    slug: 'murs-erigne',
    name: 'Murs-Erigne',
    department: 'Maine-et-Loire',
    postalCode: '49610',
    population: '5 500',
    distance: '10 km',
    description:
      'Commune viticole au sud-ouest d\'Angers, Murs-Erigne est appreciee pour son cadre de vie entre vignes et Loire.',
    specificContent: `
      Murs-Erigne, commune viticole des coteaux de Loire, offre un cadre de vie privilegie entre vignobles et fleuve.
      Les jardins y beneficient d'une exposition favorable et d'un microclimat propice a de nombreuses especes
      mediterraneennes.

      Art des Jardins connait bien les particularites des terrains de Murs-Erigne : coteaux schisteux, exposition sud,
      sols parfois calcaires... Nous selectionnons des vegetaux adaptes a ces conditions : lavandes, romarins,
      oliviers... qui s'epanouissent dans ce terroir viticole.

      Les proprietes avec vue sur Loire sont nombreuses et meritent des amenagements a la hauteur du paysage.
      Nous concevons des jardins qui tirent parti de ces panoramas exceptionnels tout en respectant l'intimite
      des proprietaires.
    `,
    neighborhoods: ['Murs', 'Erigne'],
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
