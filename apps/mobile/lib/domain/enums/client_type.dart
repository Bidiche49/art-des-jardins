import 'package:json_annotation/json_annotation.dart';

enum ClientType {
  @JsonValue('particulier')
  particulier('particulier', 'Particulier'),
  @JsonValue('professionnel')
  professionnel('professionnel', 'Professionnel'),
  @JsonValue('syndic')
  syndic('syndic', 'Syndic');

  const ClientType(this.value, this.label);
  final String value;
  final String label;
}
