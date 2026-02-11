import 'dart:async';

import 'package:flutter_test/flutter_test.dart';
import 'package:mocktail/mocktail.dart';

import 'package:art_et_jardin/services/notifications/notification_service.dart';
import 'package:art_et_jardin/services/notifications/notification_providers.dart';

class MockNotificationService extends Mock implements NotificationService {
  MockNotificationService({
    required this.foregroundStream,
    required this.tapStream,
  });

  final Stream<PushNotificationPayload> foregroundStream;
  final Stream<PushNotificationPayload> tapStream;

  @override
  Stream<PushNotificationPayload> get onForegroundMessage => foregroundStream;

  @override
  Stream<PushNotificationPayload> get onNotificationTap => tapStream;
}

class FakePushNotificationPayload extends Fake
    implements PushNotificationPayload {}

void main() {
  setUpAll(() {
    registerFallbackValue(FakePushNotificationPayload());
  });

  late MockNotificationService mockService;
  late NotificationNotifier notifier;
  late StreamController<PushNotificationPayload> foregroundController;
  late StreamController<PushNotificationPayload> tapController;

  setUp(() {
    foregroundController =
        StreamController<PushNotificationPayload>.broadcast();
    tapController = StreamController<PushNotificationPayload>.broadcast();

    mockService = MockNotificationService(
      foregroundStream: foregroundController.stream,
      tapStream: tapController.stream,
    );

    when(() => mockService.initialize()).thenAnswer((_) async {});
    when(() => mockService.requestPermission()).thenAnswer((_) async => true);
    when(() => mockService.getToken()).thenAnswer((_) async => 'test-token');
    when(() =>
            mockService.registerToken(any(), platform: any(named: 'platform')))
        .thenAnswer((_) async {});
    when(() => mockService.unregisterToken()).thenAnswer((_) async {});
    when(() => mockService.showLocalNotification(any()))
        .thenAnswer((_) async {});

    notifier = NotificationNotifier(service: mockService);
  });

  tearDown(() {
    foregroundController.close();
    tapController.close();
    notifier.dispose();
  });

  group('NotificationState', () {
    test('default state has correct values', () {
      const state = NotificationState();
      expect(state.isPermissionGranted, false);
      expect(state.fcmToken, isNull);
      expect(state.lastNotification, isNull);
      expect(state.isInitialized, false);
    });

    test('copyWith preserves unchanged values', () {
      const state = NotificationState(
        isPermissionGranted: true,
        fcmToken: 'token-1',
        isInitialized: true,
      );

      final copied = state.copyWith(fcmToken: 'token-2');
      expect(copied.isPermissionGranted, true);
      expect(copied.fcmToken, 'token-2');
      expect(copied.isInitialized, true);
    });
  });

  group('NotificationNotifier - initialize', () {
    test('initialize calls service.initialize', () async {
      await notifier.initialize();
      verify(() => mockService.initialize()).called(1);
    });

    test('initialize requests permission', () async {
      await notifier.initialize();
      verify(() => mockService.requestPermission()).called(1);
    });

    test('initialize registers token with backend', () async {
      await notifier.initialize();
      verify(() => mockService.registerToken('test-token',
          platform: any(named: 'platform'))).called(1);
    });

    test('initialize sets state correctly', () async {
      await notifier.initialize();
      expect(notifier.state.isInitialized, true);
      expect(notifier.state.isPermissionGranted, true);
      expect(notifier.state.fcmToken, 'test-token');
    });

    test('initialize is idempotent', () async {
      await notifier.initialize();
      await notifier.initialize();
      verify(() => mockService.initialize()).called(1);
    });

    test('permission denied -> no token registration', () async {
      when(() => mockService.requestPermission())
          .thenAnswer((_) async => false);

      await notifier.initialize();
      expect(notifier.state.isPermissionGranted, false);
      verifyNever(() =>
          mockService.registerToken(any(), platform: any(named: 'platform')));
    });

    test('null token -> no backend registration', () async {
      when(() => mockService.getToken()).thenAnswer((_) async => null);

      await notifier.initialize();
      verifyNever(() =>
          mockService.registerToken(any(), platform: any(named: 'platform')));
      expect(notifier.state.fcmToken, isNull);
    });
  });

  group('NotificationNotifier - foreground messages', () {
    test('foreground message updates lastNotification', () async {
      await notifier.initialize();

      const payload = PushNotificationPayload(
        title: 'Test',
        body: 'Body',
      );

      foregroundController.add(payload);
      await Future.delayed(Duration.zero);

      expect(notifier.state.lastNotification, payload);
    });

    test('foreground message shows local notification', () async {
      await notifier.initialize();

      const payload = PushNotificationPayload(
        title: 'Devis signe',
        body: 'Le devis a ete signe',
      );

      foregroundController.add(payload);
      await Future.delayed(Duration.zero);

      verify(() => mockService.showLocalNotification(payload)).called(1);
    });
  });

  group('NotificationNotifier - token refresh', () {
    test('onTokenRefresh re-registers token', () async {
      await notifier.initialize();

      await notifier.onTokenRefresh('new-token');
      verify(() => mockService.registerToken('new-token',
          platform: any(named: 'platform'))).called(1);
      expect(notifier.state.fcmToken, 'new-token');
    });

    test('onTokenRefresh does nothing if permission not granted', () async {
      when(() => mockService.requestPermission())
          .thenAnswer((_) async => false);
      await notifier.initialize();

      await notifier.onTokenRefresh('new-token');
      verifyNever(() =>
          mockService.registerToken(any(), platform: any(named: 'platform')));
    });
  });

  group('NotificationNotifier - logout', () {
    test('onLogout unregisters token', () async {
      await notifier.initialize();
      await notifier.onLogout();

      verify(() => mockService.unregisterToken()).called(1);
    });

    test('onLogout resets state', () async {
      await notifier.initialize();
      expect(notifier.state.isInitialized, true);

      await notifier.onLogout();
      expect(notifier.state.isInitialized, false);
      expect(notifier.state.fcmToken, isNull);
      expect(notifier.state.isPermissionGranted, false);
    });
  });
}
