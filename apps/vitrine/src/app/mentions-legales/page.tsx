import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Mentions Légales',
  description: 'Mentions légales du site Art des Jardins - Paysagiste à Angers.',
  alternates: {
    canonical: '/mentions-legales/',
  },
  robots: {
    index: false,
    follow: true,
  },
  openGraph: {
    title: 'Mentions Légales - Art des Jardins',
    description: 'Mentions légales du site Art des Jardins - Paysagiste à Angers.',
    images: [{ url: '/images/og-image.jpg', width: 1200, height: 630, alt: 'Art des Jardins - Paysagiste Angers' }],
  },
};

export default function MentionsLegalesPage() {
  return (
    <div className="py-16 lg:py-24">
      <div className="container-custom max-w-4xl">
        <h1 className="text-4xl font-bold mb-8">Mentions Légales</h1>

        <div className="prose prose-lg max-w-none">
          <p className="text-gray-600 mb-8">
            Conformément aux dispositions de la loi n°2004-575 du 21 juin 2004 pour la confiance en
            l'économie numérique, il est précisé aux utilisateurs du site Art des Jardins l'identité
            des différents intervenants dans le cadre de sa réalisation et de son suivi.
          </p>

          <h2>1. Éditeur du site</h2>
          <p>
            Le site <strong>art-et-jardin.fr</strong> est édité par :
          </p>
          <ul>
            <li><strong>Raison sociale :</strong> SARL Art des Jardins</li>
            <li><strong>Siège social :</strong> 9 bis rue Rouget de l'Isle, 49130 Les Ponts-de-Cé</li>
            <li><strong>SIREN :</strong> 999 636 806</li>
            <li><strong>SIRET :</strong> 999 636 806 00013</li>
            <li><strong>TVA intracommunautaire :</strong> FR36999636806</li>
            <li><strong>RCS :</strong> Angers</li>
            <li><strong>Code NAF :</strong> 81.30Z - Services d'aménagement paysager</li>
            <li><strong>Capital social :</strong> 5 000 euros</li>
            <li><strong>Téléphone :</strong> 07 81 16 07 37 / 06 59 68 49 16</li>
            <li><strong>Email :</strong> artdesjardins49@gmail.com</li>
            <li><strong>Co-gérants :</strong> M. Louis Coussière et M. Jocelyn Rondeau</li>
            <li><strong>Directeurs de la publication :</strong> M. Louis Coussière et M. Jocelyn Rondeau</li>
          </ul>

          <h2>2. Hébergement</h2>
          <p>Le site est hébergé par :</p>
          <ul>
            <li><strong>Nom :</strong> À définir</li>
            <li><strong>Adresse :</strong> À définir</li>
            <li><strong>Contact :</strong> À définir</li>
          </ul>

          <h2>3. Propriété intellectuelle</h2>
          <p>
            L'ensemble du contenu du site Art des Jardins (textes, images, graphismes, logo, icônes,
            etc.) est la propriété exclusive de Art des Jardins, à l'exception des marques, logos ou
            contenus appartenant à d'autres sociétés partenaires ou auteurs.
          </p>
          <p>
            Toute reproduction, distribution, modification, adaptation, retransmission ou publication
            de ces différents éléments est strictement interdite sans l'accord exprès par écrit de
            Art des Jardins.
          </p>

          <h2>4. Limitation de responsabilité</h2>
          <p>
            Art des Jardins s'efforce de fournir sur le site des informations aussi précises que possible.
            Toutefois, il ne pourra être tenu responsable des omissions, des inexactitudes et des
            carences dans la mise à jour.
          </p>
          <p>
            Les informations contenues sur ce site sont aussi précises que possible et le site est
            périodiquement remis à jour, mais peut toutefois contenir des inexactitudes, des
            omissions ou des lacunes.
          </p>

          <h2>5. Liens hypertextes</h2>
          <p>
            Le site peut contenir des liens hypertextes vers d'autres sites internet. Cependant,
            Art des Jardins n'a pas la possibilité de vérifier le contenu des sites ainsi visités et
            n'assumera en conséquence aucune responsabilité de ce fait.
          </p>

          <h2>6. Cookies</h2>
          <p>
            Le site Art des Jardins peut être amené à vous demander l'acceptation des cookies pour des
            besoins de statistiques et d'affichage. Pour plus d'informations, consultez notre{' '}
            <a href="/politique-confidentialite/">politique de confidentialité</a>.
          </p>

          <h2>7. Droit applicable</h2>
          <p>
            Les présentes mentions légales sont soumises au droit français. En cas de litige, les
            tribunaux français seront seuls compétents.
          </p>

          <h2>8. Contact</h2>
          <p>
            Pour toute question relative aux présentes mentions légales, vous pouvez nous contacter :
          </p>
          <ul>
            <li>Par email : artdesjardins49@gmail.com</li>
            <li>Par téléphone : 07 81 16 07 37 / 06 59 68 49 16</li>
            <li>Par courrier : 9 bis rue Rouget de l'Isle, 49130 Les Ponts-de-Cé</li>
          </ul>

          <p className="text-sm text-gray-500 mt-8">
            Dernière mise à jour : Janvier 2026
          </p>
        </div>
      </div>
    </div>
  );
}
