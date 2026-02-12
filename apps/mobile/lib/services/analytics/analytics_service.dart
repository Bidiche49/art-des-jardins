import 'package:flutter/foundation.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

/// Abstract analytics service for tracking user actions and screen views.
abstract class AnalyticsService {
  /// Initialize analytics.
  Future<void> initialize();

  /// Track a screen view.
  Future<void> logScreenView(String screenName);

  /// Track a custom event.
  Future<void> logEvent(String name, {Map<String, dynamic>? parameters});

  /// Set user ID for analytics.
  Future<void> setUserId(String userId);

  /// Clear user properties on logout.
  Future<void> clearUser();
}

/// Standard analytics events tracked in the app.
class AnalyticsEvents {
  const AnalyticsEvents._();

  static const String login = 'login';
  static const String logout = 'logout';
  static const String createClient = 'create_client';
  static const String createDevis = 'create_devis';
  static const String signDevis = 'sign_devis';
  static const String createIntervention = 'create_intervention';
  static const String syncComplete = 'sync_complete';
  static const String photoCapture = 'photo_capture';
  static const String scanQrCode = 'scan_qr_code';
  static const String exportPdf = 'export_pdf';
}

/// Tracked analytics event.
class AnalyticsEvent {
  const AnalyticsEvent(this.name, [this.parameters]);
  final String name;
  final Map<String, dynamic>? parameters;
}

/// Implementation that logs to console in debug mode.
///
/// In production, this would delegate to Firebase Analytics.
class AnalyticsServiceImpl implements AnalyticsService {
  bool _initialized = false;
  String? _userId;
  final List<AnalyticsEvent> _events = [];

  bool get isInitialized => _initialized;
  String? get userId => _userId;
  List<AnalyticsEvent> get events => List.unmodifiable(_events);

  @override
  Future<void> initialize() async {
    if (_initialized) return;
    _initialized = true;
    debugPrint('[Analytics] Initialized');
  }

  @override
  Future<void> logScreenView(String screenName) async {
    if (!_initialized) return;
    _events.add(AnalyticsEvent('screen_view', {'screen_name': screenName}));
    debugPrint('[Analytics] Screen: $screenName');
  }

  @override
  Future<void> logEvent(String name, {Map<String, dynamic>? parameters}) async {
    if (!_initialized) return;
    // Never log personal data
    Map<String, dynamic>? safeParams;
    if (parameters != null) {
      safeParams = Map<String, dynamic>.from(parameters)
        ..remove('email')
        ..remove('phone')
        ..remove('name')
        ..remove('address');
    }
    _events.add(AnalyticsEvent(name, safeParams));
    debugPrint('[Analytics] Event: $name ${safeParams ?? ''}');
  }

  @override
  Future<void> setUserId(String userId) async {
    _userId = userId;
    debugPrint('[Analytics] User: $userId');
  }

  @override
  Future<void> clearUser() async {
    _userId = null;
    _events.clear();
    debugPrint('[Analytics] User cleared');
  }
}

final analyticsServiceProvider = Provider<AnalyticsService>((ref) {
  return AnalyticsServiceImpl();
});
