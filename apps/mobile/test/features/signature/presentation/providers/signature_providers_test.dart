import 'package:flutter_test/flutter_test.dart';
import 'package:mocktail/mocktail.dart';

import 'package:art_et_jardin/features/signature/data/signature_service_impl.dart';
import 'package:art_et_jardin/features/signature/domain/signature_service.dart';
import 'package:art_et_jardin/features/signature/presentation/providers/signature_providers.dart';

class MockSignatureService extends Mock implements SignatureService {}

SignatureDevisData _testDevisData({bool alreadySigned = false, String? signedAt}) =>
    SignatureDevisData(
      devis: {
        'numero': 'DEV-2026-001',
        'clientNom': 'Dupont',
        'totalHT': 100.0,
        'totalTVA': 20.0,
        'totalTTC': 120.0,
      },
      alreadySigned: alreadySigned,
      signedAt: signedAt,
      lignes: const [],
    );

void main() {
  late MockSignatureService mockService;

  setUp(() {
    mockService = MockSignatureService();
  });

  group('SignerDevisNotifier', () {
    test('initial state is loading then ready', () async {
      when(() => mockService.loadDevis(any()))
          .thenAnswer((_) async => _testDevisData());

      final notifier = SignerDevisNotifier(mockService, 'token');

      // Initially loading
      expect(notifier.state.pageState, SignaturePageState.loading);

      // Wait for load
      await Future.delayed(Duration.zero);
      expect(notifier.state.pageState, SignaturePageState.ready);
      expect(notifier.state.devisData?.numero, 'DEV-2026-001');
    });

    test('already signed devis shows alreadySigned state', () async {
      when(() => mockService.loadDevis(any()))
          .thenAnswer((_) async => _testDevisData(
                alreadySigned: true,
                signedAt: '2026-01-15',
              ));

      final notifier = SignerDevisNotifier(mockService, 'token');
      await Future.delayed(Duration.zero);

      expect(notifier.state.pageState, SignaturePageState.alreadySigned);
      expect(notifier.state.signedAt, '2026-01-15');
    });

    test('expired token shows expired state', () async {
      when(() => mockService.loadDevis(any()))
          .thenThrow(const SignatureException('expired', 'Token expire'));

      final notifier = SignerDevisNotifier(mockService, 'token');
      await Future.delayed(Duration.zero);

      expect(notifier.state.pageState, SignaturePageState.expired);
      expect(notifier.state.error, 'Token expire');
    });

    test('invalid token shows error state', () async {
      when(() => mockService.loadDevis(any()))
          .thenThrow(const SignatureException('invalid', 'Lien invalide'));

      final notifier = SignerDevisNotifier(mockService, 'token');
      await Future.delayed(Duration.zero);

      expect(notifier.state.pageState, SignaturePageState.error);
    });

    test('network error shows error state', () async {
      when(() => mockService.loadDevis(any()))
          .thenThrow(Exception('Network error'));

      final notifier = SignerDevisNotifier(mockService, 'token');
      await Future.delayed(Duration.zero);

      expect(notifier.state.pageState, SignaturePageState.error);
      expect(notifier.state.error, contains('connexion'));
    });

    test('signDevis transitions to signing then success', () async {
      when(() => mockService.loadDevis(any()))
          .thenAnswer((_) async => _testDevisData());
      when(() => mockService.signDevis(
            token: any(named: 'token'),
            signatureBase64: any(named: 'signatureBase64'),
            cgvAccepted: any(named: 'cgvAccepted'),
          )).thenAnswer((_) async {});

      final notifier = SignerDevisNotifier(mockService, 'token');
      await Future.delayed(Duration.zero);
      expect(notifier.state.pageState, SignaturePageState.ready);

      await notifier.signDevis(
        signatureBase64: 'base64data',
        cgvAccepted: true,
      );

      expect(notifier.state.pageState, SignaturePageState.success);
    });

    test('signDevis error returns to ready', () async {
      when(() => mockService.loadDevis(any()))
          .thenAnswer((_) async => _testDevisData());
      when(() => mockService.signDevis(
            token: any(named: 'token'),
            signatureBase64: any(named: 'signatureBase64'),
            cgvAccepted: any(named: 'cgvAccepted'),
          )).thenThrow(const SignatureException('error', 'Erreur serveur'));

      final notifier = SignerDevisNotifier(mockService, 'token');
      await Future.delayed(Duration.zero);

      await notifier.signDevis(
        signatureBase64: 'data',
        cgvAccepted: true,
      );

      expect(notifier.state.pageState, SignaturePageState.ready);
      expect(notifier.state.error, 'Erreur serveur');
    });
  });
}
