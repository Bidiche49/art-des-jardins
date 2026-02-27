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

      Le climat angevin, doux et océanique, est un atout considérable pour les jardins. Les hivers rarement rigoureux et les étés tempérés permettent de cultiver une grande diversité végétale. Les hortensias, camélias, magnolias et rhododendrons s'épanouissent dans ce terroir privilégié. Les sols varient selon les quartiers : schisteux et bien drainés sur les hauteurs de Monplaisir, alluviaux et plus lourds en fond de vallée vers le lac de Maine.

      Art des Jardins intervient dans tous les quartiers d'Angers, du centre historique aux zones résidentielles périphériques. Dans le quartier de La Doutre, les jardins de ville exigent une approche soignée qui respecte le patrimoine architectural. À Saint-Serge et Belle-Beille, les espaces plus vastes se prêtent à des créations paysagères ambitieuses. Dans les quartiers pavillonnaires des Hauts de Saint-Aubin ou du lac de Maine, les terrains de 500 à 1 000 m² permettent de créer de véritables jardins d'agrément avec terrasses, massifs et espaces de détente.

      La ville encourage la biodiversité urbaine, et nous intégrons cette démarche dans chacun de nos projets : haies mixtes, prairies fleuries, nichoirs, hôtels à insectes. Nous sélectionnons des végétaux produits en Anjou, parfaitement acclimatés, et adaptons chaque création à la nature du sol et aux réglementations locales du PLU.
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
      Avrillé, commune limitrophe d'Angers au nord, offre un cadre de vie particulièrement agréable qui attire de nombreuses familles. Son parc de loisirs de 30 hectares, ses allées arborées et ses quartiers résidentiels soignés en font l'une des communes les plus vertes de l'agglomération angevine. Les propriétés se caractérisent par des jardins de 600 à 1 500 m², dont beaucoup arrivent à maturité et nécessitent des interventions de restructuration.

      Le sol avrillais est majoritairement argilo-limoneux, avec des zones de schiste sur les hauteurs du bourg. Ce type de sol retient bien l'eau en hiver mais peut se compacter en été, rendant les amendements organiques réguliers et l'aération du gazon essentiels. Le choix des végétaux doit aussi tenir compte de ces contraintes pédologiques.

      Art des Jardins connaît parfaitement les différents quartiers d'Avrillé. Dans le centre-bourg historique, les parcelles plus étroites accueillent des jardins de charme avec murets de pierre et rosiers. Du côté de la Blancheraie et du Bois-du-Roy, les terrains plus vastes permettent des aménagements ambitieux : grandes pelouses, massifs arbustifs structurés, potagers familiaux et espaces de jeux pour enfants.

      La commune étant bien exposée avec peu d'ombre naturelle, la création de zones ombragées est un enjeu important : pergolas, plantations d'arbres à croissance rapide comme les érables ou les charmes. Nous concevons des jardins qui offrent du confort toute l'année, avec des ambiances différentes selon les saisons.
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
      Beaucouzé, située à l'ouest d'Angers le long de la route de Nantes, est une commune dynamique qui mélange harmonieusement zones résidentielles et pôle commercial. Le centre commercial Atoll a contribué à transformer le visage de la commune tout en préservant les quartiers résidentiels plus anciens qui conservent leur charme et leur végétation mature.

      Le sol de Beaucouzé est principalement composé de limons profonds reposant sur un substrat schisteux. Ces sols fertiles et bien équilibrés permettent la culture d'une large gamme de végétaux. Les rosiers, vivaces et arbustes à fleurs s'y développent particulièrement bien. Le drainage naturel peut cependant être insuffisant en période de fortes pluies hivernales, et la mise en place de drains est recommandée pour les zones les plus basses.

      Art des Jardins intervient à Beaucouzé aussi bien pour les particuliers que pour les copropriétés et les entreprises du secteur commercial. Les terrains généralement plats facilitent la création de belles pelouses et de terrasses de plain-pied, ainsi que l'installation de systèmes d'arrosage automatique pour les jardins de plus de 300 m².

      Les demandes les plus fréquentes concernent la création ou la rénovation de terrasses, l'engazonnement de nouvelles parcelles et la plantation de haies. Les jardins des constructions récentes nécessitent souvent un aménagement complet depuis le terrain nu : terrassement, apport de terre végétale, engazonnement et création d'espaces de vie extérieurs.
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
      Bouchemaine, au confluent de la Maine et de la Loire, jouit d'une situation géographique privilégiée qui en fait l'une des communes les plus prisées de l'agglomération angevine. Les paysages y sont saisissants : depuis les hauteurs du bourg, la vue s'étend sur les méandres de la Loire et les prairies inondables qui changent de visage au fil des saisons. Les propriétés, allant des maisons de maître du XIXe siècle aux villas contemporaines, offrent des jardins de 1 000 à 3 000 m².

      L'eau est à la fois un atout et un défi à Bouchemaine. Dans les zones basses, les sols alluviaux riches mais lourds imposent des choix de végétaux résilients : saules, aulnes, cornouillers sanguins, iris des marais et graminées ornementales. Sur les coteaux du bourg et de la Pointe, les sols schisteux et bien drainés accueillent des espèces méditerranéennes — lavandes, cistes, romarins et oliviers — qui profitent de l'exposition sud.

      Art des Jardins adapte ses interventions au contexte hydraulique et pédologique de chaque parcelle. Pour les jardins en zone inondable, nous privilégions des aménagements résilients : terrasses surélevées, murets de soutènement en pierre naturelle, plantations en buttes et matériaux résistants à l'eau. Sur les coteaux, les plantations étagées subliment les vues sur le fleuve sans les obstruer.

      L'entretien des jardins en bord de rivière suit un rythme saisonnier adapté. Au printemps, nettoyage et apport de compost relancent la végétation après le retrait des eaux. L'été, la proximité de l'eau maintient une fraîcheur qui limite l'arrosage. L'automne est idéal pour les plantations, profitant de l'humidité naturelle du sol.
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
      Saint-Barthélemy-d'Anjou, à l'est immédiat d'Angers, connaît depuis plusieurs années un fort développement urbain avec de nombreux programmes immobiliers neufs. Cette dynamique crée une demande importante en aménagement paysager, les nouveaux propriétaires souhaitant transformer leur terrain nu en un véritable jardin de vie. Parallèlement, les quartiers plus anciens du bourg offrent des jardins matures qui nécessitent des travaux de restructuration.

      Les sols barthéloméens sont principalement argilo-schisteux, avec une bonne fertilité mais une tendance au compactage. Ce type de sol nécessite un travail de préparation soigneux avant toute plantation : décompactage, amendement organique et paillage pour maintenir une bonne structure. Pour les pelouses, les mélanges de graminées résistants à la sécheresse s'adaptent bien à ces terrains, avec un semis idéal en septembre.

      Dans les lotissements récents, les parcelles de 300 à 600 m² demandent une conception optimisée : coin repas avec terrasse, espace de jeu, massif d'agrément et potager, le tout agencé pour préserver l'intimité. Art des Jardins élabore des plans d'aménagement qui intègrent circulations, plantations, éléments construits et éclairage extérieur.

      Les haies de séparation sont un sujet récurrent dans la commune. Nous préconisons les haies mixtes composées de photinia, eleagnus, viburnum et charmille, plus résistantes aux maladies qu'une haie monospécifique et offrant un intérêt écologique supérieur en accueillant une faune variée.
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
      Trélazé, ancienne capitale de l'ardoise, possède un patrimoine unique en France. Les buttes ardoisières, vestiges de siècles d'exploitation, ont été progressivement reconverties en espaces naturels et de loisirs. Ce passé industriel a façonné les sols et le paysage de manière singulière, créant des conditions de jardinage très spécifiques. La commune conserve aussi une forte tradition de jardins ouvriers et familiaux.

      Les sols trélazéens sont profondément marqués par le schiste ardoisier. Les fragments de schiste dans les couches superficielles confèrent un excellent drainage mais une certaine pauvreté en matière organique. Un travail d'amendement conséquent est nécessaire : compost, fumier décomposé et terre végétale pour enrichir la couche cultivable et améliorer la rétention d'eau.

      Art des Jardins s'inscrit dans la tradition locale en proposant des aménagements qui combinent esthétique et production : carrés potagers surélevés, vergers en espalier, arbres fruitiers nains et massifs de fleurs comestibles. Les murets de schiste typiques de la commune sont intégrés dans nos créations — escaliers, bordures de massifs, rocailles — rappelant l'identité ardoisière tout en apportant un aspect minéral contemporain.

      Les quartiers sont variés : le centre-ville offre des jardins de petite taille, tandis que le Petit Trélazé et la Quantinière disposent de terrains de 800 à 1 200 m². Près des anciennes carrières, les dénivellations offrent des opportunités de jardins en terrasses originaux.
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
      Les Ponts-de-Cé, cité insulaire sur la Loire, offre un cadre de vie exceptionnel avec ses îles, ses bras de Loire et son château médiéval dominant le fleuve. La ville s'étend sur plusieurs îles reliées par des ponts historiques, créant une configuration urbaine unique où l'eau est omniprésente et influence profondément la nature des jardins.

      Les sols ponts-de-céais sont typiquement ligériens : sablonneux et filtrants dans les zones basses proches du fleuve, plus argileux et compacts sur les hauteurs de Sorges et Saint-Aubin. Le climat bénéficie de l'effet modérateur de la Loire qui atténue les extrêmes de température, permettant la culture de figuiers, vignes, kiwis et même certains palmiers dans les expositions abritées.

      Art des Jardins connaît parfaitement les différents secteurs de la ville. Le centre historique présente des jardins étroits mais pleins de charme, encadrés par les façades en tuffeau. Saint-Aubin offre des parcelles plus vastes avec vue sur la Loire. À Sorges, les terrains en pente permettent des créations en terrasses originales. En zone inondable, nous sélectionnons des végétaux résistants aux submersions et des matériaux qui résistent à l'immersion.

      Le patrimoine végétal ligérien est remarquable : peupliers noirs, saules blancs, frênes et aulnes forment des ripisylves le long des berges. Les murs anciens en tuffeau créent des microclimats favorables aux fruitiers en espalier et aux plantes grimpantes.
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
      Écouflant, nichée entre la Sarthe et les basses vallées angevines, bénéficie d'un environnement naturel exceptionnel classé Natura 2000. Les prairies inondables, qui accueillent chaque hiver des milliers d'oiseaux migrateurs, constituent un paysage unique qui influence l'identité des jardins écouflantais. Les propriétés sont souvent généreuses, avec des terrains de 800 à 2 000 m².

      Les sols varient considérablement selon la distance à la Sarthe. En zone basse, les alluvions riches sont extrêmement fertiles mais soumises aux remontées de nappe en hiver. Sur les hauteurs du bourg et vers Éventard, les sols sablo-limoneux sont bien drainés et faciles à travailler. Le choix des végétaux et des techniques de plantation est adapté au contexte pédologique de chaque parcelle.

      Le caractère naturel de l'environnement inspire nos créations paysagères. Nous privilégions des aménagements qui s'intègrent dans ce cadre préservé : haies champêtres mêlant noisetiers, prunelliers et viornes, prairies fleuries d'espèces locales, bosquets d'essences indigènes et mares naturelles qui accueillent batraciens et libellules.

      Art des Jardins intervient à Écouflant pour des projets variés : création de jardins complets, restructuration de jardins anciens, et interventions sur les nombreux arbres de haute tige qui caractérisent la commune. Les peupliers, saules et frênes des bords de Sarthe font partie du patrimoine végétal local que nous contribuons à entretenir.
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
      Cantenay-Épinard, commune rurale au nord d'Angers, a su conserver un caractère authentique qui attire les amoureux de la campagne angevine. Ses deux bourgs historiques présentent un patrimoine bâti remarquable avec de nombreuses fermes en tuffeau et longères rénovées. Les grands terrains offrent des opportunités exceptionnelles de création paysagère. La commune est bordée par les basses vallées angevines, classées Natura 2000, dont les prairies humides créent un paysage d'une grande beauté.

      Les sols présentent une diversité intéressante. Dans les parties hautes, les terres limoneuses profondes offrent d'excellentes conditions pour les plantations. En descendant vers les vallées, les sols deviennent plus humides et argileux, orientant le choix vers des espèces de zone humide. Cette variation permet aussi bien de planter un verger en altitude que d'aménager un jardin d'eau en fond de vallon.

      Art des Jardins conçoit ici des projets respectueux du caractère rural : remise en état des allées en graviers, taille de restauration des arbres centenaires, création de potagers et de vergers dans l'esprit des jardins de curé angevins. Le bocage environnant inspire nos aménagements avec des haies champêtres traditionnelles composées de chênes têtards, frênes, noisetiers et aubépines.

      De nombreuses propriétés possèdent des arbres remarquables — chênes centenaires, cèdres du Liban, séquoias, tilleuls argentés — qui constituent un patrimoine végétal précieux. Les haies champêtres, que nous encourageons à maintenir et enrichir, structurent le territoire et abritent une faune diverse.
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
      Mûrs-Érigné, commune viticole des coteaux de Loire, offre un cadre de vie privilégié entre vignobles réputés et fleuve royal. L'appellation Coteaux-du-Layon commence ici, et cette tradition viticole séculaire a façonné le paysage : coteaux exposés plein sud, murets de schiste retenant la chaleur, chemins creux bordés de végétation spontanée. Cet environnement unique inspire des jardins de caractère qui puisent dans le terroir local.

      Le microclimat est l'un des plus favorables de l'agglomération angevine. L'exposition sud-ouest des coteaux et la réflexion de la chaleur par le fleuve créent des conditions quasi-méditerranéennes. Les sols sont majoritairement schisteux et bien drainés sur les coteaux, avec une couche arable mince. En bas de pente, les sols deviennent plus profonds et riches, mêlant sables, limons et argiles. Ce microclimat permet la culture d'oliviers, figuiers, lauriers-roses et grenadiers.

      Art des Jardins conçoit sur les coteaux des jardins en terrasses avec murets de schiste local qui retiennent la terre, stabilisent la pente et créent des microclimats favorables. Les propriétés — maisons de vignerons, longères en tuffeau, belles demeures — méritent un écrin végétal à la hauteur : rosiers grimpants, massifs d'aromatiques, haies topiaires et allées en gravier naturel rappelant les chemins viticoles.

      L'entretien des jardins de coteaux présente des contraintes spécifiques : la pente rend la tonte complexe et l'érosion menace les sols mal protégés. Le paillage systématique, l'engazonnement des talus résistant à la sécheresse et les couvre-sols persistants stabilisent le terrain tout en réduisant l'entretien.
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
      Sainte-Gemmes-sur-Loire, nichée entre la Loire et les coteaux du Layon, bénéficie d'un environnement naturel remarquable. Le paysage est dominé par le fleuve, ses grèves de sable, ses boires et sa végétation de berge caractéristique. Les propriétés vont des maisons de bourg avec jardins clos aux vastes propriétés en bordure de Loire, en passant par les pavillons des lotissements récents.

      Le sol gemméen présente une dualité marquée. Sur les hauteurs vers La Roche, le substrat schisteux affleure et les sols sont maigres et bien drainés. Dans la plaine alluviale, les sols sablo-limoneux sont profonds, fertiles et faciles à travailler. Dans le bourg historique, les murs en tuffeau créent des microclimats favorables aux fruitiers en espalier et aux plantes grimpantes.

      Art des Jardins valorise les espaces extérieurs en tirant parti des panoramas sur la Loire : conception de terrasses orientées, cadrage des perspectives, sélection de plantes qui apportent couleur et structure sans obstruer la vue. Les pergolas et tonnelles trouvent naturellement leur place dans ces jardins lumineux. En zone inondable, nous concevons des aménagements résilients avec des matériaux résistants à l'eau.

      L'entretien suit le rythme des saisons ligériennes. Le printemps est la saison la plus active, l'été demande une gestion attentive de l'arrosage sur les sols sableux, l'automne est idéal pour les plantations et l'hiver pour l'élagage et la taille des fruitiers.
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
      Montreuil-Juigné, en plein développement au nord-ouest d'Angers, accueille de nombreuses familles attirées par un cadre de vie alliant proximité urbaine et environnement naturel. La commune longe la Mayenne, dont les berges ombragées influencent le paysage des jardins riverains. Lotissements récents et quartiers anciens de Juigné-Bené coexistent, créant une diversité architecturale intéressante.

      Le sol est principalement argileux : il retient bien l'eau et les nutriments mais se compacte facilement et peut devenir imperméable en surface. Les amendements sableux et un apport régulier de compost améliorent la structure. Les sols argileux alternent entre saturation en hiver et dessèchement en été, rendant les paillages épais essentiels pour réguler l'humidité.

      Art des Jardins accompagne les propriétaires dans la création de jardins complets pour les constructions neuves — terrassement, drainage, pelouse, plantations et éclairage — comme dans la rénovation de jardins anciens. La présence de la Mayenne crée des conditions particulières en bordure de rivière, avec une humidité favorisant mousses et maladies fongiques que nous gérons par le choix de variétés résistantes.

      Les haies de thuyas et de leylandii des années 1990-2000 arrivent en fin de vie dans de nombreuses propriétés. Nous proposons leur remplacement par des haies mixtes persistantes et caduques, plus esthétiques, écologiques et résistantes aux maladies. La transition peut se faire progressivement.
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
      Saint-Jean-de-Linières, commune rurale à l'ouest d'Angers, offre un cadre de vie champêtre apprécié des amoureux de la nature. Le paysage de bocage angevin y est particulièrement bien préservé, avec ses haies vives, ses chemins creux et ses prairies bordées de chênes têtards. Les propriétés sont souvent spacieuses, dépassant fréquemment les 1 500 m², offrant des possibilités d'aménagement exceptionnelles.

      Le sol est principalement limono-argileux, avec un substrat de grès et de schiste qui affleure par endroits. Ces sols profonds et fertiles sont favorables à la plupart des végétaux d'ornement et des arbres fruitiers. Le drainage naturel est correct sur les parties hautes mais peut être insuffisant dans les cuvettes et bas de parcelle.

      Art des Jardins intervient ici pour des projets variés. Les anciens corps de ferme reconvertis nécessitent souvent un réaménagement complet des abords : reprofilage du terrain, création d'une cour paysagée, plantation de haies et mise en valeur des bâtiments en pierre. Le bocage environnant inspire nos créations : haies mixtes de charmes, érables champêtres, noisetiers et aubépines, intégrées dans le paysage rural.

      Les grandes surfaces permettent des aménagements ambitieux : allées de promenade, parcs arborés, prairies fleuries, vergers de variétés anciennes et potagers généreux. Les arbres de grande taille — chênes pédonculés, hêtres, châtaigniers — sont omniprésents et font partie du patrimoine végétal de la commune.
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
      Briollay, au confluent de la Sarthe et du Loir, offre un cadre de vie exceptionnel. Cette situation hydrographique unique, où deux rivières se rejoignent avant de former la Maine, crée un paysage d'eau et de prairies humides d'une grande beauté. Le patrimoine bâti comprend de belles demeures bourgeoises, manoirs et maisons de maître dont les jardins font appel à un large registre : allées de tilleuls, roseraies, bassins et topiaires.

      Les sols alluviaux sont parmi les plus riches de la région. Les limons déposés par les crues ont constitué une couche fertile propice à toutes les cultures. Cette richesse s'accompagne cependant d'une forte humidité hivernale, avec des remontées de nappe qui imposent le choix d'espèces adaptées. En zone inondable, les aménagements sont conçus pour résister aux submersions temporaires avec des matériaux imputrescibles.

      Art des Jardins crée ici des jardins d'eau avec bassins naturels et plantations de berge intégrées dans l'environnement rivulaire. Iris d'eau, prêles, joncs fleuris, lysimaques, astilbes et hostas composent des massifs luxuriants qui prospèrent dans l'humidité ambiante et offrent un spectacle renouvelé du printemps à l'automne.

      Les arbres de bord de rivière — saules blancs, aulnes glutineux, peupliers noirs et frênes — bordent la Sarthe et le Loir et constituent un patrimoine végétal remarquable. Ces essences à croissance rapide nécessitent un suivi régulier pour préserver leur santé et assurer la sécurité des riverains.
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
      Savennières, village viticole mondialement réputé pour ses vins blancs secs, s'étend sur les coteaux de la rive droite de la Loire. L'appellation compte deux grands crus — la Coulée-de-Serrant et la Roche-aux-Moines — témoignant d'un terroir d'exception. Les jardins d'agrément bénéficient des mêmes conditions favorables de sol, d'exposition et de microclimat que la vigne.

      Le microclimat est remarquable : l'exposition sud-est face à la Loire capte la chaleur du matin et la réverbération du fleuve l'après-midi. Les sols essentiellement schisteux, avec des affleurements de rhyolite et de schistes pourprés, sont maigres, caillouteux et très bien drainés. Ces conditions permettent la culture d'oliviers, figuiers, grenadiers et d'aromatiques méditerranéennes — lavandes, romarins, cistes, santolines et thyms.

      Art des Jardins puise dans la tradition viticole pour concevoir des jardins intégrés dans le paysage. Schiste local pour les murets et escaliers, graves de Loire pour les allées, plantations mêlant essences méditerranéennes et locales. Les propriétés — maisons de vignerons en tuffeau, manoirs, corps de ferme rénovés — sont habillées de rosiers anciens, glycines, bignones et jasmins étoilés sur les façades de pierre blonde.

      L'entretien suit un calendrier adapté au terroir : taille en fin d'hiver, désherbage mécanique sans produit chimique dans le respect de l'environnement viticole, et arrosages limités grâce au choix de plantes adaptées à la sécheresse estivale des coteaux.
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
      Saint-Sylvain-d'Anjou, à quelques minutes d'Angers par la route de Paris, est une commune résidentielle prisée des familles pour son cadre de vie paisible. Les quartiers pavillonnaires s'y sont développés depuis les années 1970, créant un tissu résidentiel varié où coexistent des jardins de différentes générations et de styles divers.

      Le sol saint-sylvainois est principalement limono-argileux, avec une bonne capacité de rétention d'eau. Ce sol fertile convient à la majorité des végétaux d'ornement et des arbres fruitiers. Il peut cependant poser des problèmes de stagnation en hiver, et un drainage périphérique est recommandé pour les nouvelles constructions.

      Les jardins de 400 à 900 m² demandent une conception réfléchie pour optimiser chaque espace : terrasse de réception, coin de détente ombragé, aire de jeux et potager productif. De nombreux jardins plantés dans les années 1980-1990 nécessitent une rénovation : conifères disproportionnés, massifs envahis, pelouses fatiguées. Art des Jardins restructure ces espaces avec des essences plus adaptées.

      La commune étant en zone périurbaine, de nombreux jardins combinent agrément et potager familial. Les carrés potagers surélevés, faciles à entretenir et esthétiques, sont associés à des rotations de cultures et des variétés adaptées au terroir angevin pour des récoltes généreuses du printemps à l'automne.
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
      Soulaines-sur-Aubance, commune rurale au sud d'Angers, offre un cadre de vie paisible le long de la rivière Aubance qui a donné son nom à l'appellation viticole locale. Le paysage est typique du bocage angevin méridional : coteaux doux couverts de vignes, vallons frais bordés de haies vives, prairies pâturées et boisements de chênes et de châtaigniers. Les propriétés sont souvent généreuses, de 1 000 à 5 000 m².

      Le terroir est marqué par des sols argilo-calcaires sur les coteaux et des sols alluviaux le long de l'Aubance. Les sols calcaires sont propices aux lavandes, buis et plantes de rocaille, tandis que les zones alluviales conviennent aux arbres fruitiers, rosiers et vivaces gourmandes en eau. L'Aubance crée aussi des zones fraîches propices aux hostas, fougères et astilbes.

      Art des Jardins conçoit ici des jardins de curé revisités, mêlant plantes utiles et ornementales : rosiers anciens, pivoines, iris germanica, aromatiques, petits fruits et fruitiers palissés. Le bocage environnant inspire des haies champêtres de charme, noisetier, prunellier et aubépine, ainsi que des haies gourmandes de cassissiers, groseilliers et framboisiers.

      Les anciennes fermes reconverties offrent un cadre idéal pour des projets paysagers ambitieux : cours, dépendances et vergers qui constituent la base d'aménagements de charme intégrés dans le paysage viticole et bocager de la commune.
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
      Loire-Authion, née en 2016 de la fusion de six communes historiques — Brain-sur-l'Authion, Andard, La Bohalle, La Daguenière, Corné et Saint-Mathurin-sur-Loire — est intimement liée à l'histoire de l'horticulture en Anjou. Ce terroir exceptionnel entre Loire et Authion a vu naître et prospérer des dizaines de pépinières et de rosiéristes qui ont fait la renommée internationale de l'Anjou végétal.

      La plaine alluviale offre des sols d'une richesse exceptionnelle. Les limons fertiles déposés par les crues ont créé une terre noire, profonde et meuble, idéale pour toutes les cultures. Les végétaux s'y développent avec une vigueur remarquable. Le vent d'ouest dominant, souvent sous-estimé, peut cependant dessécher les plantations, ce qui nécessite d'intégrer des brise-vent naturels dans les aménagements.

      La diversité des bourgs crée une variété de paysages et de types de jardins. À Saint-Mathurin-sur-Loire, les propriétés en bord de Loire offrent des vues exceptionnelles. À Brain-sur-l'Authion, les fermes horticoles reconverties présentent de vastes terrains structurés. À Corné, les jardins pavillonnaires récents demandent des aménagements fonctionnels. Art des Jardins travaille avec les pépinières locales qui perpétuent le savoir-faire angevin.

      Le risque d'inondation est un paramètre important. La levée de Loire protège la plaine, mais les jardins sont conçus pour résister aux submersions : végétaux résilients, matériaux résistants à l'eau et terrasses en pierre naturelle privilégiées dans les zones exposées.
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
      Longuenée-en-Anjou, au nord d'Angers, est une commune nouvelle issue du regroupement de La Meignanne, Le Plessis-Macé et La Membrolle-sur-Longuenée. Ce territoire étendu offre une grande diversité de paysages, du château du Plessis-Macé aux lotissements récents de La Meignanne, en passant par les fermes rénovées de La Membrolle. Le château et son parc constituent un patrimoine végétal remarquable qui inspire les propriétaires locaux.

      Les sols sont globalement argilo-limoneux, assez profonds et fertiles. Sur les hauteurs du Plessis-Macé, le substrat de grès roussard affleure, donnant des sols plus légers et mieux drainés. Dans les vallées, les sols plus humides et lourds demandent un travail d'amendement et de drainage. Les essences nobles — tilleuls, platanes, cèdres, magnolias — témoignent d'une tradition de jardinage ancienne et soignée.

      Art des Jardins accompagne chaque bourg selon ses besoins. À La Meignanne, les lotissements récents nécessitent des créations complètes : engazonnement, haies, terrasses et éclairage. Au Plessis-Macé et à La Membrolle, les propriétés anciennes demandent rénovation, taille de restauration et entretien adapté aux grands espaces.

      Le bocage bien conservé abrite une biodiversité riche. Les haies mixtes de charmes, chênes, noisetiers et aubépines constituent le maillage bocager traditionnel. Nous proposons de les enrichir avec des espèces à fleurs (viornes, cornouillers) et à fruits (pommiers sauvages, alisiers) pour maximiser l'intérêt ornemental et écologique.
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
