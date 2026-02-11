/// Sealed class representing application failures.
sealed class Failure {
  const Failure(this.message);

  final String message;

  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      other is Failure &&
          runtimeType == other.runtimeType &&
          message == other.message;

  @override
  int get hashCode => Object.hash(runtimeType, message);

  @override
  String toString() => '$runtimeType: $message';
}

/// Server-side error (HTTP 5xx, unexpected API response).
class ServerFailure extends Failure {
  const ServerFailure([super.message = 'Erreur serveur']);
}

/// Local cache error (database, shared prefs).
class CacheFailure extends Failure {
  const CacheFailure([super.message = 'Erreur de cache local']);
}

/// Network connectivity error.
class NetworkFailure extends Failure {
  const NetworkFailure([super.message = 'Pas de connexion internet']);
}

/// Authentication error (expired token, unauthorized).
class AuthFailure extends Failure {
  const AuthFailure([super.message = 'Erreur d\'authentification']);
}

/// Validation error (invalid input).
class ValidationFailure extends Failure {
  const ValidationFailure([super.message = 'Données invalides']);
}
