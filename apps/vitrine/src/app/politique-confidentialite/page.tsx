import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Politique de Confidentialite',
  description: 'Politique de confidentialite et protection des donnees personnelles - Art des Jardins.',
  robots: {
    index: false,
    follow: true,
  },
};

export default function PolitiqueConfidentialitePage() {
  return (
    <div className="py-16 lg:py-24">
      <div className="container-custom max-w-4xl">
        <h1 className="text-4xl font-bold mb-8">Politique de Confidentialite</h1>

        <div className="prose prose-lg max-w-none">
          <p className="text-gray-600 mb-8">
            Art des Jardins accorde une grande importance a la protection de vos donnees personnelles.
            Cette politique de confidentialite vous informe sur la maniere dont vos donnees sont
            collectees, utilisees et protegees.
          </p>

          <h2>1. Responsable du traitement</h2>
          <p>
            Le responsable du traitement des donnees personnelles est :
          </p>
          <ul>
            <li><strong>Art des Jardins</strong></li>
            <li>[Adresse complete], 49000 Angers</li>
            <li>Email : artdesjardins49@gmail.com</li>
            <li>Telephone : 07 81 16 07 37</li>
          </ul>

          <h2>2. Donnees collectees</h2>
          <p>Nous collectons les donnees suivantes :</p>
          <ul>
            <li><strong>Donnees d'identification :</strong> nom, prenom, adresse email, numero de telephone</li>
            <li><strong>Donnees de localisation :</strong> adresse (pour les devis et interventions)</li>
            <li><strong>Donnees de navigation :</strong> pages visitees, duree de visite (via analytics anonymise)</li>
          </ul>

          <h2>3. Finalites du traitement</h2>
          <p>Vos donnees sont collectees pour :</p>
          <ul>
            <li>Repondre a vos demandes de contact et de devis</li>
            <li>Assurer le suivi de nos prestations</li>
            <li>Ameliorer notre site et nos services</li>
            <li>Respecter nos obligations legales</li>
          </ul>

          <h2>4. Base legale du traitement</h2>
          <p>Le traitement de vos donnees repose sur :</p>
          <ul>
            <li><strong>Votre consentement</strong> (formulaire de contact)</li>
            <li><strong>L'execution d'un contrat</strong> (devis, prestations)</li>
            <li><strong>Nos interets legitimes</strong> (amelioration des services)</li>
          </ul>

          <h2>5. Destinataires des donnees</h2>
          <p>
            Vos donnees sont destinees uniquement aux equipes internes d'Art des Jardins.
            Elles ne sont jamais vendues ni transmises a des tiers a des fins commerciales.
          </p>
          <p>
            Certains prestataires techniques peuvent avoir acces a vos donnees dans le cadre strict
            de leurs missions (hebergement, envoi d'emails).
          </p>

          <h2>6. Duree de conservation</h2>
          <p>Vos donnees sont conservees :</p>
          <ul>
            <li><strong>Demandes de contact :</strong> 3 ans apres le dernier contact</li>
            <li><strong>Donnees clients :</strong> 5 ans apres la fin de la relation commerciale</li>
            <li><strong>Donnees de facturation :</strong> 10 ans (obligation legale)</li>
          </ul>

          <h2>7. Vos droits</h2>
          <p>
            Conformement au Reglement General sur la Protection des Donnees (RGPD), vous disposez
            des droits suivants :
          </p>
          <ul>
            <li><strong>Droit d'acces :</strong> obtenir une copie de vos donnees</li>
            <li><strong>Droit de rectification :</strong> corriger des donnees inexactes</li>
            <li><strong>Droit a l'effacement :</strong> demander la suppression de vos donnees</li>
            <li><strong>Droit a la limitation :</strong> limiter le traitement de vos donnees</li>
            <li><strong>Droit a la portabilite :</strong> recevoir vos donnees dans un format structure</li>
            <li><strong>Droit d'opposition :</strong> vous opposer au traitement de vos donnees</li>
          </ul>
          <p>
            Pour exercer ces droits, contactez-nous a : <strong>artdesjardins49@gmail.com</strong>
          </p>
          <p>
            Vous pouvez egalement introduire une reclamation aupres de la CNIL :{' '}
            <a href="https://www.cnil.fr" target="_blank" rel="noopener noreferrer">
              www.cnil.fr
            </a>
          </p>

          <h2>8. Securite des donnees</h2>
          <p>
            Nous mettons en oeuvre des mesures techniques et organisationnelles appropriees pour
            proteger vos donnees contre tout acces non autorise, modification, divulgation ou
            destruction :
          </p>
          <ul>
            <li>Connexion securisee (HTTPS)</li>
            <li>Acces restreint aux donnees</li>
            <li>Sauvegarde reguliere</li>
          </ul>

          <h2>9. Cookies et traceurs</h2>
          <p>
            Notre site utilise uniquement des outils d'analyse respectueux de la vie privee
            (Plausible Analytics ou equivalent) qui ne deposent pas de cookies et ne collectent
            pas de donnees personnelles identifiantes.
          </p>
          <p>
            Ces outils nous permettent uniquement de connaitre le nombre de visiteurs et les pages
            les plus consultees, sans jamais identifier individuellement les utilisateurs.
          </p>

          <h2>10. Modifications</h2>
          <p>
            Cette politique de confidentialite peut etre modifiee a tout moment. Les modifications
            entreront en vigueur des leur publication sur cette page.
          </p>

          <h2>11. Contact</h2>
          <p>
            Pour toute question concernant cette politique ou vos donnees personnelles :
          </p>
          <ul>
            <li>Email : artdesjardins49@gmail.com</li>
            <li>Telephone : 07 81 16 07 37</li>
            <li>Adresse : [Adresse], 49000 Angers</li>
          </ul>

          <p className="text-sm text-gray-500 mt-8">
            Derniere mise a jour : Janvier 2026
          </p>
        </div>
      </div>
    </div>
  );
}
