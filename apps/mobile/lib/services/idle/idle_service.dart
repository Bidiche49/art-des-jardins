import 'dart:async';

import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../domain/enums/user_role.dart';

/// Idle detection state.
enum IdleState {
  active,
  warning,
  expired,
}

/// Service that detects user inactivity and triggers warning/expiration.
class IdleService {
  IdleService({
    Duration? patronTimeout,
    Duration? employeTimeout,
    Duration? warningBefore,
  })  : _patronTimeout = patronTimeout ?? const Duration(minutes: 30),
        _employeTimeout = employeTimeout ?? const Duration(hours: 2),
        _warningBefore = warningBefore ?? const Duration(minutes: 2);

  final Duration _patronTimeout;
  final Duration _employeTimeout;
  final Duration _warningBefore;

  Timer? _idleTimer;
  Timer? _warningTimer;
  Timer? _countdownTimer;
  DateTime? _lastActivity;
  UserRole _role = UserRole.employe;
  bool _isRunning = false;

  final _stateController = StreamController<IdleState>.broadcast();
  final _countdownController = StreamController<int>.broadcast();

  /// Stream of idle state changes.
  Stream<IdleState> get stateStream => _stateController.stream;

  /// Stream of countdown seconds remaining.
  Stream<int> get countdownStream => _countdownController.stream;

  /// Current timeout for the active role.
  Duration get timeout =>
      _role == UserRole.patron ? _patronTimeout : _employeTimeout;

  /// Duration before expiration to show warning.
  Duration get warningBefore => _warningBefore;

  /// Whether the service is currently running.
  bool get isRunning => _isRunning;

  /// Start the idle timer for a given user role.
  void start(UserRole role) {
    _role = role;
    _isRunning = true;
    _lastActivity = DateTime.now();
    _scheduleTimers();
  }

  /// Reset the idle timer on user interaction.
  void resetTimer() {
    if (!_isRunning) return;
    _lastActivity = DateTime.now();
    _cancelTimers();
    _scheduleTimers();
    _stateController.add(IdleState.active);
  }

  /// Stop the idle service completely.
  void stop() {
    _isRunning = false;
    _cancelTimers();
  }

  /// Called when app goes to background.
  void onBackground() {
    // Timer continues (doesn't pause). We track _lastActivity.
  }

  /// Called when app returns to foreground. Checks if expired.
  void onForeground() {
    if (!_isRunning || _lastActivity == null) return;
    final elapsed = DateTime.now().difference(_lastActivity!);
    if (elapsed >= timeout) {
      _cancelTimers();
      _stateController.add(IdleState.expired);
    } else if (elapsed >= timeout - _warningBefore) {
      _cancelTimers();
      _stateController.add(IdleState.warning);
      _startCountdown(timeout - elapsed);
    }
  }

  void _scheduleTimers() {
    final warningDelay = timeout - _warningBefore;
    if (warningDelay.isNegative || warningDelay == Duration.zero) {
      // Timeout shorter than warning period: skip warning, go straight to expiry
      _idleTimer = Timer(timeout, _onExpired);
      return;
    }

    _warningTimer = Timer(warningDelay, _onWarning);
    _idleTimer = Timer(timeout, _onExpired);
  }

  void _onWarning() {
    _stateController.add(IdleState.warning);
    _startCountdown(_warningBefore);
  }

  void _startCountdown(Duration remaining) {
    var seconds = remaining.inSeconds;
    _countdownController.add(seconds);
    _countdownTimer?.cancel();
    _countdownTimer = Timer.periodic(const Duration(seconds: 1), (timer) {
      seconds--;
      if (seconds <= 0) {
        timer.cancel();
        _countdownController.add(0);
      } else {
        _countdownController.add(seconds);
      }
    });
  }

  void _onExpired() {
    _cancelTimers();
    _stateController.add(IdleState.expired);
  }

  void _cancelTimers() {
    _idleTimer?.cancel();
    _idleTimer = null;
    _warningTimer?.cancel();
    _warningTimer = null;
    _countdownTimer?.cancel();
    _countdownTimer = null;
  }

  void dispose() {
    stop();
    _stateController.close();
    _countdownController.close();
  }
}

/// Provides the [IdleService] singleton.
final idleServiceProvider = Provider<IdleService>((ref) {
  final service = IdleService();
  ref.onDispose(service.dispose);
  return service;
});

/// Stream of idle state changes.
final idleStateProvider = StreamProvider<IdleState>((ref) {
  final service = ref.read(idleServiceProvider);
  return service.stateStream;
});

/// Stream of countdown seconds.
final idleCountdownProvider = StreamProvider<int>((ref) {
  final service = ref.read(idleServiceProvider);
  return service.countdownStream;
});
