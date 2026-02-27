'use client';

import { useState } from 'react';
import Link from 'next/link';
import { IconChevronDown } from '@/lib/icons';

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQCategory {
  id: string;
  title: string;
  serviceHref?: string;
  items: FAQItem[];
}

const faqCategories: FAQCategory[] = [
  {
    id: 'general',
    title: 'Questions générales',
    items: [
      {
        question: 'Quels services proposez-vous ?',
        answer:
          'Art des Jardins propose l\'aménagement paysager (création de jardins, terrasses, clôtures), l\'entretien régulier (tonte, taille de haies, désherbage), l\'élagage d\'arbres et l\'abattage sécurisé avec dessouchage. Nous intervenons aussi bien chez les particuliers que pour les professionnels et syndics.',
      },
      {
        question: 'Dans quelle zone intervenez-vous ?',
        answer:
          'Nous intervenons dans un rayon de 30 km autour d\'Angers : Les Ponts-de-Cé, Avrillé, Beaucouzé, Bouchemaine, Trélazé, Saint-Barthélemy-d\'Anjou, Écouflant, Mûrs-Érigné et toutes les communes du Maine-et-Loire (49). Le déplacement et le devis sont gratuits. Nous pouvons également intervenir hors département pour des chantiers plus conséquents.',
      },
      {
        question: 'Comment obtenir un devis ?',
        answer:
          'Appelez-nous au 07 81 16 07 37 ou au 06 59 68 49 16, écrivez-nous sur WhatsApp, ou remplissez le formulaire sur notre page contact. Nous vous recontactons sous 48h et planifions une visite gratuite sur place pour évaluer votre projet. Le devis est gratuit sous 48h suite au rendez-vous, détaillé, transparent et sans engagement.',
      },
      {
        question: 'Êtes-vous assurés ?',
        answer:
          'Oui, Art des Jardins est couvert par une assurance responsabilité civile professionnelle (RC Pro) et par une assurance décennale. Tous nos intervenants sont formés et équipés pour travailler en sécurité, y compris pour les travaux en hauteur (élagage, abattage).',
      },
      {
        question: 'Qu\'est-ce que l\'assurance décennale ?',
        answer:
          'L\'assurance décennale protège tous les aménagements que nous réalisons pendant 10 ans après la fin des travaux. Concrètement, si un ouvrage présente un défaut de solidité, un expert indépendant intervient pour vérifier que les travaux ont été réalisés dans les règles de l\'art, puis les réparations sont prises en charge. Cela couvre vos murets, terrasses, clôtures, allées… C\'est une vraie garantie de tranquillité pour vos projets paysagers.',
      },
      {
        question: 'Proposez-vous des contrats d\'entretien annuel ?',
        answer:
          'Oui, nous proposons des contrats d\'entretien à l\'année adaptés à vos besoins : tonte régulière, taille saisonnière, désherbage, ramassage de feuilles. La fréquence et les prestations sont définies ensemble lors du devis. C\'est la solution la plus économique pour garder un jardin impeccable toute l\'année.',
      },
      {
        question: 'Quels sont vos délais d\'intervention ?',
        answer:
          'Pour un devis, nous vous recontactons sous 48h suite au rendez-vous. Pour une intervention classique, comptez 2 semaines à 1 mois selon la saison. En cas d\'urgence (arbre dangereux, dégâts de tempête), nous pouvons intervenir sous 24 à 48h. Appelez-nous directement au 07 81 16 07 37.',
      },
    ],
  },
  {
    id: 'amenagement',
    title: 'Aménagement paysager',
    serviceHref: '/services/paysagisme/',
    items: [
      {
        question: 'Comment est établi le prix d\'une prestation ?',
        answer:
          'Chaque projet est unique. Nous établissons un devis personnalisé après une visite gratuite sur place, en tenant compte de la surface, des matériaux, de la complexité du chantier et de vos souhaits. Le devis est détaillé, transparent et sans engagement.',
      },
      {
        question: 'Quelle est la meilleure période pour aménager un jardin ?',
        answer:
          'L\'automne et l\'hiver sont idéaux pour la plantation, cependant nous réalisons les travaux d\'aménagement toute l\'année.',
      },
      {
        question: 'Proposez-vous un service d\'entretien après l\'aménagement ?',
        answer:
          'Oui, nous proposons des contrats d\'entretien annuels pour maintenir votre jardin en parfait état. Tonte, taille, désherbage... nous nous occupons de tout.',
      },
    ],
  },
  {
    id: 'entretien',
    title: 'Entretien de jardin',
    serviceHref: '/services/entretien-jardin/',
    items: [
      {
        question: 'À quelle fréquence devez-vous intervenir pour l\'entretien ?',
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
    id: 'elagage',
    title: 'Élagage',
    serviceHref: '/services/elagage/',
    items: [
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
    id: 'abattage',
    title: 'Abattage',
    serviceHref: '/services/abattage/',
    items: [
      {
        question: 'Faut-il une autorisation pour abattre un arbre ?',
        answer:
          'Cela dépend de votre commune et du type d\'arbre. En zone protégée ou pour les arbres classés, une autorisation est obligatoire. Nous vous aidons à faire les démarches.',
      },
      {
        question: 'Que faites-vous du bois après abattage ?',
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
  {
    id: 'terrasse',
    title: 'Terrasses',
    serviceHref: '/services/terrasse/',
    items: [
      {
        question: 'Quel matériau choisir pour ma terrasse ?',
        answer:
          'Le choix dépend de votre budget, de l\'entretien souhaité et de l\'esthétique voulue. Le bois composite est le plus simple d\'entretien, le bois naturel le plus chaleureux, et la pierre le plus durable. Nous vous conseillerons lors de la visite.',
      },
      {
        question: 'Faut-il un permis de construire pour une terrasse ?',
        answer:
          'Une terrasse de plain-pied ne nécessite généralement pas de permis. Au-delà de 60 cm de hauteur ou 20 m² de surface, une déclaration préalable peut être requise. Nous vous accompagnons dans les démarches.',
      },
      {
        question: 'Combien de temps dure la construction d\'une terrasse ?',
        answer:
          'Comptez généralement 1 à 2 semaines pour une terrasse standard, selon la surface et la complexité du projet. Nous vous communiquons un planning précis au moment du devis.',
      },
    ],
  },
  {
    id: 'cloture',
    title: 'Clôtures',
    serviceHref: '/services/cloture/',
    items: [
      {
        question: 'Quelle clôture choisir pour mon terrain ?',
        answer:
          'Le choix dépend de votre objectif (intimité, sécurité, esthétique), de votre budget et des règles d\'urbanisme locales. Nous vous conseillons la solution la plus adaptée lors de la visite gratuite.',
      },
      {
        question: 'Faut-il une autorisation pour poser une clôture ?',
        answer:
          'Dans la plupart des communes, une déclaration préalable de travaux est nécessaire. Certaines zones imposent des contraintes de hauteur ou de matériau. Nous vérifions les règles locales pour vous.',
      },
      {
        question: 'Quelle est la durée de pose d\'une clôture ?',
        answer:
          'Pour un terrain standard, comptez 2 à 5 jours selon le linéaire et le type de clôture. Nous vous communiquons un planning précis dans le devis.',
      },
    ],
  },
  {
    id: 'taille-haies',
    title: 'Taille de haies',
    serviceHref: '/services/taille-haies/',
    items: [
      {
        question: 'Quand tailler sa haie ?',
        answer:
          'La plupart des haies se taillent 2 fois par an : en juin après la première pousse et en septembre avant l\'hiver. Certaines espèces à croissance rapide peuvent nécessiter 3 tailles par an.',
      },
      {
        question: 'Ma haie est trop haute, peut-on la réduire ?',
        answer:
          'Oui, nous réalisons des rabattages pour réduire la hauteur des haies devenues trop imposantes. L\'opération se fait généralement en fin d\'hiver pour limiter le stress sur les végétaux.',
      },
      {
        question: 'Quelle est la réglementation pour les haies en limite de propriété ?',
        answer:
          'Les haies de plus de 2 m de haut doivent être plantées à 2 m minimum de la limite de propriété. En dessous de 2 m, la distance minimale est de 50 cm. Nous veillons au respect de ces règles.',
      },
    ],
  },
  {
    id: 'debroussaillage',
    title: 'Débroussaillage',
    serviceHref: '/services/debroussaillage/',
    items: [
      {
        question: 'Mon terrain est totalement envahi, pouvez-vous intervenir ?',
        answer:
          'Oui, nous intervenons sur tous types de terrains, même les plus envahis. Ronces, arbustes sauvages, repousses d\'arbres : notre matériel professionnel permet de traiter toutes les situations.',
      },
      {
        question: 'Le débroussaillage est-il obligatoire ?',
        answer:
          'Dans certaines zones classées à risque d\'incendie, le débroussaillage est une obligation légale dans un rayon de 50 m autour des habitations. Nous vous renseignons sur vos obligations.',
      },
      {
        question: 'Que devient la végétation coupée ?',
        answer:
          'Les végétaux sont broyés sur place quand c\'est possible (le broyat peut servir de paillis) ou évacués vers un centre de compostage agréé.',
      },
    ],
  },
  {
    id: 'arrosage',
    title: 'Arrosage automatique',
    serviceHref: '/services/arrosage-automatique/',
    items: [
      {
        question: 'L\'arrosage automatique consomme-t-il beaucoup d\'eau ?',
        answer:
          'Au contraire, un système bien conçu économise jusqu\'à 40 % d\'eau par rapport à un arrosage manuel. La programmation et les sondes d\'humidité évitent le gaspillage.',
      },
      {
        question: 'Peut-on installer un arrosage automatique sur un jardin existant ?',
        answer:
          'Oui, l\'installation se fait par tranchage léger qui se referme en quelques semaines. Le gazon retrouve un aspect normal rapidement après l\'intervention.',
      },
      {
        question: 'Que faire de l\'arrosage en hiver ?',
        answer:
          'Nous réalisons l\'hivernage de votre système : purge complète du circuit, protection du programmateur et des vannes. La remise en route se fait au printemps.',
      },
    ],
  },
  {
    id: 'pratique',
    title: 'Informations pratiques',
    items: [
      {
        question: 'Quels moyens de paiement acceptez-vous ?',
        answer:
          'Nous acceptons les paiements par chèque, virement bancaire et espèces. Pour les chantiers d\'aménagement, un acompte de 30 % est demandé à la signature du devis, le solde à la fin des travaux.',
      },
      {
        question: 'Les travaux de jardinage sont-ils éligibles au crédit d\'impôt ?',
        answer:
          'Oui, les travaux d\'entretien de jardin réalisés par un professionnel ouvrent droit à un crédit d\'impôt de 50 % (dans la limite de 5 000 € par an pour une personne seule, 10 000 € pour un couple). Cela inclut la tonte, la taille de haies, le débroussaillage et le désherbage. Les travaux de création (aménagement, terrasse) ne sont pas éligibles.',
      },
    ],
  },
];

const allFAQItems = faqCategories.flatMap((cat) => cat.items);

function FAQSchemas() {
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: allFAQItems.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Accueil',
        item: 'https://art-et-jardin.fr/',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'FAQ',
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
    </>
  );
}

function AccordionItem({
  item,
  isOpen,
  onToggle,
}: {
  item: FAQItem;
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="border-b border-gray-200 last:border-b-0">
      <button
        type="button"
        className="flex items-center justify-between w-full py-4 text-left"
        onClick={onToggle}
        aria-expanded={isOpen}
      >
        <span className="text-base font-medium text-gray-900 pr-4">{item.question}</span>
        <IconChevronDown
          className={`w-5 h-5 text-gray-500 flex-shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>
      <div
        className={`grid transition-[grid-template-rows] duration-300 ease-in-out ${
          isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
        }`}
      >
        <div className="overflow-hidden">
          <p className="pb-4 text-gray-600 leading-relaxed">{item.answer}</p>
        </div>
      </div>
    </div>
  );
}

export function FAQContent() {
  const [openKey, setOpenKey] = useState<string | null>('general-0');

  const toggleItem = (key: string) => {
    setOpenKey(openKey === key ? null : key);
  };

  return (
    <section className="pt-8 pb-16 lg:pt-10 lg:pb-24">
      <FAQSchemas />
      <div className="container-custom">
        {/* Quick nav */}
        <nav
          className="flex flex-wrap gap-2 mb-12 justify-center"
          aria-label="Catégories FAQ"
        >
          {faqCategories.map((cat) => (
            <a
              key={cat.id}
              href={`#${cat.id}`}
              className="text-sm px-3 py-1.5 rounded-full bg-gray-100 text-gray-700 hover:bg-primary-50 hover:text-primary-700 transition-colors"
            >
              {cat.title}
            </a>
          ))}
        </nav>

        {/* Categories */}
        <div className="max-w-3xl mx-auto space-y-12">
          {faqCategories.map((category) => (
            <div key={category.id} id={category.id} className="scroll-mt-24">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900">{category.title}</h2>
                {category.serviceHref && (
                  <Link
                    href={category.serviceHref}
                    className="text-sm text-primary-600 hover:text-primary-700 font-medium whitespace-nowrap"
                  >
                    Voir le service &rarr;
                  </Link>
                )}
              </div>
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 px-6">
                {category.items.map((item, i) => (
                  <AccordionItem
                    key={i}
                    item={item}
                    isOpen={openKey === `${category.id}-${i}`}
                    onToggle={() => toggleItem(`${category.id}-${i}`)}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Total count */}
        <p className="text-center text-sm text-gray-400 mt-12">
          {allFAQItems.length} questions &mdash; {faqCategories.length} catégories
        </p>
      </div>
    </section>
  );
}
