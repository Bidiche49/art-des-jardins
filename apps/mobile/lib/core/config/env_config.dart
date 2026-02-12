/// Environment configuration loaded via `--dart-define`.
class EnvConfig {
  const EnvConfig._();

  static const String apiUrl = String.fromEnvironment(
    'API_URL',
    defaultValue: 'http://localhost:3000/api/v1',
  );

  static const int apiTimeoutSeconds = int.fromEnvironment(
    'API_TIMEOUT',
    defaultValue: 30,
  );

  static Duration get apiTimeout => const Duration(seconds: apiTimeoutSeconds);

  static const String environment = String.fromEnvironment(
    'ENV',
    defaultValue: 'development',
  );

  static bool get isDevelopment => environment == 'development';
  static bool get isStaging => environment == 'staging';
  static bool get isProduction => environment == 'production';

  /// Validates that the environment is a known value.
  static bool get isValidEnvironment =>
      isDevelopment || isStaging || isProduction;

  /// Bundle identifier for the app.
  static const String bundleId = 'com.artetjardin.mobile';

  /// App display name.
  static const String appName = 'Art & Jardin';
}
