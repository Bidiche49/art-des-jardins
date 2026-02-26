/// Represents an event emitted after a sync operation completes successfully.
class SyncEvent {
  const SyncEvent({
    required this.operation,
    required this.entity,
    this.entityId,
    this.tempEntityId,
    this.responseData,
  });

  /// The operation that was synced: 'create', 'update', or 'delete'.
  final String operation;

  /// The entity type: 'devis', 'client', 'chantier', etc.
  final String entity;

  /// The real entity ID (from API response for create, or the original for update/delete).
  final String? entityId;

  /// The temporary entity ID used during offline creation.
  final String? tempEntityId;

  /// The raw API response data (for create/update operations).
  final Map<String, dynamic>? responseData;

  @override
  String toString() =>
      'SyncEvent($operation, $entity, entityId=$entityId, tempId=$tempEntityId)';
}
