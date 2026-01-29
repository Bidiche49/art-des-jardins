import { Test, TestingModule } from '@nestjs/testing';
import { PdfService, DevisData, SignatureData } from './pdf.service';

describe('PdfService', () => {
  let service: PdfService;

  const mockClient = {
    nom: 'Dupont',
    prenom: 'Jean',
    adresse: '123 Rue Test',
    codePostal: '49000',
    ville: 'Angers',
    email: 'jean.dupont@test.com',
  };

  const mockLignes = [
    {
      designation: 'Taille de haie',
      quantite: 10,
      unite: 'm',
      prixUnitaire: 15,
      montantHT: 150,
    },
    {
      designation: 'Evacuation dechets',
      quantite: 1,
      unite: 'forfait',
      prixUnitaire: 50,
      montantHT: 50,
    },
  ];

  const mockDevisData: DevisData = {
    numero: 'DEV-202601-001',
    dateCreation: new Date('2026-01-15'),
    dateValidite: new Date('2026-02-15'),
    client: mockClient,
    lignes: mockLignes,
    totalHT: 200,
    tauxTVA: 20,
    montantTVA: 40,
    totalTTC: 240,
    notes: 'Travaux a realiser en fevrier',
  };

  const mockSignature: SignatureData = {
    imageBase64: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
    signedAt: new Date('2026-01-16T14:30:00'),
    ipAddress: '192.168.1.1',
    reference: 'SIG-ABC12345',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PdfService],
    }).compile();

    service = module.get<PdfService>(PdfService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('generateDevis', () => {
    it('should generate a PDF buffer for devis without signature', async () => {
      const result = await service.generateDevis(mockDevisData);

      expect(result).toBeInstanceOf(Buffer);
      expect(result.length).toBeGreaterThan(0);
      // PDF files start with %PDF
      expect(result.toString('utf-8', 0, 4)).toBe('%PDF');
    });

    it('should generate a PDF buffer for devis with signature', async () => {
      const dataWithSignature: DevisData = {
        ...mockDevisData,
        signature: mockSignature,
      };

      const result = await service.generateDevis(dataWithSignature);

      expect(result).toBeInstanceOf(Buffer);
      expect(result.length).toBeGreaterThan(0);
      expect(result.toString('utf-8', 0, 4)).toBe('%PDF');
    });

    it('should generate larger PDF when signature is included', async () => {
      const withoutSignature = await service.generateDevis(mockDevisData);
      const withSignature = await service.generateDevis({
        ...mockDevisData,
        signature: mockSignature,
      });

      // PDF with signature should be larger (contains image data)
      expect(withSignature.length).toBeGreaterThan(withoutSignature.length);
    });

    it('should handle devis without notes', async () => {
      const { notes, ...dataWithoutNotes } = mockDevisData;

      const result = await service.generateDevis(dataWithoutNotes);

      expect(result).toBeInstanceOf(Buffer);
      expect(result.length).toBeGreaterThan(0);
    });

    it('should handle devis with company client (raisonSociale)', async () => {
      const companyClient = {
        ...mockClient,
        raisonSociale: 'SARL Test Company',
      };
      const dataWithCompany: DevisData = {
        ...mockDevisData,
        client: companyClient,
      };

      const result = await service.generateDevis(dataWithCompany);

      expect(result).toBeInstanceOf(Buffer);
      expect(result.length).toBeGreaterThan(0);
    });

    it('should handle empty lignes array', async () => {
      const dataWithNoLignes: DevisData = {
        ...mockDevisData,
        lignes: [],
        totalHT: 0,
        montantTVA: 0,
        totalTTC: 0,
      };

      const result = await service.generateDevis(dataWithNoLignes);

      expect(result).toBeInstanceOf(Buffer);
      expect(result.length).toBeGreaterThan(0);
    });

    it('should handle signature with invalid base64 gracefully', async () => {
      const invalidSignature: SignatureData = {
        ...mockSignature,
        imageBase64: 'data:image/png;base64,INVALID_BASE64_DATA!!!',
      };
      const dataWithInvalidSignature: DevisData = {
        ...mockDevisData,
        signature: invalidSignature,
      };

      // Should not throw, should handle gracefully
      const result = await service.generateDevis(dataWithInvalidSignature);

      expect(result).toBeInstanceOf(Buffer);
      expect(result.length).toBeGreaterThan(0);
    });
  });

  describe('generateFacture', () => {
    const mockFactureData = {
      numero: 'FAC-202601-001',
      dateCreation: new Date('2026-01-20'),
      dateEcheance: new Date('2026-02-20'),
      client: mockClient,
      lignes: mockLignes,
      totalHT: 200,
      tauxTVA: 20,
      montantTVA: 40,
      totalTTC: 240,
      devisNumero: 'DEV-202601-001',
      notes: 'Merci pour votre confiance',
    };

    it('should generate a PDF buffer for facture', async () => {
      const result = await service.generateFacture(mockFactureData);

      expect(result).toBeInstanceOf(Buffer);
      expect(result.length).toBeGreaterThan(0);
      expect(result.toString('utf-8', 0, 4)).toBe('%PDF');
    });

    it('should handle facture without devisNumero', async () => {
      const { devisNumero, ...dataWithoutDevis } = mockFactureData;

      const result = await service.generateFacture(dataWithoutDevis);

      expect(result).toBeInstanceOf(Buffer);
      expect(result.length).toBeGreaterThan(0);
    });
  });
});
