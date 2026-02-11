import 'package:json_annotation/json_annotation.dart';

enum AbsenceType {
  @JsonValue('conge')
  conge('conge', 'Congé'),
  @JsonValue('maladie')
  maladie('maladie', 'Maladie'),
  @JsonValue('formation')
  formation('formation', 'Formation'),
  @JsonValue('autre')
  autre('autre', 'Autre');

  const AbsenceType(this.value, this.label);
  final String value;
  final String label;
}
