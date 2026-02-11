import 'dart:convert';

import 'package:shared_preferences/shared_preferences.dart';

/// A scan history entry.
class ScanHistoryEntry {
  const ScanHistoryEntry({
    required this.entityType,
    required this.entityId,
    required this.label,
    required this.scannedAt,
  });

  final String entityType;
  final String entityId;
  final String label;
  final DateTime scannedAt;

  Map<String, dynamic> toJson() => {
        'entityType': entityType,
        'entityId': entityId,
        'label': label,
        'scannedAt': scannedAt.toIso8601String(),
      };

  factory ScanHistoryEntry.fromJson(Map<String, dynamic> json) {
    return ScanHistoryEntry(
      entityType: json['entityType'] as String,
      entityId: json['entityId'] as String,
      label: json['label'] as String,
      scannedAt: DateTime.parse(json['scannedAt'] as String),
    );
  }
}

/// Manages QR scan history (max 10 entries, FIFO).
class ScanHistoryService {
  ScanHistoryService(this._prefs);

  final SharedPreferences _prefs;
  static const _key = 'scan_history';
  static const int maxEntries = 10;

  List<ScanHistoryEntry> getHistory() {
    final raw = _prefs.getString(_key);
    if (raw == null) return [];
    try {
      final list = jsonDecode(raw) as List;
      return list
          .map((e) => ScanHistoryEntry.fromJson(e as Map<String, dynamic>))
          .toList();
    } catch (_) {
      return [];
    }
  }

  Future<void> addEntry(ScanHistoryEntry entry) async {
    final history = getHistory();
    // Remove duplicate if exists
    history.removeWhere((e) => e.entityId == entry.entityId);
    // Add at beginning
    history.insert(0, entry);
    // Keep max entries
    final trimmed = history.take(maxEntries).toList();
    await _prefs.setString(
      _key,
      jsonEncode(trimmed.map((e) => e.toJson()).toList()),
    );
  }

  Future<void> clear() async {
    await _prefs.remove(_key);
  }
}
