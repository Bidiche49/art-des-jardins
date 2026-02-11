import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../../../data/local/preferences/app_preferences.dart';
import '../../domain/qr_parser.dart';
import '../../domain/scan_history_service.dart';

// ============== QR Parser ==============

final qrParserProvider = Provider<QrParser>((ref) {
  return const QrParser();
});

// ============== Scan History ==============

final scanHistoryServiceProvider = Provider<ScanHistoryService>((ref) {
  return ScanHistoryService(ref.read(sharedPrefsProvider));
});

// ============== Scanner Notifier ==============

final scannerNotifierProvider =
    StateNotifierProvider<ScannerNotifier, ScannerState>((ref) {
  return ScannerNotifier(
    qrParser: ref.read(qrParserProvider),
    historyService: ref.read(scanHistoryServiceProvider),
  );
});

class ScannerState {
  const ScannerState({
    this.lastResult,
    this.error,
    this.history = const [],
    this.isProcessing = false,
  });

  final QrParseResult? lastResult;
  final String? error;
  final List<ScanHistoryEntry> history;
  final bool isProcessing;

  ScannerState copyWith({
    QrParseResult? lastResult,
    String? error,
    List<ScanHistoryEntry>? history,
    bool? isProcessing,
  }) {
    return ScannerState(
      lastResult: lastResult ?? this.lastResult,
      error: error,
      history: history ?? this.history,
      isProcessing: isProcessing ?? this.isProcessing,
    );
  }
}

class ScannerNotifier extends StateNotifier<ScannerState> {
  ScannerNotifier({
    required QrParser qrParser,
    required ScanHistoryService historyService,
  })  : _qrParser = qrParser,
        _historyService = historyService,
        super(const ScannerState()) {
    loadHistory();
  }

  final QrParser _qrParser;
  final ScanHistoryService _historyService;

  void loadHistory() {
    final history = _historyService.getHistory();
    state = state.copyWith(history: history);
  }

  Future<QrParseResult?> processScan(String rawValue) async {
    state = state.copyWith(isProcessing: true, error: null);
    try {
      final result = _qrParser.parse(rawValue);

      final label =
          '${result.entityType[0].toUpperCase()}${result.entityType.substring(1)} ${result.entityId.substring(0, 8)}...';

      await _historyService.addEntry(ScanHistoryEntry(
        entityType: result.entityType,
        entityId: result.entityId,
        label: label,
        scannedAt: DateTime.now(),
      ));

      loadHistory();
      state = state.copyWith(lastResult: result, isProcessing: false);
      return result;
    } on QrParseException catch (e) {
      state = state.copyWith(error: e.message, isProcessing: false);
      return null;
    }
  }

  Future<void> clearHistory() async {
    await _historyService.clear();
    state = state.copyWith(history: []);
  }
}
