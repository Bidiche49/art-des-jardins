import 'package:json_annotation/json_annotation.dart';

enum FactureStatut {
  @JsonValue('brouillon')
  brouillon('brouillon', 'Brouillon'),
  @JsonValue('envoyee')
  envoyee('envoyee', 'Envoyée'),
  @JsonValue('payee')
  payee('payee', 'Payée'),
  @JsonValue('annulee')
  annulee('annulee', 'Annulée');

  const FactureStatut(this.value, this.label);
  final String value;
  final String label;
}
