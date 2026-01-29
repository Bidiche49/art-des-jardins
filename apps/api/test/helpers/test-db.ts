import { PrismaClient } from '@art-et-jardin/database';
import { execSync } from 'child_process';

const prisma = new PrismaClient();

/**
 * Setup test database before running e2e tests
 * Uses .env.test for DATABASE_URL
 */
export async function setupTestDb() {
  // Run migrations on test database
  execSync('pnpm --filter @art-et-jardin/database migrate:prod', {
    env: {
      ...process.env,
      NODE_ENV: 'test',
    },
  });

  await prisma.$connect();
  return prisma;
}

/**
 * Clean all tables between tests
 */
export async function cleanTestDb() {
  const tablenames = await prisma.$queryRaw<Array<{ tablename: string }>>`
    SELECT tablename FROM pg_tables WHERE schemaname='public'
    AND tablename NOT IN ('_prisma_migrations')
  `;

  for (const { tablename } of tablenames) {
    try {
      await prisma.$executeRawUnsafe(`TRUNCATE TABLE "public"."${tablename}" CASCADE;`);
    } catch (error) {
      console.warn(`Could not truncate ${tablename}:`, error);
    }
  }
}

/**
 * Seed test data
 */
export async function seedTestDb() {
  // Create test users
  const hashedPassword = '$2b$10$test.hashed.password.for.testing.only';

  await prisma.user.createMany({
    data: [
      {
        id: 'test-patron-id',
        email: 'patron@test.com',
        passwordHash: hashedPassword,
        nom: 'Test',
        prenom: 'Patron',
        role: 'patron',
        actif: true,
      },
      {
        id: 'test-employe-id',
        email: 'employe@test.com',
        passwordHash: hashedPassword,
        nom: 'Test',
        prenom: 'Employe',
        role: 'employe',
        actif: true,
      },
    ],
    skipDuplicates: true,
  });

  // Create test client
  await prisma.client.create({
    data: {
      id: 'test-client-id',
      type: 'particulier',
      nom: 'Client',
      prenom: 'Test',
      email: 'client@test.com',
      telephone: '0600000000',
      adresse: '1 rue de Test',
      codePostal: '49000',
      ville: 'Angers',
    },
  });

  // Create test chantier
  await prisma.chantier.create({
    data: {
      id: 'test-chantier-id',
      clientId: 'test-client-id',
      responsableId: 'test-patron-id',
      adresse: '1 rue de Test',
      codePostal: '49000',
      ville: 'Angers',
      description: 'Chantier de test',
      typePrestation: ['entretien'],
      statut: 'en_cours',
    },
  });
}

/**
 * Teardown test database
 */
export async function teardownTestDb() {
  await prisma.$disconnect();
}

export { prisma as testPrisma };
