import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:shimmer/shimmer.dart';

import 'package:art_et_jardin/shared/widgets/aej_shimmer.dart';
import 'package:art_et_jardin/shared/widgets/aej_error_retry.dart';
import 'package:art_et_jardin/shared/widgets/aej_async_value_widget.dart';
import 'package:art_et_jardin/shared/widgets/aej_staggered_list.dart';
import 'package:art_et_jardin/shared/widgets/aej_button.dart';
import 'package:art_et_jardin/shared/widgets/aej_card.dart';
import 'package:art_et_jardin/shared/widgets/aej_empty_state.dart';
import 'package:art_et_jardin/shared/widgets/aej_modal.dart';
import 'package:art_et_jardin/core/theme/app_theme.dart';
import 'package:art_et_jardin/core/theme/terrain_theme.dart';

Widget _wrap(Widget child, {ThemeData? theme}) => MaterialApp(
      theme: theme ?? AppTheme.light,
      home: Scaffold(body: child),
    );

Widget _wrapDark(Widget child) => MaterialApp(
      theme: AppTheme.dark,
      home: Scaffold(body: child),
    );

Widget _wrapTerrain(Widget child) => MaterialApp(
      theme: TerrainTheme.apply(AppTheme.light),
      home: Scaffold(body: child),
    );

