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
      'Conseils et propositions d\'aménagements personnalisés',
      'Création de terrasses (tout matériaux)',
      'Allée et terrassement divers',
      'Plantation d\'arbres et arbustes',
      'Pergola sur mesure',
      'Maçonneries extérieures',
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
      'Taille de formation pour jeunes arbres',
      'Taille d\'entretien et éclaircissage',
      'Taille de réduction de volume',
      'Taille de sécurisation',
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
      'Fendage du bois',
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
      Angers, ville d'art et d'histoire, possède un patrimoine végétal remarquable avec plus de 600 hectares d'espaces verts. Du jardin des Plantes au parc de la Garenne, du jardin du Mail au lac de Maine, les Angevins sont particulièrement attachés à leur cadre de vie verdoyant. Cette tradition horticole remonte au XIXe siècle, quand Angers était déjà reconnue comme un centre majeur de la production végétale en France.

      Art des Jardins intervient dans tous les quartiers d'Angers, du centre historique aux zones résidentielles périphériques. Nous connaissons parfaitement les réglementations locales, notamment en ce qui concerne les arbres classés et les zones protégées du secteur sauvegardé. Dans le quartier de La Doutre, les jardins de ville exigent une approche soignée qui respecte le patrimoine architectural. À Saint-Serge et Belle-Beille, les espaces sont plus vastes et se prêtent à des créations paysagères ambitieuses.

      Le climat angevin, doux et océanique, est un atout considérable pour les jardins. Les hivers rarement rigoureux et les étés tempérés permettent de cultiver une grande diversité végétale. Les hortensias, camélias, magnolias et rhododendrons s'épanouissent dans ce terroir privilégié qui bénéficie de précipitations bien réparties tout au long de l'année. Le gel tardif de printemps reste cependant un risque à anticiper pour les fruitiers et les espèces fragiles.

      Les sols angevins varient selon les quartiers. Sur les hauteurs de Monplaisir et de la Roseraie, les sols sont plutôt schisteux et bien drainés, idéaux pour les plantes méditerranéennes adaptées. En fond de vallée, vers le lac de Maine et les bords de Maine, les sols alluviaux plus lourds conviennent aux arbres de grand développement et aux prairies naturelles. Nous adaptons systématiquement le choix des végétaux à la nature du sol de chaque parcelle.

      Les jardins angevins sont aussi variés que les quartiers de la ville. Dans le centre, les cours intérieures et les jardins de maisons de maître demandent un savoir-faire spécifique pour maximiser la lumière et l'espace. Dans les quartiers pavillonnaires des Hauts de Saint-Aubin ou du lac de Maine, les terrains de 500 à 1 000 m² permettent de créer de véritables jardins d'agrément avec terrasses, massifs et espaces de détente.

      Notre équipe intervient aussi bien pour la création complète d'un jardin que pour l'entretien régulier, l'élagage ou l'abattage d'arbres. Nous connaissons les pépiniéristes locaux et sélectionnons des végétaux produits en Anjou, parfaitement acclimatés et vigoureux. Chaque projet est pensé pour durer, avec des matériaux de qualité et une mise en œuvre soignée.

      Angers est également soumise au Plan Local d'Urbanisme qui impose des règles spécifiques de végétalisation pour les nouvelles constructions. Nous accompagnons nos clients dans le respect de ces obligations tout en créant des espaces verts esthétiques et fonctionnels. La ville encourage la biodiversité urbaine, et nous intégrons cette démarche dans chacun de nos projets : haies mixtes, prairies fleuries, nichoirs, hôtels à insectes.
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
      'Deux-Croix Banchais',
      'Grand Pigeon',
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
      'Commune résidentielle au nord d\'Angers, Avrillé est appréciée pour son cadre de vie verdoyant et ses nombreux espaces naturels, avec un parc de loisirs réputé.',
    specificContent: `
      Avrillé, commune limitrophe d'Angers au nord, offre un cadre de vie particulièrement agréable qui attire de nombreuses familles. Son parc de loisirs de 30 hectares, ses allées arborées et ses quartiers résidentiels soignés en font l'une des communes les plus vertes de l'agglomération angevine. Les habitants d'Avrillé sont exigeants sur la qualité de leur environnement, et les jardins y sont généralement bien entretenus et plantés avec goût.

      Les propriétés avrillaises se caractérisent par des jardins de taille moyenne à grande, souvent entre 600 et 1 500 m². Les lotissements des années 1980-2000, comme ceux de la Perrière ou de l'Adezière, présentent des jardins arrivés à maturité où les arbres et arbustes ont pris de l'ampleur. Ces jardins nécessitent régulièrement des interventions d'élagage, de taille de formation et parfois de restructuration complète pour retrouver équilibre et luminosité.

      Le sol avrillais est majoritairement argilo-limoneux, avec des zones de schiste sur les hauteurs du bourg. Ce type de sol retient bien l'eau en hiver mais peut se compacter en été, rendant l'arrosage et le travail du sol essentiels pour maintenir de belles pelouses. Nous recommandons des amendements organiques réguliers et un aération du gazon au printemps pour les terrains les plus lourds. Le choix des végétaux doit aussi tenir compte de ces contraintes pédologiques.

      Art des Jardins connaît parfaitement Avrillé et ses différents quartiers. Dans le centre-bourg historique, les parcelles sont plus étroites et les jardins de charme avec murets de pierre et rosiers sont caractéristiques. Du côté de la Blancheraie et du Bois-du-Roy, les terrains plus vastes permettent des aménagements plus ambitieux : grandes pelouses, massifs arbustifs structurés, potagers familiaux et espaces de jeux pour enfants.

      La commune est bien exposée, avec peu de zones d'ombre naturelle en dehors des boisements existants. L'été, la création de zones ombragées est un enjeu important : pergolas, plantations d'arbres à croissance rapide comme les érables ou les charmes, ou encore la mise en place de voiles d'ombrage. Nous concevons des jardins qui offrent du confort toute l'année, avec des ambiances différentes selon les saisons.

      L'entretien des haies est une prestation très demandée à Avrillé. Les clôtures végétales sont omniprésentes dans les quartiers pavillonnaires, qu'il s'agisse de haies de thuyas, de lauriers ou de haies mixtes plus écologiques. Nous proposons des contrats d'entretien annuels qui incluent deux à trois passages de taille, le désherbage des massifs et la tonte régulière de la pelouse.

      Proche du tramway et des axes routiers, Avrillé bénéficie d'un accès rapide depuis notre base, ce qui nous permet d'intervenir avec réactivité et de proposer des tarifs compétitifs grâce à la réduction des temps de trajet.
    `,
    neighborhoods: ['Centre-bourg', 'La Perrière', 'L\'Adezière', 'La Blancheraie', 'Le Bois-du-Roy', 'La Garde'],
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
      Beaucouzé, située à l'ouest d'Angers le long de la route de Nantes, est une commune dynamique qui mélange harmonieusement zones résidentielles et pôle commercial. Le centre commercial Atoll, avec son architecture moderne et ses espaces paysagers, a contribué à transformer le visage de la commune tout en préservant les quartiers résidentiels plus anciens qui conservent leur charme et leur végétation mature.

      Les quartiers résidentiels de Beaucouzé offrent des jardins souvent spacieux, bénéficiant d'un bon ensoleillement grâce à l'absence de relief marqué. Les terrains sont généralement plats, ce qui facilite l'aménagement de belles pelouses et la création de terrasses de plain-pied. Cette topographie est aussi un avantage pour l'installation de systèmes d'arrosage automatique, que nous préconisons pour les jardins de plus de 300 m².

      Le sol de Beaucouzé est principalement composé de limons profonds reposant sur un substrat schisteux. Ces sols fertiles et bien équilibrés permettent la culture d'une large gamme de végétaux. Les rosiers, les vivaces et les arbustes à fleurs s'y développent particulièrement bien. En revanche, le drainage naturel peut être insuffisant en période de fortes pluies hivernales, et nous recommandons la mise en place de drains pour les zones les plus basses du terrain.

      Art des Jardins intervient régulièrement à Beaucouzé, aussi bien pour les particuliers que pour les copropriétés et les entreprises du secteur commercial. Les aménagements d'espaces verts professionnels répondent à des exigences spécifiques : esthétique soignée toute l'année, entretien minimal, résistance au piétinement et respect des normes d'accessibilité. Nous concevons des solutions durables qui valorisent l'image des entreprises.

      Pour les particuliers, les demandes les plus fréquentes à Beaucouzé concernent la création ou la rénovation de terrasses, l'engazonnement de nouvelles parcelles et la plantation de haies de séparation. Les jardins des constructions récentes nécessitent souvent un aménagement complet depuis le terrain nu : terrassement, apport de terre végétale, engazonnement, plantation et création d'espaces de vie extérieurs avec terrasse et éclairage.

      Les arbres de grande taille sont nombreux dans les propriétés les plus anciennes de Beaucouzé. Chênes, tilleuls et marronniers nécessitent un élagage régulier pour maintenir leur port harmonieux et assurer la sécurité des biens et des personnes. Nos élagueurs certifiés interviennent avec des techniques de grimpe et de démontage adaptées à chaque situation, en respectant la physiologie de l'arbre pour préserver sa vitalité.

      La proximité de la rocade angevine et de l'axe Angers-Nantes rend Beaucouzé très accessible depuis notre base d'intervention. Nous assurons un suivi régulier de nos chantiers et proposons des créneaux d'intervention flexibles qui s'adaptent aux contraintes de nos clients, qu'ils soient particuliers ou professionnels.
    `,
    neighborhoods: ['Centre-bourg', 'Zone Atoll', 'La Gaudière', 'Le Haut-Beaucouzé'],
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
      Bouchemaine, au confluent de la Maine et de la Loire, jouit d'une situation géographique privilégiée qui en fait l'une des communes les plus prisées de l'agglomération angevine. Les paysages y sont saisissants : depuis les hauteurs du bourg, la vue s'étend sur les méandres de la Loire et les prairies inondables qui changent de visage au fil des saisons. Cette relation intime avec l'eau marque profondément la nature des jardins et les choix d'aménagement.

      Les propriétés de Bouchemaine sont souvent remarquables, allant des maisons de maître du XIXe siècle aux villas contemporaines avec vue sur l'eau. Les jardins y sont généralement de grande superficie, entre 1 000 et 3 000 m², et les propriétaires attachent une importance particulière à l'intégration paysagère. Les aménagements doivent sublimer les vues sur le fleuve sans les obstruer, ce qui demande une conception soignée avec des plantations étagées et des perspectives maîtrisées.

      L'eau est à la fois un atout et un défi à Bouchemaine. Dans les zones basses, le risque d'inondation impose des choix de végétaux résilients : saules, aulnes glutineux, cornouillers sanguins, iris des marais et graminées ornementales qui supportent les submersions temporaires. Les sols alluviaux de ces secteurs sont riches mais lourds, nécessitant des amendements pour alléger la texture et améliorer le drainage en période sèche.

      Sur les coteaux du bourg et du quartier de la Pointe, les sols sont plus schisteux et bien drainés. C'est dans ces zones que l'on trouve les jardins les plus diversifiés, avec des espèces méditerranéennes qui profitent de l'exposition sud et de la protection naturelle offerte par le vallon de la Maine. Lavandes, cistes, romarins et oliviers s'y développent étonnamment bien, apportant des notes méridionales à ces jardins ligériens.

      Art des Jardins connaît bien les spécificités de chaque micro-secteur de Bouchemaine. Nous adaptons nos interventions au contexte hydraulique et pédologique de chaque parcelle. Pour les jardins en zone inondable, nous privilégions des aménagements résilients : terrasses surélevées, murets de soutènement en pierre naturelle, plantations en buttes et choix de matériaux résistants à l'eau. Les clôtures végétales sont conçues pour laisser passer l'eau sans créer d'embâcle.

      L'entretien des jardins en bord de rivière demande une attention saisonnière particulière. Au printemps, après le retrait des eaux, un nettoyage complet des massifs et un apport de compost sont nécessaires pour relancer la végétation. L'été, la proximité de l'eau maintient une fraîcheur appréciable qui limite les besoins d'arrosage. L'automne est la saison idéale pour les plantations, profitant de l'humidité naturelle du sol.

      Les arbres de bord de Loire constituent un patrimoine végétal précieux à Bouchemaine. Peupliers noirs, frênes, ormes et chênes pédonculés forment des alignements majestueux le long des berges. Leur entretien régulier est essentiel pour la sécurité, notamment après les épisodes de vent qui fragilisent les branches hautes. Nos élagueurs interviennent avec les techniques adaptées à ces arbres de grand développement.
    `,
    neighborhoods: ['Bourg', 'La Pointe', 'Pruneaux', 'La Basse-Île', 'Pruniers'],
  },
  {
    slug: 'saint-barthelemy-anjou',
    name: 'Saint-Barthélemy-d\'Anjou',
    department: 'Maine-et-Loire',
    postalCode: '49124',
    population: '9 500',
    distance: '4 km',
    description:
      'Commune de l\'est angevin en plein développement, Saint-Barthélemy-d\'Anjou offre un mix de quartiers résidentiels établis et de programmes immobiliers récents.',
    specificContent: `
      Saint-Barthélemy-d'Anjou, à l'est immédiat d'Angers, connaît depuis plusieurs années un fort développement urbain avec de nombreux programmes immobiliers neufs. Cette dynamique crée une demande importante en aménagement paysager, les nouveaux propriétaires souhaitant transformer leur terrain nu en un véritable jardin de vie. Parallèlement, les quartiers plus anciens du bourg offrent des jardins matures qui nécessitent régulièrement des travaux de restructuration.

      La commune présente une grande variété de jardins. Dans les lotissements récents, les parcelles de 300 à 600 m² demandent une conception optimisée pour créer des espaces fonctionnels et esthétiques malgré une surface modeste. Nous excellons dans l'art de compartimenter ces petits jardins en zones distinctes : coin repas avec terrasse, espace de jeu pour les enfants, massif d'agrément et éventuel potager, le tout agencé pour préserver l'intimité vis-à-vis des voisins.

      Les sols barthéloméens sont principalement argilo-schisteux, avec une bonne fertilité mais une tendance au compactage. Ce type de sol nécessite un travail de préparation soigneux avant toute plantation : décompactage, amendement organique et paillage pour maintenir une bonne structure. Pour les pelouses, nous recommandons des mélanges de graminées résistants à la sécheresse qui s'adaptent bien à ces terrains, avec un semis en septembre pour profiter des conditions optimales d'automne.

      Art des Jardins accompagne de nombreux propriétaires barthéloméens dans la création de leur jardin clé en main. Notre approche commence par une visite conseil gratuite pour comprendre vos envies, votre mode de vie et les contraintes du terrain. Nous élaborons ensuite un plan d'aménagement détaillé qui intègre les circulations, les plantations, les éléments construits et l'éclairage extérieur. Chaque jardin est conçu pour être beau dès la première année et se bonifier avec le temps.

      Les haies de séparation sont un sujet récurrent à Saint-Barthélemy, en raison de la densité des lotissements. Nous préconisons les haies mixtes composées de plusieurs espèces : photinia, eleagnus, viburnum, charmille et quelques arbustes à fleurs pour varier les textures et les couleurs au fil des saisons. Ces haies sont plus résistantes aux maladies qu'une haie monospécifique et offrent un intérêt écologique supérieur en accueillant une faune variée.

      Pour les jardins déjà établis, nous proposons des contrats d'entretien sur mesure. La tonte régulière, la taille des haies et des arbustes, le désherbage des massifs et le traitement préventif des maladies constituent le socle de nos interventions. Nous ajustons la fréquence des passages selon les saisons : plus rapprochés au printemps et en été quand la croissance est forte, espacés en automne et en hiver.

      La proximité immédiate d'Angers fait de Saint-Barthélemy une commune où nous intervenons quasi quotidiennement. Cette présence régulière nous permet d'assurer un suivi très réactif de nos chantiers et de répondre rapidement aux urgences, qu'il s'agisse d'un arbre dangereux à sécuriser ou d'une haie à tailler avant l'arrivée des beaux jours.
    `,
    neighborhoods: ['Bourg', 'Les Music\'Halles', 'La Baumette', 'Les Music\'Halles Nord', 'La Grande Chaussée'],
  },
  {
    slug: 'trelaze',
    name: 'Trélazé',
    department: 'Maine-et-Loire',
    postalCode: '49800',
    population: '14 000',
    distance: '5 km',
    description:
      'Ancienne cité ardoisière, Trélazé est une commune dynamique avec un riche patrimoine industriel reconverti et de nombreux jardins à entretenir.',
    specificContent: `
      Trélazé, ancienne capitale de l'ardoise, possède un patrimoine unique en France. Les buttes ardoisières, vestiges de siècles d'exploitation, ont été progressivement reconverties en espaces naturels et de loisirs. Ce passé industriel a façonné les sols et le paysage de manière singulière, créant des conditions de jardinage très spécifiques que notre équipe connaît parfaitement.

      Les sols trélazéens sont profondément marqués par le schiste ardoisier. Dans de nombreux quartiers, on retrouve des fragments de schiste dans les couches superficielles, ce qui confère aux sols un excellent drainage mais aussi une certaine pauvreté en matière organique. Pour créer de beaux jardins sur ces terrains, un travail d'amendement conséquent est nécessaire : apport de compost, de fumier décomposé et de terre végétale pour enrichir la couche cultivable et améliorer la rétention d'eau.

      La commune possède une forte tradition de jardins ouvriers et familiaux qui perdure encore aujourd'hui. Ces potagers et jardins d'agrément témoignent d'un savoir-faire populaire transmis de génération en génération. Art des Jardins s'inscrit dans cette tradition en proposant des aménagements qui combinent esthétique et production : carrés potagers surélevés, vergers en espalier, arbres fruitiers nains adaptés aux petits espaces, et massifs de fleurs comestibles.

      Les quartiers de Trélazé sont variés et chacun présente ses propres caractéristiques. Le centre-ville, dense et urbain, offre principalement des jardins de petite taille où chaque mètre carré compte. Les quartiers du Petit Trélazé et de la Quantinière disposent de terrains plus grands, parfois de 800 à 1 200 m², où les possibilités d'aménagement sont plus larges. Près des anciennes carrières reconverties, les terrains peuvent présenter des dénivellations qui offrent des opportunités de création de jardins en terrasses.

      Les espaces résiduels des anciennes ardoisières constituent un atout unique pour les jardins de Trélazé. Les murets de schiste, typiques de la commune, apportent un caractère authentique aux aménagements extérieurs. Nous intégrons ces éléments patrimoniaux dans nos créations : escaliers en schiste, bordures de massifs, rocailles ornementales et murs de soutènement qui rappellent l'identité ardoisière de la ville tout en apportant un aspect esthétique minéral très contemporain.

      L'élagage est une prestation particulièrement demandée à Trélazé, où les arbres ont poussé dans des conditions parfois difficiles. Les pins, bouleaux et robiniers qui se sont spontanément développés sur les friches ardoisières ont souvent pris des formes irrégulières et nécessitent une taille d'entretien et de mise en sécurité. Nos élagueurs maîtrisent les techniques adaptées à ces situations spécifiques.

      Trélazé bénéficie du tramway qui la relie directement au centre d'Angers, ce qui facilite grandement nos déplacements. Notre équipe intervient régulièrement dans la commune, tant pour des chantiers de création que pour l'entretien annuel de jardins. Nous proposons des tarifs adaptés à tous les budgets, avec des solutions qui respectent l'identité locale et le patrimoine ardoisier de cette commune attachante.
    `,
    neighborhoods: ['Centre-ville', 'Les Music\'Halles', 'Petit Trélazé', 'La Quantinière', 'Les Plaines'],
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
      Les Ponts-de-Cé, cité insulaire sur la Loire, offre un cadre de vie exceptionnel avec ses îles, ses bras de Loire et son château médiéval dominant le fleuve. La ville s'étend sur plusieurs îles reliées par des ponts historiques, ce qui crée une configuration urbaine unique où l'eau est omniprésente. Cette proximité avec le fleuve royal influence profondément la nature des jardins et les choix d'aménagement paysager.

      Les sols ponts-de-céais sont typiquement ligériens : sablonneux et filtrants dans les zones basses proches du fleuve, plus argileux et compacts sur les hauteurs de Sorges et Saint-Aubin. Les jardins en zone basse bénéficient d'un sol léger facile à travailler mais qui sèche rapidement en été et nécessite un arrosage régulier. À l'inverse, les sols argileux des coteaux retiennent bien l'eau mais demandent un drainage soigné pour éviter l'asphyxie des racines en hiver.

      La ville est classée en zone de risque d'inondation pour une partie importante de son territoire. Cette contrainte réglementaire impose des choix de conception spécifiques que notre équipe maîtrise parfaitement. Nous sélectionnons des végétaux résistants aux submersions temporaires, concevons des aménagements qui ne font pas obstacle à l'écoulement des eaux et utilisons des matériaux qui résistent à l'immersion sans se dégrader.

      Art des Jardins connaît parfaitement les différents secteurs des Ponts-de-Cé. Le centre historique, sur l'île principale, présente des jardins de ville souvent étroits mais pleins de charme, encadrés par les murs anciens et les façades en tuffeau. Le quartier de Saint-Aubin offre des parcelles plus vastes avec vue sur la Loire, où les jardins tirent parti des panoramas exceptionnels. À Sorges, les terrains en pente permettent des créations en terrasses originales.

      Les berges de Loire qui traversent la commune abritent une végétation ripicole remarquable. Peupliers noirs, saules blancs, frênes et aulnes forment des ripisylves qui nécessitent un entretien régulier pour la sécurité des riverains. Nos élagueurs interviennent le long des cours d'eau avec des techniques adaptées aux arbres de milieu humide, en respectant les périodes de nidification et la réglementation relative aux zones humides.

      Le climat des Ponts-de-Cé bénéficie de l'effet modérateur de la Loire. Le fleuve atténue les extrêmes de température, protégeant les jardins des gelées sévères en hiver et apportant une fraîcheur bienvenue en été. Ce microclimat favorable permet la culture de plantes inhabituelles pour la latitude : figuiers, vignes, kiwis et même certains palmiers dans les expositions les plus abritées.

      Notre équipe intervient très régulièrement aux Ponts-de-Cé, que ce soit pour la création de jardins, l'entretien saisonnier ou les interventions d'élagage et d'abattage. La ville est à seulement 7 km de notre base, ce qui nous permet une grande réactivité. Nous connaissons les artisans locaux (maçons, ferroniers) avec qui nous collaborons régulièrement pour des projets d'aménagement complets associant végétal et minéral.
    `,
    neighborhoods: ['Centre', 'Saint-Aubin', 'Saint-Maurille', 'Sorges', 'Belle-Île'],
  },
  {
    slug: 'ecouflant',
    name: 'Écouflant',
    department: 'Maine-et-Loire',
    postalCode: '49000',
    population: '4 500',
    distance: '6 km',
    description:
      'Commune au nord d\'Angers entre Sarthe et basses vallées angevines, Écouflant offre un cadre naturel préservé avec de beaux jardins résidentiels.',
    specificContent: `
      Écouflant, nichée entre la Sarthe et les basses vallées angevines, bénéficie d'un environnement naturel exceptionnel classé Natura 2000. Cette commune résidentielle offre un cadre de vie remarquable où la nature est omniprésente. Les prairies inondables des basses vallées, qui accueillent chaque hiver des milliers d'oiseaux migrateurs, constituent un paysage unique qui influence l'identité des jardins écouflantais.

      Les propriétés d'Écouflant sont souvent généreuses, avec des terrains de 800 à 2 000 m² dans les quartiers résidentiels. Le bourg historique présente des maisons de caractère entourées de jardins matures, tandis que les zones plus récentes offrent des parcelles à aménager. La topographie est généralement plane, avec quelques légers vallonnements vers le coteau, ce qui facilite les aménagements et offre de bonnes conditions pour les pelouses et les terrasses.

      Les sols d'Écouflant varient considérablement selon la distance à la Sarthe. En zone basse, les alluvions riches et profondes sont extrêmement fertiles mais soumises aux remontées de nappe en hiver. Sur les hauteurs du bourg et vers Éventard, les sols sont plus légers, à dominante sablo-limoneuse, bien drainés et faciles à travailler. Nous adaptons notre approche à chaque parcelle, en recommandant les végétaux et les techniques de plantation les mieux adaptés au contexte pédologique local.

      Art des Jardins intervient régulièrement à Écouflant pour des projets variés : création de jardins complets pour les constructions neuves, restructuration de jardins anciens qui ont perdu leur attrait, entretien saisonnier des espaces verts et interventions d'élagage sur les nombreux arbres de haute tige qui caractérisent la commune. Les peupliers, saules et frênes des bords de Sarthe nécessitent un suivi régulier pour la sécurité.

      Le caractère naturel de l'environnement écouflantais inspire nos créations paysagères. Nous privilégions des aménagements qui s'intègrent harmonieusement dans ce cadre préservé : haies champêtres mêlant noisetiers, prunelliers et viornes, prairies fleuries semées d'espèces locales, bosquets d'essences indigènes et mares naturelles qui accueillent batraciens et libellules. Cette approche écologique répond aux attentes des habitants soucieux de préserver la biodiversité.

      L'entretien des grands jardins écouflantais nécessite une organisation rigoureuse et un matériel adapté. Nos tondeuses professionnelles traitent efficacement les grandes surfaces, tandis que nos outils de taille et d'élagage permettent d'intervenir sur les haies les plus imposantes et les arbres les plus hauts. Nous proposons des contrats d'entretien annuels personnalisés, avec un planning d'intervention qui respecte les cycles naturels de la végétation.

      La proximité d'Angers et l'accès facile par la route de Sablé font d'Écouflant une commune où nous intervenons avec beaucoup de facilité. Nous connaissons bien les pépiniéristes de la vallée de la Sarthe, qui produisent des végétaux parfaitement adaptés aux conditions locales. Cette connaissance du réseau local nous permet de vous proposer des plantes de qualité à des prix raisonnables.
    `,
    neighborhoods: ['Bourg', 'Basse-Île', 'Éventard', 'Le Grésillé', 'La Sarthe'],
  },
  {
    slug: 'cantenay-epinard',
    name: 'Cantenay-Épinard',
    department: 'Maine-et-Loire',
    postalCode: '49460',
    population: '2 400',
    distance: '10 km',
    description:
      'Village rural au nord d\'Angers, Cantenay-Épinard conserve un caractère authentique avec ses fermes rénovées et leurs grands jardins bordant les basses vallées angevines.',
    specificContent: `
      Cantenay-Épinard, commune rurale au nord d'Angers, a su conserver un caractère authentique qui attire les amoureux de la campagne angevine. Ses deux bourgs historiques, Cantenay et Épinard, présentent un patrimoine bâti remarquable avec de nombreuses fermes en tuffeau et longères rénovées avec soin. Les grands terrains qui entourent ces propriétés offrent des opportunités exceptionnelles de création paysagère, allant du jardin d'agrément classique au parc paysager de plusieurs milliers de mètres carrés.

      La commune est bordée par les basses vallées angevines, classées Natura 2000, qui créent un paysage de prairies humides d'une grande beauté. Cette proximité avec un milieu naturel remarquable influence notre approche des jardins à Cantenay-Épinard : nous privilégions des aménagements qui dialoguent avec ce paysage ouvert, en utilisant des végétaux locaux et en préservant les vues sur les prairies et les haies bocagères environnantes.

      Les sols de la commune présentent une diversité intéressante. Dans les parties hautes, les terres limoneuses profondes offrent d'excellentes conditions pour les plantations. En descendant vers les vallées, les sols deviennent plus humides et argileux, ce qui oriente le choix vers des espèces de zone humide. Nous maîtrisons parfaitement ces variations pédologiques et adaptons nos préconisations en conséquence, qu'il s'agisse de planter un verger en altitude ou d'aménager un jardin d'eau en fond de vallon.

      Art des Jardins intervient à Cantenay-Épinard pour des projets souvent ambitieux. Les propriétés anciennes demandent une rénovation paysagère respectueuse du caractère rural : remise en état des allées en graviers, taille de restauration des arbres centenaires, création de potagers et de vergers dans l'esprit des jardins de curé angevins. Les nouvelles constructions, plus rares, bénéficient d'un terrain vierge que nous aménageons en harmonie avec l'environnement bocager.

      Le bocage qui entoure la commune est un élément essentiel du paysage. Les haies champêtres traditionnelles, composées de chênes têtards, de frênes, de noisetiers et d'aubépines, structurent le territoire et abritent une faune diverse. Nous encourageons nos clients à maintenir et à enrichir ces haies plutôt qu'à les remplacer par des clôtures artificielles. Quand une haie doit être replantée, nous proposons un mélange d'essences locales qui reconstitue un écosystème fonctionnel.

      L'élagage des arbres de parc est une intervention courante à Cantenay-Épinard, où de nombreuses propriétés possèdent des sujets remarquables : chênes centenaires, cèdres du Liban, séquoias, tilleuls argentés... La taille de ces arbres patrimoniaux exige un savoir-faire spécifique. Nos élagueurs évaluent l'état sanitaire de chaque arbre avant d'intervenir, en proposant une taille douce qui respecte la physiologie de l'arbre et préserve son port naturel.

      Bien que plus éloignée d'Angers que d'autres communes, Cantenay-Épinard fait partie de notre zone d'intervention régulière. Nous regroupons nos chantiers dans ce secteur nord pour optimiser nos déplacements. Les clients de la commune bénéficient de la même qualité de service et de la même réactivité que ceux des communes limitrophes d'Angers.
    `,
    neighborhoods: ['Cantenay', 'Épinard', 'Le Bourg', 'Les Basses-Vallées'],
  },
  {
    slug: 'murs-erigne',
    name: 'Mûrs-Érigné',
    department: 'Maine-et-Loire',
    postalCode: '49610',
    population: '5 500',
    distance: '10 km',
    description:
      'Commune viticole au sud-ouest d\'Angers, Mûrs-Érigné est appréciée pour son cadre de vie entre vignes et Loire, avec un microclimat favorable aux jardins.',
    specificContent: `
      Mûrs-Érigné, commune viticole des coteaux de Loire, offre un cadre de vie privilégié entre vignobles réputés et fleuve royal. L'appellation Coteaux-du-Layon commence ici, et cette tradition viticole séculaire a façonné le paysage de manière remarquable : coteaux exposés plein sud, murets de schiste retenant la chaleur, chemins creux bordés de végétation spontanée. Cet environnement unique inspire des jardins de caractère qui puisent dans le terroir local.

      Le microclimat de Mûrs-Érigné est l'un des plus favorables de l'agglomération angevine. L'exposition sud-ouest des coteaux, la protection naturelle offerte par le coteau face aux vents du nord et la réflexion de la chaleur par le fleuve créent des conditions quasi-méditerranéennes dans certains secteurs. Ce microclimat exceptionnel permet la culture d'espèces inhabituelles à cette latitude : oliviers, figuiers, lauriers-roses, grenadiers et même certains agrumes en situation abritée.

      Les sols de Mûrs-Érigné sont majoritairement schisteux et bien drainés sur les coteaux, avec une couche arable souvent mince qui nécessite des apports organiques pour être fertile. En bas de pente et dans la plaine alluviale, les sols deviennent plus profonds et plus riches, mêlant sables, limons et argiles. Nous adaptons le choix des végétaux à cette topographie marquée, en plantant des espèces de sols secs en haut et des espèces plus exigeantes en eau dans les parties basses.

      Art des Jardins connaît parfaitement les particularités des terrains de Mûrs-Érigné. Sur les coteaux, les jardins en terrasses sont les plus adaptés à la pente naturelle du terrain. Nous construisons des murets de schiste local qui retiennent la terre, stabilisent la pente et créent des microclimats favorables aux plantations. Ces aménagements minéraux s'intègrent parfaitement dans le paysage viticole environnant et apportent un cachet authentique.

      Les propriétés de la commune sont souvent des maisons de caractère – maisons de vignerons, longères en tuffeau, belles demeures du XIXe siècle – qui méritent un écrin végétal à la hauteur de leur architecture. Nous concevons des jardins qui valorisent ces bâtiments : rosiers grimpants sur les façades en pierre, massifs de plantes aromatiques (lavandes, thyms, sauges), haies taillées en art topiaire et allées en gravier naturel qui rappellent les chemins viticoles traditionnels.

      L'entretien des jardins de coteaux à Mûrs-Érigné présente des contraintes spécifiques. La pente rend la tonte plus complexe et l'érosion peut emporter les sols mal protégés lors de fortes pluies. Nous recommandons le paillage systématique des massifs, l'engazonnement des talus avec des mélanges résistants à la sécheresse et la plantation de couvre-sols persistants qui stabilisent le terrain tout en réduisant l'entretien.

      Les vignes abandonnées ou en friche sont nombreuses sur les coteaux de Mûrs-Érigné. Leur défrichement et leur conversion en jardin d'agrément constituent des chantiers que nous réalisons régulièrement. Ce travail de transformation demande un dessouchage méthodique, un dérocaillage du terrain et une reprise complète du sol avant de pouvoir planter. Le résultat en vaut la peine : ces terrains offrent des expositions exceptionnelles pour créer des jardins lumineux et chaleureux.
    `,
    neighborhoods: ['Mûrs', 'Érigné', 'Les Coteaux', 'La Plaine', 'Le Bourg'],
  },
  {
    slug: 'sainte-gemmes-sur-loire',
    name: 'Sainte-Gemmes-sur-Loire',
    department: 'Maine-et-Loire',
    postalCode: '49130',
    population: '4 200',
    distance: '8 km',
    description:
      'Commune paisible au sud d\'Angers en bord de Loire, Sainte-Gemmes-sur-Loire offre un cadre de vie verdoyant entre fleuve et coteaux, avec des propriétés de charme.',
    specificContent: `
      Sainte-Gemmes-sur-Loire, nichée entre la Loire et les coteaux du Layon, bénéficie d'un environnement naturel remarquable qui en fait une commune très recherchée pour la qualité de vie. Le paysage y est dominé par la présence du fleuve, avec ses grèves de sable, ses boires et sa végétation de berge caractéristique. Les jardins de Sainte-Gemmes portent l'empreinte de cette relation intime avec la Loire.

      Les propriétés de la commune sont variées : des maisons de bourg avec jardins clos aux vastes propriétés en bordure de Loire, en passant par les pavillons des lotissements récents. Dans le bourg historique, les murs en tuffeau créent des microclimats favorables aux fruitiers en espalier et aux plantes grimpantes. Le long de la Loire, les propriétés bénéficient d'une vue exceptionnelle sur le fleuve et ses îles, avec des jardins souvent exposés plein sud.

      Le sol gemméen présente une dualité marquée. Sur les hauteurs vers La Roche, le substrat schisteux affleure et les sols sont maigres et bien drainés. Dans la plaine alluviale de Loire, les sols sablo-limoneux sont profonds, fertiles et faciles à travailler. Cette diversité permet une grande variété de plantations, à condition d'adapter ses choix à chaque micro-contexte. Nous réalisons systématiquement un diagnostic du sol avant tout projet d'aménagement important.

      Art des Jardins intervient régulièrement à Sainte-Gemmes-sur-Loire, où les demandes portent souvent sur la valorisation des espaces extérieurs en tirant parti des panoramas. La conception de terrasses avec vue sur la Loire est une de nos spécialités : choix de l'orientation, cadrage des perspectives, sélection de plantes qui n'obstruent pas la vue tout en apportant couleur et structure. Les pergolas et les tonnelles trouvent naturellement leur place dans ces jardins lumineux.

      La proximité de la Loire impose des choix techniques spécifiques pour les jardins des zones basses. Les inondations, bien que rares, peuvent survenir lors des grandes crues centennales. Nous concevons des aménagements résilients avec des matériaux résistants à l'eau, des plantations adaptées aux sols temporairement submersibles et des terrasses légèrement surélevées qui permettent de profiter du jardin même après un épisode humide.

      L'entretien des jardins gemméens suit le rythme des saisons ligériennes. Le printemps est la saison la plus active, avec la reprise végétale, les premières tontes et les plantations. L'été demande une gestion attentive de l'arrosage, surtout sur les sols sableux qui sèchent vite. L'automne est idéal pour les gros travaux de plantation et de restructuration, tandis que l'hiver est la saison de l'élagage et de la taille des arbres fruitiers.

      Notre équipe apprécie particulièrement les chantiers à Sainte-Gemmes-sur-Loire, commune qui offre des conditions de travail agréables et des projets souvent passionnants. La proximité des Ponts-de-Cé et la facilité d'accès nous permettent d'être très réactifs et de regrouper nos interventions dans ce secteur sud de l'agglomération angevine.
    `,
    neighborhoods: ['Bourg', 'Les Jubeaux', 'La Roche', 'Les Banchais', 'La Loire'],
  },
  {
    slug: 'montreuil-juigne',
    name: 'Montreuil-Juigné',
    department: 'Maine-et-Loire',
    postalCode: '49460',
    population: '8 500',
    distance: '9 km',
    description:
      'Commune dynamique au nord-ouest d\'Angers, Montreuil-Juigné allie quartiers résidentiels récents et espaces naturels préservés le long de la Mayenne.',
    specificContent: `
      Montreuil-Juigné, en plein développement au nord-ouest d'Angers, accueille de nombreuses familles attirées par un cadre de vie agréable alliant proximité urbaine et environnement naturel. La commune longe la Mayenne, dont les berges ombragées offrent de belles promenades et influencent le paysage des jardins riverains. Les lotissements récents coexistent avec les quartiers plus anciens de Juigné-Bené et du bourg historique, créant une diversité architecturale intéressante.

      Les jardins de Montreuil-Juigné reflètent cette dualité entre ancien et nouveau. Les propriétés anciennes, souvent des maisons en tuffeau ou en schiste, possèdent des jardins matures avec de grands arbres, des haies centenaires et des murets couverts de mousse. Les constructions récentes s'accompagnent de terrains à aménager entièrement, de 300 à 700 m² en moyenne, où tout est à créer : sol, gazon, plantations et espaces de vie.

      Le sol de Montreuil-Juigné est principalement argileux, ce qui constitue à la fois un atout et un défi pour le jardinage. Les sols argileux retiennent bien l'eau et les nutriments, ce qui profite aux plantations une fois bien établies. En revanche, ils sont lourds à travailler, se compactent facilement et peuvent devenir imperméables en surface. Nous recommandons des amendements sableux et un apport régulier de compost pour améliorer la structure du sol et faciliter l'enracinement des végétaux.

      Art des Jardins accompagne les propriétaires de Montreuil-Juigné dans la création et l'entretien de leurs espaces verts. Pour les maisons neuves, nous proposons un accompagnement complet, de la conception du plan de jardin à la réalisation finale : terrassement, drainage si nécessaire, pose de géotextile, création de la pelouse par semis ou placage, plantation des végétaux et installation de l'éclairage extérieur. Chaque jardin est conçu pour être fonctionnel et esthétique dès la livraison.

      La gestion de l'eau est un enjeu important dans les jardins de Montreuil-Juigné. Les sols argileux alternent entre saturation en hiver et dessèchement en été, avec des fissures de retrait qui peuvent endommager les plantations. Nous préconisons la mise en place de paillages épais (6 à 8 cm de broyat de bois) sur tous les massifs pour réguler l'humidité du sol, limiter les désherbages et enrichir progressivement la terre en matière organique.

      Les haies de clôture sont omniprésentes dans les lotissements de Montreuil-Juigné. Nous constatons que les haies de thuyas et de leylandii plantées dans les années 1990-2000 arrivent en fin de vie dans de nombreuses propriétés. Nous proposons des solutions de remplacement par des haies mixtes persistantes et caduques, plus esthétiques, plus écologiques et plus résistantes aux maladies. La transition peut se faire progressivement, en plantant la nouvelle haie avant de retirer l'ancienne.

      La présence de la Mayenne crée des conditions particulières pour les jardins en bordure de rivière. L'humidité ambiante favorise les mousses sur les pelouses et les maladies fongiques sur les rosiers. Nous adaptons notre programme d'entretien à ces conditions : traitements préventifs, choix de variétés résistantes et techniques culturales qui favorisent l'aération du sol et la circulation de l'air autour des plantes.
    `,
    neighborhoods: ['Bourg', 'Juigné-Bené', 'La Foresterie', 'Les Music\'Halles', 'La Mayenne'],
  },
  {
    slug: 'saint-jean-de-linieres',
    name: 'Saint-Jean-de-Linières',
    department: 'Maine-et-Loire',
    postalCode: '49070',
    population: '2 200',
    distance: '12 km',
    description:
      'Village rural à l\'ouest d\'Angers, Saint-Jean-de-Linières conserve un caractère champêtre avec de grandes propriétés, des espaces boisés et un paysage de bocage préservé.',
    specificContent: `
      Saint-Jean-de-Linières, commune rurale à l'ouest d'Angers, offre un cadre de vie champêtre apprécié des amoureux de la nature et de la tranquillité. Le paysage de bocage angevin y est particulièrement bien préservé, avec ses haies vives, ses chemins creux et ses prairies bordées de chênes têtards. Cette ambiance rurale influence fortement le style des jardins de la commune, où le naturel et l'authentique sont privilégiés.

      Les propriétés de Saint-Jean-de-Linières sont souvent spacieuses, avec des terrains qui dépassent fréquemment les 1 500 m² et atteignent parfois plusieurs hectares pour les anciennes exploitations agricoles reconverties en habitations. Ces grandes surfaces offrent des possibilités d'aménagement exceptionnelles : allées de promenade, parcs arborés, prairies fleuries, vergers de variétés anciennes, potagers généreux et espaces de détente multiples.

      Le sol de la commune est principalement limono-argileux, avec un substrat de grès et de schiste qui affleure par endroits. Ces sols profonds et fertiles sont favorables à la plupart des végétaux d'ornement et des arbres fruitiers. Le drainage naturel est généralement correct sur les parties hautes, mais peut être insuffisant dans les cuvettes et les bas de parcelle. Nous évaluons systématiquement les conditions hydriques du terrain avant de proposer un plan de plantation.

      Art des Jardins intervient à Saint-Jean-de-Linières pour des projets variés, de l'entretien courant des grandes propriétés à la création de jardins complets. Les anciens corps de ferme reconvertis nécessitent souvent un réaménagement complet des abords : démolition des constructions agricoles vétustes, reprofilage du terrain, création d'une cour d'entrée paysagée, plantation de haies et d'arbres d'alignement, et mise en valeur des bâtiments en pierre par des plantations adaptées.

      Le bocage angevin qui entoure la commune inspire nos créations. Nous concevons des haies mixtes composées d'espèces locales : charmes, érables champêtres, noisetiers, troènes, sureaux, aubépines et prunelliers. Ces haies champêtres s'intègrent parfaitement dans le paysage rural et offrent un intérêt écologique majeur en accueillant oiseaux, insectes pollinisateurs et petits mammifères. Elles constituent aussi des brise-vent efficaces pour protéger les jardins exposés.

      L'élagage est une prestation très demandée à Saint-Jean-de-Linières, où les arbres de grande taille sont omniprésents. Chênes pédonculés, hêtres, châtaigniers et pins maritimes peuvent atteindre des dimensions impressionnantes et nécessiter des interventions régulières pour leur mise en sécurité. Nos élagueurs certifiés travaillent en grimpe ou avec nacelle selon la configuration, en pratiquant une taille raisonnée qui préserve la structure et la vitalité de chaque arbre.

      La distance de 12 km depuis Angers ne constitue pas un obstacle pour notre équipe, qui regroupe ses interventions dans le secteur ouest de l'agglomération. Nous associons souvent les chantiers de Saint-Jean-de-Linières avec ceux de Beaucouzé et de Saint-Lambert-la-Potherie, ce qui nous permet de proposer des tarifs optimisés à nos clients de cette zone géographique.
    `,
    neighborhoods: ['Bourg', 'Les Linières', 'La Motte', 'Le Bocage'],
  },
  {
    slug: 'briollay',
    name: 'Briollay',
    department: 'Maine-et-Loire',
    postalCode: '49125',
    population: '2 800',
    distance: '12 km',
    description:
      'Au confluent de la Sarthe et du Loir, Briollay est une commune prisée pour son cadre naturel exceptionnel, ses belles propriétés en bord de rivière et ses paysages de zones humides.',
    specificContent: `
      Briollay, au confluent de la Sarthe et du Loir, offre un cadre de vie exceptionnel reconnu bien au-delà de l'agglomération angevine. Cette situation hydrographique unique, où deux rivières se rejoignent avant de confluer avec la Mayenne pour former la Maine, crée un paysage d'eau et de prairies humides d'une grande beauté. Les propriétés y sont souvent remarquables, et les jardins en bord d'eau constituent de véritables tableaux vivants qui changent au fil des saisons.

      Le patrimoine bâti de Briollay comprend de belles demeures bourgeoises, des manoirs et des maisons de maître qui nécessitent un écrin végétal à la hauteur de leur architecture. Les jardins de ces propriétés d'exception font appel à un large registre paysager : allées de tilleuls, roseraies, bassins, topiaires et parterres structurés qui rappellent la tradition des jardins à la française. Nous intervenons dans ces propriétés avec le respect et le savoir-faire qu'elles méritent.

      Les sols alluviaux de Briollay sont parmi les plus riches de la région. Les limons déposés par les crues successives ont constitué une couche fertile propice à toutes les cultures. Cependant, cette richesse s'accompagne d'une forte humidité en période hivernale, avec des remontées de nappe qui peuvent noyer les systèmes racinaires des végétaux sensibles. Nous sélectionnons des espèces adaptées à ces conditions et concevons des aménagements qui tirent parti de l'eau plutôt que de la combattre.

      L'expertise de Art des Jardins en matière de jardins de zones humides trouve à Briollay un terrain d'expression privilégié. Nous créons des jardins d'eau avec des bassins naturels, des cascades et des plantations de berge qui s'intègrent dans l'environnement rivulaire. Iris d'eau, prêles, joncs fleuris, lysimaques, astilbes et hostas composent des massifs luxuriants qui prospèrent dans l'humidité ambiante et offrent un spectacle renouvelé du printemps à l'automne.

      L'élagage des arbres de bord de rivière est une spécialité de notre équipe particulièrement sollicitée à Briollay. Les saules blancs et pleureurs, les aulnes glutineux, les peupliers noirs et les frênes communs qui bordent la Sarthe et le Loir nécessitent un entretien régulier. Ces essences à croissance rapide produisent beaucoup de bois mort qu'il faut éliminer pour la sécurité. Nos élagueurs interviennent depuis les berges ou depuis l'eau selon les cas, avec les équipements de sécurité adaptés.

      Le risque de crue est un paramètre incontournable à Briollay. Les jardins des zones inondables doivent être conçus pour résister aux submersions temporaires sans perdre leur attrait une fois l'eau retirée. Nous utilisons des matériaux imputrescibles pour les terrasses et les structures, choisissons des végétaux qui supportent l'immersion et évitons les plantations fragiles dans les zones les plus exposées. Les clôtures doivent laisser passer l'eau sans créer d'embâcle.

      Malgré sa distance de 12 km d'Angers, Briollay est facilement accessible par la route d'Écouflant et de Tiercé. Nous intervenons régulièrement dans la commune, souvent en combinant les chantiers avec ceux d'Écouflant et de Villevêque pour optimiser nos déplacements. Les propriétaires de Briollay apprécient notre connaissance fine de leur environnement spécifique et notre capacité à proposer des solutions adaptées à ce terroir de confluence.
    `,
    neighborhoods: ['Bourg', 'Vaux', 'La Basse-Rivière', 'Le Port', 'Les Grandes-Rivières'],
  },
  {
    slug: 'savennieres',
    name: 'Savennières',
    department: 'Maine-et-Loire',
    postalCode: '49170',
    population: '1 500',
    distance: '14 km',
    description:
      'Célèbre pour son vignoble d\'exception classé AOC, Savennières est une commune de caractère sur les bords de Loire, entre coteaux viticoles et jardins de charme.',
    specificContent: `
      Savennières, village viticole mondialement réputé pour ses vins blancs secs d'exception, s'étend sur les coteaux de la rive droite de la Loire. L'appellation Savennières, qui compte deux grands crus – la Coulée-de-Serrant et la Roche-aux-Moines – témoigne d'un terroir d'une qualité exceptionnelle. Ce terroir ne profite pas qu'à la vigne : les jardins d'agrément y bénéficient des mêmes conditions favorables de sol, d'exposition et de microclimat.

      Le microclimat de Savennières est remarquable. L'exposition sud-est des coteaux, face à la Loire, capte la chaleur du matin et bénéficie de la réverbération du fleuve l'après-midi. La masse d'eau de la Loire joue un rôle de régulateur thermique qui atténue les gelées hivernales et les canicules estivales. Ce microclimat doux et lumineux permet la culture d'espèces méditerranéennes et même subtropicales dans les situations les plus abritées : oliviers, figuiers, grenadiers, lauriers-roses et bougainvilliers en pot.

      Les sols de Savennières sont essentiellement schisteux, avec des affleurements de rhyolite et de schistes pourprés caractéristiques du terroir viticole. Ces sols maigres, caillouteux et très bien drainés conviennent parfaitement aux plantes de terrain sec : lavandes, romarins, cistes, santolines, thyms et autres aromatiques méditerranéennes. Les murets de schiste qui structurent les parcelles viticoles retiennent la chaleur du jour et la restituent la nuit, créant des microclimats encore plus chauds au pied des murs.

      Art des Jardins puise dans cette tradition viticole et paysagère pour concevoir des jardins qui s'intègrent dans le paysage de Savennières. Nous utilisons le schiste local pour les murets, les escaliers et les bordures de massifs. Les allées sont souvent réalisées en graves de Loire compactées, un matériau naturel et perméable qui s'harmonise avec l'environnement. Les plantations mêlent essences méditerranéennes et plantes locales pour un résultat à la fois dépaysant et authentique.

      Les propriétés de Savennières sont souvent des demeures de caractère : maisons de vignerons en tuffeau, manoirs, corps de ferme rénovés avec goût. Ces bâtiments patrimoniaux méritent des jardins à la hauteur de leur architecture. Nous concevons des plans d'aménagement qui respectent les proportions, les matériaux et l'esprit du lieu. Les rosiers anciens, les glycines, les bignones et les jasmins étoilés habillent les façades de pierre blonde avec élégance.

      L'entretien des jardins de Savennières suit un calendrier adapté au terroir viticole. La taille des arbustes se fait en fin d'hiver, avant le débourrement. Le désherbage des allées est réalisé sans produit chimique, par sarclage mécanique ou thermique, dans le respect de l'environnement viticole. Les arrosages sont limités au strict nécessaire, les plantes choisies étant adaptées à la sécheresse estivale caractéristique des coteaux bien drainés.

      Savennières est la commune la plus éloignée de notre zone d'intervention courante, à 14 km d'Angers. Nous y intervenons en regroupant les chantiers avec ceux de Béhuard et de Bouchemaine. Les propriétaires de Savennières apprécient notre capacité à créer des jardins en harmonie avec ce terroir d'exception, en tirant parti des conditions naturelles plutôt qu'en les contrariant.
    `,
    neighborhoods: ['Bourg', 'Épiré', 'La Roche-aux-Moines', 'La Coulée-de-Serrant', 'Les Coteaux'],
  },
  {
    slug: 'saint-sylvain-anjou',
    name: 'Saint-Sylvain-d\'Anjou',
    department: 'Maine-et-Loire',
    postalCode: '49480',
    population: '5 500',
    distance: '8 km',
    description:
      'Commune résidentielle au nord-est d\'Angers, Saint-Sylvain-d\'Anjou offre un cadre de vie familial avec des quartiers pavillonnaires bien établis et un environnement verdoyant.',
    specificContent: `
      Saint-Sylvain-d'Anjou, à quelques minutes d'Angers par la route de Paris, est une commune résidentielle prisée des familles pour son cadre de vie paisible et ses bonnes connexions avec la ville. Les quartiers pavillonnaires s'y sont développés progressivement depuis les années 1970, créant un tissu résidentiel varié où coexistent des jardins de différentes générations et de styles divers.

      Les jardins de Saint-Sylvain sont majoritairement de taille moyenne, entre 400 et 900 m², ce qui est typique des lotissements périurbains angevins. Ces superficies demandent une conception réfléchie pour optimiser chaque espace et créer des ambiances variées malgré les dimensions modestes. Nous excellons dans l'art de structurer ces jardins en zones fonctionnelles : espace de réception avec terrasse, coin de détente ombragé, aire de jeux pour les enfants et petit potager productif.

      Le sol saint-sylvainois est principalement limono-argileux, avec une bonne capacité de rétention d'eau. Ce sol fertile convient à la majorité des végétaux d'ornement et des arbres fruitiers. En revanche, il peut poser des problèmes de stagnation en hiver dans les parties basses des terrains. Pour les nouvelles constructions, nous recommandons systématiquement la mise en place d'un drainage périphérique et d'un apport de sable pour alléger la structure des zones de pelouse.

      Art des Jardins intervient régulièrement à Saint-Sylvain-d'Anjou pour l'entretien et l'aménagement des jardins pavillonnaires. La tonte de pelouse, la taille des haies deux à trois fois par an, le désherbage des massifs et la fertilisation constituent le socle de nos contrats d'entretien annuels. Nous proposons des formules adaptées à chaque budget, du simple entretien de base à la prise en charge complète du jardin incluant les plantations saisonnières et les traitements phytosanitaires.

      De nombreux jardins de la commune, plantés dans les années 1980-1990, arrivent à un stade où une rénovation s'impose. Les conifères ont pris des proportions excessives, les massifs sont envahis par les mauvaises herbes, les pelouses sont fatiguées et les aménagements datent. Nous proposons des prestations de rénovation de jardin qui redonnent un second souffle à ces espaces : arrachage des végétaux dépassés, restructuration des massifs, réengazonnement et replantation avec des essences plus adaptées.

      La commune étant en zone périurbaine, de nombreux jardins combinent espace d'agrément et potager familial. Nous accompagnons les propriétaires dans l'installation de carrés potagers surélevés en bois traité classe IV, faciles à entretenir et esthétiques. Nous conseillons sur les rotations de cultures, les associations de plantes et les variétés les mieux adaptées au terroir angevin pour obtenir des récoltes généreuses du printemps à l'automne.

      L'accès rapide depuis Angers par la RD323 et la proximité de l'autoroute A11 facilitent nos déplacements vers Saint-Sylvain-d'Anjou. Nous y intervenons plusieurs fois par semaine, ce qui nous permet de proposer un suivi régulier et une grande réactivité en cas de besoin urgent.
    `,
    neighborhoods: ['Bourg', 'Le Plessis-Grammoire', 'La Papillaie', 'Les Music\'Halles', 'Le Grand-Coudray'],
  },
  {
    slug: 'soulaines-sur-aubance',
    name: 'Soulaines-sur-Aubance',
    department: 'Maine-et-Loire',
    postalCode: '49610',
    population: '3 200',
    distance: '15 km',
    description:
      'Commune rurale au sud d\'Angers traversée par l\'Aubance, appréciée pour son calme, ses paysages de bocage préservés et ses vins de l\'appellation Coteaux-de-l\'Aubance.',
    specificContent: `
      Soulaines-sur-Aubance, commune rurale au sud d'Angers, offre un cadre de vie paisible le long de la rivière Aubance qui a donné son nom à l'appellation viticole locale. Le paysage est typique du bocage angevin méridional : coteaux doux couverts de vignes, vallons frais bordés de haies vives, prairies pâturées et boisements de chênes et de châtaigniers. Cette ambiance champêtre attire les familles qui recherchent l'espace et le calme à une distance raisonnable d'Angers.

      Les propriétés de Soulaines sont souvent généreuses, avec des terrains de 1 000 à 5 000 m² qui offrent de vastes possibilités d'aménagement. Les anciennes fermes reconverties en habitations disposent de cours, de dépendances et de vergers qui constituent un cadre idéal pour des projets paysagers ambitieux. Les constructions plus récentes, dans les quelques lotissements de la commune, présentent des parcelles de taille plus modeste mais suffisante pour créer de beaux jardins familiaux.

      Le terroir de Soulaines-sur-Aubance est marqué par des sols argilo-calcaires sur les coteaux et des sols alluviaux le long de l'Aubance. Les sols calcaires sont propices aux plantes de rocaille, aux lavandes et aux buis, tandis que les zones alluviales, plus fraîches et fertiles, conviennent aux arbres fruitiers, aux rosiers et aux vivaces gourmandes en eau. Nous tenons compte de cette variété de sols pour proposer des plantations parfaitement adaptées à chaque zone du jardin.

      Art des Jardins intervient à Soulaines-sur-Aubance pour des projets qui s'inscrivent dans l'esprit du terroir local. Nous concevons des jardins de curé revisités, mêlant plantes utiles et ornementales : rosiers anciens, pivoines, iris germanica, plantes aromatiques et médicinales, petits fruits et arbres fruitiers palissés. Ces jardins de charme s'intègrent naturellement dans le paysage viticole et bocager de la commune et demandent un entretien modéré.

      Le caractère bocager de Soulaines nous inspire des aménagements naturels et durables. Les haies champêtres traditionnelles, composées d'essences locales comme le charme, le noisetier, le prunellier et l'aubépine, offrent un intérêt écologique majeur tout en assurant une clôture efficace. Nous proposons aussi des haies gourmandes mêlant arbustes à fruits comestibles : cassissiers, groseilliers, framboisiers, sureaux et cornouillers mâles, qui conjuguent utilité et esthétique.

      L'Aubance, qui traverse la commune, crée des zones fraîches et humides propices aux jardins d'ombre et de sous-bois. Les hostas, fougères, brunneras, heuchères et astilbes y prospèrent naturellement, formant des massifs luxuriants même en été. Les berges de la rivière peuvent être aménagées avec des plantations de stabilisation qui freinent l'érosion tout en offrant un aspect naturel et fleuri.

      Soulaines-sur-Aubance est à 15 km d'Angers, ce qui en fait l'une des communes les plus méridionales de notre zone d'intervention courante. Nous regroupons nos chantiers dans ce secteur sud avec ceux de Mûrs-Érigné et des communes voisines pour optimiser les déplacements. Les propriétaires soulainais bénéficient de notre expertise en aménagements ruraux et de notre connaissance approfondie du terroir viticole et bocager angevin.
    `,
    neighborhoods: ['Bourg', 'Saint-Melaine', 'L\'Aubance', 'Les Coteaux'],
  },
  {
    slug: 'loire-authion',
    name: 'Loire-Authion',
    department: 'Maine-et-Loire',
    postalCode: '49800',
    population: '16 000',
    distance: '15 km',
    description:
      'Commune nouvelle regroupant six bourgs à l\'est d\'Angers, Loire-Authion est le berceau historique de l\'horticulture angevine, entre Loire et Authion.',
    specificContent: `
      Loire-Authion, née en 2016 de la fusion de six communes historiques – Brain-sur-l'Authion, Andard, La Bohalle, La Daguenière, Corné et Saint-Mathurin-sur-Loire – est intimement liée à l'histoire de l'horticulture en Anjou. Ce terroir exceptionnel entre Loire et Authion a vu naître et prospérer des dizaines de pépinières, de rosiéristes et d'exploitations horticoles qui ont fait la renommée internationale de l'Anjou végétal. Jardiner à Loire-Authion, c'est s'inscrire dans cette tradition séculaire.

      La plaine alluviale entre Loire et Authion offre des sols d'une richesse exceptionnelle. Les dépôts de limons fertiles laissés par les crues successives ont créé une terre noire, profonde et meuble, idéale pour toutes les cultures. C'est sur ces sols que les pépiniéristes ont développé leurs productions de rosiers, d'arbres fruitiers et de plantes ornementales. Les jardins d'agrément profitent de cette même fertilité, et les végétaux s'y développent avec une vigueur remarquable.

      Art des Jardins puise dans la tradition horticole locale pour proposer des aménagements de qualité aux habitants de Loire-Authion. Nous travaillons avec les pépinières du territoire qui perpétuent le savoir-faire angevin. Les rosiers cultivés localement, les arbres fruitiers greffés sur les porte-greffes adaptés au terroir et les arbustes produits en plein champ sont des végétaux robustes et vigoureux qui s'établissent rapidement dans les jardins de la commune.

      La diversité des bourgs qui composent Loire-Authion crée une variété de paysages et de types de jardins. À Saint-Mathurin-sur-Loire, les propriétés en bord de Loire bénéficient de vues exceptionnelles sur le fleuve et les bancs de sable. À Brain-sur-l'Authion, les fermes horticoles reconverties offrent de vastes terrains structurés par d'anciennes serres et des rangées d'arbres. À Corné, les jardins pavillonnaires plus récents demandent des aménagements fonctionnels et esthétiques.

      Le risque d'inondation est un paramètre important à Loire-Authion. La levée de Loire protège la plaine alluviale, mais le risque de rupture reste présent lors des grandes crues. Nous concevons des jardins qui tiennent compte de cette contrainte, avec des végétaux résistants à la submersion dans les zones les plus exposées et des aménagements facilement nettoyables après un épisode de crue. Les terrasses en bois sont déconseillées dans les zones inondables au profit de la pierre naturelle ou du béton.

      Le vent est un facteur souvent sous-estimé dans les jardins de Loire-Authion. La plaine ouverte entre Loire et Authion est exposée aux vents d'ouest dominants, qui peuvent dessécher les plantations et fragiliser les jeunes arbres. Nous intégrons des brise-vent naturels dans nos conceptions : haies filtrantes, bosquets stratégiquement placés et palissades végétalisées qui protègent les zones sensibles du jardin tout en préservant la luminosité.

      Notre équipe intervient dans tous les bourgs de Loire-Authion, de Saint-Mathurin à Corné en passant par La Daguenière et Andard. La commune étant vaste et étendue, nous organisons nos chantiers par secteur pour optimiser les déplacements. Les habitants bénéficient de notre connaissance approfondie du terroir horticole angevin et de notre réseau de fournisseurs locaux qui garantissent des végétaux de qualité supérieure.
    `,
    neighborhoods: ['Brain-sur-l\'Authion', 'Andard', 'La Bohalle', 'La Daguenière', 'Corné', 'Saint-Mathurin-sur-Loire'],
  },
  {
    slug: 'longuenee-en-anjou',
    name: 'Longuenée-en-Anjou',
    department: 'Maine-et-Loire',
    postalCode: '49770',
    population: '7 500',
    distance: '15 km',
    description:
      'Commune nouvelle au nord d\'Angers, Longuenée-en-Anjou allie patrimoine rural remarquable et développement résidentiel dans un cadre naturel préservé de bocage.',
    specificContent: `
      Longuenée-en-Anjou, au nord d'Angers, est une commune nouvelle issue du regroupement de La Meignanne, Le Plessis-Macé et La Membrolle-sur-Longuenée. Ce territoire étendu offre une grande diversité de paysages et de types de propriétés, du château du Plessis-Macé aux lotissements récents de La Meignanne, en passant par les fermes rénovées de La Membrolle. Chaque bourg conserve son identité propre et ses caractéristiques paysagères.

      Le château du Plessis-Macé et son parc constituent un patrimoine végétal remarquable qui rayonne sur toute la commune. Cette référence historique inspire les propriétaires locaux, qui aspirent souvent à créer des jardins de qualité, structurés et élégants. Les essences nobles – tilleuls, platanes, cèdres, magnolias – sont nombreuses dans les grandes propriétés de la commune et témoignent d'une tradition de jardinage ancienne et soignée.

      Les sols de Longuenée-en-Anjou sont globalement argilo-limoneux, assez profonds et fertiles. Sur les hauteurs du Plessis-Macé, le substrat de grès roussard affleure parfois, donnant des sols plus légers et mieux drainés. Dans les vallées, les sols sont plus humides et plus lourds, demandant un travail d'amendement et de drainage pour accueillir les plantations. Notre connaissance du territoire nous permet d'orienter nos clients vers les végétaux les mieux adaptés à la nature de leur terrain.

      Art des Jardins accompagne les propriétaires de Longuenée-en-Anjou dans tous leurs projets paysagers. À La Meignanne, les lotissements récents nécessitent des créations de jardin complètes : engazonnement, plantations de haies, aménagement de terrasses et installation d'éclairage extérieur. Au Plessis-Macé et à La Membrolle, les propriétés plus anciennes demandent des interventions de rénovation, de taille de restauration et d'entretien adapté aux grands espaces.

      Les grandes propriétés de la commune abritent souvent des arbres remarquables qui constituent un patrimoine végétal précieux. Chênes centenaires, cèdres du Liban, séquoias géants, hêtres pourpres et tilleuls argentés nécessitent un suivi arboricole régulier pour préserver leur santé et leur beauté. Nos élagueurs certifiés interviennent avec des techniques de taille douce qui respectent la physiologie de chaque essence et maintiennent le port naturel des arbres.

      Le bocage bien conservé de Longuenée-en-Anjou abrite une biodiversité riche que nous nous efforçons de préserver dans nos aménagements. Les haies mixtes à base de charmes, chênes, noisetiers et aubépines constituent le maillage bocager traditionnel. Nous proposons à nos clients d'enrichir ces haies existantes ou d'en créer de nouvelles selon le même modèle, en y ajoutant des espèces à fleurs (viornes, cornouillers) et à fruits (pommiers sauvages, alisiers) pour maximiser l'intérêt ornementai et écologique.

      Bien que située à 15 km d'Angers, Longuenée-en-Anjou est facilement accessible par la route de Laval. Nous regroupons nos interventions dans ce secteur nord-ouest avec ceux de Montreuil-Juigné et d'Avrillé pour optimiser nos déplacements. Les clients de la commune bénéficient d'un service complet, de la conception à l'entretien, avec la même qualité et la même réactivité que les communes plus proches d'Angers.
    `,
    neighborhoods: ['La Meignanne', 'Le Plessis-Macé', 'La Membrolle-sur-Longuenée', 'Le Bourg', 'La Chaussée'],
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
