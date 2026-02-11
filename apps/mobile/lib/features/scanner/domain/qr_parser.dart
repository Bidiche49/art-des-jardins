/// Parsed result from a QR code scan.
class QrParseResult {
  const QrParseResult({
    required this.entityType,
    required this.entityId,
  });

  final String entityType;
  final String entityId;
}

/// Parses QR codes with the `aej://` protocol.
///
/// Supported formats:
/// - `aej://chantier/{uuid}`
/// - `aej://client/{uuid}`
class QrParser {
  const QrParser();

  static const String protocol = 'aej://';
  static const Set<String> supportedEntities = {'chantier', 'client'};

  static final _uuidRegex = RegExp(
    r'^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$',
  );

  /// Parses a raw QR code string.
  ///
  /// Throws [QrParseException] if the format is invalid.
  QrParseResult parse(String raw) {
    if (raw.isEmpty) {
      throw const QrParseException('QR code vide');
    }

    if (!raw.startsWith(protocol)) {
      throw const QrParseException('Protocole aej:// manquant');
    }

    final path = raw.substring(protocol.length);
    final segments = path.split('/');

    if (segments.length != 2 || segments[0].isEmpty || segments[1].isEmpty) {
      throw const QrParseException('Format QR invalide');
    }

    final entityType = segments[0];
    final entityId = segments[1];

    if (!supportedEntities.contains(entityType)) {
      throw QrParseException('Type "$entityType" non supporte');
    }

    if (!_uuidRegex.hasMatch(entityId)) {
      throw const QrParseException('UUID invalide');
    }

    return QrParseResult(entityType: entityType, entityId: entityId);
  }
}

class QrParseException implements Exception {
  const QrParseException(this.message);
  final String message;

  @override
  String toString() => 'QrParseException: $message';
}
