import 'dart:async';

import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:mocktail/mocktail.dart';

import 'package:art_et_jardin/core/network/connectivity_service.dart';
import 'package:art_et_jardin/core/network/token_storage.dart';
import 'package:art_et_jardin/core/theme/app_colors.dart';
import 'package:art_et_jardin/services/realtime/realtime_connection_badge.dart';
import 'package:art_et_jardin/services/realtime/realtime_providers.dart';
import 'package:art_et_jardin/services/realtime/realtime_service.dart';

class MockTokenStorage extends Mock implements TokenStorage {}

class MockConnectivityService extends Mock implements ConnectivityService {}

void main() {
  late MockTokenStorage mockTokenStorage;
  late MockConnectivityService mockConnectivity;
  late StreamController<ConnectivityStatus> connectivityController;

  setUp(() {
    mockTokenStorage = MockTokenStorage();
    mockConnectivity = MockConnectivityService();
    connectivityController = StreamController<ConnectivityStatus>.broadcast();

    when(() => mockConnectivity.statusStream)
        .thenAnswer((_) => connectivityController.stream);
    when(() => mockConnectivity.startListening()).thenReturn(null);
  });

  tearDown(() async {
    await connectivityController.close();
  });

  Widget createWidget({double size = 10}) {
    return ProviderScope(
      overrides: [
        realtimeServiceProvider.overrideWithValue(
          RealtimeService(
            tokenStorage: mockTokenStorage,
            connectivityService: mockConnectivity,
          ),
        ),
      ],
      child: MaterialApp(
        home: Scaffold(
          body: RealtimeConnectionBadge(size: size),
        ),
      ),
    );
  }

  group('RealtimeConnectionBadge', () {
    testWidgets('renders with default size', (tester) async {
      await tester.pumpWidget(createWidget());

      // Find the Container
      final container = tester.widget<Container>(find.byType(Container).last);
      expect(container.constraints?.maxWidth, 10);
    });

    testWidgets('renders with custom size', (tester) async {
      await tester.pumpWidget(createWidget(size: 20));

      final container = tester.widget<Container>(find.byType(Container).last);
      expect(container.constraints?.maxWidth, 20);
    });

    testWidgets('shows red dot when disconnected (initial state)', (tester) async {
      await tester.pumpWidget(createWidget());

      // Initial state is disconnected -> red
      final container = tester.widget<Container>(find.byType(Container).last);
      final decoration = container.decoration as BoxDecoration;
      expect(decoration.color, AppColors.error);
    });

    testWidgets('has circle shape', (tester) async {
      await tester.pumpWidget(createWidget());

      final container = tester.widget<Container>(find.byType(Container).last);
      final decoration = container.decoration as BoxDecoration;
      expect(decoration.shape, BoxShape.circle);
    });

    testWidgets('has tooltip', (tester) async {
      await tester.pumpWidget(createWidget());

      expect(find.byType(Tooltip), findsOneWidget);
    });
  });
}
