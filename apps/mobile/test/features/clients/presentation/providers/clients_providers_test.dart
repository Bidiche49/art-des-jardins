import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:mocktail/mocktail.dart';

import 'package:art_et_jardin/domain/enums/client_type.dart';
import 'package:art_et_jardin/domain/models/client.dart';
import 'package:art_et_jardin/features/clients/domain/clients_repository.dart';
import 'package:art_et_jardin/features/clients/presentation/providers/clients_providers.dart';

class MockClientsRepository extends Mock implements ClientsRepository {}

Client _testClient({
  String id = 'c1',
  ClientType type = ClientType.particulier,
  String nom = 'Dupont',
  String email = 'dupont@test.fr',
}) =>
    Client(
      id: id,
      type: type,
      nom: nom,
      email: email,
      telephone: '0612345678',
      adresse: '1 rue Test',
      codePostal: '49000',
      ville: 'Angers',
      tags: [],
      createdAt: DateTime(2026, 1, 1),
      updatedAt: DateTime(2026, 1, 1),
    );

void main() {
  setUpAll(() {
    registerFallbackValue(_testClient());
  });

  // ============== ClientsListNotifier ==============
  group('ClientsListNotifier', () {
    late MockClientsRepository mockRepo;
    late ClientsListNotifier notifier;

    setUp(() {
      mockRepo = MockClientsRepository();
    });

    tearDown(() {
      notifier.dispose();
    });

    test('chargement initial -> loading puis data', () async {
      when(() => mockRepo.getAll()).thenAnswer(
          (_) async => [_testClient(), _testClient(id: 'c2', nom: 'Martin')]);

      notifier = ClientsListNotifier(repository: mockRepo);

      // Wait for loadClients to complete
      await Future<void>.delayed(const Duration(milliseconds: 50));

      expect(notifier.state.hasValue, isTrue);
      expect(notifier.state.value, hasLength(2));
    });

    test('refresh -> recharge depuis API/cache', () async {
      when(() => mockRepo.getAll())
          .thenAnswer((_) async => [_testClient()]);

      notifier = ClientsListNotifier(repository: mockRepo);
      await Future<void>.delayed(const Duration(milliseconds: 50));

      when(() => mockRepo.getAll())
          .thenAnswer((_) async => [_testClient(), _testClient(id: 'c2')]);

      await notifier.refresh();

      expect(notifier.state.value, hasLength(2));
    });

    test('filtre par type applique correctement', () async {
      when(() => mockRepo.getAll()).thenAnswer((_) async => [
            _testClient(id: 'c1', type: ClientType.particulier),
            _testClient(
                id: 'c2', type: ClientType.professionnel, nom: 'Pro SA'),
            _testClient(id: 'c3', type: ClientType.particulier, nom: 'Martin'),
          ]);

      notifier = ClientsListNotifier(repository: mockRepo);
      await Future<void>.delayed(const Duration(milliseconds: 50));

      notifier.filterByType(ClientType.professionnel);

      expect(notifier.state.value, hasLength(1));
      expect(notifier.state.value!.first.nom, 'Pro SA');
    });

    test('recherche filtre par nom/email', () async {
      when(() => mockRepo.getAll()).thenAnswer((_) async => [
            _testClient(id: 'c1', nom: 'Dupont', email: 'dupont@test.fr'),
            _testClient(id: 'c2', nom: 'Martin', email: 'martin@test.fr'),
          ]);

      notifier = ClientsListNotifier(repository: mockRepo);
      await Future<void>.delayed(const Duration(milliseconds: 50));

      notifier.search('mart');

      expect(notifier.state.value, hasLength(1));
      expect(notifier.state.value!.first.nom, 'Martin');
    });

    test('liste vide -> state data avec liste vide', () async {
      when(() => mockRepo.getAll()).thenAnswer((_) async => []);

      notifier = ClientsListNotifier(repository: mockRepo);
      await Future<void>.delayed(const Duration(milliseconds: 50));

      expect(notifier.state.hasValue, isTrue);
      expect(notifier.state.value, isEmpty);
    });

    test('erreur -> state error', () async {
      when(() => mockRepo.getAll())
          .thenThrow(Exception('Network error'));

      notifier = ClientsListNotifier(repository: mockRepo);
      await Future<void>.delayed(const Duration(milliseconds: 50));

      expect(notifier.state is AsyncError, isTrue);
    });

    test('ajout client -> liste mise a jour', () async {
      when(() => mockRepo.getAll())
          .thenAnswer((_) async => [_testClient()]);
      when(() => mockRepo.create(any())).thenAnswer(
          (_) async => _testClient(id: 'c2', nom: 'Nouveau'));

      notifier = ClientsListNotifier(repository: mockRepo);
      await Future<void>.delayed(const Duration(milliseconds: 50));
      expect(notifier.state.value, hasLength(1));

      when(() => mockRepo.getAll()).thenAnswer(
          (_) async => [_testClient(), _testClient(id: 'c2', nom: 'Nouveau')]);

      await notifier.addClient(_testClient(id: '', nom: 'Nouveau'));

      expect(notifier.state.value, hasLength(2));
    });

    test('suppression client -> liste mise a jour', () async {
      when(() => mockRepo.getAll()).thenAnswer(
          (_) async => [_testClient(), _testClient(id: 'c2', nom: 'Martin')]);
      when(() => mockRepo.delete(any())).thenAnswer((_) async {});

      notifier = ClientsListNotifier(repository: mockRepo);
      await Future<void>.delayed(const Duration(milliseconds: 50));
      expect(notifier.state.value, hasLength(2));

      when(() => mockRepo.getAll())
          .thenAnswer((_) async => [_testClient()]);

      await notifier.removeClient('c2');

      expect(notifier.state.value, hasLength(1));
    });
  });

  // ============== ClientDetailNotifier ==============
  group('ClientDetailNotifier', () {
    late MockClientsRepository mockRepo;
    late ClientDetailNotifier notifier;

    setUp(() {
      mockRepo = MockClientsRepository();
    });

    tearDown(() {
      notifier.dispose();
    });

    test('chargement par ID -> data avec le client', () async {
      when(() => mockRepo.getById('c1'))
          .thenAnswer((_) async => _testClient());

      notifier = ClientDetailNotifier(
        repository: mockRepo,
        clientId: 'c1',
      );
      await Future<void>.delayed(const Duration(milliseconds: 50));

      expect(notifier.state.hasValue, isTrue);
      expect(notifier.state.value!.nom, 'Dupont');
    });

    test('client inexistant -> erreur', () async {
      when(() => mockRepo.getById('nonexistent'))
          .thenThrow(Exception('Client nonexistent not found'));

      notifier = ClientDetailNotifier(
        repository: mockRepo,
        clientId: 'nonexistent',
      );
      await Future<void>.delayed(const Duration(milliseconds: 50));

      expect(notifier.state is AsyncError, isTrue);
    });

    test('update client -> data mise a jour', () async {
      when(() => mockRepo.getById('c1'))
          .thenAnswer((_) async => _testClient());
      when(() => mockRepo.update(any()))
          .thenAnswer((_) async => _testClient(nom: 'DupontModifie'));

      notifier = ClientDetailNotifier(
        repository: mockRepo,
        clientId: 'c1',
      );
      await Future<void>.delayed(const Duration(milliseconds: 50));

      await notifier.updateClient(_testClient(nom: 'DupontModifie'));

      expect(notifier.state.value!.nom, 'DupontModifie');
    });

    test('delete client -> appel repository', () async {
      when(() => mockRepo.getById('c1'))
          .thenAnswer((_) async => _testClient());
      when(() => mockRepo.delete('c1')).thenAnswer((_) async {});

      notifier = ClientDetailNotifier(
        repository: mockRepo,
        clientId: 'c1',
      );
      await Future<void>.delayed(const Duration(milliseconds: 50));

      await notifier.deleteClient();

      verify(() => mockRepo.delete('c1')).called(1);
    });

    test('refresh -> recharge le client', () async {
      when(() => mockRepo.getById('c1'))
          .thenAnswer((_) async => _testClient());

      notifier = ClientDetailNotifier(
        repository: mockRepo,
        clientId: 'c1',
      );
      await Future<void>.delayed(const Duration(milliseconds: 50));

      when(() => mockRepo.getById('c1'))
          .thenAnswer((_) async => _testClient(nom: 'Refresh'));

      await notifier.refresh();

      expect(notifier.state.value!.nom, 'Refresh');
    });

    test('erreur reseau -> state error', () async {
      when(() => mockRepo.getById('c1'))
          .thenThrow(Exception('Network error'));

      notifier = ClientDetailNotifier(
        repository: mockRepo,
        clientId: 'c1',
      );
      await Future<void>.delayed(const Duration(milliseconds: 50));

      expect(notifier.state is AsyncError, isTrue);
    });
  });
}
