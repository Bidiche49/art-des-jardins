import '../utils/date_utils.dart';

/// Convenience extensions on [DateTime].
extension DateTimeExtensions on DateTime {
  /// Formats as "dd/MM/yyyy".
  String get formatted => AppDateUtils.formatDate(this);

  /// Formats as "dd/MM/yyyy HH:mm".
  String get formattedWithTime => AppDateUtils.formatDateTime(this);

  /// Formats as relative string ("Aujourd'hui", "Hier", etc.).
  String get relative => AppDateUtils.formatRelative(this);

  /// Returns true if same calendar day as [other].
  bool isSameDay(DateTime other) =>
      year == other.year && month == other.month && day == other.day;

  /// Returns a [DateTime] at midnight (start of day).
  DateTime get startOfDay => DateTime(year, month, day);

  /// Returns a [DateTime] at 23:59:59.999.
  DateTime get endOfDay => DateTime(year, month, day, 23, 59, 59, 999);
}
