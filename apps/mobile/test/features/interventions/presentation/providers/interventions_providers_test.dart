import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:mocktail/mocktail.dart';

import 'package:art_et_jardin/domain/models/intervention.dart';
import 'package:art_et_jardin/features/interventions/domain/interventions_repository.dart';
import 'package:art_et_jardin/features/interventions/presentation/providers/interventions_providers.dart';

class MockInterventionsRepository extends Mock
    implements InterventionsRepository {}

Intervention _testIntervention({
  String id = 'i1',
  String description = 'Tonte pelouse',
  DateTime? date,
}) =>
    Intervention(
      id: id,
      chantierId: 'ch1',
      employeId: 'emp1',
      date: date ?? DateTime(2026, 2, 10),
      heureDebut: DateTime(2026, 2, 10, 8, 0),
      description: description,
      createdAt: DateTime(2026, 1, 1),
      updatedAt: DateTime(2026, 1, 1),
    );

void main() {
  setUpAll(() {
    registerFallbackValue(_testIntervention());
    registerFallbackValue(DateTime(2026, 1, 1));
  });

  // ============== InterventionsWeekNotifier ==============
  group('InterventionsWeekNotifier', () {
    late MockInterventionsRepository mockRepo;
    late InterventionsWeekNotifier notifier;

    setUp(() {
      mockRepo = MockInterventionsRepository();
    });

    tearDown(() {
      notifier.dispose();
    });

    test('semaine affichee = lundi a dimanche', () async {
      when(() => mockRepo.getByDateRange(any(), any()))
          .thenAnswer((_) async => []);

      notifier = InterventionsWeekNotifier(repository: mockRepo);
      await Future<void>.delayed(const Duration(milliseconds: 50));

      expect(notifier.weekStart.weekday, DateTime.monday);
      // weekEnd is 6 days after weekStart = Sunday
      expect(notifier.weekEnd.weekday, DateTime.sunday);
    });

    test('navigation semaine suivante -> bonnes dates', () async {
      when(() => mockRepo.getByDateRange(any(), any()))
          .thenAnswer((_) async => []);

      notifier = InterventionsWeekNotifier(repository: mockRepo);
      await Future<void>.delayed(const Duration(milliseconds: 50));

      final initialStart = notifier.weekStart;
      notifier.nextWeek();
      await Future<void>.delayed(const Duration(milliseconds: 50));

      expect(notifier.weekStart,
          initialStart.add(const Duration(days: 7)));
    });

    test('navigation semaine precedente -> bonnes dates', () async {
      when(() => mockRepo.getByDateRange(any(), any()))
          .thenAnswer((_) async => []);

      notifier = InterventionsWeekNotifier(repository: mockRepo);
      await Future<void>.delayed(const Duration(milliseconds: 50));

      final initialStart = notifier.weekStart;
      notifier.previousWeek();
      await Future<void>.delayed(const Duration(milliseconds: 50));

      expect(notifier.weekStart,
          initialStart.subtract(const Duration(days: 7)));
    });

    test('interventions du jour affichees dans la bonne colonne', () async {
      final monday = DateTime(2026, 2, 9); // A Monday
      when(() => mockRepo.getByDateRange(any(), any())).thenAnswer(
          (_) async => [
                _testIntervention(id: 'i1', date: monday),
                _testIntervention(
                    id: 'i2',
                    date: monday.add(const Duration(days: 2))),
              ]);

      notifier = InterventionsWeekNotifier(repository: mockRepo);
      await Future<void>.delayed(const Duration(milliseconds: 50));

      final mondayInterventions = notifier.interventionsForDay(monday);
      final wednesdayInterventions = notifier
          .interventionsForDay(monday.add(const Duration(days: 2)));
      final tuesdayInterventions = notifier
          .interventionsForDay(monday.add(const Duration(days: 1)));

      expect(mondayInterventions, hasLength(1));
      expect(wednesdayInterventions, hasLength(1));
      expect(tuesdayInterventions, isEmpty);
    });

    test('semaine sans intervention -> state data vide', () async {
      when(() => mockRepo.getByDateRange(any(), any()))
          .thenAnswer((_) async => []);

      notifier = InterventionsWeekNotifier(repository: mockRepo);
      await Future<void>.delayed(const Duration(milliseconds: 50));

      expect(notifier.state.hasValue, isTrue);
      expect(notifier.state.value, isEmpty);
    });

    test('erreur -> state error', () async {
      when(() => mockRepo.getByDateRange(any(), any()))
          .thenThrow(Exception('Network error'));

      notifier = InterventionsWeekNotifier(repository: mockRepo);
      await Future<void>.delayed(const Duration(milliseconds: 50));

      expect(notifier.state is AsyncError, isTrue);
    });

    test('ajout intervention -> liste mise a jour', () async {
      when(() => mockRepo.getByDateRange(any(), any()))
          .thenAnswer((_) async => [_testIntervention()]);
      when(() => mockRepo.create(any()))
          .thenAnswer((_) async => _testIntervention(id: 'i2'));

      notifier = InterventionsWeekNotifier(repository: mockRepo);
      await Future<void>.delayed(const Duration(milliseconds: 50));
      expect(notifier.state.value, hasLength(1));

      when(() => mockRepo.getByDateRange(any(), any())).thenAnswer(
          (_) async =>
              [_testIntervention(), _testIntervention(id: 'i2')]);

      await notifier.addIntervention(_testIntervention(id: ''));
      expect(notifier.state.value, hasLength(2));
    });

    test('refresh -> recharge la semaine', () async {
      when(() => mockRepo.getByDateRange(any(), any()))
          .thenAnswer((_) async => [_testIntervention()]);

      notifier = InterventionsWeekNotifier(repository: mockRepo);
      await Future<void>.delayed(const Duration(milliseconds: 50));

      when(() => mockRepo.getByDateRange(any(), any())).thenAnswer(
          (_) async =>
              [_testIntervention(), _testIntervention(id: 'i2')]);

      await notifier.refresh();
      expect(notifier.state.value, hasLength(2));
    });
  });

  // ============== InterventionDetailNotifier ==============
  group('InterventionDetailNotifier', () {
    late MockInterventionsRepository mockRepo;
    late InterventionDetailNotifier notifier;

    setUp(() {
      mockRepo = MockInterventionsRepository();
    });

    tearDown(() {
      notifier.dispose();
    });

    test('chargement par ID -> data avec intervention', () async {
      when(() => mockRepo.getById('i1'))
          .thenAnswer((_) async => _testIntervention());

      notifier = InterventionDetailNotifier(
        repository: mockRepo,
        interventionId: 'i1',
      );
      await Future<void>.delayed(const Duration(milliseconds: 50));

      expect(notifier.state.hasValue, isTrue);
      expect(notifier.state.value!.description, 'Tonte pelouse');
    });

    test('intervention inexistante -> erreur', () async {
      when(() => mockRepo.getById('nonexistent'))
          .thenThrow(Exception('Intervention nonexistent not found'));

      notifier = InterventionDetailNotifier(
        repository: mockRepo,
        interventionId: 'nonexistent',
      );
      await Future<void>.delayed(const Duration(milliseconds: 50));

      expect(notifier.state is AsyncError, isTrue);
    });

    test('update intervention -> data mise a jour', () async {
      when(() => mockRepo.getById('i1'))
          .thenAnswer((_) async => _testIntervention());
      when(() => mockRepo.update(any()))
          .thenAnswer((_) async => _testIntervention(description: 'Modifie'));

      notifier = InterventionDetailNotifier(
        repository: mockRepo,
        interventionId: 'i1',
      );
      await Future<void>.delayed(const Duration(milliseconds: 50));

      await notifier.updateIntervention(
          _testIntervention(description: 'Modifie'));

      expect(notifier.state.value!.description, 'Modifie');
    });

    test('delete intervention -> appel repository', () async {
      when(() => mockRepo.getById('i1'))
          .thenAnswer((_) async => _testIntervention());
      when(() => mockRepo.delete('i1')).thenAnswer((_) async {});

      notifier = InterventionDetailNotifier(
        repository: mockRepo,
        interventionId: 'i1',
      );
      await Future<void>.delayed(const Duration(milliseconds: 50));

      await notifier.deleteIntervention();

      verify(() => mockRepo.delete('i1')).called(1);
    });

    test('refresh -> recharge intervention', () async {
      when(() => mockRepo.getById('i1'))
          .thenAnswer((_) async => _testIntervention());

      notifier = InterventionDetailNotifier(
        repository: mockRepo,
        interventionId: 'i1',
      );
      await Future<void>.delayed(const Duration(milliseconds: 50));

      when(() => mockRepo.getById('i1'))
          .thenAnswer((_) async => _testIntervention(description: 'Refresh'));

      await notifier.refresh();
      expect(notifier.state.value!.description, 'Refresh');
    });

    test('erreur reseau -> state error', () async {
      when(() => mockRepo.getById('i1'))
          .thenThrow(Exception('Network error'));

      notifier = InterventionDetailNotifier(
        repository: mockRepo,
        interventionId: 'i1',
      );
      await Future<void>.delayed(const Duration(milliseconds: 50));

      expect(notifier.state is AsyncError, isTrue);
    });
  });
}
