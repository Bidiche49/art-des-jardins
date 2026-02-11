import 'dart:async';
import 'dart:math';

import 'package:socket_io_client/socket_io_client.dart' as io;

import '../../core/config/app_constants.dart';
import '../../core/config/env_config.dart';
import '../../core/network/connectivity_service.dart';
import '../../core/network/token_storage.dart';

/// Connection state for the WebSocket.
enum RealtimeConnectionState { disconnected, connecting, connected }

/// A real-time event received from the server.
class RealtimeEvent {
  const RealtimeEvent({
    required this.type,
    required this.payload,
  });

  final String type;
  final Map<String, dynamic> payload;
}

/// Known event types emitted by the backend.
class RealtimeEventTypes {
  const RealtimeEventTypes._();

  static const String devisCreated = 'devis:created';
  static const String devisSigned = 'devis:signed';
  static const String devisRejected = 'devis:rejected';
  static const String factureCreated = 'facture:created';
  static const String facturePaid = 'facture:paid';
  static const String interventionStarted = 'intervention:started';
  static const String interventionCompleted = 'intervention:completed';
  static const String clientCreated = 'client:created';

  static const List<String> all = [
    devisCreated,
    devisSigned,
    devisRejected,
    factureCreated,
    facturePaid,
    interventionStarted,
    interventionCompleted,
    clientCreated,
  ];
}

/// WebSocket service using socket.io with auto-reconnection.
class RealtimeService {
  RealtimeService({
    required TokenStorage tokenStorage,
    required ConnectivityService connectivityService,
    io.Socket? socket,
  })  : _tokenStorage = tokenStorage,
        _connectivityService = connectivityService,
        _injectedSocket = socket;

  final TokenStorage _tokenStorage;
  final ConnectivityService _connectivityService;
  final io.Socket? _injectedSocket;

  io.Socket? _socket;
  StreamSubscription<ConnectivityStatus>? _connectivitySubscription;

  final _eventController = StreamController<RealtimeEvent>.broadcast();
  final _stateController =
      StreamController<RealtimeConnectionState>.broadcast();

  RealtimeConnectionState _connectionState = RealtimeConnectionState.disconnected;
  int _reconnectAttempts = 0;
  Timer? _reconnectTimer;
  bool _disposed = false;

  static const int _maxReconnectAttempts = AppConstants.maxRetries;
  static const Duration _baseReconnectDelay = Duration(seconds: 1);

  /// Stream of real-time events.
  Stream<RealtimeEvent> get events => _eventController.stream;

  /// Stream of connection state changes.
  Stream<RealtimeConnectionState> get connectionState =>
      _stateController.stream;

  /// Current connection state.
  RealtimeConnectionState get currentState => _connectionState;

  /// Whether the socket is currently connected.
  bool get isConnected =>
      _connectionState == RealtimeConnectionState.connected;

  /// Connect to the WebSocket server with JWT auth.
  Future<void> connect() async {
    if (_disposed) return;

    final token = await _tokenStorage.getAccessToken();
    if (token == null || token.isEmpty) return;

    _updateState(RealtimeConnectionState.connecting);
    _reconnectAttempts = 0;

    if (_injectedSocket != null) {
      _socket = _injectedSocket;
    } else {
      final wsUrl = _buildWsUrl();
      _socket = io.io(
        wsUrl,
        io.OptionBuilder()
            .setTransports(['websocket'])
            .setAuth({'token': token})
            .disableAutoConnect()
            .build(),
      );
    }

    _setupListeners();
    _socket!.connect();

    // Listen for connectivity changes to auto-reconnect
    _connectivitySubscription?.cancel();
    _connectivitySubscription =
        _connectivityService.statusStream.listen(_onConnectivityChange);
  }

  /// Disconnect from the WebSocket server.
  void disconnect() {
    _reconnectTimer?.cancel();
    _reconnectTimer = null;
    _connectivitySubscription?.cancel();
    _connectivitySubscription = null;

    if (_socket != null) {
      _socket!.clearListeners();
      _socket!.disconnect();
      _socket!.dispose();
      _socket = null;
    }

    _updateState(RealtimeConnectionState.disconnected);
  }

  /// Dispose all resources.
  void dispose() {
    _disposed = true;
    disconnect();
    _eventController.close();
    _stateController.close();
  }

  void _setupListeners() {
    final socket = _socket!;

    socket.onConnect((_) {
      _reconnectAttempts = 0;
      _updateState(RealtimeConnectionState.connected);
    });

    socket.onDisconnect((_) {
      if (!_disposed) {
        _updateState(RealtimeConnectionState.disconnected);
        _scheduleReconnect();
      }
    });

    socket.onConnectError((_) {
      if (!_disposed) {
        _updateState(RealtimeConnectionState.disconnected);
        _scheduleReconnect();
      }
    });

    // Register handlers for all known events
    for (final eventType in RealtimeEventTypes.all) {
      socket.on(eventType, (data) => _handleEvent(eventType, data));
    }
  }

  void _handleEvent(String type, dynamic data) {
    if (_disposed) return;

    try {
      final payload = data is Map<String, dynamic>
          ? data
          : <String, dynamic>{};
      _eventController.add(RealtimeEvent(type: type, payload: payload));
    } catch (_) {
      // Ignore malformed payloads
    }
  }

  void _scheduleReconnect() {
    if (_disposed) return;
    if (_reconnectAttempts >= _maxReconnectAttempts) return;

    _reconnectTimer?.cancel();
    final delay = _getBackoffDelay(_reconnectAttempts);
    _reconnectAttempts++;

    _reconnectTimer = Timer(delay, () {
      if (!_disposed) {
        connect();
      }
    });
  }

  void _onConnectivityChange(ConnectivityStatus status) {
    if (_disposed) return;

    if (status == ConnectivityStatus.online &&
        _connectionState == RealtimeConnectionState.disconnected) {
      _reconnectAttempts = 0;
      connect();
    }
  }

  Duration _getBackoffDelay(int attempt) {
    return _baseReconnectDelay * pow(2, attempt).toInt();
  }

  void _updateState(RealtimeConnectionState newState) {
    if (_connectionState == newState) return;
    _connectionState = newState;
    if (!_stateController.isClosed) {
      _stateController.add(newState);
    }
  }

  String _buildWsUrl() {
    // WebSocket URL derived from API URL (strip /api/v1 suffix)
    var url = EnvConfig.apiUrl;
    if (url.endsWith('/api/v1')) {
      url = url.substring(0, url.length - '/api/v1'.length);
    }
    return url;
  }
}
