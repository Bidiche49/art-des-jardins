import 'package:intl/intl.dart';

/// Currency formatting utilities for EUR.
class CurrencyUtils {
  const CurrencyUtils._();

  static final NumberFormat _eurFormat = NumberFormat.currency(
    locale: 'fr_FR',
    symbol: 'EUR',
    decimalDigits: 2,
  );

  /// Formats a [double] as EUR: "1 234,56 EUR".
  static String formatEUR(double amount) {
    return _eurFormat.format(amount);
  }
}
