import 'package:flutter_test/flutter_test.dart';
import 'package:mocktail/mocktail.dart';

import 'package:art_et_jardin/domain/enums/absence_type.dart';
import 'package:art_et_jardin/domain/models/absence.dart';
import 'package:art_et_jardin/domain/models/daily_weather.dart';
import 'package:art_et_jardin/domain/models/intervention.dart';
import 'package:art_et_jardin/features/calendar/domain/absences_repository.dart';
import 'package:art_et_jardin/features/calendar/domain/weather_service.dart';
import 'package:art_et_jardin/features/calendar/presentation/providers/calendar_providers.dart';
import 'package:art_et_jardin/features/interventions/domain/interventions_repository.dart';

class MockInterventionsRepository extends Mock
    implements InterventionsRepository {}

class MockAbsencesRepository extends Mock implements AbsencesRepository {}

class MockWeatherService extends Mock implements WeatherService {}

Intervention _testIntervention({
  String id = 'i1',
  DateTime? date,
}) =>
    Intervention(
      id: id,
      chantierId: 'ch1',
      employeId: 'emp1',
      date: date ?? DateTime(2026, 2, 10),
      heureDebut: DateTime(2026, 2, 10, 8, 0),
      description: 'Tonte pelouse',
      createdAt: DateTime(2026, 1, 1),
      updatedAt: DateTime(2026, 1, 1),
    );

Absence _testAbsence({
  String id = 'abs1',
  String userId = 'user1',
  AbsenceType type = AbsenceType.conge,
  DateTime? dateDebut,
  DateTime? dateFin,
  bool validee = false,
}) =>
    Absence(
      id: id,
      userId: userId,
      dateDebut: dateDebut ?? DateTime(2026, 2, 10),
      dateFin: dateFin ?? DateTime(2026, 2, 12),
      type: type,
      validee: validee,
      createdAt: DateTime(2026, 1, 1),
      updatedAt: DateTime(2026, 1, 1),
    );

