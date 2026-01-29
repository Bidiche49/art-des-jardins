import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Conditions Generales de Vente',
  description: 'Conditions generales de vente des prestations Art & Jardin - Paysagiste a Angers.',
  robots: {
    index: false,
    follow: true,
  },
};

export default function CGVPage() {
  return (
    <div className="py-16 lg:py-24">
      <div className="container-custom max-w-4xl">
        <h1 className="text-4xl font-bold mb-8">Conditions Generales de Vente</h1>

        <div className="prose prose-lg max-w-none">
          <p className="text-gray-600 mb-8">
            Les presentes conditions generales de vente regissent les relations contractuelles entre
            Art & Jardin et ses clients pour toutes les prestations de services en espaces verts.
          </p>

          <h2>Article 1 - Objet</h2>
          <p>
            Les presentes conditions generales de vente (CGV) ont pour objet de definir les droits
            et obligations des parties dans le cadre des prestations de services proposees par
            Art & Jardin : amenagement paysager, entretien de jardins, elagage et abattage d'arbres.
          </p>

          <h2>Article 2 - Devis et commande</h2>
          <h3>2.1 Etablissement du devis</h3>
          <p>
            Tout devis est etabli gratuitement apres une visite sur place permettant d'evaluer
            precisement les travaux a realiser. Le devis est valable 30 jours a compter de sa date
            d'emission.
          </p>
          <h3>2.2 Acceptation du devis</h3>
          <p>
            La commande est reputee ferme et definitive des reception par Art & Jardin du devis
            signe par le client avec la mention "Bon pour accord" et accompagne d'un acompte de 30%
            du montant total TTC.
          </p>

          <h2>Article 3 - Prix et paiement</h2>
          <h3>3.1 Prix</h3>
          <p>
            Les prix sont exprimes en euros TTC. Ils comprennent les fournitures, la main d'oeuvre
            et l'evacuation des dechets verts sauf mention contraire sur le devis.
          </p>
          <h3>3.2 Conditions de paiement</h3>
          <ul>
            <li><strong>Acompte :</strong> 30% a la commande</li>
            <li><strong>Solde :</strong> a reception de facture, a 30 jours maximum</li>
          </ul>
          <p>
            Le paiement peut s'effectuer par virement bancaire, cheque ou especes (dans la limite
            legale de 1000 euros).
          </p>
          <h3>3.3 Retard de paiement</h3>
          <p>
            Tout retard de paiement entrainera l'application de penalites de retard au taux de 3
            fois le taux d'interet legal, ainsi qu'une indemnite forfaitaire de 40 euros pour frais
            de recouvrement.
          </p>

          <h2>Article 4 - Execution des prestations</h2>
          <h3>4.1 Delais</h3>
          <p>
            Les delais d'intervention sont donnes a titre indicatif. Ils peuvent etre modifies en
            fonction des conditions meteorologiques ou de contraintes techniques imprevues.
            Art & Jardin informera le client de tout retard significatif.
          </p>
          <h3>4.2 Acces au chantier</h3>
          <p>
            Le client s'engage a permettre un acces libre et securise au chantier. Tout retard ou
            impossibilite d'acces pourra entrainer une facturation supplementaire.
          </p>
          <h3>4.3 Travaux supplementaires</h3>
          <p>
            Tout travail supplementaire non prevu au devis initial fera l'objet d'un avenant accepte
            par le client avant execution.
          </p>

          <h2>Article 5 - Responsabilite et garanties</h2>
          <h3>5.1 Assurance</h3>
          <p>
            Art & Jardin est assure en responsabilite civile professionnelle. Une attestation
            d'assurance peut etre fournie sur demande.
          </p>
          <h3>5.2 Garantie de reprise</h3>
          <p>
            Pour les plantations, une garantie de reprise de 1 an est accordee sous reserve du
            respect des conseils d'entretien fournis et d'un arrosage adapte par le client.
          </p>
          <h3>5.3 Limitation de responsabilite</h3>
          <p>
            Art & Jardin ne pourra etre tenu responsable des dommages resultant d'un mauvais
            entretien par le client apres l'intervention, de conditions climatiques exceptionnelles,
            ou d'informations erronees fournies par le client.
          </p>

          <h2>Article 6 - Annulation et modification</h2>
          <h3>6.1 Par le client</h3>
          <p>
            Toute annulation doit etre notifiee par ecrit. En cas d'annulation :
          </p>
          <ul>
            <li>Plus de 15 jours avant : remboursement integral de l'acompte</li>
            <li>Entre 8 et 15 jours : 50% de l'acompte conserve</li>
            <li>Moins de 8 jours : acompte integralement conserve</li>
          </ul>
          <h3>6.2 Par Art & Jardin</h3>
          <p>
            En cas d'annulation de notre fait (hors cas de force majeure), l'acompte sera
            integralement rembourse.
          </p>

          <h2>Article 7 - Propriete intellectuelle</h2>
          <p>
            Les plans et etudes realises par Art & Jardin restent sa propriete intellectuelle.
            Ils ne peuvent etre utilises ou reproduits sans accord prealable ecrit.
          </p>

          <h2>Article 8 - Protection des donnees</h2>
          <p>
            Les donnees personnelles collectees sont traitees conformement a notre{' '}
            <a href="/politique-confidentialite/">politique de confidentialite</a>.
          </p>

          <h2>Article 9 - Litiges</h2>
          <p>
            En cas de litige, une solution amiable sera recherchee en priorite. A defaut, le
            tribunal competent sera celui du siege social d'Art & Jardin (Angers).
          </p>
          <p>
            Le client peut egalement recourir a un mediateur de la consommation :{' '}
            [Coordonnees du mediateur]
          </p>

          <h2>Article 10 - Droit de retractation</h2>
          <p>
            Conformement a l'article L.221-28 du Code de la consommation, le droit de retractation
            ne s'applique pas aux contrats de fourniture de services pleinement executes avant la
            fin du delai de retractation avec l'accord du consommateur.
          </p>
          <p>
            Pour les autres cas, le delai de retractation est de 14 jours a compter de la signature
            du devis.
          </p>

          <h2>Article 11 - Dispositions generales</h2>
          <p>
            Si une disposition des presentes CGV venait a etre declaree nulle, les autres
            dispositions resteraient applicables.
          </p>
          <p>
            Le fait de ne pas exercer un droit prevu par les presentes ne constitue pas une
            renonciation a ce droit.
          </p>

          <p className="text-sm text-gray-500 mt-8">
            Derniere mise a jour : Janvier 2026
          </p>
        </div>
      </div>
    </div>
  );
}
