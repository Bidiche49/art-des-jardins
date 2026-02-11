import '../../domain/models/sync_conflict.dart';

class ConflictService {
  static const Set<String> _excludedFields = {
    'id',
    'version',
    'createdAt',
    'updatedAt',
    'created_at',
    'updated_at',
  };

  bool hasConflict(Map<String, dynamic> local, Map<String, dynamic> server) {
    final localVersion = (local['version'] as num?)?.toInt() ?? 0;
    final serverVersion = (server['version'] as num?)?.toInt() ?? 0;

    if (serverVersion > localVersion) return true;

    if (serverVersion == localVersion) {
      final localUpdated = local['updatedAt'] ?? local['updated_at'];
      final serverUpdated = server['updatedAt'] ?? server['updated_at'];

      if (localUpdated != null && serverUpdated != null) {
        final localDate = DateTime.parse(localUpdated.toString());
        final serverDate = DateTime.parse(serverUpdated.toString());
        return serverDate.isAfter(localDate);
      }
    }

    return false;
  }

  List<String> detectConflictingFields(
    Map<String, dynamic> local,
    Map<String, dynamic> server,
  ) {
    final allKeys = <String>{...local.keys, ...server.keys}
      ..removeAll(_excludedFields);

    final conflicting = <String>[];
    for (final key in allKeys) {
      if (local[key] != server[key]) {
        conflicting.add(key);
      }
    }
    conflicting.sort();
    return conflicting;
  }

  SyncConflict createSyncConflict({
    required String entityType,
    required String entityId,
    required String entityLabel,
    required Map<String, dynamic> localVersion,
    required Map<String, dynamic> serverVersion,
    required DateTime localTimestamp,
    required DateTime serverTimestamp,
  }) {
    return SyncConflict(
      id: '${entityType}_${entityId}_${DateTime.now().millisecondsSinceEpoch}',
      entityType: entityType,
      entityId: entityId,
      entityLabel: entityLabel,
      localVersion: localVersion,
      serverVersion: serverVersion,
      localTimestamp: localTimestamp,
      serverTimestamp: serverTimestamp,
      conflictingFields: detectConflictingFields(localVersion, serverVersion),
    );
  }

  Map<String, dynamic> resolveConflict({
    required SyncConflict conflict,
    required String strategy,
    Map<String, dynamic>? mergeOverrides,
  }) {
    switch (strategy) {
      case 'local':
        return Map<String, dynamic>.from(conflict.localVersion);
      case 'server':
        return Map<String, dynamic>.from(conflict.serverVersion);
      case 'merge':
        return mergeData(
          conflict.localVersion,
          conflict.serverVersion,
          mergeOverrides ?? {},
        );
      default:
        throw ArgumentError('Unknown resolution strategy: $strategy');
    }
  }

  Map<String, dynamic> mergeData(
    Map<String, dynamic> local,
    Map<String, dynamic> server,
    Map<String, dynamic> overrides,
  ) {
    final result = Map<String, dynamic>.from(server);
    for (final entry in overrides.entries) {
      result[entry.key] = entry.value;
    }
    return result;
  }
}
