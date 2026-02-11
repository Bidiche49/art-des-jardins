import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_test/flutter_test.dart';

import 'package:art_et_jardin/domain/enums/absence_type.dart';
import 'package:art_et_jardin/domain/models/absence.dart';
import 'package:art_et_jardin/domain/models/daily_weather.dart';
import 'package:art_et_jardin/features/calendar/presentation/widgets/absence_card.dart';
import 'package:art_et_jardin/features/calendar/presentation/widgets/weather_widget.dart';

Widget _wrapWithProviders(Widget child, {List<Override> overrides = const []}) {
  return ProviderScope(
    overrides: overrides,
    child: MaterialApp(
      home: Scaffold(body: child),
    ),
  );
}

Absence _testAbsence({
  String id = 'abs1',
  AbsenceType type = AbsenceType.conge,
  bool validee = false,
  DateTime? dateDebut,
  DateTime? dateFin,
  String? motif,
}) =>
    Absence(
      id: id,
      userId: 'user1',
      dateDebut: dateDebut ?? DateTime(2026, 3, 10),
      dateFin: dateFin ?? DateTime(2026, 3, 14),
      type: type,
      motif: motif,
      validee: validee,
      createdAt: DateTime(2026, 1, 1),
      updatedAt: DateTime(2026, 1, 1),
    );

void main() {
  // ============== AbsenceCard ==============
  group('AbsenceCard', () {
    testWidgets('affiche type et dates', (tester) async {
      await tester.pumpWidget(_wrapWithProviders(
        AbsenceCard(absence: _testAbsence(type: AbsenceType.conge)),
      ));

      expect(find.text('Congé'), findsOneWidget);
      expect(find.text('10/03/2026 - 14/03/2026'), findsOneWidget);
      expect(find.text('5 jours'), findsOneWidget);
    });

    testWidgets('affiche badge "En attente" si non validee', (tester) async {
      await tester.pumpWidget(_wrapWithProviders(
        AbsenceCard(absence: _testAbsence(validee: false)),
      ));

      expect(find.text('En attente'), findsOneWidget);
    });

    testWidgets('affiche badge "Validee" si validee', (tester) async {
      await tester.pumpWidget(_wrapWithProviders(
        AbsenceCard(absence: _testAbsence(validee: true)),
      ));

      expect(find.text('Validee'), findsOneWidget);
    });

    testWidgets('affiche motif si present', (tester) async {
      await tester.pumpWidget(_wrapWithProviders(
        AbsenceCard(absence: _testAbsence(motif: 'Vacances famille')),
      ));

      expect(find.text('Vacances famille'), findsOneWidget);
    });

    testWidgets('boutons Valider/Refuser visibles quand showActions=true',
        (tester) async {
      await tester.pumpWidget(_wrapWithProviders(
        AbsenceCard(
          absence: _testAbsence(validee: false),
          showActions: true,
          onValidate: () {},
          onRefuse: () {},
        ),
      ));

      expect(find.text('Valider'), findsOneWidget);
      expect(find.text('Refuser'), findsOneWidget);
    });

    testWidgets('pas de boutons quand showActions=false', (tester) async {
      await tester.pumpWidget(_wrapWithProviders(
        AbsenceCard(absence: _testAbsence(validee: false)),
      ));

      expect(find.text('Valider'), findsNothing);
      expect(find.text('Refuser'), findsNothing);
    });

    testWidgets('pas de boutons pour absence deja validee', (tester) async {
      await tester.pumpWidget(_wrapWithProviders(
        AbsenceCard(
          absence: _testAbsence(validee: true),
          showActions: true,
        ),
      ));

      expect(find.text('Valider'), findsNothing);
      expect(find.text('Refuser'), findsNothing);
    });

    testWidgets('1 jour affiche "1 jour" sans s', (tester) async {
      await tester.pumpWidget(_wrapWithProviders(
        AbsenceCard(
          absence: _testAbsence(
            dateDebut: DateTime(2026, 3, 10),
            dateFin: DateTime(2026, 3, 10),
          ),
        ),
      ));

      expect(find.text('1 jour'), findsOneWidget);
    });
  });

  // ============== WeatherDayCard ==============
  group('WeatherDayCard', () {
    testWidgets('affiche icone et temperatures', (tester) async {
      await tester.pumpWidget(_wrapWithProviders(
        const WeatherDayCard(
          weather: DailyWeather(
            date: '2026-02-10',
            tempMax: 14,
            tempMin: 6,
            icon: '☀️',
            description: 'Ensoleillé',
          ),
        ),
      ));

      expect(find.text('☀️'), findsOneWidget);
      expect(find.text('14°'), findsOneWidget);
      expect(find.text('6°'), findsOneWidget);
      expect(find.text('Mar'), findsOneWidget);
    });

    testWidgets('precipitation elevee -> border bleue', (tester) async {
      await tester.pumpWidget(_wrapWithProviders(
        const WeatherDayCard(
          weather: DailyWeather(
            date: '2026-02-10',
            tempMax: 10,
            tempMin: 4,
            precipitation: 12,
            icon: '🌧️',
          ),
        ),
      ));

      // Should have blue tinted background
      final container = tester.widget<Container>(find.byType(Container).first);
      final decoration = container.decoration as BoxDecoration;
      expect(decoration.border, isNotNull);
    });
  });

  // ============== WeatherAlertBadge ==============
  group('WeatherAlertBadge', () {
    testWidgets('visible quand precipitation > 5mm', (tester) async {
      await tester.pumpWidget(_wrapWithProviders(
        const WeatherAlertBadge(
          weather: DailyWeather(
            date: '2026-02-10',
            tempMax: 10,
            tempMin: 4,
            precipitation: 8,
          ),
        ),
      ));

      expect(find.text('8mm'), findsOneWidget);
    });

    testWidgets('invisible quand precipitation <= 5mm', (tester) async {
      await tester.pumpWidget(_wrapWithProviders(
        const WeatherAlertBadge(
          weather: DailyWeather(
            date: '2026-02-10',
            tempMax: 10,
            tempMin: 4,
            precipitation: 2,
          ),
        ),
      ));

      expect(find.byType(WeatherAlertBadge), findsOneWidget);
      expect(find.text('2mm'), findsNothing);
    });
  });
}
