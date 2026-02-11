import 'dart:async';

import 'package:connectivity_plus/connectivity_plus.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:mocktail/mocktail.dart';

import 'package:art_et_jardin/core/network/connectivity_service.dart';

class MockConnectivity extends Mock implements Connectivity {}

void main() {
  late MockConnectivity mockConnectivity;
  late ConnectivityService service;

  setUp(() {
    mockConnectivity = MockConnectivity();
    service = ConnectivityService(connectivity: mockConnectivity);
  });

  tearDown(() {
    service.dispose();
  });

  group('ConnectivityService', () {
    test('detects online state correctly', () async {
      when(() => mockConnectivity.checkConnectivity())
          .thenAnswer((_) async => [ConnectivityResult.wifi]);

      final status = await service.getCurrentStatus();
      expect(status, ConnectivityStatus.online);
    });

    test('detects offline state correctly', () async {
      when(() => mockConnectivity.checkConnectivity())
          .thenAnswer((_) async => [ConnectivityResult.none]);

      final status = await service.getCurrentStatus();
      expect(status, ConnectivityStatus.offline);
    });

    test('stream emits on connectivity change', () async {
      final controller =
          StreamController<List<ConnectivityResult>>.broadcast();
      when(() => mockConnectivity.onConnectivityChanged)
          .thenAnswer((_) => controller.stream);

      service.startListening();

      final future = service.statusStream.first;
      controller.add([ConnectivityResult.wifi]);

      final status = await future;
      expect(status, ConnectivityStatus.online);

      await controller.close();
    });

    test('transitions online to offline', () async {
      final controller =
          StreamController<List<ConnectivityResult>>.broadcast();
      when(() => mockConnectivity.onConnectivityChanged)
          .thenAnswer((_) => controller.stream);

      service.startListening();

      final statuses = <ConnectivityStatus>[];
      final sub = service.statusStream.listen(statuses.add);

      controller.add([ConnectivityResult.wifi]);
      await Future<void>.delayed(Duration.zero);

      controller.add([ConnectivityResult.none]);
      await Future<void>.delayed(Duration.zero);

      expect(statuses, [ConnectivityStatus.online, ConnectivityStatus.offline]);

      await sub.cancel();
      await controller.close();
    });

    test('detects WiFi connection', () async {
      when(() => mockConnectivity.checkConnectivity())
          .thenAnswer((_) async => [ConnectivityResult.wifi]);

      expect(await service.isWifi, isTrue);
      expect(await service.isMobile, isFalse);
    });

    test('detects mobile connection', () async {
      when(() => mockConnectivity.checkConnectivity())
          .thenAnswer((_) async => [ConnectivityResult.mobile]);

      expect(await service.isMobile, isTrue);
      expect(await service.isWifi, isFalse);
    });
  });
}
