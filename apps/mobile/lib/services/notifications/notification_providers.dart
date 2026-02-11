import 'dart:async';
import 'dart:io' show Platform;

import 'package:flutter_riverpod/flutter_riverpod.dart';

import 'notification_service.dart';

/// State for the notification notifier.
class NotificationState {
  const NotificationState({
    this.isPermissionGranted = false,
    this.fcmToken,
    this.lastNotification,
    this.isInitialized = false,
  });

  final bool isPermissionGranted;
  final String? fcmToken;
  final PushNotificationPayload? lastNotification;
  final bool isInitialized;

  NotificationState copyWith({
    bool? isPermissionGranted,
    String? fcmToken,
    PushNotificationPayload? lastNotification,
    bool? isInitialized,
  }) {
    return NotificationState(
      isPermissionGranted: isPermissionGranted ?? this.isPermissionGranted,
      fcmToken: fcmToken ?? this.fcmToken,
      lastNotification: lastNotification ?? this.lastNotification,
      isInitialized: isInitialized ?? this.isInitialized,
    );
  }
}

class NotificationNotifier extends StateNotifier<NotificationState> {
  NotificationNotifier({
    required NotificationService service,
  })  : _service = service,
        super(const NotificationState());

  final NotificationService _service;
  StreamSubscription<PushNotificationPayload>? _foregroundSub;
  StreamSubscription<PushNotificationPayload>? _tapSub;

  /// Initialize push notifications.
  Future<void> initialize() async {
    if (state.isInitialized) return;

    await _service.initialize();

    final granted = await _service.requestPermission();
    state = state.copyWith(
      isPermissionGranted: granted,
      isInitialized: true,
    );

    if (!granted) return;

    // Get and register token
    final token = await _service.getToken();
    if (token != null) {
      await _registerTokenWithBackend(token);
    }

    // Listen to foreground messages
    _foregroundSub = _service.onForegroundMessage.listen((payload) {
      state = state.copyWith(lastNotification: payload);
      _service.showLocalNotification(payload);
    });

    // Listen to notification taps
    _tapSub = _service.onNotificationTap.listen((payload) {
      // Deep link navigation handled externally via the stream
      state = state.copyWith(lastNotification: payload);
    });
  }

  Future<void> _registerTokenWithBackend(String token) async {
    final platform = _getPlatform();
    await _service.registerToken(token, platform: platform);
    state = state.copyWith(fcmToken: token);
  }

  /// Handle token refresh.
  Future<void> onTokenRefresh(String newToken) async {
    if (!state.isPermissionGranted) return;
    await _registerTokenWithBackend(newToken);
  }

  /// Handle logout - unregister token.
  Future<void> onLogout() async {
    await _service.unregisterToken();
    state = const NotificationState();
  }

  String _getPlatform() {
    try {
      if (Platform.isIOS) return 'ios';
      if (Platform.isAndroid) return 'android';
    } catch (_) {
      // Platform not available in tests
    }
    return 'mobile';
  }

  @override
  void dispose() {
    _foregroundSub?.cancel();
    _tapSub?.cancel();
    super.dispose();
  }
}

final notificationNotifierProvider =
    StateNotifierProvider<NotificationNotifier, NotificationState>((ref) {
  return NotificationNotifier(
    service: ref.read(notificationServiceProvider),
  );
});

/// Stream of foreground notifications for snackbar display.
final foregroundNotificationsProvider =
    StreamProvider<PushNotificationPayload>((ref) {
  final service = ref.read(notificationServiceProvider);
  return service.onForegroundMessage;
});

/// Stream of notification taps for deep link navigation.
final notificationTapProvider =
    StreamProvider<PushNotificationPayload>((ref) {
  final service = ref.read(notificationServiceProvider);
  return service.onNotificationTap;
});
