import 'package:json_annotation/json_annotation.dart';

enum NotificationType {
  @JsonValue('info')
  info('info', 'Information'),
  @JsonValue('warning')
  warning('warning', 'Avertissement'),
  @JsonValue('success')
  success('success', 'Succès'),
  @JsonValue('action_required')
  actionRequired('action_required', 'Action requise');

  const NotificationType(this.value, this.label);
  final String value;
  final String label;
}
