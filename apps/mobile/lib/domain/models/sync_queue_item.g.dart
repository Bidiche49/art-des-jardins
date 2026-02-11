// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'sync_queue_item.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

_SyncQueueItem _$SyncQueueItemFromJson(Map<String, dynamic> json) =>
    _SyncQueueItem(
      id: json['id'] as String,
      operation: json['operation'] as String,
      entity: json['entity'] as String,
      entityId: json['entityId'] as String?,
      data: json['data'] as Map<String, dynamic>,
      timestamp: (json['timestamp'] as num).toInt(),
      retryCount: (json['retryCount'] as num?)?.toInt() ?? 0,
      lastError: json['lastError'] as String?,
      status:
          $enumDecodeNullable(_$SyncStatusEnumMap, json['status']) ??
          SyncStatus.pending,
    );

Map<String, dynamic> _$SyncQueueItemToJson(_SyncQueueItem instance) =>
    <String, dynamic>{
      'id': instance.id,
      'operation': instance.operation,
      'entity': instance.entity,
      'entityId': instance.entityId,
      'data': instance.data,
      'timestamp': instance.timestamp,
      'retryCount': instance.retryCount,
      'lastError': instance.lastError,
      'status': _$SyncStatusEnumMap[instance.status]!,
    };

const _$SyncStatusEnumMap = {
  SyncStatus.pending: 'pending',
  SyncStatus.syncing: 'syncing',
  SyncStatus.synced: 'synced',
  SyncStatus.failed: 'failed',
  SyncStatus.conflict: 'conflict',
};
