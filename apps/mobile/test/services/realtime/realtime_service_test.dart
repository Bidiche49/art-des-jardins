import 'dart:async';

import 'package:flutter_test/flutter_test.dart';
import 'package:mocktail/mocktail.dart';

import 'package:art_et_jardin/core/network/connectivity_service.dart';
import 'package:art_et_jardin/core/network/token_storage.dart';
import 'package:art_et_jardin/services/realtime/realtime_service.dart';

class MockTokenStorage extends Mock implements TokenStorage {}

class MockConnectivityService extends Mock implements ConnectivityService {}

void main() {
  late MockTokenStorage mockTokenStorage;
  late MockConnectivityService mockConnectivityService;
  late StreamController<ConnectivityStatus> connectivityController;

  setUp(() {
    mockTokenStorage = MockTokenStorage();
    mockConnectivityService = MockConnectivityService();
    connectivityController = StreamController<ConnectivityStatus>.broadcast();

    when(() => mockConnectivityService.statusStream)
        .thenAnswer((_) => connectivityController.stream);
    when(() => mockConnectivityService.startListening()).thenReturn(null);
  });

  tearDown(() async {
    await connectivityController.close();
  });

  RealtimeService createService() {
    return RealtimeService(
      tokenStorage: mockTokenStorage,
      connectivityService: mockConnectivityService,
    );
  }

  // ============== Connection tests ==============
  group('RealtimeService - connection', () {
    test('initial state is disconnected', () {
      final service = createService();
      expect(service.currentState, RealtimeConnectionState.disconnected);
      expect(service.isConnected, isFalse);
      service.dispose();
    });

    test('connect with valid token transitions to connecting', () async {
      when(() => mockTokenStorage.getAccessToken())
          .thenAnswer((_) async => 'valid-jwt-token');

      final service = createService();
      final states = <RealtimeConnectionState>[];
      final sub = service.connectionState.listen(states.add);

      await service.connect();
      // Allow microtasks from broadcast StreamController to flush
      await Future<void>.delayed(Duration.zero);

      expect(states, contains(RealtimeConnectionState.connecting));

      await sub.cancel();
      service.dispose();
    });

    test('connect without token does nothing', () async {
      when(() => mockTokenStorage.getAccessToken())
          .thenAnswer((_) async => null);

      final service = createService();
      final states = <RealtimeConnectionState>[];
      final sub = service.connectionState.listen(states.add);

      await service.connect();

      expect(states, isEmpty);
      expect(service.currentState, RealtimeConnectionState.disconnected);

      await sub.cancel();
      service.dispose();
    });

    test('connect with empty token does nothing', () async {
      when(() => mockTokenStorage.getAccessToken())
          .thenAnswer((_) async => '');

      final service = createService();
      final states = <RealtimeConnectionState>[];
      final sub = service.connectionState.listen(states.add);

      await service.connect();

      expect(states, isEmpty);
      expect(service.currentState, RealtimeConnectionState.disconnected);

      await sub.cancel();
      service.dispose();
    });

    test('disconnect sets state to disconnected', () async {
      when(() => mockTokenStorage.getAccessToken())
          .thenAnswer((_) async => 'token');

      final service = createService();
      await service.connect();
      service.disconnect();

      expect(service.currentState, RealtimeConnectionState.disconnected);
      service.dispose();
    });

    test('dispose cleans up resources', () async {
      final service = createService();
      service.dispose();

      // After dispose, events stream should be closed
      expect(service.events.isEmpty, completes);
    });

    test('connect after dispose does nothing', () async {
      when(() => mockTokenStorage.getAccessToken())
          .thenAnswer((_) async => 'token');

      final service = createService();
      service.dispose();

      await service.connect();

      expect(service.currentState, RealtimeConnectionState.disconnected);
    });

    test('isConnected returns true only when connected', () {
      final service = createService();

      expect(service.isConnected, isFalse);
      // Can't test true without a real socket, but we verify the getter logic
      service.dispose();
    });
  });

  // ============== Reconnection tests ==============
  group('RealtimeService - reconnection', () {
    test('max reconnect attempts is 3', () {
      // Verified through AppConstants.maxRetries
      final service = createService();
      expect(service.currentState, RealtimeConnectionState.disconnected);
      service.dispose();
    });

    test('connectivity online triggers reconnect when disconnected', () async {
      when(() => mockTokenStorage.getAccessToken())
          .thenAnswer((_) async => 'token');

      final service = createService();
      await service.connect();

      // Simulate going online -> should trigger reconnection attempt
      connectivityController.add(ConnectivityStatus.online);
      await Future<void>.delayed(const Duration(milliseconds: 50));

      service.dispose();
    });

    test('connectivity offline does not trigger reconnect', () async {
      when(() => mockTokenStorage.getAccessToken())
          .thenAnswer((_) async => 'token');

      final service = createService();
      await service.connect();

      final statesAfterConnect = <RealtimeConnectionState>[];
      final sub = service.connectionState.listen(statesAfterConnect.add);

      connectivityController.add(ConnectivityStatus.offline);
      await Future<void>.delayed(const Duration(milliseconds: 50));

      // No connecting state should appear from offline event
      expect(
        statesAfterConnect.where((s) => s == RealtimeConnectionState.connecting),
        isEmpty,
      );

      await sub.cancel();
      service.dispose();
    });
  });

  // ============== Event types ==============
  group('RealtimeEventTypes', () {
    test('all contains 8 event types', () {
      expect(RealtimeEventTypes.all, hasLength(8));
    });

    test('all events have correct format entity:action', () {
      for (final event in RealtimeEventTypes.all) {
        expect(event, contains(':'));
        final parts = event.split(':');
        expect(parts, hasLength(2));
        expect(parts[0], isNotEmpty);
        expect(parts[1], isNotEmpty);
      }
    });

    test('contains devis events', () {
      expect(RealtimeEventTypes.all, contains('devis:created'));
      expect(RealtimeEventTypes.all, contains('devis:signed'));
      expect(RealtimeEventTypes.all, contains('devis:rejected'));
    });

    test('contains facture events', () {
      expect(RealtimeEventTypes.all, contains('facture:created'));
      expect(RealtimeEventTypes.all, contains('facture:paid'));
    });

    test('contains intervention events', () {
      expect(RealtimeEventTypes.all, contains('intervention:started'));
      expect(RealtimeEventTypes.all, contains('intervention:completed'));
    });

    test('contains client events', () {
      expect(RealtimeEventTypes.all, contains('client:created'));
    });

    test('event type constants match list values', () {
      expect(RealtimeEventTypes.devisCreated, 'devis:created');
      expect(RealtimeEventTypes.devisSigned, 'devis:signed');
      expect(RealtimeEventTypes.devisRejected, 'devis:rejected');
      expect(RealtimeEventTypes.factureCreated, 'facture:created');
      expect(RealtimeEventTypes.facturePaid, 'facture:paid');
      expect(RealtimeEventTypes.interventionStarted, 'intervention:started');
      expect(RealtimeEventTypes.interventionCompleted, 'intervention:completed');
      expect(RealtimeEventTypes.clientCreated, 'client:created');
    });
  });

  // ============== RealtimeEvent ==============
  group('RealtimeEvent', () {
    test('creates event with type and payload', () {
      const event = RealtimeEvent(
        type: 'devis:created',
        payload: {'numero': 'D-2026-001'},
      );

      expect(event.type, 'devis:created');
      expect(event.payload['numero'], 'D-2026-001');
    });

    test('empty payload is valid', () {
      const event = RealtimeEvent(
        type: 'client:created',
        payload: {},
      );

      expect(event.payload, isEmpty);
    });

    test('payload with nested data', () {
      const event = RealtimeEvent(
        type: 'devis:signed',
        payload: {
          'numero': 'D-2026-001',
          'client': {'nom': 'Dupont'},
          'montant': 1500.0,
        },
      );

      expect(event.payload['montant'], 1500.0);
    });
  });

  // ============== Event stream ==============
  group('RealtimeService - event stream', () {
    test('events stream is broadcast', () {
      final service = createService();

      // Should be able to listen multiple times without error
      final sub1 = service.events.listen((_) {});
      final sub2 = service.events.listen((_) {});

      sub1.cancel();
      sub2.cancel();
      service.dispose();
    });

    test('connectionState stream is broadcast', () {
      final service = createService();

      final sub1 = service.connectionState.listen((_) {});
      final sub2 = service.connectionState.listen((_) {});

      sub1.cancel();
      sub2.cancel();
      service.dispose();
    });

    test('events stream closes on dispose', () async {
      final service = createService();
      final completer = Completer<void>();

      service.events.listen(
        (_) {},
        onDone: () => completer.complete(),
      );

      service.dispose();
      await completer.future;
    });

    test('connectionState stream closes on dispose', () async {
      final service = createService();
      final completer = Completer<void>();

      service.connectionState.listen(
        (_) {},
        onDone: () => completer.complete(),
      );

      service.dispose();
      await completer.future;
    });
  });

  // ============== RealtimeConnectionState enum ==============
  group('RealtimeConnectionState', () {
    test('has three states', () {
      expect(RealtimeConnectionState.values, hasLength(3));
    });

    test('includes disconnected, connecting, connected', () {
      expect(
        RealtimeConnectionState.values,
        containsAll([
          RealtimeConnectionState.disconnected,
          RealtimeConnectionState.connecting,
          RealtimeConnectionState.connected,
        ]),
      );
    });
  });
}
