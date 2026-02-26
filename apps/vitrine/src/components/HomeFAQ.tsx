'use client';

import { useState } from 'react';
import { IconChevronDown } from '@/lib/icons';

interface FAQItem {
  question: string;
  answer: string;
}

const faqs: FAQItem[] = [
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
];

function FAQSchema() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

function AccordionItem({ item, isOpen, onToggle }: { item: FAQItem; isOpen: boolean; onToggle: () => void }) {
  return (
    <div className="border-b border-gray-200 last:border-b-0">
      <button
        type="button"
        className="flex items-center justify-between w-full py-5 text-left"
        onClick={onToggle}
        aria-expanded={isOpen}
      >
        <span className="text-lg font-medium text-gray-900 pr-4">{item.question}</span>
        <IconChevronDown className={`w-5 h-5 text-gray-500 flex-shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      <div
        className={`grid transition-[grid-template-rows] duration-300 ease-in-out ${
          isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
        }`}
      >
        <div className="overflow-hidden">
          <p className="pb-5 text-gray-600 leading-relaxed">{item.answer}</p>
        </div>
      </div>
    </div>
  );
}

export function HomeFAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="py-16 lg:py-24 bg-gray-50">
      <FAQSchema />
      <div className="container-custom max-w-3xl">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">Questions fréquentes</h2>
        <p className="text-gray-600 text-center mb-10 max-w-2xl mx-auto">
          Tout ce que vous devez savoir avant de faire appel à un paysagiste à Angers.
        </p>
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 px-6 md:px-8">
          {faqs.map((faq, i) => (
            <AccordionItem
              key={i}
              item={faq}
              isOpen={openIndex === i}
              onToggle={() => setOpenIndex(openIndex === i ? null : i)}
            />
          ))}
        </div>
        <div className="text-center mt-10">
          <p className="text-gray-600 mb-4">
            Vous avez d&apos;autres questions ? Contactez-nous directement.
          </p>
          <a href="/contact/" className="btn-primary">
            Poser une question
          </a>
        </div>
      </div>
    </section>
  );
}
