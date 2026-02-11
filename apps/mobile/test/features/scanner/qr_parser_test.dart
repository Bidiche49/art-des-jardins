import 'package:flutter_test/flutter_test.dart';

import 'package:art_et_jardin/features/scanner/domain/qr_parser.dart';

void main() {
  const parser = QrParser();

  group('QrParser', () {
    test('parses aej://chantier/{uuid} correctly', () {
      final result =
          parser.parse('aej://chantier/550e8400-e29b-41d4-a716-446655440000');

      expect(result.entityType, 'chantier');
      expect(result.entityId, '550e8400-e29b-41d4-a716-446655440000');
    });

    test('parses aej://client/{uuid} correctly', () {
      final result =
          parser.parse('aej://client/550e8400-e29b-41d4-a716-446655440000');

      expect(result.entityType, 'client');
      expect(result.entityId, '550e8400-e29b-41d4-a716-446655440000');
    });

    test('throws on invalid QR code', () {
      expect(
        () => parser.parse('random-text-here'),
        throwsA(isA<QrParseException>()),
      );
    });

    test('throws on missing aej:// protocol', () {
      expect(
        () => parser.parse(
            'https://example.com/chantier/550e8400-e29b-41d4-a716-446655440000'),
        throwsA(isA<QrParseException>().having(
            (e) => e.message, 'message', contains('Protocole'))),
      );
    });

    test('throws on invalid UUID', () {
      expect(
        () => parser.parse('aej://chantier/not-a-valid-uuid'),
        throwsA(isA<QrParseException>()
            .having((e) => e.message, 'message', contains('UUID'))),
      );
    });

    test('throws on empty string', () {
      expect(
        () => parser.parse(''),
        throwsA(isA<QrParseException>()
            .having((e) => e.message, 'message', contains('vide'))),
      );
    });

    test('throws on unsupported entity type', () {
      expect(
        () => parser
            .parse('aej://facture/550e8400-e29b-41d4-a716-446655440000'),
        throwsA(isA<QrParseException>().having(
            (e) => e.message, 'message', contains('non supporte'))),
      );
    });

    test('throws on malformed path (too many segments)', () {
      expect(
        () => parser.parse(
            'aej://chantier/extra/550e8400-e29b-41d4-a716-446655440000'),
        throwsA(isA<QrParseException>()),
      );
    });
  });
}
