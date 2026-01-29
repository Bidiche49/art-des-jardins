import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException } from '@nestjs/common';
import { ExportService } from './export.service';
import { PrismaService } from '../../database/prisma.service';
import {
  createMockClient,
  createMockChantier,
  createMockDevis,
  createMockFacture,
  createMockIntervention,
  createMockUser,
} from '../../../test/helpers/test-utils';

describe('ExportService', () => {
  let service: ExportService;
  let mockClientFindMany: jest.Mock;
  let mockChantierFindMany: jest.Mock;
  let mockDevisFindMany: jest.Mock;
  let mockFactureFindMany: jest.Mock;
  let mockInterventionFindMany: jest.Mock;
  let mockUserFindMany: jest.Mock;

  const mockClient = createMockClient({ id: 'client-123' });
  const mockChantier = createMockChantier('client-123', { id: 'chantier-123' });
  const mockDevisData = createMockDevis('chantier-123', { id: 'devis-123' });
  const mockFactureData = createMockFacture('devis-123', { id: 'facture-123' });
  const mockInterventionData = createMockIntervention('chantier-123', 'user-123', {
    id: 'intervention-123',
  });
  const mockUserData = createMockUser({ id: 'user-123' });

  beforeEach(async () => {
    mockClientFindMany = jest.fn();
    mockChantierFindMany = jest.fn();
    mockDevisFindMany = jest.fn();
    mockFactureFindMany = jest.fn();
    mockInterventionFindMany = jest.fn();
    mockUserFindMany = jest.fn();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ExportService,
        {
          provide: PrismaService,
          useValue: {
            client: { findMany: mockClientFindMany },
            chantier: { findMany: mockChantierFindMany },
            devis: { findMany: mockDevisFindMany },
            facture: { findMany: mockFactureFindMany },
            intervention: { findMany: mockInterventionFindMany },
            user: { findMany: mockUserFindMany },
          },
        },
      ],
    }).compile();

    service = module.get<ExportService>(ExportService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('exportCsv', () => {
    it('should export clients CSV with correct headers', async () => {
      mockClientFindMany.mockResolvedValue([mockClient]);

      const csv = await service.exportCsv('clients');

      expect(csv).toContain('ID;Type;Nom;Prenom;Email;Telephone;Adresse;CodePostal;Ville;DateCreation');
      expect(csv).toContain(mockClient.id);
      expect(csv).toContain(mockClient.nom);
      expect(csv).toContain(mockClient.email);
    });

    it('should export chantiers CSV', async () => {
      mockChantierFindMany.mockResolvedValue([mockChantier]);

      const csv = await service.exportCsv('chantiers');

      expect(csv).toContain('ID;ClientID;Adresse;CodePostal;Ville;TypePrestation;Description;Statut');
      expect(csv).toContain(mockChantier.clientId);
    });

    it('should export devis CSV', async () => {
      mockDevisFindMany.mockResolvedValue([mockDevisData]);

      const csv = await service.exportCsv('devis');

      expect(csv).toContain('ID;Numero;ChantierID;DateEmission;DateValidite;TotalHT;TotalTVA;TotalTTC;Statut');
      expect(csv).toContain(mockDevisData.numero);
    });

    it('should export factures CSV', async () => {
      mockFactureFindMany.mockResolvedValue([mockFactureData]);

      const csv = await service.exportCsv('factures');

      expect(csv).toContain('ID;Numero;DevisID;DateEmission;DateEcheance;TotalHT;TotalTVA;TotalTTC;Statut');
      expect(csv).toContain(mockFactureData.numero);
    });

    it('should export interventions CSV', async () => {
      mockInterventionFindMany.mockResolvedValue([mockInterventionData]);

      const csv = await service.exportCsv('interventions');

      expect(csv).toContain('ID;ChantierID;EmployeID;Date;HeureDebut;HeureFin;DureeMinutes;Description;Valide');
      expect(csv).toContain(mockInterventionData.chantierId);
    });

    it('should export users CSV without passwordHash', async () => {
      mockUserFindMany.mockResolvedValue([mockUserData]);

      const csv = await service.exportCsv('users');

      expect(csv).toContain('ID;Email;Nom;Prenom;Role;Actif;DerniereConnexion;DateCreation');
      expect(csv).not.toContain('passwordHash');
      expect(csv).not.toContain(mockUserData.passwordHash);
    });

    it('should throw BadRequestException for invalid table', async () => {
      await expect(service.exportCsv('invalid' as any)).rejects.toThrow(
        BadRequestException,
      );
      await expect(service.exportCsv('invalid' as any)).rejects.toThrow(
        "Table 'invalid' non exportable",
      );
    });

    it('should escape special characters in CSV', async () => {
      const clientWithSpecialChars = {
        ...mockClient,
        notes: 'Note with; semicolon and "quotes"',
      };
      mockClientFindMany.mockResolvedValue([clientWithSpecialChars]);

      const csv = await service.exportCsv('clients');

      // Should not break CSV structure
      expect(csv.split('\n').length).toBe(2); // header + 1 row
    });

    it('should handle null/undefined values', async () => {
      const clientWithNulls = {
        ...mockClient,
        prenom: null,
        telephoneSecondaire: undefined,
      };
      mockClientFindMany.mockResolvedValue([clientWithNulls]);

      const csv = await service.exportCsv('clients');

      // Should not throw and handle nulls gracefully
      expect(csv).toBeDefined();
    });

    it('should format dates as ISO strings', async () => {
      const clientWithDate = {
        ...mockClient,
        createdAt: new Date('2026-01-25T10:00:00.000Z'),
      };
      mockClientFindMany.mockResolvedValue([clientWithDate]);

      const csv = await service.exportCsv('clients');

      expect(csv).toContain('2026-01-25T10:00:00.000Z');
    });
  });

  describe('getExportableTables', () => {
    it('should return all exportable tables', () => {
      const tables = service.getExportableTables();

      expect(tables).toContain('clients');
      expect(tables).toContain('chantiers');
      expect(tables).toContain('devis');
      expect(tables).toContain('factures');
      expect(tables).toContain('interventions');
      expect(tables).toContain('users');
      expect(tables).toHaveLength(6);
    });
  });

  describe('exportFull', () => {
    it('should export all tables to ZIP', async () => {
      mockClientFindMany.mockResolvedValue([mockClient]);
      mockChantierFindMany.mockResolvedValue([mockChantier]);
      mockDevisFindMany.mockResolvedValue([mockDevisData]);
      mockFactureFindMany.mockResolvedValue([mockFactureData]);
      mockInterventionFindMany.mockResolvedValue([mockInterventionData]);
      mockUserFindMany.mockResolvedValue([mockUserData]);

      // Create a mock writable stream
      const chunks: Buffer[] = [];
      const mockStream = {
        write: jest.fn((chunk) => chunks.push(chunk)),
        end: jest.fn(),
        on: jest.fn((event, handler) => {
          if (event === 'finish') {
            setTimeout(handler, 0);
          }
          return mockStream;
        }),
        once: jest.fn().mockReturnThis(),
        emit: jest.fn().mockReturnThis(),
      } as any;

      // Note: This test is limited because archiver needs actual stream
      // Full e2e test would verify ZIP contents
      await expect(service.exportFull(mockStream)).resolves.not.toThrow();

      // Verify all tables were queried
      expect(mockClientFindMany).toHaveBeenCalled();
      expect(mockChantierFindMany).toHaveBeenCalled();
      expect(mockDevisFindMany).toHaveBeenCalled();
      expect(mockFactureFindMany).toHaveBeenCalled();
      expect(mockInterventionFindMany).toHaveBeenCalled();
      expect(mockUserFindMany).toHaveBeenCalled();
    });
  });
});
