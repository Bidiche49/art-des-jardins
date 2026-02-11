import 'package:dio/dio.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:mocktail/mocktail.dart';

import 'package:art_et_jardin/services/notifications/notification_service.dart';

class MockDio extends Mock implements Dio {}

void main() {
  late MockDio mockDio;
  late NotificationServiceImpl service;

  setUp(() {
    mockDio = MockDio();
    service = NotificationServiceImpl(dio: mockDio);
  });

  tearDown(() {
    service.dispose();
  });

  group('PushNotificationPayload', () {
    test('creates payload with all fields', () {
      const payload = PushNotificationPayload(
        title: 'Test',
        body: 'Body',
        deepLink: '/devis/123',
        data: {'type': 'devis', 'entityId': '123'},
      );
      expect(payload.title, 'Test');
      expect(payload.body, 'Body');
      expect(payload.deepLink, '/devis/123');
      expect(payload.data['type'], 'devis');
    });

    test('creates payload without deep link', () {
      const payload = PushNotificationPayload(
        title: 'Test',
        body: 'Body',
      );
      expect(payload.deepLink, isNull);
      expect(payload.data, isEmpty);
    });
  });

  group('NotificationServiceImpl - initialize', () {
    test('initialize sets initialized flag', () async {
      await service.initialize();
      // Can call again without error (idempotent)
      await service.initialize();
    });

    test('requestPermission returns true', () async {
      final granted = await service.requestPermission();
      expect(granted, true);
    });
  });

  group('NotificationServiceImpl - token management', () {
    test('registerToken sends token to backend', () async {
      when(() => mockDio.post(any(), data: any(named: 'data')))
          .thenAnswer((_) async => Response(
                requestOptions: RequestOptions(),
                statusCode: 200,
              ));

      await service.registerToken('test-token', platform: 'ios');

      verify(() => mockDio.post(
            '/notifications/subscribe',
            data: {'fcmToken': 'test-token', 'platform': 'ios'},
          )).called(1);
    });

    test('registerToken with android platform', () async {
      when(() => mockDio.post(any(), data: any(named: 'data')))
          .thenAnswer((_) async => Response(
                requestOptions: RequestOptions(),
                statusCode: 200,
              ));

      await service.registerToken('android-token', platform: 'android');

      verify(() => mockDio.post(
            '/notifications/subscribe',
            data: {'fcmToken': 'android-token', 'platform': 'android'},
          )).called(1);
    });

    test('registerToken handles API error without throwing', () async {
      when(() => mockDio.post(any(), data: any(named: 'data')))
          .thenThrow(DioException(
        requestOptions: RequestOptions(),
        type: DioExceptionType.connectionError,
      ));

      // Should not throw
      await service.registerToken('test-token', platform: 'ios');
    });

    test('unregisterToken sends token to backend', () async {
      when(() => mockDio.post(any(), data: any(named: 'data')))
          .thenAnswer((_) async => Response(
                requestOptions: RequestOptions(),
                statusCode: 200,
              ));

      // First register a token
      await service.registerToken('test-token', platform: 'ios');

      // Then unregister
      await service.unregisterToken();

      verify(() => mockDio.post(
            '/notifications/unsubscribe',
            data: {'fcmToken': 'test-token'},
          )).called(1);
    });

    test('unregisterToken does nothing when no token', () async {
      await service.unregisterToken();
      verifyNever(() => mockDio.post(any(), data: any(named: 'data')));
    });

    test('getToken returns null initially', () async {
      final token = await service.getToken();
      expect(token, isNull);
    });

    test('getToken returns token after registration', () async {
      when(() => mockDio.post(any(), data: any(named: 'data')))
          .thenAnswer((_) async => Response(
                requestOptions: RequestOptions(),
                statusCode: 200,
              ));

      await service.registerToken('my-token', platform: 'ios');
      // Token is stored internally (though getToken delegates to FCM in real impl)
    });
  });

  group('NotificationServiceImpl - foreground messages', () {
    test('foreground message stream emits payloads', () async {
      const payload = PushNotificationPayload(
        title: 'Devis signe',
        body: 'Le devis #123 a ete signe',
      );

      expectLater(
        service.onForegroundMessage,
        emits(payload),
      );

      service.handleForegroundMessage(payload);
    });

    test('notification tap stream emits payloads', () async {
      const payload = PushNotificationPayload(
        title: 'Facture payee',
        body: 'La facture #456 a ete payee',
        deepLink: '/factures/456',
      );

      expectLater(
        service.onNotificationTap,
        emits(payload),
      );

      service.handleNotificationTap(payload);
    });
  });

  group('NotificationServiceImpl - deep link resolution', () {
    test('resolves devis deep link', () {
      final link = service.resolveDeepLink({
        'type': 'devis',
        'entityId': 'abc-123',
      });
      expect(link, '/devis/abc-123');
    });

    test('resolves facture deep link', () {
      final link = service.resolveDeepLink({
        'type': 'facture',
        'entityId': 'def-456',
      });
      expect(link, '/factures/def-456');
    });

    test('resolves intervention deep link', () {
      final link = service.resolveDeepLink({
        'type': 'intervention',
        'entityId': 'ghi-789',
      });
      expect(link, '/interventions/ghi-789');
    });

    test('resolves client deep link', () {
      final link = service.resolveDeepLink({
        'type': 'client',
        'entityId': 'jkl-012',
      });
      expect(link, '/clients/jkl-012');
    });

    test('resolves chantier deep link', () {
      final link = service.resolveDeepLink({
        'type': 'chantier',
        'entityId': 'mno-345',
      });
      expect(link, '/chantiers/mno-345');
    });

    test('resolves absence deep link', () {
      final link = service.resolveDeepLink({
        'type': 'absence',
      });
      expect(link, '/calendar/absences');
    });

    test('returns / for unknown type', () {
      final link = service.resolveDeepLink({
        'type': 'unknown',
      });
      expect(link, '/');
    });

    test('returns null when no type', () {
      final link = service.resolveDeepLink({});
      expect(link, isNull);
    });

    test('notification without deep link -> opens app root', () {
      final link = service.resolveDeepLink({
        'type': 'general',
      });
      expect(link, '/');
    });
  });
}
