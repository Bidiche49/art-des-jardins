import 'package:json_annotation/json_annotation.dart';

enum PhotoType {
  @JsonValue('BEFORE')
  before('BEFORE', 'Avant'),
  @JsonValue('DURING')
  during('DURING', 'Pendant'),
  @JsonValue('AFTER')
  after('AFTER', 'Après');

  const PhotoType(this.value, this.label);
  final String value;
  final String label;
}
