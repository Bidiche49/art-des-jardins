import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Mentions Legales',
  description: 'Mentions legales du site Art & Jardin - Paysagiste a Angers.',
  robots: {
    index: false,
    follow: true,
  },
};

export default function MentionsLegalesPage() {
  return (
    <div className="py-16 lg:py-24">
      <div className="container-custom max-w-4xl">
        <h1 className="text-4xl font-bold mb-8">Mentions Legales</h1>

        <div className="prose prose-lg max-w-none">
          <p className="text-gray-600 mb-8">
            Conformement aux dispositions de la loi n°2004-575 du 21 juin 2004 pour la confiance en
            l'economie numerique, il est precise aux utilisateurs du site Art & Jardin l'identite
            des differents intervenants dans le cadre de sa realisation et de son suivi.
          </p>

          <h2>1. Editeur du site</h2>
          <p>
            Le site <strong>art-et-jardin.fr</strong> est edite par :
          </p>
          <ul>
            <li><strong>Raison sociale :</strong> Art & Jardin [Forme juridique]</li>
            <li><strong>Siege social :</strong> [Adresse complete], 49000 Angers</li>
            <li><strong>SIRET :</strong> [Numero SIRET]</li>
            <li><strong>Capital social :</strong> [Montant] euros</li>
            <li><strong>Telephone :</strong> 06 XX XX XX XX</li>
            <li><strong>Email :</strong> contact@art-et-jardin.fr</li>
            <li><strong>Directeur de la publication :</strong> [Nom du gerant]</li>
          </ul>

          <h2>2. Hebergement</h2>
          <p>Le site est heberge par :</p>
          <ul>
            <li><strong>Nom :</strong> [Hebergeur - ex: Cloudflare, OVH, etc.]</li>
            <li><strong>Adresse :</strong> [Adresse de l'hebergeur]</li>
            <li><strong>Contact :</strong> [Email ou telephone]</li>
          </ul>

          <h2>3. Propriete intellectuelle</h2>
          <p>
            L'ensemble du contenu du site Art & Jardin (textes, images, graphismes, logo, icones,
            etc.) est la propriete exclusive de Art & Jardin, a l'exception des marques, logos ou
            contenus appartenant a d'autres societes partenaires ou auteurs.
          </p>
          <p>
            Toute reproduction, distribution, modification, adaptation, retransmission ou publication
            de ces differents elements est strictement interdite sans l'accord expres par ecrit de
            Art & Jardin.
          </p>

          <h2>4. Limitation de responsabilite</h2>
          <p>
            Art & Jardin s'efforce de fournir sur le site des informations aussi precises que possible.
            Toutefois, il ne pourra etre tenu responsable des omissions, des inexactitudes et des
            carences dans la mise a jour.
          </p>
          <p>
            Les informations contenues sur ce site sont aussi precises que possible et le site est
            periodiquement remis a jour, mais peut toutefois contenir des inexactitudes, des
            omissions ou des lacunes.
          </p>

          <h2>5. Liens hypertextes</h2>
          <p>
            Le site peut contenir des liens hypertextes vers d'autres sites internet. Cependant,
            Art & Jardin n'a pas la possibilite de verifier le contenu des sites ainsi visites et
            n'assumera en consequence aucune responsabilite de ce fait.
          </p>

          <h2>6. Cookies</h2>
          <p>
            Le site Art & Jardin peut etre amene a vous demander l'acceptation des cookies pour des
            besoins de statistiques et d'affichage. Pour plus d'informations, consultez notre{' '}
            <a href="/politique-confidentialite/">politique de confidentialite</a>.
          </p>

          <h2>7. Droit applicable</h2>
          <p>
            Les presentes mentions legales sont soumises au droit francais. En cas de litige, les
            tribunaux francais seront seuls competents.
          </p>

          <h2>8. Contact</h2>
          <p>
            Pour toute question relative aux presentes mentions legales, vous pouvez nous contacter :
          </p>
          <ul>
            <li>Par email : contact@art-et-jardin.fr</li>
            <li>Par telephone : 06 XX XX XX XX</li>
            <li>Par courrier : [Adresse], 49000 Angers</li>
          </ul>

          <p className="text-sm text-gray-500 mt-8">
            Derniere mise a jour : Janvier 2026
          </p>
        </div>
      </div>
    </div>
  );
}
