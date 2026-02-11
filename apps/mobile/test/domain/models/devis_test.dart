import 'package:art_et_jardin/domain/enums/devis_statut.dart';
import 'package:art_et_jardin/domain/models/devis.dart';
import 'package:art_et_jardin/domain/models/ligne_devis.dart';
import 'package:flutter_test/flutter_test.dart';

void main() {
  Map<String, dynamic> fullDevisJson() => {
        'id': 'd1-uuid',
        'chantierId': 'ch1-uuid',
        'numero': 'DEV-2026-001',
        'dateEmission': '2026-01-15T10:30:00.000Z',
        'dateValidite': '2026-02-15T10:30:00.000Z',
        'totalHT': 5000.0,
        'totalTVA': 1000.0,
        'totalTTC': 6000.0,
        'statut': 'envoye',
        'dateAcceptation': null,
        'signatureClient': null,
        'pdfUrl': 'https://cdn.example.com/devis.pdf',
        'conditionsParticulieres': 'Paiement 30 jours',
        'notes': null,
        'deletedAt': null,
        'createdAt': '2026-01-15T10:30:00.000Z',
        'updatedAt': '2026-01-15T10:30:00.000Z',
      };

  Map<String, dynamic> fullLigneDevisJson() => {
        'id': 'ld1-uuid',
        'devisId': 'd1-uuid',
        'description': 'Tonte pelouse 200m2',
        'quantite': 200.0,
        'unite': 'm2',
        'prixUnitaireHT': 2.5,
        'tva': 20.0,
        'montantHT': 500.0,
        'montantTTC': 600.0,
        'ordre': 1,
      };

  group('Devis', () {
    test('fromJson -> toJson round-trip', () {
      final devis = Devis.fromJson(fullDevisJson());
      final json = devis.toJson();
      final devis2 = Devis.fromJson(json);
      expect(devis2, devis);
    });

    test('fromJson with API JSON snapshot', () {
      final devis = Devis.fromJson(fullDevisJson());
      expect(devis.numero, 'DEV-2026-001');
      expect(devis.statut, DevisStatut.envoye);
      expect(devis.totalTTC, 6000.0);
    });

    test('fromJson without signature (nullable) -> parse OK', () {
      final json = fullDevisJson();
      json['signatureClient'] = null;
      final devis = Devis.fromJson(json);
      expect(devis.signatureClient, isNull);
    });

    test('default statut is brouillon', () {
      final devis = Devis(
        id: 'x',
        chantierId: 'ch',
        numero: 'DEV-001',
        dateEmission: DateTime.now(),
        dateValidite: DateTime.now(),
        totalHT: 0,
        totalTVA: 0,
        totalTTC: 0,
        createdAt: DateTime.now(),
        updatedAt: DateTime.now(),
      );
      expect(devis.statut, DevisStatut.brouillon);
    });
  });

  group('LigneDevis', () {
    test('fromJson -> toJson round-trip', () {
      final ligne = LigneDevis.fromJson(fullLigneDevisJson());
      final json = ligne.toJson();
      final ligne2 = LigneDevis.fromJson(json);
      expect(ligne2, ligne);
    });

    test('fromJson with API JSON snapshot', () {
      final ligne = LigneDevis.fromJson(fullLigneDevisJson());
      expect(ligne.description, 'Tonte pelouse 200m2');
      expect(ligne.quantite, 200.0);
      expect(ligne.prixUnitaireHT, 2.5);
      expect(ligne.tva, 20.0);
    });

    test('default tva is 20.0', () {
      const ligne = LigneDevis(
        id: 'x',
        devisId: 'd',
        description: 'Test',
        quantite: 1,
        unite: 'h',
        prixUnitaireHT: 50,
        montantHT: 50,
        montantTTC: 60,
      );
      expect(ligne.tva, 20.0);
    });
  });
}
