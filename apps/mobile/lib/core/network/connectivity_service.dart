import 'dart:async';

import 'package:connectivity_plus/connectivity_plus.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

/// Provides the [ConnectivityService] singleton.
final connectivityServiceProvider = Provider<ConnectivityService>(
  (ref) => ConnectivityService(),
);

/// Provides a stream of connectivity status.
final connectivityStreamProvider = StreamProvider<ConnectivityStatus>((ref) {
  final service = ref.read(connectivityServiceProvider);
  return service.statusStream;
});

/// Simplified connectivity status.
enum ConnectivityStatus { online, offline }

/// Wraps [Connectivity] to provide a simpler online/offline stream.
class ConnectivityService {
  ConnectivityService({Connectivity? connectivity})
      : _connectivity = connectivity ?? Connectivity();

  final Connectivity _connectivity;
  StreamSubscription<List<ConnectivityResult>>? _subscription;
  final StreamController<ConnectivityStatus> _controller =
      StreamController<ConnectivityStatus>.broadcast();

  Stream<ConnectivityStatus> get statusStream => _controller.stream;

  /// Starts listening to connectivity changes.
  void startListening() {
    _subscription = _connectivity.onConnectivityChanged.listen((results) {
      _controller.add(_mapResults(results));
    });
  }

  /// Gets the current connectivity status.
  Future<ConnectivityStatus> getCurrentStatus() async {
    final results = await _connectivity.checkConnectivity();
    return _mapResults(results);
  }

  /// Returns whether the device is currently connected (wifi or mobile).
  Future<bool> get isOnline async {
    final status = await getCurrentStatus();
    return status == ConnectivityStatus.online;
  }

  ConnectivityStatus _mapResults(List<ConnectivityResult> results) {
    if (results.contains(ConnectivityResult.none) || results.isEmpty) {
      return ConnectivityStatus.offline;
    }
    return ConnectivityStatus.online;
  }

  /// Checks if current connection is WiFi.
  Future<bool> get isWifi async {
    final results = await _connectivity.checkConnectivity();
    return results.contains(ConnectivityResult.wifi);
  }

  /// Checks if current connection is mobile data.
  Future<bool> get isMobile async {
    final results = await _connectivity.checkConnectivity();
    return results.contains(ConnectivityResult.mobile);
  }

  void dispose() {
    _subscription?.cancel();
    _controller.close();
  }
}
