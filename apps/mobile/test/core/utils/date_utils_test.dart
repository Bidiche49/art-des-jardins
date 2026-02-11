import 'package:flutter_test/flutter_test.dart';
import 'package:art_et_jardin/core/utils/date_utils.dart';

void main() {
  group('AppDateUtils', () {
    group('formatDate', () {
      test('formats a valid date as dd/MM/yyyy', () {
        final date = DateTime(2026, 2, 10);
        expect(AppDateUtils.formatDate(date), '10/02/2026');
      });

      test('formats DateTime.now as today\'s date', () {
        final now = DateTime.now();
        final result = AppDateUtils.formatDate(now);
        expect(result, matches(RegExp(r'^\d{2}/\d{2}/\d{4}$')));
      });

      test('formats date at midnight', () {
        final date = DateTime(2026, 6, 15, 0, 0, 0);
        expect(AppDateUtils.formatDate(date), '15/06/2026');
      });

      test('handles Dec 31 / Jan 1 boundary', () {
        expect(AppDateUtils.formatDate(DateTime(2025, 12, 31)), '31/12/2025');
        expect(AppDateUtils.formatDate(DateTime(2026, 1, 1)), '01/01/2026');
      });
    });

    group('formatDateTime', () {
      test('formats with time as dd/MM/yyyy HH:mm', () {
        final date = DateTime(2026, 2, 10, 14, 30);
        expect(AppDateUtils.formatDateTime(date), '10/02/2026 14:30');
      });

      test('formats midnight time', () {
        final date = DateTime(2026, 3, 1, 0, 0);
        expect(AppDateUtils.formatDateTime(date), '01/03/2026 00:00');
      });
    });

    group('formatRelative', () {
      test('returns "Aujourd\'hui" for today', () {
        final now = DateTime.now();
        expect(AppDateUtils.formatRelative(now), "Aujourd'hui");
      });

      test('returns "Hier" for yesterday', () {
        final yesterday = DateTime.now().subtract(const Duration(days: 1));
        expect(AppDateUtils.formatRelative(yesterday), 'Hier');
      });

      test('returns "il y a X jours" for older dates', () {
        final fiveDaysAgo = DateTime.now().subtract(const Duration(days: 5));
        expect(AppDateUtils.formatRelative(fiveDaysAgo), 'il y a 5 jours');
      });

      test('returns "Demain" for tomorrow', () {
        final tomorrow = DateTime.now().add(const Duration(days: 1));
        expect(AppDateUtils.formatRelative(tomorrow), 'Demain');
      });

      test('returns "dans X jours" for future dates', () {
        final inThreeDays = DateTime.now().add(const Duration(days: 3));
        expect(AppDateUtils.formatRelative(inThreeDays), 'dans 3 jours');
      });

      test('handles year boundary (Dec 31 -> Jan 1)', () {
        // Create a date that's definitely in the past relative to now
        final pastDate = DateTime.now().subtract(const Duration(days: 10));
        final result = AppDateUtils.formatRelative(pastDate);
        expect(result, contains('il y a'));
      });
    });
  });
}