void main() {
  setUpAll(() {
    registerFallbackValue(DateTime(2026, 1, 1));
    registerFallbackValue(_testAbsence());
  });

  // ============== CalendarNotifier ==============
  group('CalendarNotifier', () {
    late MockInterventionsRepository mockInterventions;
    late MockAbsencesRepository mockAbsences;
    late CalendarNotifier notifier;

    setUp(() {
      mockInterventions = MockInterventionsRepository();
      mockAbsences = MockAbsencesRepository();
    });

    tearDown(() {
      notifier.dispose();
    });

    test('charge evenements par mois', () async {
      when(() => mockInterventions.getByDateRange(any(), any()))
          .thenAnswer((_) async => [_testIntervention()]);
      when(() => mockAbsences.getAll())
          .thenAnswer((_) async => [_testAbsence()]);

      notifier = CalendarNotifier(
        interventionsRepository: mockInterventions,
        absencesRepository: mockAbsences,
      );
      await Future<void>.delayed(const Duration(milliseconds: 50));

      expect(notifier.state.interventions.length, 1);
      expect(notifier.state.absences.length, 1);
      expect(notifier.state.isLoading, false);
    });

    test('interventions mappees aux bons jours', () async {
      final date = DateTime(2026, 2, 10);
      when(() => mockInterventions.getByDateRange(any(), any()))
          .thenAnswer((_) async => [
                _testIntervention(id: 'i1', date: date),
                _testIntervention(id: 'i2', date: DateTime(2026, 2, 15)),
              ]);
      when(() => mockAbsences.getAll()).thenAnswer((_) async => []);

      notifier = CalendarNotifier(
        interventionsRepository: mockInterventions,
        absencesRepository: mockAbsences,
      );
      await Future<void>.delayed(const Duration(milliseconds: 50));

      final forDay = notifier.interventionsForDay(date);
      expect(forDay.length, 1);
      expect(forDay.first.id, 'i1');
    });

    test('absences mappees aux bonnes periodes (multi-jours)', () async {
      when(() => mockInterventions.getByDateRange(any(), any()))
          .thenAnswer((_) async => []);
      when(() => mockAbsences.getAll()).thenAnswer((_) async => [
            _testAbsence(
              dateDebut: DateTime(2026, 2, 10),
              dateFin: DateTime(2026, 2, 12),
            ),
          ]);

      notifier = CalendarNotifier(
        interventionsRepository: mockInterventions,
        absencesRepository: mockAbsences,
      );
      await Future<void>.delayed(const Duration(milliseconds: 50));

      expect(notifier.absencesForDay(DateTime(2026, 2, 10)).length, 1);
      expect(notifier.absencesForDay(DateTime(2026, 2, 11)).length, 1);
      expect(notifier.absencesForDay(DateTime(2026, 2, 12)).length, 1);
      expect(notifier.absencesForDay(DateTime(2026, 2, 13)).length, 0);
    });

    test('pas d\'evenements -> jours vides', () async {
      when(() => mockInterventions.getByDateRange(any(), any()))
          .thenAnswer((_) async => []);
      when(() => mockAbsences.getAll()).thenAnswer((_) async => []);

      notifier = CalendarNotifier(
        interventionsRepository: mockInterventions,
        absencesRepository: mockAbsences,
      );
      await Future<void>.delayed(const Duration(milliseconds: 50));

      expect(notifier.eventsForDay(DateTime(2026, 2, 10)), 0);
    });

    test('combinaison interventions + absences meme jour', () async {
      final date = DateTime(2026, 2, 10);
      when(() => mockInterventions.getByDateRange(any(), any()))
          .thenAnswer((_) async => [_testIntervention(date: date)]);
      when(() => mockAbsences.getAll()).thenAnswer((_) async => [
            _testAbsence(dateDebut: date, dateFin: date),
          ]);

      notifier = CalendarNotifier(
        interventionsRepository: mockInterventions,
        absencesRepository: mockAbsences,
      );
      await Future<void>.delayed(const Duration(milliseconds: 50));

      expect(notifier.eventsForDay(date), 2);
    });

    test('navigation mois change -> charge nouveaux evenements', () async {
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

      // Verify getByDateRange was called with March dates
      final captured = verify(
        () => mockInterventions.getByDateRange(captureAny(), captureAny()),
      ).captured;
      // Last call should be for March
      final lastStart = captured[captured.length - 2] as DateTime;
      expect(lastStart.month, 3);
    });

    test('selectDay met a jour le selectedDay', () async {
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
    });
  });

  // ============== WeatherNotifier ==============
  group('WeatherNotifier', () {
    late MockWeatherService mockWeather;
    late WeatherNotifier notifier;

    setUp(() {
      mockWeather = MockWeatherService();
    });

    tearDown(() {
      notifier.dispose();
    });

    test('charge meteo 7 jours', () async {
      when(() => mockWeather.get7DayForecast(
            latitude: any(named: 'latitude'),
            longitude: any(named: 'longitude'),
          )).thenAnswer((_) async => [
            const DailyWeather(date: '2026-02-10', tempMax: 12, tempMin: 4),
            const DailyWeather(date: '2026-02-11', tempMax: 14, tempMin: 6),
          ]);

      notifier = WeatherNotifier(weatherService: mockWeather);
      await Future<void>.delayed(const Duration(milliseconds: 50));

      expect(notifier.state.hasValue, true);
      expect(notifier.state.value!.length, 2);
    });

    test('weatherForDate retourne la bonne meteo', () async {
      when(() => mockWeather.get7DayForecast(
            latitude: any(named: 'latitude'),
            longitude: any(named: 'longitude'),
          )).thenAnswer((_) async => [
            const DailyWeather(
                date: '2026-02-10', tempMax: 12, tempMin: 4, icon: '☀️'),
            const DailyWeather(
                date: '2026-02-11', tempMax: 14, tempMin: 6, icon: '🌧️'),
          ]);

      notifier = WeatherNotifier(weatherService: mockWeather);
      await Future<void>.delayed(const Duration(milliseconds: 50));

      final weather = notifier.weatherForDate('2026-02-10');
      expect(weather?.icon, '☀️');
      expect(weather?.tempMax, 12);
    });

    test('weatherForDate retourne null si date inconnue', () async {
      when(() => mockWeather.get7DayForecast(
            latitude: any(named: 'latitude'),
            longitude: any(named: 'longitude'),
          )).thenAnswer((_) async => [
            const DailyWeather(date: '2026-02-10', tempMax: 12, tempMin: 4),
          ]);

      notifier = WeatherNotifier(weatherService: mockWeather);
      await Future<void>.delayed(const Duration(milliseconds: 50));

      expect(notifier.weatherForDate('2099-01-01'), isNull);
    });
  });

  // ============== AbsencesNotifier ==============
  group('AbsencesNotifier', () {
    late MockAbsencesRepository mockRepo;
    late AbsencesNotifier notifier;

    setUp(() {
      mockRepo = MockAbsencesRepository();
    });

    tearDown(() {
      notifier.dispose();
    });

    test('charge mes absences (employe)', () async {
      when(() => mockRepo.getMyAbsences('user1'))
          .thenAnswer((_) async => [_testAbsence()]);

      notifier = AbsencesNotifier(
        repository: mockRepo,
        currentUserId: 'user1',
        isPatron: false,
      );
      await Future<void>.delayed(const Duration(milliseconds: 50));

      expect(notifier.state.myAbsences.length, 1);
      expect(notifier.state.pendingAbsences, isEmpty);
      expect(notifier.state.allAbsences, isEmpty);
    });

    test('patron charge les 3 listes', () async {
      when(() => mockRepo.getMyAbsences('patron1'))
          .thenAnswer((_) async => [_testAbsence()]);
      when(() => mockRepo.getPendingAbsences())
          .thenAnswer((_) async => [_testAbsence(validee: false)]);
      when(() => mockRepo.getAll())
          .thenAnswer((_) async => [_testAbsence(), _testAbsence(id: 'abs2')]);

      notifier = AbsencesNotifier(
        repository: mockRepo,
        currentUserId: 'patron1',
        isPatron: true,
      );
      await Future<void>.delayed(const Duration(milliseconds: 50));

      expect(notifier.state.myAbsences.length, 1);
      expect(notifier.state.pendingAbsences.length, 1);
      expect(notifier.state.allAbsences.length, 2);
    });

    test('calculateDays retourne le bon nombre', () async {
      when(() => mockRepo.getMyAbsences(any())).thenAnswer((_) async => []);

      notifier = AbsencesNotifier(
        repository: mockRepo,
        currentUserId: 'user1',
        isPatron: false,
      );

      final absence = _testAbsence(
        dateDebut: DateTime(2026, 3, 10),
        dateFin: DateTime(2026, 3, 14),
      );
      expect(notifier.calculateDays(absence), 5);
    });

    test('validateAbsence appelle repository et refresh', () async {
      when(() => mockRepo.getMyAbsences(any())).thenAnswer((_) async => []);
      when(() => mockRepo.validate('abs1'))
          .thenAnswer((_) async => _testAbsence(validee: true));

      notifier = AbsencesNotifier(
        repository: mockRepo,
        currentUserId: 'user1',
        isPatron: false,
      );
      await Future<void>.delayed(const Duration(milliseconds: 50));

      await notifier.validateAbsence('abs1');

      verify(() => mockRepo.validate('abs1')).called(1);
    });
  });
}
