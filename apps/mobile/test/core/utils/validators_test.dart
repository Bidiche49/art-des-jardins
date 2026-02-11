import 'package:flutter_test/flutter_test.dart';
import 'package:art_et_jardin/core/utils/validators.dart';

void main() {
  group('Validators', () {
    group('required', () {
      test('returns error for null', () {
        expect(Validators.required(null), isNotNull);
      });

      test('returns error for empty string', () {
        expect(Validators.required(''), isNotNull);
      });

      test('returns error for whitespace only', () {
        expect(Validators.required('   '), isNotNull);
      });

      test('returns null for valid text', () {
        expect(Validators.required('hello'), isNull);
      });
    });

    group('email', () {
      test('accepts valid email', () {
        expect(Validators.email('user@example.com'), isNull);
      });

      test('accepts email with subdomain', () {
        expect(Validators.email('user@sub.example.com'), isNull);
      });

      test('accepts email with plus sign', () {
        expect(Validators.email('user+tag@example.com'), isNull);
      });

      test('rejects email without @', () {
        expect(Validators.email('userexample.com'), isNotNull);
      });

      test('rejects email without domain', () {
        expect(Validators.email('user@'), isNotNull);
      });
    });

    group('phoneFR', () {
      test('accepts 06 format', () {
        expect(Validators.phoneFR('0612345678'), isNull);
      });

      test('accepts 07 format', () {
        expect(Validators.phoneFR('0712345678'), isNull);
      });

      test('accepts +33 format', () {
        expect(Validators.phoneFR('+33612345678'), isNull);
      });

      test('accepts number with spaces', () {
        expect(Validators.phoneFR('06 12 34 56 78'), isNull);
      });

      test('rejects too short number', () {
        expect(Validators.phoneFR('061234'), isNotNull);
      });

      test('rejects number with letters', () {
        expect(Validators.phoneFR('06abcdefgh'), isNotNull);
      });

      test('rejects empty value', () {
        expect(Validators.phoneFR(''), isNotNull);
      });
    });

    group('postalCode', () {
      test('accepts 5-digit code', () {
        expect(Validators.postalCode('49000'), isNull);
      });

      test('accepts Paris code', () {
        expect(Validators.postalCode('75001'), isNull);
      });

      test('rejects 4-digit code', () {
        expect(Validators.postalCode('4900'), isNotNull);
      });

      test('rejects code with letters', () {
        expect(Validators.postalCode('4900A'), isNotNull);
      });

      test('rejects empty value', () {
        expect(Validators.postalCode(''), isNotNull);
      });
    });

    group('uuid', () {
      test('accepts valid UUID v4', () {
        expect(
          Validators.uuid('550e8400-e29b-41d4-a716-446655440000'),
          isNull,
        );
      });

      test('accepts uppercase UUID', () {
        expect(
          Validators.uuid('550E8400-E29B-41D4-A716-446655440000'),
          isNull,
        );
      });

      test('rejects invalid UUID (too short)', () {
        expect(Validators.uuid('550e8400-e29b-41d4'), isNotNull);
      });

      test('rejects invalid UUID (no dashes)', () {
        expect(Validators.uuid('550e8400e29b41d4a716446655440000'), isNotNull);
      });
    });
  });
}
