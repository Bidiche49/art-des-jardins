import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../../../core/network/dio_client.dart';
import '../../data/signature_service_impl.dart';
import '../../domain/signature_service.dart';

// ============== Service ==============

final signatureServiceProvider = Provider<SignatureService>((ref) {
  return SignatureServiceImpl(
    publicDio: ref.read(publicDioProvider),
  );
});

// ============== State ==============

class SignerDevisState {
  const SignerDevisState({
    this.pageState = SignaturePageState.loading,
    this.devisData,
    this.error,
    this.signedAt,
  });

  final SignaturePageState pageState;
  final SignatureDevisData? devisData;
  final String? error;
  final String? signedAt;

  SignerDevisState copyWith({
    SignaturePageState? pageState,
    SignatureDevisData? devisData,
    String? error,
    String? signedAt,
  }) {
    return SignerDevisState(
      pageState: pageState ?? this.pageState,
      devisData: devisData ?? this.devisData,
      error: error,
      signedAt: signedAt ?? this.signedAt,
    );
  }
}

// ============== Notifier ==============

final signerDevisNotifierProvider = StateNotifierProvider.family<
    SignerDevisNotifier, SignerDevisState, String>((ref, token) {
  final service = ref.read(signatureServiceProvider);
  return SignerDevisNotifier(service, token);
});

class SignerDevisNotifier extends StateNotifier<SignerDevisState> {
  SignerDevisNotifier(this._service, this._token)
      : super(const SignerDevisState()) {
    loadDevis();
  }

  final SignatureService _service;
  final String _token;

  Future<void> loadDevis() async {
    state = const SignerDevisState(pageState: SignaturePageState.loading);
    try {
      final data = await _service.loadDevis(_token);
      if (data.alreadySigned) {
        state = SignerDevisState(
          pageState: SignaturePageState.alreadySigned,
          devisData: data,
          signedAt: data.signedAt,
        );
      } else {
        state = SignerDevisState(
          pageState: SignaturePageState.ready,
          devisData: data,
        );
      }
    } on SignatureException catch (e) {
      if (e.code == 'expired') {
        state = SignerDevisState(
          pageState: SignaturePageState.expired,
          error: e.message,
        );
      } else {
        state = SignerDevisState(
          pageState: SignaturePageState.error,
          error: e.message,
        );
      }
    } catch (_) {
      state = const SignerDevisState(
        pageState: SignaturePageState.error,
        error: 'Impossible de charger le devis. Verifiez votre connexion.',
      );
    }
  }

  Future<void> signDevis({
    required String signatureBase64,
    required bool cgvAccepted,
  }) async {
    state = state.copyWith(pageState: SignaturePageState.signing);
    try {
      await _service.signDevis(
        token: _token,
        signatureBase64: signatureBase64,
        cgvAccepted: cgvAccepted,
      );
      state = state.copyWith(pageState: SignaturePageState.success);
    } on SignatureException catch (e) {
      state = state.copyWith(
        pageState: SignaturePageState.ready,
        error: e.message,
      );
    } catch (e) {
      state = state.copyWith(
        pageState: SignaturePageState.ready,
        error: 'Erreur de connexion. Veuillez reessayer.',
      );
    }
  }
}
