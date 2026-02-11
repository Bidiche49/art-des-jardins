import 'package:json_annotation/json_annotation.dart';

enum SenderType {
  @JsonValue('client')
  client('client', 'Client'),
  @JsonValue('entreprise')
  entreprise('entreprise', 'Entreprise');

  const SenderType(this.value, this.label);
  final String value;
  final String label;
}
