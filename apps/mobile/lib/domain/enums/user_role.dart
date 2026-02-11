import 'package:json_annotation/json_annotation.dart';

enum UserRole {
  @JsonValue('patron')
  patron('patron', 'Patron'),
  @JsonValue('employe')
  employe('employe', 'Employé');

  const UserRole(this.value, this.label);
  final String value;
  final String label;
}
