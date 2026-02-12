import 'dart:async';

import 'package:flutter/foundation.dart';

import 'services/crash_reporting/crash_reporting_service.dart';

/// Initialise les services de l'application.
///
/// Parallelise les initialisations independantes pour un startup rapide.
/// Configure le crash reporting pour capturer les erreurs non gerees.
Future<void> bootstrap() async {
  final crashReporting = CrashReportingServiceImpl();

  // Setup global error handlers
  FlutterError.onError = (details) {
    FlutterError.presentError(details);
    crashReporting.recordError(
      details.exception,
      details.stack,
      fatal: false,
    );
  };

  PlatformDispatcher.instance.onError = (error, stack) {
    crashReporting.recordError(error, stack, fatal: true);
    return true;
  };

  // Parallel init of independent services
  await Future.wait([
    crashReporting.initialize(),
    // Drift, Dio, SecureStorage, FCM init handled via Riverpod providers
    // They are lazy-initialized on first access, which is the Flutter way
  ]);

  debugPrint('[Bootstrap] App initialized');
}
