import 'package:freezed_annotation/freezed_annotation.dart';

part 'sync_conflict.freezed.dart';
part 'sync_conflict.g.dart';

@freezed
abstract class SyncConflict with _$SyncConflict {
  const factory SyncConflict({
    required String id,
    required String entityType,
    required String entityId,
    required String entityLabel,
    required Map<String, dynamic> localVersion,
    required Map<String, dynamic> serverVersion,
    required DateTime localTimestamp,
    required DateTime serverTimestamp,
    @Default([]) List<String> conflictingFields,
    DateTime? resolvedAt,
  }) = _SyncConflict;

  factory SyncConflict.fromJson(Map<String, dynamic> json) =>
      _$SyncConflictFromJson(json);
}
