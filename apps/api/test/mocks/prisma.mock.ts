import { PrismaService } from '../../src/database/prisma.service';

export type MockPrismaService = {
  [K in keyof PrismaService]: jest.Mock;
} & {
  user: {
    findUnique: jest.Mock;
    findMany: jest.Mock;
    create: jest.Mock;
    update: jest.Mock;
    delete: jest.Mock;
    count: jest.Mock;
  };
  client: {
    findUnique: jest.Mock;
    findMany: jest.Mock;
    create: jest.Mock;
    update: jest.Mock;
    delete: jest.Mock;
    count: jest.Mock;
  };
  chantier: {
    findUnique: jest.Mock;
    findMany: jest.Mock;
    create: jest.Mock;
    update: jest.Mock;
    delete: jest.Mock;
    count: jest.Mock;
  };
  devis: {
    findUnique: jest.Mock;
    findMany: jest.Mock;
    create: jest.Mock;
    update: jest.Mock;
    delete: jest.Mock;
    count: jest.Mock;
  };
  ligneDevis: {
    findMany: jest.Mock;
    createMany: jest.Mock;
    deleteMany: jest.Mock;
  };
  facture: {
    findUnique: jest.Mock;
    findMany: jest.Mock;
    create: jest.Mock;
    update: jest.Mock;
    delete: jest.Mock;
    count: jest.Mock;
  };
  ligneFacture: {
    findMany: jest.Mock;
    createMany: jest.Mock;
    deleteMany: jest.Mock;
  };
  intervention: {
    findUnique: jest.Mock;
    findMany: jest.Mock;
    findFirst: jest.Mock;
    create: jest.Mock;
    update: jest.Mock;
    delete: jest.Mock;
    count: jest.Mock;
  };
  auditLog: {
    findMany: jest.Mock;
    create: jest.Mock;
    count: jest.Mock;
  };
  sequence: {
    findUnique: jest.Mock;
    upsert: jest.Mock;
  };
  $transaction: jest.Mock;
};

export const createMockPrismaService = (): MockPrismaService => {
  const createModelMock = () => ({
    findUnique: jest.fn(),
    findMany: jest.fn(),
    findFirst: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    count: jest.fn(),
    createMany: jest.fn(),
    deleteMany: jest.fn(),
    upsert: jest.fn(),
  });

  return {
    user: createModelMock(),
    client: createModelMock(),
    chantier: createModelMock(),
    devis: createModelMock(),
    ligneDevis: createModelMock(),
    facture: createModelMock(),
    ligneFacture: createModelMock(),
    intervention: createModelMock(),
    auditLog: createModelMock(),
    sequence: createModelMock(),
    $connect: jest.fn(),
    $disconnect: jest.fn(),
    $transaction: jest.fn((callback) => callback({
      user: createModelMock(),
      client: createModelMock(),
      chantier: createModelMock(),
      devis: createModelMock(),
      ligneDevis: createModelMock(),
      facture: createModelMock(),
      ligneFacture: createModelMock(),
      intervention: createModelMock(),
      auditLog: createModelMock(),
      sequence: createModelMock(),
    })),
    onModuleInit: jest.fn(),
    onModuleDestroy: jest.fn(),
  } as unknown as MockPrismaService;
};

export const mockPrismaService = createMockPrismaService();
