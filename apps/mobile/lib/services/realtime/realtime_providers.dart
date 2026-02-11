import 'dart:async';

import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../core/network/connectivity_service.dart';
import '../../core/network/dio_client.dart';
import 'realtime_service.dart';

/// Provides the [RealtimeService] singleton.
final realtimeServiceProvider = Provider<RealtimeService>((ref) {
  final service = RealtimeService(
    tokenStorage: ref.read(tokenStorageProvider),
    connectivityService: ref.read(connectivityServiceProvider),
  );
  ref.onDispose(service.dispose);
  return service;
});

/// Stream of connection state changes.
final realtimeConnectionStateProvider =
    StreamProvider<RealtimeConnectionState>((ref) {
  final service = ref.read(realtimeServiceProvider);
  return service.connectionState;
});

/// Stream of all real-time events.
final realtimeEventsProvider = StreamProvider<RealtimeEvent>((ref) {
  final service = ref.read(realtimeServiceProvider);
  return service.events;
});

/// Snackbar messages for real-time events.
class RealtimeEventMessages {
  const RealtimeEventMessages._();

  static String messageFor(RealtimeEvent event) {
    switch (event.type) {
      case RealtimeEventTypes.devisCreated:
        final numero = event.payload['numero'] ?? '';
        return 'Nouveau devis cree${numero.toString().isNotEmpty ? ' : $numero' : ''}';
      case RealtimeEventTypes.devisSigned:
        final numero = event.payload['numero'] ?? '';
        return 'Devis signe${numero.toString().isNotEmpty ? ' : $numero' : ''}';
      case RealtimeEventTypes.devisRejected:
        final numero = event.payload['numero'] ?? '';
        return 'Devis refuse${numero.toString().isNotEmpty ? ' : $numero' : ''}';
      case RealtimeEventTypes.factureCreated:
        final numero = event.payload['numero'] ?? '';
        return 'Nouvelle facture${numero.toString().isNotEmpty ? ' : $numero' : ''}';
      case RealtimeEventTypes.facturePaid:
        final numero = event.payload['numero'] ?? '';
        return 'Facture payee${numero.toString().isNotEmpty ? ' : $numero' : ''}';
      case RealtimeEventTypes.interventionStarted:
        final desc = event.payload['description'] ?? '';
        return 'Intervention demarree${desc.toString().isNotEmpty ? ' : $desc' : ''}';
      case RealtimeEventTypes.interventionCompleted:
        final desc = event.payload['description'] ?? '';
        return 'Intervention terminee${desc.toString().isNotEmpty ? ' : $desc' : ''}';
      case RealtimeEventTypes.clientCreated:
        final nom = event.payload['nom'] ?? '';
        return 'Nouveau client${nom.toString().isNotEmpty ? ' : $nom' : ''}';
      default:
        return 'Mise a jour recue';
    }
  }

  static IconData iconFor(String eventType) {
    switch (eventType) {
      case RealtimeEventTypes.devisCreated:
      case RealtimeEventTypes.devisSigned:
      case RealtimeEventTypes.devisRejected:
        return Icons.description;
      case RealtimeEventTypes.factureCreated:
      case RealtimeEventTypes.facturePaid:
        return Icons.receipt;
      case RealtimeEventTypes.interventionStarted:
      case RealtimeEventTypes.interventionCompleted:
        return Icons.build;
      case RealtimeEventTypes.clientCreated:
        return Icons.person_add;
      default:
        return Icons.notifications;
    }
  }
}

/// Notifier that manages real-time connection and event handling.
class RealtimeNotifier extends StateNotifier<RealtimeNotifierState> {
  RealtimeNotifier({
    required RealtimeService realtimeService,
  })  : _realtimeService = realtimeService,
        super(const RealtimeNotifierState()) {
    _init();
  }

  final RealtimeService _realtimeService;
  StreamSubscription<RealtimeEvent>? _eventSubscription;
  StreamSubscription<RealtimeConnectionState>? _stateSubscription;

  /// Callback for showing snackbar (set by the UI layer).
  void Function(RealtimeEvent event)? onEventReceived;

  /// Callback for invalidating providers.
  void Function(String eventType)? onInvalidateProviders;

  void _init() {
    _stateSubscription =
        _realtimeService.connectionState.listen((connectionState) {
      state = state.copyWith(connectionState: connectionState);
    });

    _eventSubscription = _realtimeService.events.listen((event) {
      state = state.copyWith(
        lastEvent: event,
        eventCount: state.eventCount + 1,
      );

      onInvalidateProviders?.call(event.type);
      onEventReceived?.call(event);
    });
  }

  /// Start the real-time connection.
  Future<void> connect() async {
    await _realtimeService.connect();
  }

  /// Stop the real-time connection.
  void disconnect() {
    _realtimeService.disconnect();
  }

  @override
  void dispose() {
    _eventSubscription?.cancel();
    _stateSubscription?.cancel();
    super.dispose();
  }
}

/// State for the [RealtimeNotifier].
class RealtimeNotifierState {
  const RealtimeNotifierState({
    this.connectionState = RealtimeConnectionState.disconnected,
    this.lastEvent,
    this.eventCount = 0,
  });

  final RealtimeConnectionState connectionState;
  final RealtimeEvent? lastEvent;
  final int eventCount;

  RealtimeNotifierState copyWith({
    RealtimeConnectionState? connectionState,
    RealtimeEvent? lastEvent,
    int? eventCount,
  }) {
    return RealtimeNotifierState(
      connectionState: connectionState ?? this.connectionState,
      lastEvent: lastEvent ?? this.lastEvent,
      eventCount: eventCount ?? this.eventCount,
    );
  }
}

/// Provides the [RealtimeNotifier].
final realtimeNotifierProvider =
    StateNotifierProvider<RealtimeNotifier, RealtimeNotifierState>((ref) {
  final service = ref.read(realtimeServiceProvider);
  return RealtimeNotifier(realtimeService: service);
});
