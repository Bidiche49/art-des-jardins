import 'package:intl/intl.dart';

/// Date formatting utilities with French locale.
class AppDateUtils {
  const AppDateUtils._();

  static final DateFormat _dateFormat = DateFormat('dd/MM/yyyy');
  static final DateFormat _dateTimeFormat = DateFormat('dd/MM/yyyy HH:mm');

  /// Formats a [DateTime] as "dd/MM/yyyy".
  static String formatDate(DateTime date) => _dateFormat.format(date);

  /// Formats a [DateTime] as "dd/MM/yyyy HH:mm".
  static String formatDateTime(DateTime date) => _dateTimeFormat.format(date);

  /// Formats a [DateTime] relative to now (FR).
  ///
  /// Returns "Aujourd'hui", "Hier", or "il y a X jours".
  static String formatRelative(DateTime date) {
    final now = DateTime.now();
    final today = DateTime(now.year, now.month, now.day);
    final target = DateTime(date.year, date.month, date.day);
    final difference = today.difference(target).inDays;

    if (difference == 0) return "Aujourd'hui";
    if (difference == 1) return 'Hier';
    if (difference > 1) return 'il y a $difference jours';

    // Future dates
    if (difference == -1) return 'Demain';
    return 'dans ${-difference} jours';
  }
}
