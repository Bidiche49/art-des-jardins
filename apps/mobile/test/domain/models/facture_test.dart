import 'package:art_et_jardin/domain/enums/facture_statut.dart';
import 'package:art_et_jardin/domain/enums/mode_paiement.dart';
import 'package:art_et_jardin/domain/models/facture.dart';
import 'package:flutter_test/flutter_test.dart';

void main() {
  Map<String, dynamic> fullFactureJson() => {
        'id': 'f1-uuid',
        'devisId': 'd1-uuid',
        'numero': 'FAC-2026-001',
        'dateEmission': '2026-01-15T10:30:00.000Z',
        'dateEcheance': '2026-02-15T10:30:00.000Z',
        'datePaiement': '2026-02-10T10:30:00.000Z',
        'totalHT': 5000.0,
        'totalTVA': 1000.0,
        'totalTTC': 6000.0,
        'statut': 'payee',
        'modePaiement': 'virement',
        'referencePaiement': 'VIR-2026-ABC',
        'pdfUrl': 'https://cdn.example.com/facture.pdf',
        'mentionsLegales': 'TVA non applicable',
        'notes': null,
        'deletedAt': null,
        'createdAt': '2026-01-15T10:30:00.000Z',
        'updatedAt': '2026-01-15T10:30:00.000Z',
      };

  group('Facture', () {
    test('fromJson -> toJson round-trip', () {
      final facture = Facture.fromJson(fullFactureJson());
      final json = facture.toJson();
      final facture2 = Facture.fromJson(json);
      expect(facture2, facture);
    });

    test('fromJson with API JSON snapshot', () {
      final facture = Facture.fromJson(fullFactureJson());
      expect(facture.numero, 'FAC-2026-001');
      expect(facture.statut, FactureStatut.payee);
      expect(facture.modePaiement, ModePaiement.virement);
      expect(facture.totalTTC, 6000.0);
    });

    test('fromJson without modePaiement (nullable)', () {
      final json = fullFactureJson()..['modePaiement'] = null;
      final facture = Facture.fromJson(json);
      expect(facture.modePaiement, isNull);
    });

    test('default statut is brouillon', () {
      final facture = Facture(
        id: 'x',
        devisId: 'd',
        numero: 'FAC-001',
        dateEmission: DateTime.now(),
        dateEcheance: DateTime.now(),
        totalHT: 0,
        totalTVA: 0,
        totalTTC: 0,
        createdAt: DateTime.now(),
        updatedAt: DateTime.now(),
      );
      expect(facture.statut, FactureStatut.brouillon);
    });
  });
}
