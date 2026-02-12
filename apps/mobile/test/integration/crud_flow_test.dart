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
  String ville = 'Angers',
}) =>
    Client(
      id: id,
      type: type,
      nom: nom,
      email: email,
      telephone: '0612345678',
      adresse: '1 rue Test',
      codePostal: '49000',
      ville: ville,
      tags: [],
      createdAt: DateTime(2026, 1, 1),
      updatedAt: DateTime(2026, 1, 1),
    );

void main() {
  late MockClientsRepository mockRepo;

  setUpAll(() {
    registerFallbackValue(_testClient());
  });

  setUp(() {
    mockRepo = MockClientsRepository();
  });

  group('CRUD Flow - Clients', () {
    test('load clients -> data available', () async {
      when(() => mockRepo.getAll()).thenAnswer((_) async => [
            _testClient(id: 'c1', nom: 'Dupont'),
            _testClient(id: 'c2', nom: 'Martin'),
            _testClient(id: 'c3', nom: 'Durand'),
          ]);

      final notifier = ClientsListNotifier(repository: mockRepo);
      await Future<void>.delayed(const Duration(milliseconds: 50));

      expect(notifier.state.hasValue, isTrue);
      expect(notifier.state.value, hasLength(3));
      notifier.dispose();
    });

    test('filter by type -> correct results', () async {
      when(() => mockRepo.getAll()).thenAnswer((_) async => [
            _testClient(id: 'c1', type: ClientType.particulier),
            _testClient(id: 'c2', type: ClientType.professionnel),
            _testClient(id: 'c3', type: ClientType.particulier),
          ]);

      final notifier = ClientsListNotifier(repository: mockRepo);
      await Future<void>.delayed(const Duration(milliseconds: 50));

      notifier.filterByType(ClientType.particulier);

      expect(notifier.state.value, hasLength(2));
      notifier.dispose();
    });

    test('search by name -> matching results', () async {
      when(() => mockRepo.getAll()).thenAnswer((_) async => [
            _testClient(id: 'c1', nom: 'Dupont', email: 'jean@test.fr'),
            _testClient(id: 'c2', nom: 'Martin', email: 'paul@test.fr'),
            _testClient(id: 'c3', nom: 'Durand', email: 'marc@test.fr'),
          ]);

      final notifier = ClientsListNotifier(repository: mockRepo);
      await Future<void>.delayed(const Duration(milliseconds: 50));

      notifier.search('Du');

      expect(notifier.state.value, hasLength(2)); // Dupont + Durand
      notifier.dispose();
    });

    test('clear filter -> all results', () async {
      when(() => mockRepo.getAll()).thenAnswer((_) async => [
            _testClient(id: 'c1', type: ClientType.particulier),
            _testClient(id: 'c2', type: ClientType.professionnel),
          ]);

      final notifier = ClientsListNotifier(repository: mockRepo);
      await Future<void>.delayed(const Duration(milliseconds: 50));

      notifier.filterByType(ClientType.particulier);
      expect(notifier.state.value, hasLength(1));

      notifier.filterByType(null);
      expect(notifier.state.value, hasLength(2));
      notifier.dispose();
    });

    test('refresh reloads data', () async {
      when(() => mockRepo.getAll())
          .thenAnswer((_) async => [_testClient(id: 'c1')]);

      final notifier = ClientsListNotifier(repository: mockRepo);
      await Future<void>.delayed(const Duration(milliseconds: 50));

      when(() => mockRepo.getAll())
          .thenAnswer((_) async => [_testClient(id: 'c1'), _testClient(id: 'c2')]);

      await notifier.refresh();

      expect(notifier.state.value, hasLength(2));
      notifier.dispose();
    });

    test('error during load -> error state', () async {
      when(() => mockRepo.getAll()).thenThrow(Exception('Network error'));

      final notifier = ClientsListNotifier(repository: mockRepo);
      await Future<void>.delayed(const Duration(milliseconds: 50));

      expect(notifier.state.error, isNotNull);
      notifier.dispose();
    });

    test('client detail load by ID', () async {
      when(() => mockRepo.getById('c1'))
          .thenAnswer((_) async => _testClient(id: 'c1', nom: 'Dupont'));

      final notifier = ClientDetailNotifier(repository: mockRepo, clientId: 'c1');
      await Future<void>.delayed(const Duration(milliseconds: 50));

      expect(notifier.state.hasValue, isTrue);
      expect(notifier.state.value!.nom, 'Dupont');
      notifier.dispose();
    });

    test('combined filter + search', () async {
      when(() => mockRepo.getAll()).thenAnswer((_) async => [
            _testClient(id: 'c1', nom: 'Dupont', type: ClientType.particulier, email: 'jean@test.fr'),
            _testClient(id: 'c2', nom: 'Martin SA', type: ClientType.professionnel, email: 'paul@test.fr'),
            _testClient(id: 'c3', nom: 'Durand', type: ClientType.particulier, email: 'marc@test.fr'),
            _testClient(id: 'c4', nom: 'Dupont SARL', type: ClientType.professionnel, email: 'sarl@test.fr'),
          ]);

      final notifier = ClientsListNotifier(repository: mockRepo);
      await Future<void>.delayed(const Duration(milliseconds: 50));

      notifier.filterByType(ClientType.professionnel);
      notifier.search('Dupont');

      expect(notifier.state.value, hasLength(1));
      expect(notifier.state.value!.first.nom, 'Dupont SARL');
      notifier.dispose();
    });
  });
}