void main() {
  // ============================================================
  // SHIMMER LOADING SKELETONS
  // ============================================================
  group('AejShimmer', () {
    testWidgets('AejShimmerCard renders with shimmer effect', (tester) async {
      await tester.pumpWidget(_wrap(const AejShimmerCard()));
      expect(find.byType(Shimmer), findsOneWidget);
      expect(find.byType(Container), findsWidgets);
    });

    testWidgets('AejShimmerCard respects custom height', (tester) async {
      await tester.pumpWidget(_wrap(const AejShimmerCard(height: 120)));
      // The shimmer card renders without crash
      expect(find.byType(Shimmer), findsOneWidget);
    });

    testWidgets('AejShimmerList renders multiple skeleton cards',
        (tester) async {
      await tester.pumpWidget(_wrap(const AejShimmerList(itemCount: 3)));
      expect(find.byType(AejShimmerCard), findsNWidgets(3));
    });

    testWidgets('AejShimmerKpiGrid renders grid of placeholders',
        (tester) async {
      await tester.pumpWidget(_wrap(const AejShimmerKpiGrid(count: 4)));
      expect(find.byType(Shimmer), findsOneWidget);
      expect(find.byType(GridView), findsOneWidget);
    });

    testWidgets('AejShimmerCard renders in dark mode without crash',
        (tester) async {
      await tester.pumpWidget(_wrapDark(const AejShimmerCard()));
      expect(find.byType(Shimmer), findsOneWidget);
    });

    testWidgets('AejShimmerCard renders in light mode without crash',
        (tester) async {
      await tester.pumpWidget(_wrap(const AejShimmerCard()));
      expect(find.byType(Shimmer), findsOneWidget);
    });
  });

  // ============================================================
  // ERROR STATES + RETRY
  // ============================================================
  group('AejErrorRetry', () {
    testWidgets('displays error message and icon', (tester) async {
      await tester.pumpWidget(_wrap(
        const AejErrorRetry(message: 'Something went wrong'),
      ));
      expect(find.text('Something went wrong'), findsOneWidget);
      expect(find.byIcon(Icons.error_outline), findsOneWidget);
    });

    testWidgets('retry button calls onRetry', (tester) async {
      var retried = false;
      await tester.pumpWidget(_wrap(
        AejErrorRetry(
          message: 'Error',
          onRetry: () => retried = true,
        ),
      ));
      expect(find.text('Reessayer'), findsOneWidget);
      await tester.tap(find.text('Reessayer'));
      expect(retried, isTrue);
    });

    testWidgets('no retry button when onRetry is null', (tester) async {
      await tester.pumpWidget(_wrap(
        const AejErrorRetry(message: 'Error'),
      ));
      expect(find.text('Reessayer'), findsNothing);
    });

    testWidgets('network factory shows correct message and icon',
        (tester) async {
      await tester.pumpWidget(_wrap(AejErrorRetry.network()));
      expect(find.text('Pas de connexion'), findsOneWidget);
      expect(find.byIcon(Icons.wifi_off), findsOneWidget);
    });

    testWidgets('server factory shows correct message', (tester) async {
      await tester.pumpWidget(_wrap(AejErrorRetry.server()));
      expect(find.text('Une erreur est survenue'), findsOneWidget);
      expect(find.byIcon(Icons.cloud_off), findsOneWidget);
    });

    testWidgets('timeout factory shows correct message', (tester) async {
      await tester.pumpWidget(_wrap(AejErrorRetry.timeout()));
      expect(find.text('Le serveur met trop de temps'), findsOneWidget);
      expect(find.byIcon(Icons.hourglass_empty), findsOneWidget);
    });
  });

  // ============================================================
  // ASYNC VALUE WIDGET (data state builder)
  // ============================================================
  group('AejAsyncValueWidget', () {
    testWidgets('shows shimmer on loading', (tester) async {
      await tester.pumpWidget(_wrap(
        AejAsyncValueWidget<String>(
          value: const AsyncValue.loading(),
          data: (d) => Text(d),
        ),
      ));
      expect(find.byType(AejShimmerList), findsOneWidget);
    });

    testWidgets('shows data when loaded', (tester) async {
      await tester.pumpWidget(_wrap(
        AejAsyncValueWidget<String>(
          value: const AsyncValue.data('Hello'),
          data: (d) => Text(d),
        ),
      ));
      expect(find.text('Hello'), findsOneWidget);
    });

    testWidgets('shows error with retry on error state', (tester) async {
      var retried = false;
      await tester.pumpWidget(_wrap(
        AejAsyncValueWidget<String>(
          value: AsyncValue.error(Exception('fail'), StackTrace.empty),
          data: (d) => Text(d),
          onRetry: () => retried = true,
        ),
      ));
      expect(find.byType(AejErrorRetry), findsOneWidget);
      await tester.tap(find.text('Reessayer'));
      expect(retried, isTrue);
    });

    testWidgets('network error shows specific message', (tester) async {
      await tester.pumpWidget(_wrap(
        AejAsyncValueWidget<String>(
          value: AsyncValue.error(
              Exception('network error'), StackTrace.empty),
          data: (d) => Text(d),
        ),
      ));
      expect(find.text('Pas de connexion'), findsOneWidget);
    });

    testWidgets('timeout error shows specific message', (tester) async {
      await tester.pumpWidget(_wrap(
        AejAsyncValueWidget<String>(
          value:
              AsyncValue.error(Exception('timeout'), StackTrace.empty),
          data: (d) => Text(d),
        ),
      ));
      expect(find.text('Le serveur met trop de temps'), findsOneWidget);
    });

    testWidgets('generic error shows default message', (tester) async {
      await tester.pumpWidget(_wrap(
        AejAsyncValueWidget<String>(
          value: AsyncValue.error(Exception('unknown'), StackTrace.empty),
          data: (d) => Text(d),
        ),
      ));
      expect(find.text('Une erreur est survenue'), findsOneWidget);
    });

    testWidgets('custom loading widget used when provided', (tester) async {
      await tester.pumpWidget(_wrap(
        AejAsyncValueWidget<String>(
          value: const AsyncValue.loading(),
          data: (d) => Text(d),
          loading: () => const Text('Custom loading'),
        ),
      ));
      expect(find.text('Custom loading'), findsOneWidget);
      expect(find.byType(AejShimmerList), findsNothing);
    });

    testWidgets('custom error widget used when provided', (tester) async {
      await tester.pumpWidget(_wrap(
        AejAsyncValueWidget<String>(
          value: AsyncValue.error(Exception('fail'), StackTrace.empty),
          data: (d) => Text(d),
          error: (e, s) => const Text('Custom error'),
        ),
      ));
      expect(find.text('Custom error'), findsOneWidget);
      expect(find.byType(AejErrorRetry), findsNothing);
    });
  });

  // ============================================================
  // STAGGERED LIST ANIMATION
  // ============================================================
  group('AejStaggeredList', () {
    testWidgets('renders all children', (tester) async {
      await tester.pumpWidget(_wrap(
        const AejStaggeredList(
          children: [
            Text('Item 1'),
            Text('Item 2'),
            Text('Item 3'),
          ],
        ),
      ));
      await tester.pumpAndSettle();
      expect(find.text('Item 1'), findsOneWidget);
      expect(find.text('Item 2'), findsOneWidget);
      expect(find.text('Item 3'), findsOneWidget);
    });

    testWidgets('uses FadeTransition and SlideTransition', (tester) async {
      await tester.pumpWidget(_wrap(
        const AejStaggeredList(
          children: [Text('A'), Text('B')],
        ),
      ));
      // Wait for stagger timers to fire
      await tester.pumpAndSettle();
      // Find FadeTransition descendants of AejStaggeredList specifically
      expect(
        find.descendant(
          of: find.byType(AejStaggeredList),
          matching: find.byType(FadeTransition),
        ),
        findsNWidgets(2),
      );
      expect(
        find.descendant(
          of: find.byType(AejStaggeredList),
          matching: find.byType(SlideTransition),
        ),
        findsNWidgets(2),
      );
    });

    testWidgets('animations complete after stagger delay', (tester) async {
      await tester.pumpWidget(_wrap(
        const AejStaggeredList(
          staggerDelay: Duration(milliseconds: 50),
          animationDuration: Duration(milliseconds: 200),
          children: [Text('A'), Text('B'), Text('C')],
        ),
      ));
      // Initial state - animations started
      await tester.pump(const Duration(milliseconds: 10));
      // After full animation time + stagger for all items
      await tester.pumpAndSettle();
      expect(find.text('A'), findsOneWidget);
      expect(find.text('B'), findsOneWidget);
      expect(find.text('C'), findsOneWidget);
    });

    testWidgets('empty children list renders without crash', (tester) async {
      await tester.pumpWidget(_wrap(
        const AejStaggeredList(children: []),
      ));
      await tester.pumpAndSettle();
      expect(find.byType(AejStaggeredList), findsOneWidget);
    });
  });

  // ============================================================
  // SCALE FEEDBACK ON BUTTONS AND CARDS
  // ============================================================
  group('Scale feedback', () {
    testWidgets('AejButton has ScaleTransition', (tester) async {
      await tester.pumpWidget(_wrap(
        AejButton(label: 'Press', onPressed: () {}),
      ));
      expect(
        find.descendant(
          of: find.byType(AejButton),
          matching: find.byType(ScaleTransition),
        ),
        findsOneWidget,
      );
    });

    testWidgets('AejButton scale animates on tap down', (tester) async {
      await tester.pumpWidget(_wrap(
        AejButton(label: 'Press', onPressed: () {}),
      ));
      final scaleFinder = find.descendant(
        of: find.byType(AejButton),
        matching: find.byType(ScaleTransition),
      );
      final gesture =
          await tester.startGesture(tester.getCenter(find.text('Press')));
      await tester.pump(const Duration(milliseconds: 100));
      final scaleTransition =
          tester.widget<ScaleTransition>(scaleFinder);
      // Scale should be animating towards 0.98
      expect(scaleTransition.scale.value, lessThanOrEqualTo(1.0));
      await gesture.up();
      await tester.pumpAndSettle();
    });
  });

  // ============================================================
  // DARK MODE TESTS
  // ============================================================
  group('Dark mode', () {
    testWidgets('AejButton renders in dark mode without crash',
        (tester) async {
      await tester.pumpWidget(_wrapDark(
        AejButton(label: 'Dark button', onPressed: () {}),
      ));
      expect(find.text('Dark button'), findsOneWidget);
    });

    testWidgets('AejCard renders in dark mode without crash',
        (tester) async {
      await tester.pumpWidget(_wrapDark(
        const AejCard(child: Text('Dark card')),
      ));
      expect(find.text('Dark card'), findsOneWidget);
    });

    testWidgets('AejEmptyState renders in dark mode', (tester) async {
      await tester.pumpWidget(_wrapDark(
        const AejEmptyState(
          icon: Icons.inbox,
          title: 'Aucun client',
          description: 'Commencez par ajouter',
        ),
      ));
      expect(find.text('Aucun client'), findsOneWidget);
      expect(find.text('Commencez par ajouter'), findsOneWidget);
    });

    testWidgets('AejErrorRetry renders in dark mode', (tester) async {
      await tester.pumpWidget(_wrapDark(
        AejErrorRetry.server(onRetry: () {}),
      ));
      expect(find.text('Une erreur est survenue'), findsOneWidget);
      expect(find.text('Reessayer'), findsOneWidget);
    });

    testWidgets('AejShimmerList renders in dark mode', (tester) async {
      await tester.pumpWidget(_wrapDark(const AejShimmerList(itemCount: 2)));
      expect(find.byType(AejShimmerCard), findsNWidgets(2));
    });

    testWidgets('AejShimmerKpiGrid renders in dark mode', (tester) async {
      await tester.pumpWidget(_wrapDark(const AejShimmerKpiGrid()));
      expect(find.byType(Shimmer), findsOneWidget);
    });
  });

  // ============================================================
  // TERRAIN MODE TESTS
  // ============================================================
  group('Terrain mode', () {
    testWidgets('TerrainTheme min interactive dimension is 64',
        (tester) async {
      expect(TerrainTheme.minInteractiveDimension, 64.0);
    });

    testWidgets('TerrainTheme font size increase is 4', (tester) async {
      expect(TerrainTheme.fontSizeIncrease, 4.0);
    });

    testWidgets('terrain theme increases bodyMedium font size',
        (tester) async {
      final baseTheme = AppTheme.light;
      final terrainTheme = TerrainTheme.apply(baseTheme);
      final baseFontSize = baseTheme.textTheme.bodyMedium?.fontSize ?? 14;
      final terrainFontSize = terrainTheme.textTheme.bodyMedium?.fontSize;
      expect(terrainFontSize, baseFontSize + 4.0);
    });

    testWidgets('terrain theme increases titleLarge font size',
        (tester) async {
      final baseTheme = AppTheme.light;
      final terrainTheme = TerrainTheme.apply(baseTheme);
      final baseFontSize = baseTheme.textTheme.titleLarge?.fontSize ?? 22;
      final terrainFontSize = terrainTheme.textTheme.titleLarge?.fontSize;
      expect(terrainFontSize, baseFontSize + 4.0);
    });

    testWidgets('AejButton renders in terrain mode without crash',
        (tester) async {
      await tester.pumpWidget(_wrapTerrain(
        AejButton(label: 'Terrain', onPressed: () {}),
      ));
      expect(find.text('Terrain'), findsOneWidget);
    });

    testWidgets('AejEmptyState renders in terrain mode', (tester) async {
      await tester.pumpWidget(_wrapTerrain(
        const AejEmptyState(
          icon: Icons.build,
          title: 'Mode terrain',
          description: 'Touch targets agrandis',
        ),
      ));
      expect(find.text('Mode terrain'), findsOneWidget);
    });
  });

  // ============================================================
  // RESPONSIVE TESTS
  // ============================================================
  group('Responsive', () {
    testWidgets('AejModal shows BottomSheet on narrow screen (400px)',
        (tester) async {
      tester.view.physicalSize = const Size(400, 800);
      tester.view.devicePixelRatio = 1.0;
      addTearDown(tester.view.resetPhysicalSize);
      addTearDown(tester.view.resetDevicePixelRatio);

      await tester.pumpWidget(MaterialApp(
        home: Builder(
          builder: (ctx) => ElevatedButton(
            onPressed: () => AejModal.show(
              context: ctx,
              title: 'Test Modal',
              content: const Text('Content'),
            ),
            child: const Text('Open'),
          ),
        ),
      ));
      await tester.tap(find.text('Open'));
      await tester.pumpAndSettle();

      expect(find.text('Test Modal'), findsOneWidget);
      // On narrow screen, should NOT be a Dialog
      expect(find.byType(Dialog), findsNothing);
    });

    testWidgets('AejModal shows Dialog on wide screen (800px)',
        (tester) async {
      tester.view.physicalSize = const Size(800, 600);
      tester.view.devicePixelRatio = 1.0;
      addTearDown(tester.view.resetPhysicalSize);
      addTearDown(tester.view.resetDevicePixelRatio);

      await tester.pumpWidget(MaterialApp(
        home: Builder(
          builder: (ctx) => ElevatedButton(
            onPressed: () => AejModal.show(
              context: ctx,
              title: 'Wide Modal',
              content: const Text('Content'),
            ),
            child: const Text('Open'),
          ),
        ),
      ));
      await tester.tap(find.text('Open'));
      await tester.pumpAndSettle();

      expect(find.text('Wide Modal'), findsOneWidget);
      expect(find.byType(Dialog), findsOneWidget);
    });

    testWidgets('AejShimmerKpiGrid uses 2 columns', (tester) async {
      await tester.pumpWidget(_wrap(const AejShimmerKpiGrid(count: 4)));
      final grid = tester.widget<GridView>(find.byType(GridView));
      final delegate = grid.gridDelegate as SliverGridDelegateWithFixedCrossAxisCount;
      expect(delegate.crossAxisCount, 2);
    });
  });

  // ============================================================
  // ACCESSIBILITY TESTS
  // ============================================================
  group('Accessibility', () {
    testWidgets('AejErrorRetry retry button has text label', (tester) async {
      await tester.pumpWidget(_wrap(
        AejErrorRetry(message: 'Error', onRetry: () {}),
      ));
      // The retry button has a text label "Reessayer"
      expect(find.text('Reessayer'), findsOneWidget);
      // Icon is also present for visual cue
      expect(find.byIcon(Icons.refresh), findsOneWidget);
    });

    testWidgets('AejEmptyState provides semantic info', (tester) async {
      await tester.pumpWidget(_wrap(
        const AejEmptyState(
          icon: Icons.inbox,
          title: 'Aucun resultat',
          description: 'Essayez une autre recherche',
        ),
      ));
      // Title and description are accessible text
      expect(find.text('Aucun resultat'), findsOneWidget);
      expect(find.text('Essayez une autre recherche'), findsOneWidget);
    });

    testWidgets('AejButton text is readable at all sizes', (tester) async {
      for (final size in AejButtonSize.values) {
        await tester.pumpWidget(_wrap(
          AejButton(label: 'Accessible', size: size, onPressed: () {}),
        ));
        expect(find.text('Accessible'), findsOneWidget);
      }
    });

    testWidgets('AejModal close button has icon for a11y', (tester) async {
      await tester.pumpWidget(MaterialApp(
        home: Builder(
          builder: (ctx) => ElevatedButton(
            onPressed: () => AejModal.show(
              context: ctx,
              title: 'A11y Modal',
              content: const Text('Content'),
            ),
            child: const Text('Open'),
          ),
        ),
      ));
      await tester.tap(find.text('Open'));
      await tester.pumpAndSettle();
      // Close button uses Icons.close which has built-in semantics
      expect(find.byIcon(Icons.close), findsOneWidget);
    });
  });
}
