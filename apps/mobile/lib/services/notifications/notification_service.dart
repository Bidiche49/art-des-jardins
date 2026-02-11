import 'dart:async';

import 'package:dio/dio.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../core/network/api_endpoints.dart';
import '../../core/network/dio_client.dart';

/// Payload for a push notification.
class PushNotificationPayload {
  const PushNotificationPayload({
    required this.title,
    required this.body,
    this.deepLink,
    this.data = const {},
  });

  final String title;
  final String body;
  final String? deepLink;
  final Map<String, dynamic> data;
}

/// Abstract notification service for push notifications.
abstract class NotificationService {
  /// Initialize FCM and local notifications.
  Future<void> initialize();

  /// Request notification permission from the user.
  Future<bool> requestPermission();

  /// Get the current FCM token.
  Future<String?> getToken();

  /// Register the FCM token with the backend.
  Future<void> registerToken(String token, {required String platform});

  /// Unregister the FCM token (on logout).
  Future<void> unregisterToken();

  /// Stream of foreground notification payloads.
  Stream<PushNotificationPayload> get onForegroundMessage;

  /// Stream of notification tap payloads (deep links).
  Stream<PushNotificationPayload> get onNotificationTap;

  /// Show a local notification (foreground snackbar).
  Future<void> showLocalNotification(PushNotificationPayload payload);

  /// Resolve a deep link path from notification data.
  String? resolveDeepLink(Map<String, dynamic> data);

  /// Dispose resources.
  void dispose();
}

class NotificationServiceImpl implements NotificationService {
  NotificationServiceImpl({required Dio dio}) : _dio = dio;

  final Dio _dio;
  String? _currentToken;
  bool _initialized = false;

  final _foregroundController =
      StreamController<PushNotificationPayload>.broadcast();
  final _tapController = StreamController<PushNotificationPayload>.broadcast();

  @override
  Future<void> initialize() async {
    if (_initialized) return;
    _initialized = true;
    // In real implementation:
    // 1. await Firebase.initializeApp()
    // 2. Setup FirebaseMessaging.onMessage listener -> _foregroundController
    // 3. Setup FirebaseMessaging.onMessageOpenedApp -> _tapController
    // 4. Check for initial message (terminated state)
    // 5. Setup background message handler
    // 6. Initialize flutter_local_notifications
  }

  @override
  Future<bool> requestPermission() async {
    // In real implementation: FirebaseMessaging.instance.requestPermission()
    // Returns true if authorized
    return true;
  }

  @override
  Future<String?> getToken() async {
    // In real implementation: FirebaseMessaging.instance.getToken()
    return _currentToken;
  }

  @override
  Future<void> registerToken(String token, {required String platform}) async {
    _currentToken = token;
    try {
      await _dio.post(
        ApiEndpoints.notificationsSubscribe,
        data: {
          'fcmToken': token,
          'platform': platform,
        },
      );
    } catch (_) {
      // Non-blocking: push registration failure should not break the app
    }
  }

  @override
  Future<void> unregisterToken() async {
    if (_currentToken == null) return;
    try {
      await _dio.post(
        ApiEndpoints.notificationsUnsubscribe,
        data: {'fcmToken': _currentToken},
      );
    } catch (_) {
      // Non-blocking
    }
    _currentToken = null;
  }

  @override
  Stream<PushNotificationPayload> get onForegroundMessage =>
      _foregroundController.stream;

  @override
  Stream<PushNotificationPayload> get onNotificationTap =>
      _tapController.stream;

  @override
  Future<void> showLocalNotification(PushNotificationPayload payload) async {
    // In real implementation: flutter_local_notifications.show()
  }

  @override
  String? resolveDeepLink(Map<String, dynamic> data) {
    final type = data['type'] as String?;
    final entityId = data['entityId'] as String?;

    if (type == null) return null;

    return switch (type) {
      'devis' when entityId != null => '/devis/$entityId',
      'facture' when entityId != null => '/factures/$entityId',
      'intervention' when entityId != null => '/interventions/$entityId',
      'client' when entityId != null => '/clients/$entityId',
      'chantier' when entityId != null => '/chantiers/$entityId',
      'absence' => '/calendar/absences',
      _ => '/',
    };
  }

  /// Simulate receiving a foreground message (for testing/integration).
  void handleForegroundMessage(PushNotificationPayload payload) {
    _foregroundController.add(payload);
  }

  /// Simulate a notification tap (for testing/integration).
  void handleNotificationTap(PushNotificationPayload payload) {
    _tapController.add(payload);
  }

  @override
  void dispose() {
    _foregroundController.close();
    _tapController.close();
  }
}

final notificationServiceProvider = Provider<NotificationService>((ref) {
  final service = NotificationServiceImpl(
    dio: ref.read(authDioProvider),
  );
  ref.onDispose(() => service.dispose());
  return service;
});
