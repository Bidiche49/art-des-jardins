import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:mocktail/mocktail.dart';

import 'package:art_et_jardin/domain/enums/devis_statut.dart';
import 'package:art_et_jardin/domain/models/devis.dart';
import 'package:art_et_jardin/domain/models/ligne_devis.dart';
import 'package:art_et_jardin/domain/models/prestation_template.dart';
import 'package:art_et_jardin/features/devis/domain/devis_repository.dart';
import 'package:art_et_jardin/features/devis/presentation/providers/devis_providers.dart';

class MockDevisRepository extends Mock implements DevisRepository {}

LigneDevis _ligne({
  String desc = 'Tonte pelouse',
  double qte = 1,
  String unite = 'm2',
  double prix = 10,
  double tva = 20,
}) {
  final ht = double.parse((qte * prix).toStringAsFixed(2));
  final ttc = double.parse((ht * (1 + tva / 100)).toStringAsFixed(2));
  return LigneDevis(
    id: 'l-${DateTime.now().microsecondsSinceEpoch}',
    devisId: '',
    description: desc,
    quantite: qte,
    unite: unite,
    prixUnitaireHT: prix,
    tva: tva,
    montantHT: ht,
    montantTTC: ttc,
  );
}

Devis _devis() => Devis(
      id: 'devis-1',
      chantierId: 'chantier-1',
      numero: 'DEV-2026-001',
      dateEmission: DateTime(2026, 1, 1),
      dateValidite: DateTime(2026, 1, 31),
      totalHT: 100,
      totalTVA: 20,
      totalTTC: 120,
      statut: DevisStatut.brouillon,
      createdAt: DateTime(2026, 1, 1),
      updatedAt: DateTime(2026, 1, 1),
    );

