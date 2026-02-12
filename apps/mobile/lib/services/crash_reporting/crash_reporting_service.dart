import 'package:flutter/foundation.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

/// Abstract crash reporting service.
///
/// Wraps Firebase Crashlytics (or any crash reporting backend).
/// Testable via mock implementations.
abstract class CrashReportingService {
  /// Initialize crash reporting.
  Future<void> initialize();

  /// Record a non-fatal error.
  Future<void> recordError(
    dynamic exception,
    StackTrace? stackTrace, {
    bool fatal = false,
  });

  /// Set user identifier for crash reports.
  Future<void> setUserId(String userId);

  /// Clear user identifier (on logout).
  Future<void> clearUserId();

  /// Log a breadcrumb message.
  Future<void> log(String message);

  /// Enable or disable crash reporting.
  Future<void> setEnabled(bool enabled);
}

/// Implementation that logs to console in debug mode.
///
/// In production, this would delegate to Firebase Crashlytics.
/// Firebase Crashlytics requires native setup (GoogleService-Info.plist,
/// google-services.json) which is configured per environment.
class CrashReportingServiceImpl implements CrashReportingService {
  bool _initialized = false;
  String? _userId;
  bool _enabled = true;
  final List<String> _breadcrumbs = [];

  bool get isInitialized => _initialized;
  String? get userId => _userId;
  bool get isEnabled => _enabled;
  List<String> get breadcrumbs => List.unmodifiable(_breadcrumbs);

  @override
  Future<void> initialize() async {
    if (_initialized) return;
    _initialized = true;
    debugPrint('[CrashReporting] Initialized');
  }

  @override
  Future<void> recordError(
    dynamic exception,
    StackTrace? stackTrace, {
    bool fatal = false,
  }) async {
    if (!_enabled || !_initialized) return;
    final severity = fatal ? 'FATAL' : 'ERROR';
    debugPrint('[$severity] $exception');
    if (stackTrace != null) {
      debugPrint(stackTrace.toString().split('\n').take(5).join('\n'));
    }
  }

  @override
  Future<void> setUserId(String userId) async {
    _userId = userId;
    debugPrint('[CrashReporting] User: $userId');
  }

  @override
  Future<void> clearUserId() async {
    _userId = null;
    debugPrint('[CrashReporting] User cleared');
  }

  @override
  Future<void> log(String message) async {
    if (!_enabled) return;
    _breadcrumbs.add(message);
    // Keep last 100 breadcrumbs
    if (_breadcrumbs.length > 100) {
      _breadcrumbs.removeAt(0);
    }
    debugPrint('[CrashReporting] $message');
  }

  @override
  Future<void> setEnabled(bool enabled) async {
    _enabled = enabled;
  }
}

final crashReportingServiceProvider = Provider<CrashReportingService>((ref) {
  return CrashReportingServiceImpl();
});
