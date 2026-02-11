import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

import 'package:art_et_jardin/domain/enums/photo_type.dart';
import 'package:art_et_jardin/features/interventions/presentation/widgets/photo_capture.dart';
import 'package:art_et_jardin/features/interventions/presentation/widgets/photo_compare.dart';
import 'package:art_et_jardin/features/interventions/presentation/widgets/photo_gallery.dart';
import 'package:art_et_jardin/features/interventions/presentation/widgets/week_navigator.dart';

Widget _wrap(Widget child) => MaterialApp(home: Scaffold(body: child));

void main() {
  group('PhotoCapture', () {
    testWidgets('selecteur type Avant/Pendant/Apres avec couleurs',
        (tester) async {
      PhotoType? captured;
      await tester.pumpWidget(_wrap(
        PhotoCapture(onCapture: (type) => captured = type),
      ));

      expect(find.text('Avant'), findsOneWidget);
      expect(find.text('Pendant'), findsOneWidget);
      expect(find.text('Après'), findsOneWidget);

      await tester.tap(find.text('Avant'));
      expect(captured, PhotoType.before);

      await tester.tap(find.text('Pendant'));
      expect(captured, PhotoType.during);

      await tester.tap(find.text('Après'));
      expect(captured, PhotoType.after);
    });

    testWidgets('icone camera visible', (tester) async {
      await tester.pumpWidget(_wrap(
        PhotoCapture(onCapture: (_) {}),
      ));

      expect(find.byIcon(Icons.camera_alt), findsNWidgets(3));
    });
  });

  group('PhotoGallery', () {
    testWidgets('empty state quand pas de photos', (tester) async {
      await tester.pumpWidget(_wrap(
        const PhotoGallery(photoUrls: []),
      ));

      expect(find.text('Aucune photo'), findsOneWidget);
    });

    testWidgets('GridView avec photos', (tester) async {
      await tester.pumpWidget(_wrap(
        const PhotoGallery(
          photoUrls: [
            'https://example.com/photo1.jpg',
            'https://example.com/photo2.jpg',
          ],
        ),
      ));

      expect(find.byType(GridView), findsOneWidget);
    });

    testWidgets('filtre par type visible quand photoTypes fourni',
        (tester) async {
      await tester.pumpWidget(_wrap(
        const PhotoGallery(
          photoUrls: [
            'https://example.com/photo1.jpg',
            'https://example.com/photo2.jpg',
          ],
          photoTypes: {
            'https://example.com/photo1.jpg': PhotoType.before,
            'https://example.com/photo2.jpg': PhotoType.after,
          },
        ),
      ));

      expect(find.text('Toutes'), findsOneWidget);
      expect(find.text('Avant'), findsOneWidget);
      expect(find.text('Après'), findsOneWidget);
    });
  });

  group('PhotoCompare', () {
    testWidgets('side-by-side avant/apres labels', (tester) async {
      await tester.pumpWidget(_wrap(
        const PhotoCompare(
          beforeUrl: 'https://example.com/before.jpg',
          afterUrl: 'https://example.com/after.jpg',
        ),
      ));

      expect(find.text('Avant'), findsOneWidget);
      expect(find.text('Apres'), findsOneWidget);
      expect(find.text('Comparaison avant/apres'), findsOneWidget);
    });
  });

  group('WeekNavigator', () {
    testWidgets('affiche les dates et boutons navigation', (tester) async {
      await tester.pumpWidget(_wrap(
        WeekNavigator(
          weekStart: DateTime(2026, 2, 9), // Monday
          onPrevious: () {},
          onNext: () {},
          onToday: () {},
        ),
      ));

      expect(find.text('09/02 - 15/02'), findsOneWidget);
      expect(find.byIcon(Icons.chevron_left), findsOneWidget);
      expect(find.byIcon(Icons.chevron_right), findsOneWidget);
    });

    testWidgets('tap precedent appelle callback', (tester) async {
      var called = false;
      await tester.pumpWidget(_wrap(
        WeekNavigator(
          weekStart: DateTime(2026, 2, 9),
          onPrevious: () => called = true,
          onNext: () {},
          onToday: () {},
        ),
      ));

      await tester.tap(find.byIcon(Icons.chevron_left));
      expect(called, isTrue);
    });

    testWidgets('tap suivant appelle callback', (tester) async {
      var called = false;
      await tester.pumpWidget(_wrap(
        WeekNavigator(
          weekStart: DateTime(2026, 2, 9),
          onPrevious: () {},
          onNext: () => called = true,
          onToday: () {},
        ),
      ));

      await tester.tap(find.byIcon(Icons.chevron_right));
      expect(called, isTrue);
    });
  });
}
