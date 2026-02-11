/// State of the signature page.
enum SignaturePageState {
  loading,
  ready,
  signing,
  success,
  error,
  expired,
  alreadySigned,
}

/// Data returned when loading a devis for signature.
class SignatureDevisData {
  const SignatureDevisData({
    required this.devis,
    required this.alreadySigned,
    this.signedAt,
    this.lignes = const [],
  });

  final Map<String, dynamic> devis;
  final bool alreadySigned;
  final String? signedAt;
  final List<Map<String, dynamic>> lignes;

  String get numero => devis['numero'] as String? ?? '';
  String get clientNom => devis['clientNom'] as String? ?? '';
  double get totalHT => (devis['totalHT'] as num?)?.toDouble() ?? 0;
  double get totalTVA => (devis['totalTVA'] as num?)?.toDouble() ?? 0;
  double get totalTTC => (devis['totalTTC'] as num?)?.toDouble() ?? 0;
  String? get conditionsParticulieres =>
      devis['conditionsParticulieres'] as String?;
  String? get notes => devis['notes'] as String?;
}

abstract class SignatureService {
  Future<SignatureDevisData> loadDevis(String token);
  Future<void> signDevis({
    required String token,
    required String signatureBase64,
    required bool cgvAccepted,
  });
}
