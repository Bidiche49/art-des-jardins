import 'package:flutter_test/flutter_test.dart';
import 'package:mocktail/mocktail.dart';

import 'package:art_et_jardin/domain/models/ligne_devis.dart';
import 'package:art_et_jardin/features/devis/domain/devis_repository.dart';
import 'package:art_et_jardin/features/devis/presentation/providers/devis_providers.dart';

class MockDevisRepository extends Mock implements DevisRepository {}

double _r2(double v) => double.parse(v.toStringAsFixed(2));

LigneDevis _testLigne({
  String id = 'l1',
  String description = 'Tonte pelouse',
  double quantite = 1.0,
  String unite = 'm2',
  double prixUnitaireHT = 5.0,
  double tva = 20.0,
}) =>
    LigneDevis(
      id: id,
      devisId: 'd1',
      description: description,
      quantite: quantite,
      unite: unite,
      prixUnitaireHT: prixUnitaireHT,
      tva: tva,
      montantHT: _r2(quantite * prixUnitaireHT),
      montantTTC: _r2(quantite * prixUnitaireHT * (1 + tva / 100)),
      ordre: 0,
    );

void main() {
  late MockDevisRepository mockRepo;
  late DevisBuilderNotifier notifier;

  setUp(() {
    mockRepo = MockDevisRepository();
  });

  tearDown(() {
    notifier.dispose();
  });

  group('Devis Builder Flow', () {
    test('initial state has empty lignes', () {
      notifier = DevisBuilderNotifier(mockRepo);
      expect(notifier.state.lignes, isEmpty);
      expect(notifier.state.chantierId, isNull);
    });

    test('addLigne adds empty line', () {
      notifier = DevisBuilderNotifier(mockRepo);
      notifier.addLigne();
      expect(notifier.state.lignes, hasLength(1));
    });

    test('add multiple lignes and update -> totaux corrects', () {
      notifier = DevisBuilderNotifier(mockRepo);

      // Add 3 lines
      notifier.addLigne();
      notifier.addLigne();
      notifier.addLigne();

      // Update line 0: 100m2 * 5€ HT, TVA 20%
      notifier.updateLigne(
          0,
          _testLigne(
              description: 'Tonte', quantite: 100, prixUnitaireHT: 5.0, tva: 20));

      // Update line 1: 2u * 150€ HT, TVA 20%
      notifier.updateLigne(
          1,
          _testLigne(
              description: 'Elagage', quantite: 2, prixUnitaireHT: 150.0, tva: 20));

      // Update line 2: 1u * 200€ HT, TVA 10%
      notifier.updateLigne(
          2,
          _testLigne(
              description: 'Evacuation', quantite: 1, prixUnitaireHT: 200.0, tva: 10));

      // HT: 500 + 300 + 200 = 1000
      expect(notifier.state.totalHT, 1000.0);
      // TVA: 100 + 60 + 20 = 180
      expect(notifier.state.totalTVA, 180.0);
      // TTC: 1000 + 180 = 1180
      expect(notifier.state.totalTTC, 1180.0);
    });

    test('removeLigne updates totals', () {
      notifier = DevisBuilderNotifier(mockRepo);

      notifier.addLigne();
      notifier.addLigne();

      notifier.updateLigne(
          0, _testLigne(quantite: 10, prixUnitaireHT: 100.0));
      notifier.updateLigne(
          1, _testLigne(quantite: 5, prixUnitaireHT: 50.0));

      notifier.removeLigne(0);

      expect(notifier.state.lignes, hasLength(1));
      // HT should be 5*50 = 250
      expect(notifier.state.totalHT, 250.0);
    });

    test('setChantier updates state', () {
      notifier = DevisBuilderNotifier(mockRepo);
      notifier.setChantier('ch-123');
      expect(notifier.state.chantierId, 'ch-123');
    });

    test('reset clears all state', () {
      notifier = DevisBuilderNotifier(mockRepo);

      notifier.setChantier('ch-123');
      notifier.addLigne();
      notifier.setNotes('Note importante');

      notifier.reset();

      expect(notifier.state.chantierId, isNull);
      expect(notifier.state.lignes, isEmpty);
      expect(notifier.state.notes, isNull);
    });

    test('setNotes updates state', () {
      notifier = DevisBuilderNotifier(mockRepo);
      notifier.setNotes('Test notes');
      expect(notifier.state.notes, 'Test notes');
    });

    test('setConditions updates state', () {
      notifier = DevisBuilderNotifier(mockRepo);
      notifier.setConditions('Conditions speciales');
      expect(notifier.state.conditionsParticulieres, 'Conditions speciales');
    });

    test('saveBrouillon fails without chantier', () async {
      notifier = DevisBuilderNotifier(mockRepo);
      notifier.addLigne();

      final result = await notifier.saveBrouillon();

      expect(result, isNull);
      expect(notifier.state.error, isNotNull);
    });
  });
}

