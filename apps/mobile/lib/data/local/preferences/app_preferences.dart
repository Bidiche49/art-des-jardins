import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:shared_preferences/shared_preferences.dart';

/// Provides the [SharedPreferences] instance.
///
/// Must be overridden in [ProviderScope] after initialization:
/// ```dart
/// final prefs = await SharedPreferences.getInstance();
/// ProviderScope(overrides: [sharedPrefsProvider.overrideWithValue(prefs)]);
/// ```
final sharedPrefsProvider = Provider<SharedPreferences>(
  (ref) => throw UnimplementedError('SharedPreferences not initialized'),
);

/// Provides the [AppPreferences] wrapper.
final appPreferencesProvider = Provider<AppPreferences>(
  (ref) => AppPreferences(ref.read(sharedPrefsProvider)),
);

/// Typed wrapper around [SharedPreferences].
class AppPreferences {
  AppPreferences(this._prefs);

  final SharedPreferences _prefs;

  // Theme
  static const _themeModeKey = 'theme_mode';
  static const _terrainModeKey = 'terrain_mode';

  String? get themeMode => _prefs.getString(_themeModeKey);
  Future<bool> setThemeMode(String value) =>
      _prefs.setString(_themeModeKey, value);

  bool get terrainMode => _prefs.getBool(_terrainModeKey) ?? false;
  Future<bool> setTerrainMode(bool value) =>
      _prefs.setBool(_terrainModeKey, value);

  // Onboarding
  static const _onboardingCompletedKey = 'onboarding_completed';

  bool get onboardingCompleted =>
      _prefs.getBool(_onboardingCompletedKey) ?? false;
  Future<bool> setOnboardingCompleted(bool value) =>
      _prefs.setBool(_onboardingCompletedKey, value);

  // Last sync
  static const _lastSyncKey = 'last_sync';

  DateTime? get lastSync {
    final millis = _prefs.getInt(_lastSyncKey);
    return millis != null ? DateTime.fromMillisecondsSinceEpoch(millis) : null;
  }

  Future<bool> setLastSync(DateTime value) =>
      _prefs.setInt(_lastSyncKey, value.millisecondsSinceEpoch);

  /// Clears all preferences.
  Future<bool> clear() => _prefs.clear();
}
