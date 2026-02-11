import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:mocktail/mocktail.dart';

import 'package:art_et_jardin/domain/enums/chantier_statut.dart';
import 'package:art_et_jardin/domain/models/chantier.dart';
import 'package:art_et_jardin/features/chantiers/domain/chantiers_repository.dart';
import 'package:art_et_jardin/features/chantiers/presentation/providers/chantiers_providers.dart';

class MockChantiersRepository extends Mock implements ChantiersRepository {}

Chantier _testChantier({
  String id = 'ch1',
  ChantierStatut statut = ChantierStatut.lead,
  String description = 'Amenagement jardin',
  String adresse = '1 rue du Parc',
  String ville = 'Angers',
}) =>
    Chantier(
      id: id,
      clientId: 'c1',
      adresse: adresse,
      codePostal: '49000',
      ville: ville,
      description: description,
      statut: statut,
      typePrestation: [],
      createdAt: DateTime(2026, 1, 1),
      updatedAt: DateTime(2026, 1, 1),
    );

void main() {
  setUpAll(() {
    registerFallbackValue(_testChantier());
  });

  // ============== ChantiersListNotifier ==============
  group('ChantiersListNotifier', () {
    late MockChantiersRepository mockRepo;
    late ChantiersListNotifier notifier;

    setUp(() {
      mockRepo = MockChantiersRepository();
    });

    tearDown(() {
      notifier.dispose();
    });

    test('chargement initial -> loading puis data', () async {
      when(() => mockRepo.getAll()).thenAnswer((_) async =>
          [_testChantier(), _testChantier(id: 'ch2', description: 'Elagage')]);

      notifier = ChantiersListNotifier(repository: mockRepo);

      await Future<void>.delayed(const Duration(milliseconds: 50));

      expect(notifier.state.hasValue, isTrue);
      expect(notifier.state.value, hasLength(2));
    });

    test('refresh -> recharge depuis API/cache', () async {
      when(() => mockRepo.getAll())
          .thenAnswer((_) async => [_testChantier()]);

      notifier = ChantiersListNotifier(repository: mockRepo);
      await Future<void>.delayed(const Duration(milliseconds: 50));

      when(() => mockRepo.getAll()).thenAnswer(
          (_) async => [_testChantier(), _testChantier(id: 'ch2')]);

      await notifier.refresh();

      expect(notifier.state.value, hasLength(2));
    });

    test('filtre par statut applique correctement', () async {
      when(() => mockRepo.getAll()).thenAnswer((_) async => [
            _testChantier(id: 'ch1', statut: ChantierStatut.lead),
            _testChantier(id: 'ch2', statut: ChantierStatut.enCours,
                description: 'En cours'),
            _testChantier(id: 'ch3', statut: ChantierStatut.lead,
                description: 'Autre lead'),
          ]);

      notifier = ChantiersListNotifier(repository: mockRepo);
      await Future<void>.delayed(const Duration(milliseconds: 50));

      notifier.filterByStatut(ChantierStatut.enCours);

      expect(notifier.state.value, hasLength(1));
      expect(notifier.state.value!.first.description, 'En cours');
    });

    test('recherche filtre par description/adresse', () async {
      when(() => mockRepo.getAll()).thenAnswer((_) async => [
            _testChantier(
                id: 'ch1',
                description: 'Amenagement jardin',
                adresse: '1 rue du Parc'),
            _testChantier(
                id: 'ch2',
                description: 'Elagage chene',
                adresse: '5 avenue Pasteur'),
          ]);

      notifier = ChantiersListNotifier(repository: mockRepo);
      await Future<void>.delayed(const Duration(milliseconds: 50));

      notifier.search('elagage');

      expect(notifier.state.value, hasLength(1));
      expect(notifier.state.value!.first.description, 'Elagage chene');
    });

    test('liste vide -> state data avec liste vide', () async {
      when(() => mockRepo.getAll()).thenAnswer((_) async => []);

      notifier = ChantiersListNotifier(repository: mockRepo);
      await Future<void>.delayed(const Duration(milliseconds: 50));

      expect(notifier.state.hasValue, isTrue);
      expect(notifier.state.value, isEmpty);
    });

    test('erreur -> state error', () async {
      when(() => mockRepo.getAll())
          .thenThrow(Exception('Network error'));

      notifier = ChantiersListNotifier(repository: mockRepo);
      await Future<void>.delayed(const Duration(milliseconds: 50));

      expect(notifier.state is AsyncError, isTrue);
    });

    test('ajout chantier -> liste mise a jour', () async {
      when(() => mockRepo.getAll())
          .thenAnswer((_) async => [_testChantier()]);
      when(() => mockRepo.create(any())).thenAnswer(
          (_) async => _testChantier(id: 'ch2', description: 'Nouveau'));

      notifier = ChantiersListNotifier(repository: mockRepo);
      await Future<void>.delayed(const Duration(milliseconds: 50));
      expect(notifier.state.value, hasLength(1));

      when(() => mockRepo.getAll()).thenAnswer((_) async =>
          [_testChantier(), _testChantier(id: 'ch2', description: 'Nouveau')]);

      await notifier.addChantier(_testChantier(id: '', description: 'Nouveau'));

      expect(notifier.state.value, hasLength(2));
    });

    test('suppression chantier -> liste mise a jour', () async {
      when(() => mockRepo.getAll()).thenAnswer((_) async =>
          [_testChantier(), _testChantier(id: 'ch2', description: 'Elagage')]);
      when(() => mockRepo.delete(any())).thenAnswer((_) async {});

      notifier = ChantiersListNotifier(repository: mockRepo);
      await Future<void>.delayed(const Duration(milliseconds: 50));
      expect(notifier.state.value, hasLength(2));

      when(() => mockRepo.getAll())
          .thenAnswer((_) async => [_testChantier()]);

      await notifier.removeChantier('ch2');

      expect(notifier.state.value, hasLength(1));
    });
  });

  // ============== ChantierDetailNotifier ==============
  group('ChantierDetailNotifier', () {
    late MockChantiersRepository mockRepo;
    late ChantierDetailNotifier notifier;

    setUp(() {
      mockRepo = MockChantiersRepository();
    });

    tearDown(() {
      notifier.dispose();
    });

    test('chargement par ID -> data avec le chantier', () async {
      when(() => mockRepo.getById('ch1'))
          .thenAnswer((_) async => _testChantier());

      notifier = ChantierDetailNotifier(
        repository: mockRepo,
        chantierId: 'ch1',
      );
      await Future<void>.delayed(const Duration(milliseconds: 50));

      expect(notifier.state.hasValue, isTrue);
      expect(notifier.state.value!.description, 'Amenagement jardin');
    });

    test('chantier inexistant -> erreur', () async {
      when(() => mockRepo.getById('nonexistent'))
          .thenThrow(Exception('Chantier nonexistent not found'));

      notifier = ChantierDetailNotifier(
        repository: mockRepo,
        chantierId: 'nonexistent',
      );
      await Future<void>.delayed(const Duration(milliseconds: 50));

      expect(notifier.state is AsyncError, isTrue);
    });

    test('update chantier -> data mise a jour', () async {
      when(() => mockRepo.getById('ch1'))
          .thenAnswer((_) async => _testChantier());
      when(() => mockRepo.update(any()))
          .thenAnswer((_) async => _testChantier(description: 'Modifie'));

      notifier = ChantierDetailNotifier(
        repository: mockRepo,
        chantierId: 'ch1',
      );
      await Future<void>.delayed(const Duration(milliseconds: 50));

      await notifier.updateChantier(_testChantier(description: 'Modifie'));

      expect(notifier.state.value!.description, 'Modifie');
    });

    test('delete chantier -> appel repository', () async {
      when(() => mockRepo.getById('ch1'))
          .thenAnswer((_) async => _testChantier());
      when(() => mockRepo.delete('ch1')).thenAnswer((_) async {});

      notifier = ChantierDetailNotifier(
        repository: mockRepo,
        chantierId: 'ch1',
      );
      await Future<void>.delayed(const Duration(milliseconds: 50));

      await notifier.deleteChantier();

      verify(() => mockRepo.delete('ch1')).called(1);
    });

    test('refresh -> recharge le chantier', () async {
      when(() => mockRepo.getById('ch1'))
          .thenAnswer((_) async => _testChantier());

      notifier = ChantierDetailNotifier(
        repository: mockRepo,
        chantierId: 'ch1',
      );
      await Future<void>.delayed(const Duration(milliseconds: 50));

      when(() => mockRepo.getById('ch1'))
          .thenAnswer((_) async => _testChantier(description: 'Refresh'));

      await notifier.refresh();

      expect(notifier.state.value!.description, 'Refresh');
    });

    test('erreur reseau -> state error', () async {
      when(() => mockRepo.getById('ch1'))
          .thenThrow(Exception('Network error'));

      notifier = ChantierDetailNotifier(
        repository: mockRepo,
        chantierId: 'ch1',
      );
      await Future<void>.delayed(const Duration(milliseconds: 50));

      expect(notifier.state is AsyncError, isTrue);
    });
  });
}
