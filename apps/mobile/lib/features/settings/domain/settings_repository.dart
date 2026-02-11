import 'package:flutter/material.dart';

/// Abstract repository for settings preferences.
abstract class SettingsRepository {
  /// Gets the saved theme mode, or null if not set.
  ThemeMode? getThemeMode();

  /// Saves the theme mode preference.
  Future<void> setThemeMode(ThemeMode mode);

  /// Gets whether terrain mode is enabled.
  bool getTerrainMode();

  /// Saves the terrain mode preference.
  Future<void> setTerrainMode(bool enabled);

  /// Gets whether biometric login is configured.
  bool getBiometricConfigured();

  /// Saves biometric configuration preference.
  Future<void> setBiometricConfigured(bool configured);

  /// Gets the last sync date, or null if never synced.
  DateTime? getLastSync();

  /// Gets whether notifications are enabled.
  bool getNotificationsEnabled();

  /// Saves notification preference.
  Future<void> setNotificationsEnabled(bool enabled);
}
