import 'package:json_annotation/json_annotation.dart';

enum DocumentType {
  @JsonValue('devis')
  devis('devis', 'Devis'),
  @JsonValue('devis_signe')
  devisSigne('devis_signe', 'Devis signé'),
  @JsonValue('facture')
  facture('facture', 'Facture'),
  @JsonValue('relance')
  relance('relance', 'Relance');

  const DocumentType(this.value, this.label);
  final String value;
  final String label;
}
