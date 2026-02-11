/// Application-wide constants.
class AppConstants {
  const AppConstants._();

  // Networking
  static const int maxRetries = 3;
  static const Duration retryDelay = Duration(seconds: 2);

  // UI
  static const Duration debounceDuration = Duration(milliseconds: 500);
  static const Duration animationDuration = Duration(milliseconds: 300);
  static const Duration snackBarDuration = Duration(seconds: 3);

  // Session
  static const Duration idleTimeout = Duration(minutes: 15);
  static const Duration tokenRefreshBuffer = Duration(minutes: 2);

  // Sync
  static const int syncBatchSize = 50;
  static const Duration syncInterval = Duration(minutes: 5);

  // Pagination
  static const int defaultPageSize = 20;

  // Validation
  static const int maxPhotoSizeMB = 10;
  static const int maxPhotosPerIntervention = 20;
}
