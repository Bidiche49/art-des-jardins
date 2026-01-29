import { PrismaClient, UserRole, ClientType, ChantierStatut, TypePrestation } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...\n');

  // ============================================
  // UTILISATEURS
  // ============================================
  const passwordHash = await bcrypt.hash('password123', 10);

  const patron = await prisma.user.upsert({
    where: { email: 'patron@artjardin.fr' },
    update: {},
    create: {
      email: 'patron@artjardin.fr',
      passwordHash,
      nom: 'Dupont',
      prenom: 'Jean',
      telephone: '06 12 34 56 78',
      role: UserRole.patron,
      actif: true,
    },
  });
  console.log(`✅ User patron: ${patron.email}`);

  const employe1 = await prisma.user.upsert({
    where: { email: 'pierre.martin@artjardin.fr' },
    update: {},
    create: {
      email: 'pierre.martin@artjardin.fr',
      passwordHash,
      nom: 'Martin',
      prenom: 'Pierre',
      telephone: '06 98 76 54 32',
      role: UserRole.employe,
      actif: true,
    },
  });
  console.log(`✅ User employe: ${employe1.email}`);

  const employe2 = await prisma.user.upsert({
    where: { email: 'lucas.bernard@artjardin.fr' },
    update: {},
    create: {
      email: 'lucas.bernard@artjardin.fr',
      passwordHash,
      nom: 'Bernard',
      prenom: 'Lucas',
      telephone: '06 55 44 33 22',
      role: UserRole.employe,
      actif: true,
    },
  });
  console.log(`✅ User employe: ${employe2.email}`);

  // ============================================
  // CLIENTS (5 clients variés)
  // ============================================
  const client1 = await prisma.client.upsert({
    where: { id: 'client-particulier-1' },
    update: {},
    create: {
      id: 'client-particulier-1',
      type: ClientType.particulier,
      nom: 'Durand',
      prenom: 'Marie',
      email: 'marie.durand@email.com',
      telephone: '06 11 22 33 44',
      adresse: '15 rue des Fleurs',
      codePostal: '49000',
      ville: 'Angers',
      notes: 'Cliente fidèle depuis 2020. Jardin de 500m².',
      tags: ['jardin', 'entretien-regulier'],
    },
  });
  console.log(`✅ Client particulier: ${client1.nom} ${client1.prenom}`);

  const client2 = await prisma.client.upsert({
    where: { id: 'client-particulier-2' },
    update: {},
    create: {
      id: 'client-particulier-2',
      type: ClientType.particulier,
      nom: 'Moreau',
      prenom: 'Philippe',
      email: 'p.moreau@gmail.com',
      telephone: '06 22 33 44 55',
      adresse: '8 impasse du Parc',
      codePostal: '49100',
      ville: 'Angers',
      notes: 'Grand terrain avec piscine. Accès par le portail latéral.',
      tags: ['piscine', 'grand-terrain'],
    },
  });
  console.log(`✅ Client particulier: ${client2.nom} ${client2.prenom}`);

  const client3 = await prisma.client.upsert({
    where: { id: 'client-pro-1' },
    update: {},
    create: {
      id: 'client-pro-1',
      type: ClientType.professionnel,
      nom: 'Lefebvre',
      raisonSociale: 'Lefebvre SARL',
      email: 'contact@lefebvre-sarl.fr',
      telephone: '02 41 00 00 00',
      telephoneSecondaire: '06 00 11 22 33',
      adresse: '42 avenue de la République',
      codePostal: '49100',
      ville: 'Angers',
      notes: 'Entreprise avec contrat annuel. Facturation mensuelle.',
      tags: ['espaces-verts', 'contrat-annuel', 'facturation-mensuelle'],
    },
  });
  console.log(`✅ Client pro: ${client3.raisonSociale}`);

  const client4 = await prisma.client.upsert({
    where: { id: 'client-pro-2' },
    update: {},
    create: {
      id: 'client-pro-2',
      type: ClientType.professionnel,
      nom: 'Petit',
      raisonSociale: 'Restaurant Le Petit Jardin',
      email: 'lepetitjardin@resto.fr',
      telephone: '02 41 55 66 77',
      adresse: '3 place du Ralliement',
      codePostal: '49000',
      ville: 'Angers',
      notes: 'Terrasse avec jardinières. Intervention le lundi matin uniquement.',
      tags: ['terrasse', 'jardinieres', 'centre-ville'],
    },
  });
  console.log(`✅ Client pro: ${client4.raisonSociale}`);

  const client5 = await prisma.client.upsert({
    where: { id: 'client-syndic-1' },
    update: {},
    create: {
      id: 'client-syndic-1',
      type: ClientType.syndic,
      nom: 'Gestion Immobilière de l\'Anjou',
      raisonSociale: 'GIA - Syndic',
      email: 'contact@gia-syndic.fr',
      telephone: '02 41 88 99 00',
      adresse: '25 boulevard Foch',
      codePostal: '49000',
      ville: 'Angers',
      notes: 'Syndic gérant 12 copropriétés. Contact principal: M. Rousseau.',
      tags: ['syndic', 'multi-sites', 'coproprietes'],
    },
  });
  console.log(`✅ Client syndic: ${client5.raisonSociale}`);

  // ============================================
  // CHANTIERS (exemples)
  // ============================================
  const chantier1 = await prisma.chantier.upsert({
    where: { id: 'chantier-1' },
    update: {},
    create: {
      id: 'chantier-1',
      clientId: client1.id,
      adresse: '15 rue des Fleurs',
      codePostal: '49000',
      ville: 'Angers',
      typePrestation: [TypePrestation.entretien, TypePrestation.tonte],
      description: 'Entretien mensuel du jardin - tonte et taille haies',
      surface: 500,
      statut: ChantierStatut.en_cours,
      responsableId: employe1.id,
      notes: 'Tondeuse sur place. Clé sous le pot.',
    },
  });
  console.log(`✅ Chantier: ${chantier1.description.substring(0, 40)}...`);

  const chantier2 = await prisma.chantier.upsert({
    where: { id: 'chantier-2' },
    update: {},
    create: {
      id: 'chantier-2',
      clientId: client2.id,
      adresse: '8 impasse du Parc',
      codePostal: '49100',
      ville: 'Angers',
      typePrestation: [TypePrestation.elagage],
      description: 'Élagage du grand chêne - branches sur toiture',
      statut: ChantierStatut.devis_envoye,
      dateVisite: new Date('2026-01-20'),
      responsableId: patron.id,
      notes: 'Accès nacelle possible par le jardin voisin (accord obtenu).',
    },
  });
  console.log(`✅ Chantier: ${chantier2.description.substring(0, 40)}...`);

  const chantier3 = await prisma.chantier.upsert({
    where: { id: 'chantier-3' },
    update: {},
    create: {
      id: 'chantier-3',
      clientId: client3.id,
      adresse: '42 avenue de la République',
      codePostal: '49100',
      ville: 'Angers',
      typePrestation: [TypePrestation.entretien, TypePrestation.tonte, TypePrestation.taille],
      description: 'Contrat annuel espaces verts - intervention bi-mensuelle',
      surface: 2000,
      statut: ChantierStatut.planifie,
      dateDebut: new Date('2026-01-01'),
      dateFin: new Date('2026-12-31'),
      responsableId: employe1.id,
    },
  });
  console.log(`✅ Chantier: ${chantier3.description.substring(0, 40)}...`);

  // ============================================
  // SEQUENCES (numérotation devis/factures)
  // ============================================
  const currentYear = new Date().getFullYear();

  await prisma.sequence.upsert({
    where: { id: `DEV-${currentYear}` },
    update: {},
    create: {
      id: `DEV-${currentYear}`,
      prefix: 'DEV',
      year: currentYear,
      lastValue: 0,
    },
  });

  await prisma.sequence.upsert({
    where: { id: `FAC-${currentYear}` },
    update: {},
    create: {
      id: `FAC-${currentYear}`,
      prefix: 'FAC',
      year: currentYear,
      lastValue: 0,
    },
  });
  console.log(`✅ Sequences initialisées pour ${currentYear}`);

  // ============================================
  // RÉSUMÉ
  // ============================================
  console.log('\n========================================');
  console.log('🎉 Seed completed successfully!');
  console.log('========================================\n');
  console.log('📊 Données créées:');
  console.log(`   - 3 utilisateurs (1 patron, 2 employés)`);
  console.log(`   - 5 clients (2 particuliers, 2 pros, 1 syndic)`);
  console.log(`   - 3 chantiers (exemples)`);
  console.log(`   - 2 séquences (devis/factures ${currentYear})`);
  console.log('\n🔑 Credentials de test:');
  console.log(`   Patron:  patron@artjardin.fr / password123`);
  console.log(`   Employé: pierre.martin@artjardin.fr / password123`);
  console.log('');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
