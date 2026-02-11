import 'package:json_annotation/json_annotation.dart';

enum DevisStatut {
  @JsonValue('brouillon')
  brouillon('brouillon', 'Brouillon'),
  @JsonValue('envoye')
  envoye('envoye', 'Envoyé'),
  @JsonValue('signe')
  signe('signe', 'Signé'),
  @JsonValue('accepte')
  accepte('accepte', 'Accepté'),
  @JsonValue('refuse')
  refuse('refuse', 'Refusé'),
  @JsonValue('expire')
  expire('expire', 'Expiré');

  const DevisStatut(this.value, this.label);
  final String value;
  final String label;
}
