import Link from 'next/link';
import { IconCheck } from '@/lib/icons';

interface TaxCreditExample {
  label: string;
  total: string;
  credit: string;
  net: string;
  perMonth: string;
}

interface TaxCreditConfig {
  title: string;
  subtitle: string;
  example: TaxCreditExample;
  ctaLabel: string;
}

const configs: Record<string, TaxCreditConfig> = {
  'entretien-jardin': {
    title: 'l\u2019entretien de jardin',
    subtitle: 'En tant que professionnel agréé services à la personne, nos prestations d\u2019entretien vous ouvrent droit à un crédit d\u2019impôt immédiat de 50\u00a0%.',
    example: { label: 'Contrat entretien annuel', total: '1\u202f200\u00a0€', credit: '- 600\u00a0€', net: '600\u00a0€', perMonth: 'Soit seulement 50\u00a0€ / mois pour un jardin impeccable' },
    ctaLabel: 'Demander un devis entretien',
  },
  'taille-haies': {
    title: 'la taille de haies',
    subtitle: 'La taille de haies fait partie des petits travaux de jardinage éligibles au crédit d\u2019impôt de 50\u00a0%. Profitez-en\u00a0!',
    example: { label: 'Taille de haies annuelle (2 passages)', total: '600\u00a0€', credit: '- 300\u00a0€', net: '300\u00a0€', perMonth: 'Soit seulement 25\u00a0€ / mois pour des haies impeccables' },
    ctaLabel: 'Demander un devis taille de haies',
  },
  debroussaillage: {
    title: 'le débroussaillage',
    subtitle: 'Le débroussaillage réalisé par un professionnel agréé est éligible au crédit d\u2019impôt de 50\u00a0%. Remettez votre terrain en état à moindre coût\u00a0!',
    example: { label: 'Débroussaillage terrain', total: '800\u00a0€', credit: '- 400\u00a0€', net: '400\u00a0€', perMonth: 'Le coût réel divisé par deux grâce au crédit d\u2019impôt' },
    ctaLabel: 'Demander un devis débroussaillage',
  },
};

interface TaxCreditSectionProps {
  serviceSlug?: string;
}

export function TaxCreditSection({ serviceSlug = 'entretien-jardin' }: TaxCreditSectionProps) {
  const config = configs[serviceSlug] || configs['entretien-jardin'];

  return (
    <section className="py-16 lg:py-24 bg-gradient-to-br from-green-50 to-emerald-50">
      <div className="container-custom max-w-4xl">
        <div className="text-center mb-12">
          <span className="inline-flex items-center gap-2 bg-green-100 text-green-800 text-sm font-semibold px-4 py-2 rounded-full mb-4">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
            </svg>
            Avantage fiscal
          </span>
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">
            50&nbsp;% de crédit d&apos;impôt sur {config.title}
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {config.subtitle}
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-md border border-green-100 p-8 md:p-10">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Left - Explanation */}
            <div>
              <h3 className="text-xl font-bold mb-4 text-green-900">Comment ça marche ?</h3>
              <div className="space-y-4 text-gray-600">
                <p>
                  Les petits travaux de jardinage réalisés par un professionnel agréé ouvrent
                  droit à un <strong className="text-green-800">crédit d&apos;impôt de 50&nbsp;%</strong> des
                  sommes versées, dans la limite de <strong className="text-green-800">5&nbsp;000&nbsp;€ par an</strong> (soit
                  2&nbsp;500&nbsp;€ de crédit d&apos;impôt maximum).
                </p>
                <p>
                  Ce dispositif s&apos;applique à <strong>tous les foyers fiscaux</strong>, que vous soyez imposable
                  ou non. Si vous n&apos;êtes pas imposable, l&apos;avantage vous est versé
                  directement par l&apos;administration fiscale.
                </p>
                <p>
                  L&apos;avance immédiate de crédit d&apos;impôt vous permet de ne payer que
                  50&nbsp;% du montant dès la facturation, sans attendre votre déclaration de revenus.
                </p>
              </div>
            </div>

            {/* Right - Example + eligible */}
            <div>
              <div className="bg-green-50 rounded-xl p-6 mb-6 border border-green-100">
                <h4 className="font-bold text-green-900 mb-3">Exemple concret</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">{config.example.label}</span>
                    <span className="font-medium">{config.example.total}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Crédit d&apos;impôt (50&nbsp;%)</span>
                    <span className="font-bold text-green-700">{config.example.credit}</span>
                  </div>
                  <div className="border-t border-green-200 pt-2 flex justify-between">
                    <span className="font-bold text-green-900">Coût réel pour vous</span>
                    <span className="font-bold text-green-900 text-lg">{config.example.net}</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">{config.example.perMonth}</p>
                </div>
              </div>

              <h4 className="font-bold text-gray-900 mb-3">Travaux éligibles au crédit d&apos;impôt</h4>
              <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
                {[
                  'Tonte de pelouse',
                  'Taille de haies (< 3,5 m)',
                  'Désherbage',
                  'Ramassage de feuilles',
                  'Bêchage / Griffage',
                  'Débroussaillage',
                ].map((item) => (
                  <div key={item} className="flex items-center gap-1.5">
                    <IconCheck className="w-4 h-4 text-green-600 flex-shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>

              <p className="text-xs text-gray-400 mt-4">
                Non éligible : élagage (+ 3,5 m), abattage, création paysagère.
              </p>
            </div>
          </div>

          <div className="mt-8 text-center">
            <Link href="/contact/" className="btn-primary">
              {config.ctaLabel}
            </Link>
            <p className="text-xs text-gray-500 mt-3">
              Devis gratuit et sans engagement — Crédit d&apos;impôt déduit automatiquement
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
