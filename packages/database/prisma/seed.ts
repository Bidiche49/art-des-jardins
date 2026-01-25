import { PrismaClient, UserRole, ClientType } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Creer les utilisateurs de base
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

  const employe = await prisma.user.upsert({
    where: { email: 'employe@artjardin.fr' },
    update: {},
    create: {
      email: 'employe@artjardin.fr',
      passwordHash,
      nom: 'Martin',
      prenom: 'Pierre',
      telephone: '06 98 76 54 32',
      role: UserRole.employe,
      actif: true,
    },
  });

  // Creer quelques clients de test
  const clientParticulier = await prisma.client.create({
    data: {
      type: ClientType.particulier,
      nom: 'Durand',
      prenom: 'Marie',
      email: 'marie.durand@email.com',
      telephone: '06 11 22 33 44',
      adresse: '15 rue des Fleurs',
      codePostal: '49000',
      ville: 'Angers',
      tags: ['jardin', 'entretien'],
    },
  });

  const clientPro = await prisma.client.create({
    data: {
      type: ClientType.professionnel,
      nom: 'Lefebvre',
      raisonSociale: 'Lefebvre SARL',
      email: 'contact@lefebvre-sarl.fr',
      telephone: '02 41 00 00 00',
      adresse: '42 avenue de la Republique',
      codePostal: '49100',
      ville: 'Angers',
      tags: ['espaces-verts', 'contrat-annuel'],
    },
  });

  // Initialiser les sequences
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

  console.log('Seed completed!');
  console.log({
    users: [patron.email, employe.email],
    clients: [clientParticulier.email, clientPro.email],
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
