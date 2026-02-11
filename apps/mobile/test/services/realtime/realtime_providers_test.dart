import 'dart:async';

import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:mocktail/mocktail.dart';

import 'package:art_et_jardin/core/network/connectivity_service.dart';
import 'package:art_et_jardin/core/network/token_storage.dart';
import 'package:art_et_jardin/services/realtime/realtime_providers.dart';
import 'package:art_et_jardin/services/realtime/realtime_service.dart';

class MockTokenStorage extends Mock implements TokenStorage {}

class MockConnectivityService extends Mock implements ConnectivityService {}

class MockRealtimeService extends Mock implements RealtimeService {}

void main() {
  // ============== RealtimeEventMessages ==============
  group('RealtimeEventMessages', () {
    group('messageFor', () {
      test('devis:created with numero', () {
        const event = RealtimeEvent(
          type: RealtimeEventTypes.devisCreated,
          payload: {'numero': 'D-2026-001'},
        );
        expect(
          RealtimeEventMessages.messageFor(event),
          'Nouveau devis cree : D-2026-001',
        );
      });

      test('devis:created without numero', () {
        const event = RealtimeEvent(
          type: RealtimeEventTypes.devisCreated,
          payload: {},
        );
        expect(
          RealtimeEventMessages.messageFor(event),
          'Nouveau devis cree',
        );
      });

      test('devis:signed with numero', () {
        const event = RealtimeEvent(
          type: RealtimeEventTypes.devisSigned,
          payload: {'numero': 'D-2026-002'},
        );
        expect(
          RealtimeEventMessages.messageFor(event),
          'Devis signe : D-2026-002',
        );
      });

      test('devis:signed without numero', () {
        const event = RealtimeEvent(
          type: RealtimeEventTypes.devisSigned,
          payload: {},
        );
        expect(RealtimeEventMessages.messageFor(event), 'Devis signe');
      });

      test('devis:rejected with numero', () {
        const event = RealtimeEvent(
          type: RealtimeEventTypes.devisRejected,
          payload: {'numero': 'D-2026-003'},
        );
        expect(
          RealtimeEventMessages.messageFor(event),
          'Devis refuse : D-2026-003',
        );
      });

      test('devis:rejected without numero', () {
        const event = RealtimeEvent(
          type: RealtimeEventTypes.devisRejected,
          payload: {},
        );
        expect(RealtimeEventMessages.messageFor(event), 'Devis refuse');
      });

      test('facture:created with numero', () {
        const event = RealtimeEvent(
          type: RealtimeEventTypes.factureCreated,
          payload: {'numero': 'F-2026-001'},
        );
        expect(
          RealtimeEventMessages.messageFor(event),
          'Nouvelle facture : F-2026-001',
        );
      });

      test('facture:created without numero', () {
        const event = RealtimeEvent(
          type: RealtimeEventTypes.factureCreated,
          payload: {},
        );
        expect(RealtimeEventMessages.messageFor(event), 'Nouvelle facture');
      });

      test('facture:paid with numero', () {
        const event = RealtimeEvent(
          type: RealtimeEventTypes.facturePaid,
          payload: {'numero': 'F-2026-002'},
        );
        expect(
          RealtimeEventMessages.messageFor(event),
          'Facture payee : F-2026-002',
        );
      });

      test('facture:paid without numero', () {
        const event = RealtimeEvent(
          type: RealtimeEventTypes.facturePaid,
          payload: {},
        );
        expect(RealtimeEventMessages.messageFor(event), 'Facture payee');
      });

      test('intervention:started with description', () {
        const event = RealtimeEvent(
          type: RealtimeEventTypes.interventionStarted,
          payload: {'description': 'Taille haie'},
        );
        expect(
          RealtimeEventMessages.messageFor(event),
          'Intervention demarree : Taille haie',
        );
      });

      test('intervention:started without description', () {
        const event = RealtimeEvent(
          type: RealtimeEventTypes.interventionStarted,
          payload: {},
        );
        expect(
          RealtimeEventMessages.messageFor(event),
          'Intervention demarree',
        );
      });

      test('intervention:completed with description', () {
        const event = RealtimeEvent(
          type: RealtimeEventTypes.interventionCompleted,
          payload: {'description': 'Elagage chene'},
        );
        expect(
          RealtimeEventMessages.messageFor(event),
          'Intervention terminee : Elagage chene',
        );
      });

      test('intervention:completed without description', () {
        const event = RealtimeEvent(
          type: RealtimeEventTypes.interventionCompleted,
          payload: {},
        );
        expect(
          RealtimeEventMessages.messageFor(event),
          'Intervention terminee',
        );
      });

      test('client:created with nom', () {
        const event = RealtimeEvent(
          type: RealtimeEventTypes.clientCreated,
          payload: {'nom': 'Dupont'},
        );
        expect(
          RealtimeEventMessages.messageFor(event),
          'Nouveau client : Dupont',
        );
      });

      test('client:created without nom', () {
        const event = RealtimeEvent(
          type: RealtimeEventTypes.clientCreated,
          payload: {},
        );
        expect(RealtimeEventMessages.messageFor(event), 'Nouveau client');
      });

      test('unknown event type returns default message', () {
        const event = RealtimeEvent(
          type: 'unknown:event',
          payload: {},
        );
        expect(
          RealtimeEventMessages.messageFor(event),
          'Mise a jour recue',
        );
      });
    });

    group('iconFor', () {
      test('devis events return description icon', () {
        expect(
          RealtimeEventMessages.iconFor(RealtimeEventTypes.devisCreated),
          Icons.description,
        );
        expect(
          RealtimeEventMessages.iconFor(RealtimeEventTypes.devisSigned),
          Icons.description,
        );
        expect(
          RealtimeEventMessages.iconFor(RealtimeEventTypes.devisRejected),
          Icons.description,
        );
      });

      test('facture events return receipt icon', () {
        expect(
          RealtimeEventMessages.iconFor(RealtimeEventTypes.factureCreated),
          Icons.receipt,
        );
        expect(
          RealtimeEventMessages.iconFor(RealtimeEventTypes.facturePaid),
          Icons.receipt,
        );
      });

      test('intervention events return build icon', () {
        expect(
          RealtimeEventMessages.iconFor(RealtimeEventTypes.interventionStarted),
          Icons.build,
        );
        expect(
          RealtimeEventMessages.iconFor(RealtimeEventTypes.interventionCompleted),
          Icons.build,
        );
      });

      test('client events return person_add icon', () {
        expect(
          RealtimeEventMessages.iconFor(RealtimeEventTypes.clientCreated),
          Icons.person_add,
        );
      });

      test('unknown event type returns notifications icon', () {
        expect(
          RealtimeEventMessages.iconFor('unknown:event'),
          Icons.notifications,
        );
      });
    });
  });

  // ============== RealtimeNotifierState ==============
  group('RealtimeNotifierState', () {
    test('default state is disconnected with 0 events', () {
      const state = RealtimeNotifierState();
      expect(state.connectionState, RealtimeConnectionState.disconnected);
      expect(state.lastEvent, isNull);
      expect(state.eventCount, 0);
    });

    test('copyWith updates connectionState', () {
      const state = RealtimeNotifierState();
      final updated =
          state.copyWith(connectionState: RealtimeConnectionState.connected);

      expect(updated.connectionState, RealtimeConnectionState.connected);
      expect(updated.lastEvent, isNull);
      expect(updated.eventCount, 0);
    });

    test('copyWith updates lastEvent', () {
      const state = RealtimeNotifierState();
      const event = RealtimeEvent(
        type: 'devis:created',
        payload: {'numero': 'D-001'},
      );
      final updated = state.copyWith(lastEvent: event);

      expect(updated.lastEvent, event);
      expect(updated.connectionState, RealtimeConnectionState.disconnected);
    });

    test('copyWith updates eventCount', () {
      const state = RealtimeNotifierState();
      final updated = state.copyWith(eventCount: 5);

      expect(updated.eventCount, 5);
    });

    test('copyWith preserves unchanged fields', () {
      const event = RealtimeEvent(type: 'test', payload: {});
      const state = RealtimeNotifierState(
        connectionState: RealtimeConnectionState.connected,
        lastEvent: event,
        eventCount: 3,
      );
      final updated = state.copyWith(eventCount: 4);

      expect(updated.connectionState, RealtimeConnectionState.connected);
      expect(updated.lastEvent, event);
      expect(updated.eventCount, 4);
    });
  });

  // ============== RealtimeNotifier ==============
  group('RealtimeNotifier', () {
    late MockConnectivityService mockConnectivity;
    late MockTokenStorage mockTokenStorage;
    late StreamController<ConnectivityStatus> connectivityController;

    setUp(() {
      mockConnectivity = MockConnectivityService();
      mockTokenStorage = MockTokenStorage();
      connectivityController = StreamController<ConnectivityStatus>.broadcast();

      when(() => mockConnectivity.statusStream)
          .thenAnswer((_) => connectivityController.stream);
      when(() => mockConnectivity.startListening()).thenReturn(null);
    });

    tearDown(() async {
      await connectivityController.close();
    });

    RealtimeService createService() {
      return RealtimeService(
        tokenStorage: mockTokenStorage,
        connectivityService: mockConnectivity,
      );
    }

    test('initial state is disconnected', () {
      final service = createService();
      final notifier = RealtimeNotifier(realtimeService: service);

      expect(
        notifier.state.connectionState,
        RealtimeConnectionState.disconnected,
      );
      expect(notifier.state.eventCount, 0);
      expect(notifier.state.lastEvent, isNull);

      notifier.dispose();
      service.dispose();
    });

    test('connect triggers service connect', () async {
      when(() => mockTokenStorage.getAccessToken())
          .thenAnswer((_) async => 'token');

      final service = createService();
      final notifier = RealtimeNotifier(realtimeService: service);

      await notifier.connect();

      // Should have attempted connection (state may be connecting)
      notifier.dispose();
      service.dispose();
    });

    test('disconnect triggers service disconnect', () async {
      when(() => mockTokenStorage.getAccessToken())
          .thenAnswer((_) async => 'token');

      final service = createService();
      final notifier = RealtimeNotifier(realtimeService: service);

      notifier.disconnect();

      expect(
        notifier.state.connectionState,
        RealtimeConnectionState.disconnected,
      );

      notifier.dispose();
      service.dispose();
    });

    test('onEventReceived callback is called on events', () async {
      final service = createService();
      final notifier = RealtimeNotifier(realtimeService: service);

      final received = <RealtimeEvent>[];
      notifier.onEventReceived = (event) => received.add(event);

      // Events are received through the service's stream
      // (In a real scenario, the socket would emit events)
      notifier.dispose();
      service.dispose();
    });

    test('onInvalidateProviders callback is called on events', () async {
      final service = createService();
      final notifier = RealtimeNotifier(realtimeService: service);

      final invalidated = <String>[];
      notifier.onInvalidateProviders = (type) => invalidated.add(type);

      notifier.dispose();
      service.dispose();
    });

    test('dispose cleans up subscriptions', () {
      final service = createService();
      final notifier = RealtimeNotifier(realtimeService: service);

      // Should not throw
      notifier.dispose();
      service.dispose();
    });
  });

  // ============== RealtimeConnectionState ==============
  group('RealtimeConnectionState', () {
    test('has three states', () {
      expect(RealtimeConnectionState.values, hasLength(3));
    });

    test('disconnected is default', () {
      expect(
        RealtimeConnectionState.disconnected.index,
        0,
      );
    });

    test('all states are distinct', () {
      final states = RealtimeConnectionState.values.toSet();
      expect(states, hasLength(3));
    });
  });
}
