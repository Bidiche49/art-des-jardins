import 'package:dio/dio.dart';

import '../../../core/network/api_endpoints.dart';
import '../domain/signature_service.dart';

class SignatureServiceImpl implements SignatureService {
  SignatureServiceImpl({required this.publicDio});

  final Dio publicDio;

  @override
  Future<SignatureDevisData> loadDevis(String token) async {
    try {
      final response = await publicDio.get(ApiEndpoints.signatureLoad(token));
      final data =
          response.data is Map<String, dynamic> ? response.data as Map<String, dynamic> : <String, dynamic>{};

      final alreadySigned = data['alreadySigned'] as bool? ?? false;
      final signedAt = data['signedAt'] as String?;
      final devisData =
          data['devis'] is Map<String, dynamic> ? data['devis'] as Map<String, dynamic> : <String, dynamic>{};
      final lignesRaw = devisData['lignes'] as List? ?? [];
      final lignes = lignesRaw
          .map((l) => l is Map<String, dynamic> ? l : <String, dynamic>{})
          .toList();

      return SignatureDevisData(
        devis: devisData,
        alreadySigned: alreadySigned,
        signedAt: signedAt,
        lignes: lignes,
      );
    } on DioException catch (e) {
      if (e.response?.statusCode == 403) {
        throw const SignatureException('expired', 'Ce lien de signature a expire');
      }
      if (e.response?.statusCode == 404) {
        throw const SignatureException('invalid', 'Lien de signature invalide');
      }
      rethrow;
    }
  }

  @override
  Future<void> signDevis({
    required String token,
    required String signatureBase64,
    required bool cgvAccepted,
  }) async {
    if (!cgvAccepted) {
      throw const SignatureException(
          'cgv_required', 'Vous devez accepter les CGV');
    }
    if (signatureBase64.isEmpty) {
      throw const SignatureException(
          'empty_signature', 'La signature est vide');
    }

    await publicDio.post(
      ApiEndpoints.signatureSign(token),
      data: {
        'signatureBase64': signatureBase64,
        'cgvAccepted': true,
      },
    );
  }
}

class SignatureException implements Exception {
  const SignatureException(this.code, this.message);

  final String code;
  final String message;

  @override
  String toString() => message;
}
