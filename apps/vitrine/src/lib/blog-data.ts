export interface BlogArticle {
  slug: string;
  title: string;
  metaTitle: string;
  metaDescription: string;
  excerpt: string;
  category: string;
  readTime: number; // minutes
  publishDate: string; // YYYY-MM-DD
  imageSlug: string;
  content: string; // HTML-safe markdown-like content
  faq: { question: string; answer: string }[];
}

export const articles: BlogArticle[] = [
  {
    slug: 'quand-elaguer-ses-arbres',
    title: 'Quand élaguer ses arbres ? Guide complet par espèce',
    metaTitle: 'Quand Élaguer ses Arbres ? Calendrier par Espèce | Art des Jardins',
    metaDescription:
      'Découvrez la meilleure période pour élaguer vos arbres selon l\'espèce : chêne, tilleul, cerisier, pin... Guide complet par un élagueur professionnel à Angers.',
    excerpt:
      'L\'élagage au bon moment est essentiel pour la santé de vos arbres. Découvrez le calendrier idéal espèce par espèce.',
    category: 'Élagage',
    readTime: 6,
    publishDate: '2026-02-01',
    imageSlug: 'elagage-1',
    content: `
L'élagage est un geste essentiel pour la santé et la sécurité de vos arbres. Mais attention : élaguer au mauvais moment peut fragiliser l'arbre, favoriser les maladies ou compromettre la cicatrisation. Voici notre guide complet.

## La règle générale : privilégier l'hiver

Pour la majorité des arbres à feuilles caduques, **la période idéale d'élagage se situe entre novembre et mars**, pendant le repos végétatif. L'arbre est en dormance, la sève ne circule pas, ce qui limite le stress et favorise une bonne cicatrisation au printemps.

**Avantages de l'élagage hivernal :**
- Meilleure visibilité de la structure sans feuilles
- Moins de risque de propagation de maladies
- Cicatrisation optimale au redémarrage printanier
- Sol dur facilitant l'accès avec le matériel

## Calendrier par espèce

### Arbres à feuilles caduques
- **Chêne, hêtre, charme** : novembre à février (hors gel)
- **Tilleul, érable, frêne** : décembre à février
- **Marronnier** : janvier à mars
- **Bouleau, peuplier** : novembre à décembre (car ils « pleurent » au printemps)

### Arbres fruitiers
- **Pommier, poirier** : février à mars (taille de fructification)
- **Cerisier, prunier** : après la récolte (été/automne) — jamais en hiver !
- **Figuier** : mars à avril

### Conifères
- **Pin, sapin, épicéa** : fin d'été (septembre) ou fin d'hiver (mars)
- **Cyprès, thuya** : mai à juin et septembre

### Cas particuliers
- **Platane** : octobre à novembre uniquement (risque de chancre coloré)
- **Palmier** : juin à septembre

## Les périodes à éviter absolument

- **Avril-mai** : montée de sève, l'arbre est très vulnérable
- **Périodes de gel intense** : le bois gelé se fend mal et cicatrise difficilement
- **Nidification** (mars à août) : la loi protège les oiseaux nicheurs

## Pourquoi faire appel à un professionnel ?

Un élagueur professionnel connaît les spécificités de chaque espèce et adapte sa technique. À Angers, Art des Jardins intervient toute l'année avec un calendrier adapté à chaque arbre. Nous réalisons un diagnostic gratuit avant toute intervention.
    `,
    faq: [
      {
        question: 'Peut-on élaguer en été ?',
        answer:
          'Oui, pour certaines espèces comme les cerisiers ou pour des tailles légères d\'entretien. Mais les élagages importants sont déconseillés en été pour les arbres caducs.',
      },
      {
        question: 'À quelle fréquence faut-il élaguer ?',
        answer:
          'En général, un élagage d\'entretien tous les 3 à 5 ans suffit. Les arbres fruitiers nécessitent une taille annuelle pour bien fructifier.',
      },
    ],
  },
  {
    slug: 'prix-paysagiste-amenagement-jardin',
    title: 'Prix paysagiste : combien coûte un aménagement de jardin ?',
    metaTitle: 'Prix Paysagiste 2026 : Tarifs Aménagement Jardin | Art des Jardins',
    metaDescription:
      'Combien coûte un paysagiste ? Tarifs détaillés pour l\'aménagement de jardin : création, terrasse, plantation. Prix au m² et exemples chiffrés.',
    excerpt:
      'Le coût d\'un aménagement paysager varie selon la complexité. Voici nos tarifs indicatifs détaillés.',
    category: 'Aménagement',
    readTime: 5,
    publishDate: '2026-02-05',
    imageSlug: 'creation-2',
    content: `
Le budget d'un aménagement de jardin dépend de nombreux facteurs : surface, complexité, choix des matériaux et des végétaux. Voici un guide complet pour estimer votre projet.

## Fourchettes de prix au m²

| Type de prestation | Prix indicatif |
|---|---|
| Engazonnement simple | 8 – 15 €/m² |
| Plantation de massifs | 30 – 80 €/m² |
| Création de terrasse (bois) | 100 – 200 €/m² |
| Création de terrasse (pierre) | 80 – 150 €/m² |
| Aménagement complet jardin | 50 – 150 €/m² |
| Arrosage automatique | 15 – 30 €/m² |

## Ce qui influence le prix

### La surface
Plus la surface est grande, plus le prix au m² diminue grâce aux économies d'échelle. Un jardin de 50 m² coûtera proportionnellement plus cher qu'un jardin de 200 m².

### L'état du terrain
Un terrain plat et accessible sera moins coûteux à aménager qu'un terrain en pente nécessitant du terrassement, des murets de soutènement ou un drainage.

### Le choix des végétaux
Les arbres de grande taille (3-4 m) coûtent nettement plus cher que des jeunes plants. Les espèces rares ou méditerranéennes sont aussi plus onéreuses que les essences locales.

### Les matériaux
Pierre naturelle, bois exotique, béton désactivé... le choix des matériaux pour terrasses, allées et bordures a un impact significatif sur le budget.

## Exemples de budgets

**Petit jardin de ville (50 m²)** : 3 000 – 6 000 €
- Engazonnement, quelques arbustes, bordures, éclairage simple

**Jardin familial (150 m²)** : 8 000 – 18 000 €
- Terrasse, pelouse, massifs plantés, haie, arrosage

**Grand jardin (300 m² et +)** : 15 000 – 40 000 €
- Conception complète, terrasse, allées, plantation, éclairage, arrosage automatique

## Le devis : une étape indispensable

Chaque jardin est unique. Chez Art des Jardins, nous réalisons systématiquement une visite gratuite pour évaluer votre terrain, comprendre vos envies et établir un devis détaillé. Pas de mauvaise surprise : tout est chiffré poste par poste.
    `,
    faq: [
      {
        question: 'Le devis est-il gratuit ?',
        answer:
          'Oui, le devis et la visite sur place sont entièrement gratuits et sans engagement. Nous nous déplaçons dans un rayon de 30 km autour d\'Angers.',
      },
      {
        question: 'Peut-on réaliser un aménagement par étapes ?',
        answer:
          'Tout à fait. Nous pouvons planifier votre projet en plusieurs phases pour étaler le budget. La conception globale est pensée dès le départ pour garantir la cohérence.',
      },
    ],
  },
  {
    slug: 'entretien-jardin-calendrier-mois-par-mois',
    title: 'Entretien de jardin : le calendrier mois par mois',
    metaTitle: 'Calendrier Entretien Jardin Mois par Mois | Art des Jardins Angers',
    metaDescription:
      'Que faire au jardin chaque mois ? Calendrier complet d\'entretien : tonte, taille, plantation, traitement. Conseils de jardiniers professionnels à Angers.',
    excerpt:
      'Un jardin impeccable toute l\'année demande des gestes adaptés à chaque saison. Voici le calendrier complet.',
    category: 'Entretien',
    readTime: 7,
    publishDate: '2026-02-10',
    imageSlug: 'entretien-2',
    content: `
Un beau jardin, c'est un jardin entretenu au bon moment. Voici le calendrier mois par mois pour ne rien oublier, adapté au climat de l'Anjou.

## Printemps : le renouveau

### Mars
- Première tonte de la saison (lame haute)
- Taille des rosiers et arbustes à floraison estivale
- Bêchage et amendement des massifs
- Plantation d'arbustes et vivaces
- Traitement préventif contre les maladies

### Avril
- Tonte régulière (toutes les 2 semaines)
- Désherbage des massifs et allées
- Plantation des annuelles et bulbes d'été
- Semis de gazon (regarnissage)
- Mise en route de l'arrosage automatique

### Mai
- Tonte hebdomadaire
- Taille des haies (première passe)
- Paillage des massifs (économie d'eau)
- Traitement anti-pucerons si nécessaire
- Installation du mobilier de jardin

## Été : l'entretien régulier

### Juin
- Tonte hebdomadaire
- Arrosage régulier (matin ou soir)
- Taille des haies de persistants
- Tuteurage des vivaces hautes
- Ramassage des fruits tombés

### Juillet-Août
- Tonte (relever la hauteur de coupe en cas de sécheresse)
- Arrosage adapté (goutte-à-goutte idéal)
- Désherbage régulier
- Taille des lavandes après floraison
- Surveillance des maladies (mildiou, oïdium)

## Automne : la préparation

### Septembre
- Tonte régulière (reprise de croissance)
- Semis et regarnissage de gazon
- Plantation des bulbes de printemps
- Taille des haies (dernière passe avant l'hiver)
- Division des vivaces

### Octobre-Novembre
- Dernières tontes de la saison
- Ramassage des feuilles mortes
- Plantation d'arbres et arbustes (période idéale !)
- Protection des plantes gélives
- Vidange de l'arrosage automatique
- Amendement du sol (compost, fumier)

## Hiver : le repos actif

### Décembre-Février
- Élagage des arbres caducs (hors gel)
- Taille de formation des arbres fruitiers
- Entretien du matériel
- Planification des projets de printemps
- Protection contre le gel (voile d'hivernage, paillage)

## Confier son entretien à un professionnel

Avec un contrat d'entretien chez Art des Jardins, vous n'avez plus à vous soucier du calendrier : nous intervenons aux bons moments avec les bons gestes. De 10 à 15 passages par an selon votre jardin.
    `,
    faq: [
      {
        question: 'Combien de fois par an faut-il tondre ?',
        answer:
          'En Anjou, comptez 25 à 30 tontes par an : hebdomadaire d\'avril à octobre, bi-mensuelle au printemps et en automne, pause en hiver.',
      },
      {
        question: 'Quand planter des arbres ?',
        answer:
          'La meilleure période est de novembre à mars (hors gel). Comme dit le proverbe : "À la Sainte-Catherine, tout bois prend racine" (25 novembre).',
      },
    ],
  },
  {
    slug: 'taille-haie-quand-comment',
    title: 'Taille de haie : quand et comment tailler ?',
    metaTitle: 'Taille de Haie : Quand et Comment Tailler ? | Art des Jardins',
    metaDescription:
      'Guide complet sur la taille de haie : meilleure période, technique, fréquence. Haie de thuya, laurier, photinia... Conseils de professionnels.',
    excerpt:
      'La taille de haie au bon moment garantit une haie dense et saine. Voici tout ce qu\'il faut savoir.',
    category: 'Entretien',
    readTime: 5,
    publishDate: '2026-02-12',
    imageSlug: 'entretien-1',
    content: `
Une haie bien taillée est un atout pour votre jardin : elle structure l'espace, protège du vent et des regards. Encore faut-il la tailler correctement et au bon moment.

## Quand tailler sa haie ?

### La règle des deux tailles
La plupart des haies nécessitent **deux tailles par an** :
1. **Mai-juin** : taille principale après la première poussée de printemps
2. **Septembre** : taille de « mise au propre » avant l'hiver

### Selon le type de haie

**Haies persistantes (thuya, laurier, photinia, cyprès)** :
- Taille en mai-juin et septembre
- Éviter la taille en plein été (stress hydrique)

**Haies à feuilles caduques (charme, hêtre, troène)** :
- Taille en juin et en automne (octobre-novembre)
- Possibilité d'une taille légère en mars

**Haies fleuries (forsythia, lilas, spirée)** :
- Taille juste APRÈS la floraison
- Ne jamais tailler avant la floraison sous peine de la supprimer

**Haies libres (champêtres)** :
- Une seule taille par an suffit (fin d'été)
- Respecter la forme naturelle

## Comment bien tailler ?

### Les bons gestes
- **Tailler en trapèze** : base plus large que le sommet pour que la lumière atteigne la base
- **Utiliser un cordeau** pour garantir une ligne droite
- **Couper les branches à leur naissance** plutôt que les raccourcir
- **Nettoyer et désinfecter les outils** entre les haies pour éviter de propager des maladies

### La réglementation
Attention : la loi interdit la taille de haies du **1er mars au 31 août** dans certaines zones pour protéger la nidification des oiseaux. Renseignez-vous auprès de votre mairie.

## Le saviez-vous ?

L'entretien des haies de moins de 3,5 m de hauteur est éligible au **crédit d'impôt de 50 %** dans le cadre des services à la personne. Chez Art des Jardins, nos prestations d'entretien de haie ouvrent droit à cet avantage fiscal.
    `,
    faq: [
      {
        question: 'Ma haie de thuya jaunit, que faire ?',
        answer:
          'Le jaunissement des thuyas peut avoir plusieurs causes : manque d\'eau, araignées rouges, ou maladie fongique. Un diagnostic professionnel permet d\'identifier la cause et d\'agir rapidement.',
      },
      {
        question: 'Quelle est la hauteur maximale d\'une haie ?',
        answer:
          'Selon le Code civil (art. 671), si votre haie est à moins de 2 m de la limite de propriété, sa hauteur ne doit pas dépasser 2 m. Au-delà de 2 m de la limite, pas de restriction.',
      },
    ],
  },
  {
    slug: 'abattage-arbre-reglementation-autorisation',
    title: 'Abattage d\'arbre : réglementation et autorisation',
    metaTitle: 'Abattage d\'Arbre : Réglementation et Autorisation 2026 | Art des Jardins',
    metaDescription:
      'Faut-il une autorisation pour abattre un arbre ? PLU, EBC, arbres classés... Tout savoir sur la réglementation de l\'abattage d\'arbres en Maine-et-Loire.',
    excerpt:
      'Avant d\'abattre un arbre, vérifiez la réglementation. Certains cas nécessitent une autorisation préalable.',
    category: 'Abattage',
    readTime: 5,
    publishDate: '2026-02-14',
    imageSlug: 'abattage-1',
    content: `
Vous souhaitez abattre un arbre dans votre jardin ? Avant toute intervention, il est essentiel de vérifier la réglementation applicable. Dans certains cas, une autorisation est obligatoire sous peine d'amende.

## Quand faut-il une autorisation ?

### Arbres en zone protégée

Si votre propriété se trouve dans une des zones suivantes, une autorisation est nécessaire :

- **Espaces Boisés Classés (EBC)** : toute coupe nécessite une autorisation de la mairie
- **Zone de protection du patrimoine** : avis de l'Architecte des Bâtiments de France
- **Périmètre d'un monument historique** (500 m) : déclaration préalable
- **Site classé ou inscrit** : autorisation du préfet

### Plan Local d'Urbanisme (PLU)

Le PLU de votre commune peut imposer des contraintes supplémentaires :
- **Obligation de replantation** après abattage
- **Protection de certaines espèces** locales
- **Zone verte ou corridor écologique** à respecter

À Angers et dans l'agglomération, le PLUi (intercommunal) classe de nombreux arbres remarquables.

### Arbres classés ou remarquables

Certains arbres sont protégés en raison de leur âge, leur taille ou leur intérêt patrimonial. Leur abattage nécessite une procédure spécifique et n'est autorisé qu'en cas de danger avéré ou de maladie incurable.

## Quand peut-on abattre librement ?

Vous pouvez généralement abattre sans autorisation :
- Les arbres de votre jardin **en dehors de toute zone protégée**
- Les arbres **morts ou dangereux** (avec justificatif si contestation)
- Les arbres de **moins de 2 m de hauteur**

## La procédure de déclaration

1. **Vérifiez le PLU** de votre commune (en mairie ou en ligne)
2. **Déposez une déclaration préalable** si nécessaire (formulaire Cerfa)
3. **Attendez l'autorisation** (délai de 1 à 2 mois)
4. **Faites réaliser l'abattage** par un professionnel

## Art des Jardins vous accompagne

Nous connaissons parfaitement la réglementation locale en Maine-et-Loire. Avant toute intervention, nous vérifions les contraintes applicables à votre parcelle et vous accompagnons dans les démarches administratives si nécessaire.
    `,
    faq: [
      {
        question: 'Quelle amende en cas d\'abattage non autorisé ?',
        answer:
          'L\'amende peut aller jusqu\'à 300 € par mètre cube de bois abattu en EBC, et jusqu\'à 150 000 € pour l\'abattage d\'un arbre classé. Des obligations de replantation peuvent s\'ajouter.',
      },
      {
        question: 'Mon voisin veut abattre un arbre qui me gêne, quels sont mes droits ?',
        answer:
          'Si les branches dépassent chez vous, vous pouvez demander à votre voisin de les couper (art. 673 du Code civil). Pour l\'abattage, seul le propriétaire de l\'arbre peut décider, sauf si l\'arbre présente un danger avéré.',
      },
    ],
  },
];

export function getArticleBySlug(slug: string): BlogArticle | undefined {
  return articles.find((a) => a.slug === slug);
}
