import 'package:json_annotation/json_annotation.dart';

enum SyncStatus {
  @JsonValue('pending')
  pending('pending', 'En attente'),
  @JsonValue('syncing')
  syncing('syncing', 'Synchronisation'),
  @JsonValue('synced')
  synced('synced', 'Synchronisé'),
  @JsonValue('failed')
  failed('failed', 'Échoué'),
  @JsonValue('conflict')
  conflict('conflict', 'Conflit');

  const SyncStatus(this.value, this.label);
  final String value;
  final String label;
}
