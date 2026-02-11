import 'package:json_annotation/json_annotation.dart';

enum ModePaiement {
  @JsonValue('virement')
  virement('virement', 'Virement'),
  @JsonValue('cheque')
  cheque('cheque', 'Chèque'),
  @JsonValue('especes')
  especes('especes', 'Espèces'),
  @JsonValue('carte')
  carte('carte', 'Carte');

  const ModePaiement(this.value, this.label);
  final String value;
  final String label;
}