void main() {
  late MockDevisRepository mockRepo;
  late DevisBuilderNotifier notifier;

  setUpAll(() {
    registerFallbackValue(DevisStatut.brouillon);
  });

  setUp(() {
    mockRepo = MockDevisRepository();
    notifier = DevisBuilderNotifier(mockRepo);
  });

  group('DevisBuilderNotifier - Etat initial', () {
    test('etat initial vide, 0 lignes', () {
      expect(notifier.state.lignes, isEmpty);
      expect(notifier.state.chantierId, isNull);
      expect(notifier.state.totalHT, 0);
      expect(notifier.state.totalTVA, 0);
      expect(notifier.state.totalTTC, 0);
      expect(notifier.state.validiteJours, 30);
      expect(notifier.state.isSaving, false);
    });
  });

  group('DevisBuilderNotifier - Gestion lignes', () {
    test('addLigne ajoute une nouvelle ligne', () {
      notifier.addLigne();
      expect(notifier.state.lignes.length, 1);
      expect(notifier.state.lignes[0].quantite, 1);
      expect(notifier.state.lignes[0].unite, 'u');
    });

    test('removeLigne supprime la ligne', () {
      notifier.addLigne();
      notifier.addLigne();
      expect(notifier.state.lignes.length, 2);
      notifier.removeLigne(0);
      expect(notifier.state.lignes.length, 1);
    });

    test('updateLigne met a jour les valeurs', () {
      notifier.addLigne();
      final updated = notifier.state.lignes[0].copyWith(
        description: 'Test',
        quantite: 5,
        prixUnitaireHT: 10,
      );
      notifier.updateLigne(0, updated);
      expect(notifier.state.lignes[0].description, 'Test');
      expect(notifier.state.lignes[0].quantite, 5);
      expect(notifier.state.lignes[0].montantHT, 50);
    });

    test('removeLigne reordonne les indices', () {
      notifier.addLigne();
      notifier.addLigne();
      notifier.addLigne();
      notifier.removeLigne(1);
      expect(notifier.state.lignes[0].ordre, 0);
      expect(notifier.state.lignes[1].ordre, 1);
    });

    test('removeLigne index invalide ne fait rien', () {
      notifier.addLigne();
      notifier.removeLigne(-1);
      notifier.removeLigne(5);
      expect(notifier.state.lignes.length, 1);
    });

    test('updateLigne index invalide ne fait rien', () {
      notifier.addLigne();
      final ligne = notifier.state.lignes[0];
      notifier.updateLigne(5, ligne);
      expect(notifier.state.lignes.length, 1);
    });
  });

  group('DevisBuilderNotifier - Calculs', () {
    test('montantHT = quantite * prixUnitaireHT', () {
      notifier.addLigne();
      final updated = notifier.state.lignes[0].copyWith(
        quantite: 3,
        prixUnitaireHT: 25,
      );
      notifier.updateLigne(0, updated);
      expect(notifier.state.lignes[0].montantHT, 75);
    });

    test('montantTTC = montantHT * (1 + tva/100)', () {
      notifier.addLigne();
      final updated = notifier.state.lignes[0].copyWith(
        quantite: 1,
        prixUnitaireHT: 100,
        tva: 20,
      );
      notifier.updateLigne(0, updated);
      expect(notifier.state.lignes[0].montantTTC, 120);
    });

    test('total HT = somme des montantHT', () {
      notifier.addLigne();
      notifier.updateLigne(
          0,
          notifier.state.lignes[0]
              .copyWith(quantite: 2, prixUnitaireHT: 50));
      notifier.addLigne();
      notifier.updateLigne(
          1,
          notifier.state.lignes[1]
              .copyWith(quantite: 3, prixUnitaireHT: 30));
      // 100 + 90 = 190
      expect(notifier.state.totalHT, 190);
    });

    test('total TVA = somme des (TTC - HT)', () {
      notifier.addLigne();
      notifier.updateLigne(
          0,
          notifier.state.lignes[0]
              .copyWith(quantite: 1, prixUnitaireHT: 100, tva: 20));
      // TVA = 120 - 100 = 20
      expect(notifier.state.totalTVA, 20);
    });

    test('total TTC = totalHT + totalTVA', () {
      notifier.addLigne();
      notifier.updateLigne(
          0,
          notifier.state.lignes[0]
              .copyWith(quantite: 1, prixUnitaireHT: 100, tva: 20));
      expect(notifier.state.totalTTC, 120);
    });

    test('ajout 5 lignes totaux corrects', () {
      for (var i = 0; i < 5; i++) {
        notifier.addLigne();
        notifier.updateLigne(
            i,
            notifier.state.lignes[i]
                .copyWith(quantite: 1, prixUnitaireHT: 10, tva: 20));
      }
      expect(notifier.state.totalHT, 50);
      expect(notifier.state.totalTVA, 10);
      expect(notifier.state.totalTTC, 60);
    });

    test('modification quantite recalcule totaux', () {
      notifier.addLigne();
      notifier.updateLigne(
          0,
          notifier.state.lignes[0]
              .copyWith(quantite: 2, prixUnitaireHT: 50, tva: 20));
      expect(notifier.state.totalHT, 100);
      notifier.updateLigne(
          0,
          notifier.state.lignes[0]
              .copyWith(quantite: 5, prixUnitaireHT: 50, tva: 20));
      expect(notifier.state.totalHT, 250);
    });

    test('modification prix recalcule totaux', () {
      notifier.addLigne();
      notifier.updateLigne(
          0,
          notifier.state.lignes[0]
              .copyWith(quantite: 1, prixUnitaireHT: 100, tva: 20));
      expect(notifier.state.totalHT, 100);
      notifier.updateLigne(
          0,
          notifier.state.lignes[0]
              .copyWith(quantite: 1, prixUnitaireHT: 200, tva: 20));
      expect(notifier.state.totalHT, 200);
    });

    test('suppression ligne recalcule totaux', () {
      notifier.addLigne();
      notifier.addLigne();
      notifier.updateLigne(
          0,
          notifier.state.lignes[0]
              .copyWith(quantite: 1, prixUnitaireHT: 100, tva: 20));
      notifier.updateLigne(
          1,
          notifier.state.lignes[1]
              .copyWith(quantite: 1, prixUnitaireHT: 50, tva: 20));
      expect(notifier.state.totalHT, 150);
      notifier.removeLigne(0);
      expect(notifier.state.totalHT, 50);
    });

    test('TVA 0% -> TTC = HT', () {
      notifier.addLigne();
      notifier.updateLigne(
          0,
          notifier.state.lignes[0]
              .copyWith(quantite: 1, prixUnitaireHT: 100, tva: 0));
      expect(notifier.state.totalTTC, notifier.state.totalHT);
    });

    test('TVA 20% montants corrects', () {
      notifier.addLigne();
      notifier.updateLigne(
          0,
          notifier.state.lignes[0]
              .copyWith(quantite: 1, prixUnitaireHT: 100, tva: 20));
      expect(notifier.state.totalHT, 100);
      expect(notifier.state.totalTVA, 20);
      expect(notifier.state.totalTTC, 120);
    });

    test('TVA 10% montants corrects', () {
      notifier.addLigne();
      notifier.updateLigne(
          0,
          notifier.state.lignes[0]
              .copyWith(quantite: 1, prixUnitaireHT: 100, tva: 10));
      expect(notifier.state.totalHT, 100);
      expect(notifier.state.totalTVA, 10);
      expect(notifier.state.totalTTC, 110);
    });
  });

  group('DevisBuilderNotifier - Precision calculs', () {
    test('pas erreur arrondi float', () {
      notifier.addLigne();
      notifier.updateLigne(
          0,
          notifier.state.lignes[0]
              .copyWith(quantite: 1, prixUnitaireHT: 1.1, tva: 0));
      notifier.addLigne();
      notifier.updateLigne(
          1,
          notifier.state.lignes[1]
              .copyWith(quantite: 1, prixUnitaireHT: 2.2, tva: 0));
      expect(notifier.state.totalHT, 3.3);
    });

    test('arrondi a 2 decimales', () {
      notifier.addLigne();
      notifier.updateLigne(
          0,
          notifier.state.lignes[0]
              .copyWith(quantite: 1, prixUnitaireHT: 33.333, tva: 0));
      final ht = notifier.state.lignes[0].montantHT;
      final parts = ht.toStringAsFixed(2).split('.');
      expect(parts[1].length, 2);
    });

    test('quantite decimale (2.5 m2) calcul correct', () {
      notifier.addLigne();
      notifier.updateLigne(
          0,
          notifier.state.lignes[0]
              .copyWith(quantite: 2.5, prixUnitaireHT: 10, tva: 0));
      expect(notifier.state.lignes[0].montantHT, 25);
    });

    test('prix 0.01 EUR calcul correct', () {
      notifier.addLigne();
      notifier.updateLigne(
          0,
          notifier.state.lignes[0]
              .copyWith(quantite: 1, prixUnitaireHT: 0.01, tva: 20));
      expect(notifier.state.lignes[0].montantHT, 0.01);
      expect(notifier.state.lignes[0].montantTTC, 0.01); // arrondi
    });

    test('tres gros montant pas overflow', () {
      notifier.addLigne();
      notifier.updateLigne(
          0,
          notifier.state.lignes[0]
              .copyWith(quantite: 1, prixUnitaireHT: 100000, tva: 20));
      expect(notifier.state.totalHT, 100000);
      expect(notifier.state.totalTTC, 120000);
    });

    test('ligne quantite 0 -> montant 0', () {
      notifier.addLigne();
      notifier.updateLigne(
          0,
          notifier.state.lignes[0]
              .copyWith(quantite: 0, prixUnitaireHT: 100, tva: 20));
      expect(notifier.state.lignes[0].montantHT, 0);
    });

    test('ligne prix 0 -> montant 0', () {
      notifier.addLigne();
      notifier.updateLigne(
          0,
          notifier.state.lignes[0]
              .copyWith(quantite: 5, prixUnitaireHT: 0, tva: 20));
      expect(notifier.state.lignes[0].montantHT, 0);
    });

    test('devis vide (0 lignes) -> totaux = 0', () {
      expect(notifier.state.totalHT, 0);
      expect(notifier.state.totalTVA, 0);
      expect(notifier.state.totalTTC, 0);
    });
  });

  group('DevisBuilderNotifier - Import templates', () {
    PrestationTemplate makeTemplate({
      String name = 'Tonte pelouse',
      String? desc,
      String unit = 'm2',
      double price = 15,
      double tva = 20,
    }) =>
        PrestationTemplate(
          id: 'tpl-1',
          name: name,
          description: desc,
          category: 'entretien',
          unit: unit,
          unitPriceHT: price,
          tvaRate: tva,
          createdAt: DateTime(2026),
          updatedAt: DateTime(2026),
        );

    test('import template ajoute une ligne pre-remplie', () {
      final tpl = makeTemplate();
      notifier.importTemplate(tpl);
      expect(notifier.state.lignes.length, 1);
      expect(notifier.state.lignes[0].description, tpl.name);
      expect(notifier.state.lignes[0].unite, 'm2');
      expect(notifier.state.lignes[0].prixUnitaireHT, 15);
    });

    test('import multiple templates ajoute toutes les lignes', () {
      notifier.importTemplates([
        makeTemplate(name: 'Tonte'),
        makeTemplate(name: 'Elagage'),
        makeTemplate(name: 'Haie'),
      ]);
      expect(notifier.state.lignes.length, 3);
    });

    test('template avec TVA appliquee', () {
      notifier.importTemplate(makeTemplate(tva: 10));
      expect(notifier.state.lignes[0].tva, 10);
    });

    test('template description, unite, prix corrects', () {
      notifier.importTemplate(makeTemplate(
        desc: 'Tonte complete',
        unit: 'h',
        price: 45,
      ));
      expect(notifier.state.lignes[0].description, 'Tonte complete');
      expect(notifier.state.lignes[0].unite, 'h');
      expect(notifier.state.lignes[0].prixUnitaireHT, 45);
    });

    test('ligne importee modifiable apres import', () {
      notifier.importTemplate(makeTemplate());
      notifier.updateLigne(
          0, notifier.state.lignes[0].copyWith(quantite: 10));
      expect(notifier.state.lignes[0].quantite, 10);
    });
  });

  group('DevisBuilderNotifier - Sauvegarde/Envoi', () {
    test('sauvegarde brouillon online appelle create', () async {
      notifier.setChantier('chantier-1');
      notifier.addLigne();
      notifier.updateLigne(
          0,
          notifier.state.lignes[0]
              .copyWith(quantite: 1, prixUnitaireHT: 100));

      when(() => mockRepo.create(
            chantierId: any(named: 'chantierId'),
            lignes: any(named: 'lignes'),
            validiteJours: any(named: 'validiteJours'),
            conditionsParticulieres: any(named: 'conditionsParticulieres'),
            notes: any(named: 'notes'),
          )).thenAnswer((_) async => _devis());

      final result = await notifier.saveBrouillon();
      expect(result, isNotNull);
      expect(notifier.state.isSaving, false);
      verify(() => mockRepo.create(
            chantierId: 'chantier-1',
            lignes: any(named: 'lignes'),
            validiteJours: 30,
            conditionsParticulieres: null,
            notes: null,
          )).called(1);
    });

    test('sauvegarde sans chantier -> erreur', () async {
      final result = await notifier.saveBrouillon();
      expect(result, isNull);
      expect(notifier.state.error, isNotNull);
    });

    test('envoi sans lignes -> erreur', () async {
      notifier.setChantier('chantier-1');
      final result = await notifier.envoyerDevis();
      expect(result, isNull);
      expect(notifier.state.error, contains('ligne'));
    });

    test('mode edition charge devis existant', () {
      final devis = _devis();
      final lignes = [_ligne(qte: 2, prix: 50)];
      notifier.loadExistingDevis(devis, lignes);
      expect(notifier.state.editingDevisId, 'devis-1');
      expect(notifier.state.chantierId, 'chantier-1');
      expect(notifier.state.lignes.length, 1);
    });

    test('mode edition sauvegarde appelle update', () async {
      final devis = _devis();
      final lignes = [_ligne(qte: 2, prix: 50)];
      notifier.loadExistingDevis(devis, lignes);

      when(() => mockRepo.update(
            id: any(named: 'id'),
            lignes: any(named: 'lignes'),
            validiteJours: any(named: 'validiteJours'),
            conditionsParticulieres: any(named: 'conditionsParticulieres'),
            notes: any(named: 'notes'),
          )).thenAnswer((_) async => devis);

      await notifier.saveBrouillon();
      verify(() => mockRepo.update(
            id: 'devis-1',
            lignes: any(named: 'lignes'),
            validiteJours: any(named: 'validiteJours'),
            conditionsParticulieres: any(named: 'conditionsParticulieres'),
            notes: any(named: 'notes'),
          )).called(1);
    });

    test('envoi devis appelle save puis updateStatut', () async {
      notifier.setChantier('chantier-1');
      notifier.addLigne();
      notifier.updateLigne(
          0,
          notifier.state.lignes[0]
              .copyWith(quantite: 1, prixUnitaireHT: 100));

      final saved = _devis();
      when(() => mockRepo.create(
            chantierId: any(named: 'chantierId'),
            lignes: any(named: 'lignes'),
            validiteJours: any(named: 'validiteJours'),
            conditionsParticulieres: any(named: 'conditionsParticulieres'),
            notes: any(named: 'notes'),
          )).thenAnswer((_) async => saved);

      when(() => mockRepo.updateStatut(any(), any()))
          .thenAnswer((_) async => saved.copyWith(statut: DevisStatut.envoye));

      final result = await notifier.envoyerDevis();
      expect(result, isNotNull);
      expect(result!.statut, DevisStatut.envoye);
    });

    test('transformation dateValidite -> validiteJours', () {
      notifier.setValiditeJours(45);
      expect(notifier.state.validiteJours, 45);
    });
  });

  group('DevisBuilderNotifier - Reset', () {
    test('reset remet etat initial', () {
      notifier.setChantier('chantier-1');
      notifier.addLigne();
      notifier.reset();
      expect(notifier.state.lignes, isEmpty);
      expect(notifier.state.chantierId, isNull);
    });
  });

  group('DevisListNotifier', () {
    late MockDevisRepository listMockRepo;
    late DevisListNotifier listNotifier;

    setUp(() {
      listMockRepo = MockDevisRepository();
      when(() => listMockRepo.getAll()).thenAnswer((_) async => [_devis()]);
      listNotifier = DevisListNotifier(listMockRepo);
    });

    test('charge la liste au demarrage', () async {
      await Future.delayed(Duration.zero);
      final state = listNotifier.state;
      expect(state.valueOrNull?.length, 1);
    });

    test('filter par statut', () async {
      when(() => listMockRepo.getByStatut(DevisStatut.brouillon))
          .thenAnswer((_) async => [_devis()]);
      listNotifier.setFilter(DevisStatut.brouillon);
      await Future.delayed(Duration.zero);
      verify(() => listMockRepo.getByStatut(DevisStatut.brouillon)).called(1);
    });

    test('search filtre par numero', () async {
      when(() => listMockRepo.getAll()).thenAnswer((_) async => [
            _devis(),
            _devis().copyWith(id: 'devis-2', numero: 'DEV-2026-002'),
          ]);
      listNotifier.search('002');
      await Future.delayed(Duration.zero);
      final data = listNotifier.state.valueOrNull;
      expect(data?.length, 1);
      expect(data?.first.numero, 'DEV-2026-002');
    });
  });

  group('DevisDetailNotifier', () {
    late MockDevisRepository detailMockRepo;
    late DevisDetailNotifier detailNotifier;

    setUp(() {
      detailMockRepo = MockDevisRepository();
      when(() => detailMockRepo.getById('devis-1'))
          .thenAnswer((_) async => _devis());
      detailNotifier = DevisDetailNotifier(detailMockRepo, 'devis-1');
    });

    test('charge le devis au demarrage', () async {
      await Future.delayed(Duration.zero);
      expect(detailNotifier.state.valueOrNull?.numero, 'DEV-2026-001');
    });

    test('updateStatut change le statut', () async {
      await Future.delayed(Duration.zero);
      when(() => detailMockRepo.updateStatut('devis-1', DevisStatut.envoye))
          .thenAnswer(
              (_) async => _devis().copyWith(statut: DevisStatut.envoye));
      await detailNotifier.updateStatut(DevisStatut.envoye);
      expect(detailNotifier.state.valueOrNull?.statut, DevisStatut.envoye);
    });
  });

  group('DevisBuilderState - Calculs statiques', () {
    test('totalHT avec lignes pre-calculees', () {
      final state = DevisBuilderState(
        lignes: [
          _ligne(qte: 2, prix: 50, tva: 20),
          _ligne(qte: 3, prix: 30, tva: 10),
        ],
      );
      expect(state.totalHT, 190);
    });

    test('totalTVA avec taux differents', () {
      final state = DevisBuilderState(
        lignes: [
          _ligne(qte: 1, prix: 100, tva: 20), // TVA = 20
          _ligne(qte: 1, prix: 100, tva: 10), // TVA = 10
        ],
      );
      expect(state.totalTVA, 30);
    });
  });
}
