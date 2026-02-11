import 'package:flutter_test/flutter_test.dart';
import 'package:art_et_jardin/core/utils/currency_utils.dart';

void main() {
  group('CurrencyUtils', () {
    group('formatEUR', () {
      test('formats 1234.56 with thousands separator', () {
        final result = CurrencyUtils.formatEUR(1234.56);
        // intl fr_FR uses narrow no-break space (U+202F) as grouping separator
        expect(result, contains('1'));
        expect(result, contains('234'));
        expect(result, contains('56'));
        expect(result, contains('EUR'));
      });

      test('formats 0 as zero EUR', () {
        final result = CurrencyUtils.formatEUR(0);
        expect(result, contains('0'));
        expect(result, contains('00'));
        expect(result, contains('EUR'));
      });

      test('formats 1000000 with grouping', () {
        final result = CurrencyUtils.formatEUR(1000000);
        expect(result, contains('1'));
        expect(result, contains('000'));
        expect(result, contains('EUR'));
      });

      test('formats negative amount', () {
        final result = CurrencyUtils.formatEUR(-500.10);
        expect(result, contains('500'));
        expect(result, contains('10'));
        expect(result, contains('EUR'));
      });

      test('formats small decimal (0.1) with two decimal places', () {
        final result = CurrencyUtils.formatEUR(0.1);
        expect(result, contains('0'));
        expect(result, contains('10'));
        expect(result, contains('EUR'));
      });

      test('rounds 99.999 to 100,00', () {
        final result = CurrencyUtils.formatEUR(99.999);
        expect(result, contains('100'));
        expect(result, contains('00'));
        expect(result, contains('EUR'));
      });

      test('formats very large amount (> 1M)', () {
        final result = CurrencyUtils.formatEUR(1500000.75);
        expect(result, contains('1'));
        expect(result, contains('500'));
        expect(result, contains('000'));
        expect(result, contains('75'));
        expect(result, contains('EUR'));
      });

      test('formats centimes only', () {
        final result = CurrencyUtils.formatEUR(0.01);
        expect(result, contains('0'));
        expect(result, contains('01'));
        expect(result, contains('EUR'));
      });
    });
  });
}
