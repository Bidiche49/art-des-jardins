import Link from 'next/link';
import { IconCheck } from '@/lib/icons';

export function TaxCreditSection() {
  return (
    <section className="py-16 lg:py-24 bg-blue-50">
      <div className="container-custom max-w-4xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            50 % de crédit d&apos;impôt sur l&apos;entretien de jardin
          </h2>
          <p className="text-lg text-gray-600">
            Profitez de l&apos;avantage fiscal pour les services à la personne (SAP)
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-blue-100 p-8 md:p-10">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Left - Explanation */}
            <div>
              <h3 className="text-xl font-bold mb-4 text-blue-900">Comment ça marche ?</h3>
              <div className="space-y-4 text-gray-600">
                <p>
                  Les travaux d&apos;entretien de jardin réalisés par un professionnel agréé ouvrent
                  droit à un <strong className="text-blue-800">crédit d&apos;impôt de 50 %</strong> des
                  sommes versées, dans la limite de <strong className="text-blue-800">5 000 € par an</strong> (soit
                  2 500 € de crédit d&apos;impôt maximum).
                </p>
                <p>
                  Ce dispositif s&apos;applique à tous les foyers fiscaux, que vous soyez imposable
                  ou non. Si vous n&apos;êtes pas imposable, l&apos;avantage vous est versé
                  directement par l&apos;administration fiscale.
                </p>
                <p>
                  <strong>Paiement CESU accepté</strong> : vous pouvez régler nos prestations
                  avec des Chèques Emploi Service Universel.
                </p>
              </div>
            </div>

            {/* Right - Example + eligible */}
            <div>
              <div className="bg-blue-50 rounded-xl p-6 mb-6">
                <h4 className="font-bold text-blue-900 mb-3">Exemple concret</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Contrat entretien annuel</span>
                    <span className="font-medium">1 200 €</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Crédit d&apos;impôt (50 %)</span>
                    <span className="font-medium text-green-700">- 600 €</span>
                  </div>
                  <div className="border-t border-blue-200 pt-2 flex justify-between">
                    <span className="font-bold text-blue-900">Coût réel</span>
                    <span className="font-bold text-blue-900 text-lg">600 €</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Soit 50 € / mois pour un jardin impeccable</p>
                </div>
              </div>

              <h4 className="font-bold text-gray-900 mb-3">Travaux éligibles</h4>
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
                    <IconCheck className="w-4 h-4 text-green-500 flex-shrink-0" />
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
              Demander un devis entretien
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
