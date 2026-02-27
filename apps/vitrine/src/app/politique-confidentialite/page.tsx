import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Politique de Confidentialité',
  description: 'Politique de confidentialité et protection des données personnelles - Art des Jardins.',
  alternates: {
    canonical: '/politique-confidentialite/',
  },
  robots: {
    index: false,
    follow: true,
  },
  openGraph: {
    title: 'Politique de Confidentialité - Art des Jardins',
    description: 'Politique de confidentialité et protection des données personnelles - Art des Jardins.',
    images: [{ url: '/images/og-image.jpg', width: 1200, height: 630, alt: 'Art des Jardins - Paysagiste Angers' }],
  },
};

export default function PolitiqueConfidentialitePage() {
  return (
    <div className="py-16 lg:py-24">
      <div className="container-custom max-w-4xl">
        <h1 className="text-4xl font-bold mb-8">Politique de Confidentialité</h1>

        <div className="prose prose-lg max-w-none">
          <p className="text-gray-600 mb-8">
            Art des Jardins accorde une grande importance à la protection de vos données personnelles.
            Cette politique de confidentialité vous informe sur la manière dont vos données sont
            collectées, utilisées et protégées.
          </p>

          <h2>1. Responsable du traitement</h2>
          <p>
            Le responsable du traitement des données personnelles est :
          </p>
          <ul>
            <li><strong>Art des Jardins</strong></li>
            <li>[Adresse complète], 49000 Angers</li>
            <li>Email : artdesjardins49@gmail.com</li>
            <li>Téléphone : 07 81 16 07 37 / 06 59 68 49 16</li>
          </ul>

          <h2>2. Données collectées</h2>
          <p>Nous collectons les données suivantes :</p>
          <ul>
            <li><strong>Données d'identification :</strong> nom, prénom, adresse email, numéro de téléphone</li>
            <li><strong>Données de localisation :</strong> adresse (pour les devis et interventions)</li>
            <li><strong>Données de navigation :</strong> pages visitées, durée de visite (via analytics anonymisé)</li>
          </ul>

          <h2>3. Finalités du traitement</h2>
          <p>Vos données sont collectées pour :</p>
          <ul>
            <li>Répondre à vos demandes de contact et de devis</li>
            <li>Assurer le suivi de nos prestations</li>
            <li>Améliorer notre site et nos services</li>
            <li>Respecter nos obligations légales</li>
          </ul>

          <h2>4. Base légale du traitement</h2>
          <p>Le traitement de vos données repose sur :</p>
          <ul>
            <li><strong>Votre consentement</strong> (formulaire de contact)</li>
            <li><strong>L'exécution d'un contrat</strong> (devis, prestations)</li>
            <li><strong>Nos intérêts légitimes</strong> (amélioration des services)</li>
          </ul>

          <h2>5. Destinataires des données</h2>
          <p>
            Vos données sont destinées uniquement aux équipes internes d'Art des Jardins.
            Elles ne sont jamais vendues ni transmises à des tiers à des fins commerciales.
          </p>
          <p>
            Certains prestataires techniques peuvent avoir accès à vos données dans le cadre strict
            de leurs missions (hébergement, envoi d'emails).
          </p>

          <h2>6. Durée de conservation</h2>
          <p>Vos données sont conservées :</p>
          <ul>
            <li><strong>Demandes de contact :</strong> 3 ans après le dernier contact</li>
            <li><strong>Données clients :</strong> 5 ans après la fin de la relation commerciale</li>
            <li><strong>Données de facturation :</strong> 10 ans (obligation légale)</li>
          </ul>

          <h2>7. Vos droits</h2>
          <p>
            Conformément au Règlement Général sur la Protection des Données (RGPD), vous disposez
            des droits suivants :
          </p>
          <ul>
            <li><strong>Droit d'accès :</strong> obtenir une copie de vos données</li>
            <li><strong>Droit de rectification :</strong> corriger des données inexactes</li>
            <li><strong>Droit à l'effacement :</strong> demander la suppression de vos données</li>
            <li><strong>Droit à la limitation :</strong> limiter le traitement de vos données</li>
            <li><strong>Droit à la portabilité :</strong> recevoir vos données dans un format structuré</li>
            <li><strong>Droit d'opposition :</strong> vous opposer au traitement de vos données</li>
          </ul>
          <p>
            Pour exercer ces droits, contactez-nous à : <strong>artdesjardins49@gmail.com</strong>
          </p>
          <p>
            Vous pouvez également introduire une réclamation auprès de la CNIL :{' '}
            <a href="https://www.cnil.fr" target="_blank" rel="noopener noreferrer">
              www.cnil.fr
            </a>
          </p>

          <h2>8. Sécurité des données</h2>
          <p>
            Nous mettons en oeuvre des mesures techniques et organisationnelles appropriées pour
            protéger vos données contre tout accès non autorisé, modification, divulgation ou
            destruction :
          </p>
          <ul>
            <li>Connexion sécurisée (HTTPS)</li>
            <li>Accès restreint aux données</li>
            <li>Sauvegarde régulière</li>
          </ul>

          <h2>9. Cookies et traceurs</h2>
          <p>
            Notre site utilise uniquement des outils d'analyse respectueux de la vie privée
            (Plausible Analytics ou équivalent) qui ne déposent pas de cookies et ne collectent
            pas de données personnelles identifiantes.
          </p>
          <p>
            Ces outils nous permettent uniquement de connaître le nombre de visiteurs et les pages
            les plus consultées, sans jamais identifier individuellement les utilisateurs.
          </p>

          <h2>10. Modifications</h2>
          <p>
            Cette politique de confidentialité peut être modifiée à tout moment. Les modifications
            entreront en vigueur dès leur publication sur cette page.
          </p>

          <h2>11. Contact</h2>
          <p>
            Pour toute question concernant cette politique ou vos données personnelles :
          </p>
          <ul>
            <li>Email : artdesjardins49@gmail.com</li>
            <li>Téléphone : 07 81 16 07 37 / 06 59 68 49 16</li>
            <li>Adresse : [Adresse], 49000 Angers</li>
          </ul>

          <p className="text-sm text-gray-500 mt-8">
            Dernière mise à jour : Janvier 2026
          </p>
        </div>
      </div>
    </div>
  );
}
