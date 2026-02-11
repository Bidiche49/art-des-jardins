import 'package:json_annotation/json_annotation.dart';

enum ChantierStatut {
  @JsonValue('lead')
  lead('lead', 'Lead'),
  @JsonValue('visite_planifiee')
  visitePlanifiee('visite_planifiee', 'Visite planifiée'),
  @JsonValue('devis_envoye')
  devisEnvoye('devis_envoye', 'Devis envoyé'),
  @JsonValue('accepte')
  accepte('accepte', 'Accepté'),
  @JsonValue('planifie')
  planifie('planifie', 'Planifié'),
  @JsonValue('en_cours')
  enCours('en_cours', 'En cours'),
  @JsonValue('termine')
  termine('termine', 'Terminé'),
  @JsonValue('facture')
  facture('facture', 'Facturé'),
  @JsonValue('annule')
  annule('annule', 'Annulé');

  const ChantierStatut(this.value, this.label);
  final String value;
  final String label;
}
