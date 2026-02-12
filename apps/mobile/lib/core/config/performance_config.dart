/// Performance-related configuration constants.
class PerformanceConfig {
  const PerformanceConfig._();

  // === Timeouts by operation type ===
  static const Duration listingTimeout = Duration(seconds: 10);
  static const Duration uploadTimeout = Duration(seconds: 30);
  static const Duration pdfTimeout = Duration(seconds: 60);
  static const Duration defaultTimeout = Duration(seconds: 30);

  // === Image cache ===
  static const int imageCacheMaxSizeMB = 100;
  static const int imageCacheMaxSizeBytes = imageCacheMaxSizeMB * 1024 * 1024;
  static const int thumbnailMaxWidth = 300;
  static const int thumbnailMaxHeight = 300;

  // === Photo compression ===
  static const int photoMaxWidth = 1920;
  static const int photoMaxHeight = 1920;
  static const int photoQuality = 80;
  static const int photoCompressedMaxWidth = 1200;
  static const int photoCompressedQuality = 75;

  // === Lists ===
  static const int defaultPageSize = 20;
  static const int maxItemsInMemory = 500;

  // === Startup ===
  static const Duration maxStartupTime = Duration(seconds: 2);
}
