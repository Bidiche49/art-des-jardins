import 'package:flutter_test/flutter_test.dart';
import 'package:mocktail/mocktail.dart';

import 'package:art_et_jardin/domain/enums/absence_type.dart';
import 'package:art_et_jardin/domain/models/intervention.dart';
import 'package:art_et_jardin/domain/models/absence.dart';
import 'package:art_et_jardin/features/calendar/presentation/providers/calendar_providers.dart';
import 'package:art_et_jardin/features/interventions/domain/interventions_repository.dart';
import 'package:art_et_jardin/features/calendar/domain/absences_repository.dart';

class MockInterventionsRepository extends Mock
    implements InterventionsRepository {}

class MockAbsencesRepository extends Mock implements AbsencesRepository {}

Intervention _testIntervention({
  String id = 'i1',
  DateTime? date,
}) =>
    Intervention(
      id: id,
      chantierId: 'ch1',
      employeId: 'e1',
      date: date ?? DateTime(2026, 2, 12),
      heureDebut: DateTime(2026, 2, 12, 8, 0),
      heureFin: DateTime(2026, 2, 12, 17, 0),
      description: 'Tonte pelouse',
      valide: false,
      createdAt: DateTime(2026, 1, 1),
      updatedAt: DateTime(2026, 1, 1),
    );

Absence _testAbsence({
  String id = 'a1',
  DateTime? dateDebut,
  DateTime? dateFin,
}) =>
    Absence(
      id: id,
      userId: 'u1',
      type: AbsenceType.conge,
      dateDebut: dateDebut ?? DateTime(2026, 2, 14),
      dateFin: dateFin ?? DateTime(2026, 2, 14),
      createdAt: DateTime(2026, 1, 1),
      updatedAt: DateTime(2026, 1, 1),
    );

void main() {
  late MockInterventionsRepository mockInterventions;
  late MockAbsencesRepository mockAbsences;
  late CalendarNotifier notifier;

  setUp(() {
    mockInterventions = MockInterventionsRepository();
    mockAbsences = MockAbsencesRepository();
    // Register fallback for any() matchers
    registerFallbackValue(DateTime(2026, 1, 1));
  });

  group('Calendar Flow', () {
    test('loadMonth fetches interventions and absences', () async {
      when(() => mockInterventions.getByDateRange(any(), any()))
          .thenAnswer((_) async => [_testIntervention()]);
      when(() => mockAbsences.getAll())
          .thenAnswer((_) async => [_testAbsence()]);

      notifier = CalendarNotifier(
        interventionsRepository: mockInterventions,
        absencesRepository: mockAbsences,
      );
      // Constructor calls loadMonth, wait for it
      await Future<void>.delayed(const Duration(milliseconds: 100));

      expect(notifier.state.interventions, hasLength(1));
      expect(notifier.state.absences, hasLength(1));
      notifier.dispose();
    });

    test('selectDay updates selectedDay', () async {
      when(() => mockInterventions.getByDateRange(any(), any()))
          .thenAnswer((_) async => []);
      when(() => mockAbsences.getAll()).thenAnswer((_) async => []);

      notifier = CalendarNotifier(
        interventionsRepository: mockInterventions,
        absencesRepository: mockAbsences,
      );
      await Future<void>.delayed(const Duration(milliseconds: 50));

      notifier.selectDay(DateTime(2026, 2, 15));
      expect(notifier.state.selectedDay, DateTime(2026, 2, 15));
      notifier.dispose();
    });

    test('interventionsForDay filters by date', () async {
      when(() => mockInterventions.getByDateRange(any(), any()))
          .thenAnswer((_) async => [
                _testIntervention(id: 'i1', date: DateTime(2026, 2, 12)),
                _testIntervention(id: 'i2', date: DateTime(2026, 2, 13)),
              ]);
      when(() => mockAbsences.getAll()).thenAnswer((_) async => []);

      notifier = CalendarNotifier(
        interventionsRepository: mockInterventions,
        absencesRepository: mockAbsences,
      );
      await Future<void>.delayed(const Duration(milliseconds: 100));

      final dayInterventions =
          notifier.interventionsForDay(DateTime(2026, 2, 12));

      expect(dayInterventions, hasLength(1));
      expect(dayInterventions.first.id, 'i1');
      notifier.dispose();
    });

    test('changeFocusedDay updates focusedDay', () async {
      when(() => mockInterventions.getByDateRange(any(), any()))
          .thenAnswer((_) async => []);
      when(() => mockAbsences.getAll()).thenAnswer((_) async => []);

      notifier = CalendarNotifier(
        interventionsRepository: mockInterventions,
        absencesRepository: mockAbsences,
      );
      await Future<void>.delayed(const Duration(milliseconds: 50));

      notifier.changeFocusedDay(DateTime(2026, 3, 1));
      await Future<void>.delayed(const Duration(milliseconds: 50));

      expect(notifier.state.focusedDay, DateTime(2026, 3, 1));
      notifier.dispose();
    });

    test('error during load sets error state', () async {
      when(() => mockInterventions.getByDateRange(any(), any()))
          .thenThrow(Exception('Network error'));
      when(() => mockAbsences.getAll()).thenAnswer((_) async => []);

      notifier = CalendarNotifier(
        interventionsRepository: mockInterventions,
        absencesRepository: mockAbsences,
      );
      await Future<void>.delayed(const Duration(milliseconds: 100));

      expect(notifier.state.error, isNotNull);
      notifier.dispose();
    });

    test('eventsForDay counts interventions + absences', () async {
      when(() => mockInterventions.getByDateRange(any(), any()))
          .thenAnswer((_) async => [
                _testIntervention(id: 'i1', date: DateTime(2026, 2, 14)),
              ]);
      when(() => mockAbsences.getAll()).thenAnswer((_) async => [
            _testAbsence(
              dateDebut: DateTime(2026, 2, 14),
              dateFin: DateTime(2026, 2, 14),
            ),
          ]);

      notifier = CalendarNotifier(
        interventionsRepository: mockInterventions,
        absencesRepository: mockAbsences,
      );
      await Future<void>.delayed(const Duration(milliseconds: 100));

      final count = notifier.eventsForDay(DateTime(2026, 2, 14));
      expect(count, 2); // 1 intervention + 1 absence
      notifier.dispose();
    });
  });
}
