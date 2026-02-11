import 'package:freezed_annotation/freezed_annotation.dart';

import '../enums/sync_status.dart';

part 'sync_queue_item.freezed.dart';
part 'sync_queue_item.g.dart';

@freezed
abstract class SyncQueueItem with _$SyncQueueItem {
  const factory SyncQueueItem({
    required String id,
    required String operation,
    required String entity,
    String? entityId,
    required Map<String, dynamic> data,
    required int timestamp,
    @Default(0) int retryCount,
    String? lastError,
    @Default(SyncStatus.pending) SyncStatus status,
  }) = _SyncQueueItem;

  factory SyncQueueItem.fromJson(Map<String, dynamic> json) =>
      _$SyncQueueItemFromJson(json);
}
