import 'package:dio/dio.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:mocktail/mocktail.dart';

import 'package:art_et_jardin/features/signature/data/signature_service_impl.dart';

class MockDio extends Mock implements Dio {
  @override
  BaseOptions get options => BaseOptions(baseUrl: 'http://localhost:3000/api');
}

void main() {
  late MockDio mockDio;
  late SignatureServiceImpl service;

  setUp(() {
    mockDio = MockDio();
    service = SignatureServiceImpl(publicDio: mockDio);
  });

  group('loadDevis', () {
    test('valid token returns devis data', () async {
      when(() => mockDio.get(any())).thenAnswer((_) async => Response(
            data: {
              'alreadySigned': false,
              'devis': {
                'numero': 'DEV-2026-001',
                'clientNom': 'Dupont',
                'totalHT': 100.0,
                'totalTVA': 20.0,
                'totalTTC': 120.0,
                'lignes': [
                  {
                    'description': 'Tonte',
                    'quantite': 1,
                    'unite': 'm2',
                    'prixUnitaireHT': 100.0,
                    'tva': 20,
                  }
                ],
              },
            },
            statusCode: 200,
            requestOptions: RequestOptions(),
          ));

      final result = await service.loadDevis('valid-token');
      expect(result.numero, 'DEV-2026-001');
      expect(result.clientNom, 'Dupont');
      expect(result.totalTTC, 120.0);
      expect(result.lignes.length, 1);
      expect(result.alreadySigned, false);
    });

    test('invalid token throws error', () async {
      when(() => mockDio.get(any())).thenThrow(DioException(
        requestOptions: RequestOptions(),
        response: Response(
          statusCode: 404,
          data: {'message': 'Lien invalide'},
          requestOptions: RequestOptions(),
        ),
      ));

      expect(
        () => service.loadDevis('invalid-token'),
        throwsA(isA<SignatureException>()
            .having((e) => e.code, 'code', 'invalid')),
      );
    });

    test('expired token throws expired error', () async {
      when(() => mockDio.get(any())).thenThrow(DioException(
        requestOptions: RequestOptions(),
        response: Response(
          statusCode: 403,
          data: {'message': 'Token expire'},
          requestOptions: RequestOptions(),
        ),
      ));

      expect(
        () => service.loadDevis('expired-token'),
        throwsA(isA<SignatureException>()
            .having((e) => e.code, 'code', 'expired')),
      );
    });

    test('already signed devis returns alreadySigned true', () async {
      when(() => mockDio.get(any())).thenAnswer((_) async => Response(
            data: {
              'alreadySigned': true,
              'signedAt': '2026-01-15T10:00:00.000',
              'devis': {
                'numero': 'DEV-2026-001',
                'totalHT': 100.0,
                'totalTVA': 20.0,
                'totalTTC': 120.0,
              },
            },
            statusCode: 200,
            requestOptions: RequestOptions(),
          ));

      final result = await service.loadDevis('signed-token');
      expect(result.alreadySigned, true);
      expect(result.signedAt, '2026-01-15T10:00:00.000');
    });

    test('uses publicDio not authDio', () async {
      when(() => mockDio.get(any())).thenAnswer((_) async => Response(
            data: {
              'alreadySigned': false,
              'devis': {'numero': 'DEV-001', 'totalHT': 0, 'totalTVA': 0, 'totalTTC': 0},
            },
            statusCode: 200,
            requestOptions: RequestOptions(),
          ));

      await service.loadDevis('token');
      verify(() => mockDio.get('/signature/token')).called(1);
    });
  });

  group('signDevis', () {
    test('valid signature posts successfully', () async {
      when(() => mockDio.post(any(), data: any(named: 'data')))
          .thenAnswer((_) async => Response(
                data: {'success': true, 'signedAt': '2026-01-15T10:00:00.000'},
                statusCode: 200,
                requestOptions: RequestOptions(),
              ));

      await service.signDevis(
        token: 'valid-token',
        signatureBase64: 'base64data',
        cgvAccepted: true,
      );

      verify(() => mockDio.post(
            '/signature/valid-token/sign',
            data: {
              'signatureBase64': 'base64data',
              'cgvAccepted': true,
            },
          )).called(1);
    });

    test('throws when CGV not accepted', () async {
      expect(
        () => service.signDevis(
          token: 'token',
          signatureBase64: 'base64data',
          cgvAccepted: false,
        ),
        throwsA(isA<SignatureException>()
            .having((e) => e.code, 'code', 'cgv_required')),
      );
    });

    test('throws when signature is empty', () async {
      expect(
        () => service.signDevis(
          token: 'token',
          signatureBase64: '',
          cgvAccepted: true,
        ),
        throwsA(isA<SignatureException>()
            .having((e) => e.code, 'code', 'empty_signature')),
      );
    });

    test('sends to correct endpoint', () async {
      when(() => mockDio.post(any(), data: any(named: 'data')))
          .thenAnswer((_) async => Response(
                data: {'success': true},
                statusCode: 200,
                requestOptions: RequestOptions(),
              ));

      await service.signDevis(
        token: 'my-token',
        signatureBase64: 'data',
        cgvAccepted: true,
      );

      verify(() => mockDio.post(
            '/signature/my-token/sign',
            data: any(named: 'data'),
          )).called(1);
    });
  });
}
