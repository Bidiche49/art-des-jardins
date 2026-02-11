import 'package:json_annotation/json_annotation.dart';

enum CalendarProvider {
  @JsonValue('google')
  google('google', 'Google'),
  @JsonValue('microsoft')
  microsoft('microsoft', 'Microsoft');

  const CalendarProvider(this.value, this.label);
  final String value;
  final String label;
}
