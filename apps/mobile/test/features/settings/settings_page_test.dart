import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:mocktail/mocktail.dart';

import 'package:art_et_jardin/features/settings/domain/settings_repository.dart';
import 'package:art_et_jardin/features/settings/data/settings_repository_impl.dart';
import 'package:art_et_jardin/features/settings/presentation/pages/settings_page.dart';
import 'package:art_et_jardin/services/sync/sync_providers.dart';
import 'package:art_et_jardin/services/sync/sync_service.dart';

class MockSettingsRepository extends Mock implements SettingsRepository {}

class MockSyncService extends Mock implements SyncService {}

void main() {
  late MockSettingsRepository mockRepository;
  late MockSyncService mockSyncService;

  setUp(() {
    mockRepository = MockSettingsRepository();
    mockSyncService = MockSyncService();

    // Default stubs
    when(() => mockRepository.getThemeMode()).thenReturn(ThemeMode.system);
    when(() => mockRepository.getTerrainMode()).thenReturn(false);
    when(() => mockRepository.getBiometricConfigured()).thenReturn(false);
    when(() => mockRepository.getNotificationsEnabled()).thenReturn(true);
    when(() => mockRepository.getLastSync()).thenReturn(null);
  });

  Widget buildTestWidget() {
    return ProviderScope(
      overrides: [
        settingsRepositoryProvider.overrideWithValue(mockRepository),
        syncServiceProvider.overrideWithValue(mockSyncService),
        pendingSyncCountProvider.overrideWith(
          (ref) => Stream.value(0),
        ),
      ],
      child: const MaterialApp(
        home: Scaffold(body: SettingsPage()),
      ),
    );
  }

  group('SettingsPage', () {
    testWidgets('renders 3 theme buttons (Clair/Sombre/Systeme)',
        (tester) async {
      await tester.pumpWidget(buildTestWidget());
      await tester.pumpAndSettle();

      expect(find.text('Clair'), findsOneWidget);
      expect(find.text('Sombre'), findsOneWidget);
      expect(find.text('Systeme'), findsOneWidget);
    });

    testWidgets('renders terrain mode toggle', (tester) async {
      await tester.pumpWidget(buildTestWidget());
      await tester.pumpAndSettle();

      expect(find.text('Mode terrain'), findsAtLeast(1));
      expect(find.byIcon(Icons.terrain), findsOneWidget);
    });

    testWidgets('renders biometric section', (tester) async {
      await tester.pumpWidget(buildTestWidget());
      await tester.pumpAndSettle();

      expect(find.text('Connexion biometrique'), findsOneWidget);
      expect(find.byIcon(Icons.fingerprint), findsOneWidget);
    });

    testWidgets('renders sync section with pending count', (tester) async {
      await tester.pumpWidget(ProviderScope(
        overrides: [
          settingsRepositoryProvider.overrideWithValue(mockRepository),
          syncServiceProvider.overrideWithValue(mockSyncService),
          pendingSyncCountProvider.overrideWith(
            (ref) => Stream.value(5),
          ),
        ],
        child: const MaterialApp(
          home: Scaffold(body: SettingsPage()),
        ),
      ));
      await tester.pumpAndSettle();

      expect(find.text('5 elements en attente'), findsOneWidget);
      expect(find.text('Sync'), findsOneWidget);
    });

    testWidgets('renders version info', (tester) async {
      await tester.pumpWidget(buildTestWidget());
      await tester.pumpAndSettle();

      // Scroll to bottom to see version text
      await tester.scrollUntilVisible(
        find.text('Art & Jardin v1.0.0'),
        200,
      );
      await tester.pumpAndSettle();

      expect(find.text('Art & Jardin v1.0.0'), findsOneWidget);
    });

    testWidgets('theme change calls setThemeMode', (tester) async {
      when(() => mockRepository.setThemeMode(ThemeMode.dark))
          .thenAnswer((_) async {});

      await tester.pumpWidget(buildTestWidget());
      await tester.pumpAndSettle();

      // Tap on "Sombre" segment
      await tester.tap(find.text('Sombre'));
      await tester.pumpAndSettle();

      verify(() => mockRepository.setThemeMode(ThemeMode.dark)).called(1);
    });

    testWidgets('terrain toggle calls setTerrainMode', (tester) async {
      when(() => mockRepository.setTerrainMode(true))
          .thenAnswer((_) async {});

      await tester.pumpWidget(buildTestWidget());
      await tester.pumpAndSettle();

      // Find the Switch in terrain mode SwitchListTile
      final switches = find.byType(Switch);
      // Terrain mode is the first switch
      await tester.tap(switches.first);
      await tester.pumpAndSettle();

      verify(() => mockRepository.setTerrainMode(true)).called(1);
    });

    testWidgets('sync button triggers syncAll', (tester) async {
      when(() => mockSyncService.syncAll())
          .thenAnswer((_) async => const SyncResult(synced: 0, failed: 0, conflicts: 0));

      await tester.pumpWidget(buildTestWidget());
      await tester.pumpAndSettle();

      await tester.tap(find.text('Sync'));
      await tester.pumpAndSettle();

      verify(() => mockSyncService.syncAll()).called(1);
    });
  });
}
