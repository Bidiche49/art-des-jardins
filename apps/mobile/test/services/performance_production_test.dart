import 'package:flutter_test/flutter_test.dart';

import 'package:art_et_jardin/core/config/env_config.dart';
import 'package:art_et_jardin/core/config/performance_config.dart';
import 'package:art_et_jardin/services/crash_reporting/crash_reporting_service.dart';
import 'package:art_et_jardin/services/analytics/analytics_service.dart';

void main() {
  // ============================================================
  // CRASH REPORTING SERVICE
  // ============================================================
  group('CrashReportingService', () {
    late CrashReportingServiceImpl service;

    setUp(() {
      service = CrashReportingServiceImpl();
    });

    test('initialize sets initialized flag', () async {
      expect(service.isInitialized, isFalse);
      await service.initialize();
      expect(service.isInitialized, isTrue);
    });

    test('initialize is idempotent', () async {
      await service.initialize();
      await service.initialize(); // should not crash
      expect(service.isInitialized, isTrue);
    });

    test('recordError does nothing when not initialized', () async {
      // Should not throw
      await service.recordError(Exception('test'), StackTrace.empty);
    });

    test('recordError works when initialized', () async {
      await service.initialize();
      await service.recordError(Exception('test'), StackTrace.empty);
      // No assertion needed - just verifies no crash
    });

    test('recordError with fatal flag works', () async {
      await service.initialize();
      await service.recordError(
        Exception('fatal'),
        StackTrace.empty,
        fatal: true,
      );
    });

    test('setUserId stores user ID', () async {
      await service.setUserId('user-123');
      expect(service.userId, 'user-123');
    });

    test('clearUserId removes user ID', () async {
      await service.setUserId('user-123');
      await service.clearUserId();
      expect(service.userId, isNull);
    });

    test('log adds breadcrumb', () async {
      await service.setEnabled(true);
      await service.log('Navigation to /clients');
      expect(service.breadcrumbs, contains('Navigation to /clients'));
    });

    test('log respects max 100 breadcrumbs', () async {
      await service.setEnabled(true);
      for (var i = 0; i < 110; i++) {
        await service.log('Message $i');
      }
      expect(service.breadcrumbs.length, 100);
      // First messages should be removed
      expect(service.breadcrumbs.first, 'Message 10');
      expect(service.breadcrumbs.last, 'Message 109');
    });

    test('setEnabled disables logging', () async {
      await service.setEnabled(false);
      await service.log('Should not appear');
      expect(service.breadcrumbs, isEmpty);
    });

    test('recordError does nothing when disabled', () async {
      await service.initialize();
      await service.setEnabled(false);
      // Should not throw
      await service.recordError(Exception('ignored'), null);
    });
  });

  // ============================================================
  // ANALYTICS SERVICE
  // ============================================================
  group('AnalyticsService', () {
    late AnalyticsServiceImpl service;

    setUp(() {
      service = AnalyticsServiceImpl();
    });

    test('initialize sets initialized flag', () async {
      expect(service.isInitialized, isFalse);
      await service.initialize();
      expect(service.isInitialized, isTrue);
    });

    test('initialize is idempotent', () async {
      await service.initialize();
      await service.initialize(); // should not crash
      expect(service.isInitialized, isTrue);
    });

    test('logScreenView records screen event', () async {
      await service.initialize();
      await service.logScreenView('/dashboard');
      expect(service.events, hasLength(1));
      expect(service.events.first.name, 'screen_view');
      expect(service.events.first.parameters?['screen_name'], '/dashboard');
    });

    test('logScreenView does nothing before init', () async {
      await service.logScreenView('/dashboard');
      expect(service.events, isEmpty);
    });

    test('logEvent records custom event', () async {
      await service.initialize();
      await service.logEvent('create_client', parameters: {'type': 'pro'});
      expect(service.events, hasLength(1));
      expect(service.events.first.name, 'create_client');
      expect(service.events.first.parameters?['type'], 'pro');
    });

    test('logEvent strips personal data', () async {
      await service.initialize();
      await service.logEvent('test', parameters: {
        'email': 'test@test.fr',
        'phone': '0612345678',
        'name': 'Dupont',
        'address': '123 rue Test',
        'type': 'pro',
      });
      expect(service.events.first.parameters, isNotNull);
      expect(service.events.first.parameters!.containsKey('email'), isFalse);
      expect(service.events.first.parameters!.containsKey('phone'), isFalse);
      expect(service.events.first.parameters!.containsKey('name'), isFalse);
      expect(service.events.first.parameters!.containsKey('address'), isFalse);
      expect(service.events.first.parameters!['type'], 'pro');
    });

    test('logEvent with no parameters works', () async {
      await service.initialize();
      await service.logEvent('sync_complete');
      expect(service.events.first.parameters, isNull);
    });

    test('setUserId stores user ID', () async {
      await service.setUserId('user-123');
      expect(service.userId, 'user-123');
    });

    test('clearUser removes user and events', () async {
      await service.initialize();
      await service.setUserId('user-123');
      await service.logEvent('test');
      await service.clearUser();
      expect(service.userId, isNull);
      expect(service.events, isEmpty);
    });
  });

  // ============================================================
  // ANALYTICS EVENTS CONSTANTS
  // ============================================================
  group('AnalyticsEvents', () {
    test('all standard events defined', () {
      expect(AnalyticsEvents.login, 'login');
      expect(AnalyticsEvents.logout, 'logout');
      expect(AnalyticsEvents.createClient, 'create_client');
      expect(AnalyticsEvents.createDevis, 'create_devis');
      expect(AnalyticsEvents.signDevis, 'sign_devis');
      expect(AnalyticsEvents.createIntervention, 'create_intervention');
      expect(AnalyticsEvents.syncComplete, 'sync_complete');
      expect(AnalyticsEvents.photoCapture, 'photo_capture');
      expect(AnalyticsEvents.scanQrCode, 'scan_qr_code');
      expect(AnalyticsEvents.exportPdf, 'export_pdf');
    });
  });

  // ============================================================
  // PERFORMANCE CONFIG
  // ============================================================
  group('PerformanceConfig', () {
    test('timeout values are correct', () {
      expect(PerformanceConfig.listingTimeout, const Duration(seconds: 10));
      expect(PerformanceConfig.uploadTimeout, const Duration(seconds: 30));
      expect(PerformanceConfig.pdfTimeout, const Duration(seconds: 60));
      expect(PerformanceConfig.defaultTimeout, const Duration(seconds: 30));
    });

    test('image cache config values', () {
      expect(PerformanceConfig.imageCacheMaxSizeMB, 100);
      expect(PerformanceConfig.imageCacheMaxSizeBytes, 100 * 1024 * 1024);
      expect(PerformanceConfig.thumbnailMaxWidth, 300);
      expect(PerformanceConfig.thumbnailMaxHeight, 300);
    });

    test('photo compression config values', () {
      expect(PerformanceConfig.photoMaxWidth, 1920);
      expect(PerformanceConfig.photoMaxHeight, 1920);
      expect(PerformanceConfig.photoQuality, 80);
      expect(PerformanceConfig.photoCompressedMaxWidth, 1200);
      expect(PerformanceConfig.photoCompressedQuality, 75);
    });

    test('list config values', () {
      expect(PerformanceConfig.defaultPageSize, 20);
      expect(PerformanceConfig.maxItemsInMemory, 500);
    });

    test('startup time target', () {
      expect(PerformanceConfig.maxStartupTime, const Duration(seconds: 2));
    });
  });

  // ============================================================
  // ENV CONFIG
  // ============================================================
  group('EnvConfig', () {
    test('default API URL is localhost', () {
      expect(EnvConfig.apiUrl, 'http://localhost:3000/api/v1');
    });

    test('default environment is development', () {
      expect(EnvConfig.environment, 'development');
    });

    test('isDevelopment is true by default', () {
      expect(EnvConfig.isDevelopment, isTrue);
    });

    test('isProduction is false by default', () {
      expect(EnvConfig.isProduction, isFalse);
    });

    test('isStaging is false by default', () {
      expect(EnvConfig.isStaging, isFalse);
    });

    test('isValidEnvironment is true for development', () {
      expect(EnvConfig.isValidEnvironment, isTrue);
    });

    test('default timeout is 30 seconds', () {
      expect(EnvConfig.apiTimeout, const Duration(seconds: 30));
    });

    test('bundle ID is correct', () {
      expect(EnvConfig.bundleId, 'com.artetjardin.mobile');
    });

    test('app name is correct', () {
      expect(EnvConfig.appName, 'Art & Jardin');
    });
  });

  // ============================================================
  // ANALYTICS EVENT CLASS
  // ============================================================
  group('AnalyticsEvent', () {
    test('stores name and parameters', () {
      final event = AnalyticsEvent('test', {'key': 'value'});
      expect(event.name, 'test');
      expect(event.parameters?['key'], 'value');
    });

    test('parameters can be null', () {
      final event = AnalyticsEvent('test');
      expect(event.name, 'test');
      expect(event.parameters, isNull);
    });
  });
}
