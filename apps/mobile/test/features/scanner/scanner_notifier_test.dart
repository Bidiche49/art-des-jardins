import 'package:flutter_test/flutter_test.dart';
import 'package:shared_preferences/shared_preferences.dart';

import 'package:art_et_jardin/features/scanner/domain/qr_parser.dart';
import 'package:art_et_jardin/features/scanner/domain/scan_history_service.dart';
import 'package:art_et_jardin/features/scanner/presentation/providers/scanner_providers.dart';

void main() {
  late ScannerNotifier notifier;
  late QrParser parser;
  late ScanHistoryService historyService;

  setUp(() async {
    SharedPreferences.setMockInitialValues({});
    final prefs = await SharedPreferences.getInstance();
    parser = const QrParser();
    historyService = ScanHistoryService(prefs);
    notifier = ScannerNotifier(
      qrParser: parser,
      historyService: historyService,
    );
  });

  tearDown(() {
    notifier.dispose();
  });

  group('ScannerNotifier', () {
    test('initial state has empty history', () {
      expect(notifier.state.history, isEmpty);
      expect(notifier.state.lastResult, isNull);
      expect(notifier.state.error, isNull);
      expect(notifier.state.isProcessing, false);
    });

    test('processScan with valid QR returns result', () async {
      final result = await notifier
          .processScan('aej://chantier/550e8400-e29b-41d4-a716-446655440000');

      expect(result, isNotNull);
      expect(result!.entityType, 'chantier');
      expect(result.entityId, '550e8400-e29b-41d4-a716-446655440000');
      expect(notifier.state.lastResult, isNotNull);
      expect(notifier.state.isProcessing, false);
    });

    test('processScan with valid QR adds to history', () async {
      await notifier
          .processScan('aej://chantier/550e8400-e29b-41d4-a716-446655440000');

      expect(notifier.state.history.length, 1);
      expect(notifier.state.history.first.entityType, 'chantier');
    });

    test('processScan with invalid QR sets error', () async {
      final result = await notifier.processScan('invalid-qr-code');

      expect(result, isNull);
      expect(notifier.state.error, isNotNull);
      expect(notifier.state.isProcessing, false);
    });

    test('clearHistory empties the history list', () async {
      await notifier
          .processScan('aej://chantier/550e8400-e29b-41d4-a716-446655440000');
      expect(notifier.state.history.isNotEmpty, true);

      await notifier.clearHistory();
      expect(notifier.state.history, isEmpty);
    });
  });
}
