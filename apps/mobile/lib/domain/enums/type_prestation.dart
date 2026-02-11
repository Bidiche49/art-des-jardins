import 'package:json_annotation/json_annotation.dart';

enum TypePrestation {
  @JsonValue('paysagisme')
  paysagisme('paysagisme', 'Paysagisme'),
  @JsonValue('entretien')
  entretien('entretien', 'Entretien'),
  @JsonValue('elagage')
  elagage('elagage', 'Élagage'),
  @JsonValue('abattage')
  abattage('abattage', 'Abattage'),
  @JsonValue('tonte')
  tonte('tonte', 'Tonte'),
  @JsonValue('taille')
  taille('taille', 'Taille'),
  @JsonValue('autre')
  autre('autre', 'Autre');

  const TypePrestation(this.value, this.label);
  final String value;
  final String label;
}
