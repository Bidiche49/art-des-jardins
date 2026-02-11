import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../../../core/theme/theme_provider.dart';
import '../../../../services/sync/sync_providers.dart';
import '../../data/settings_repository_impl.dart';
import '../../domain/settings_repository.dart';

/// State for settings.
class SettingsState {
  const SettingsState({
    this.themeMode = ThemeMode.system,
    this.terrainMode = false,
    this.biometricConfigured = false,
    this.notificationsEnabled = true,
    this.lastSync,
  });

  final ThemeMode themeMode;
  final bool terrainMode;
  final bool biometricConfigured;
  final bool notificationsEnabled;
  final DateTime? lastSync;

  SettingsState copyWith({
    ThemeMode? themeMode,
    bool? terrainMode,
    bool? biometricConfigured,
    bool? notificationsEnabled,
    DateTime? lastSync,
  }) {
    return SettingsState(
      themeMode: themeMode ?? this.themeMode,
      terrainMode: terrainMode ?? this.terrainMode,
      biometricConfigured: biometricConfigured ?? this.biometricConfigured,
      notificationsEnabled: notificationsEnabled ?? this.notificationsEnabled,
      lastSync: lastSync ?? this.lastSync,
    );
  }
}

class SettingsNotifier extends StateNotifier<SettingsState> {
  SettingsNotifier({
    required SettingsRepository repository,
    required Ref ref,
  })  : _repository = repository,
        _ref = ref,
        super(const SettingsState()) {
    _loadFromPreferences();
  }

  final SettingsRepository _repository;
  final Ref _ref;

  void _loadFromPreferences() {
    final savedTheme = _repository.getThemeMode();
    final terrainMode = _repository.getTerrainMode();
    final biometric = _repository.getBiometricConfigured();
    final notifications = _repository.getNotificationsEnabled();
    final lastSync = _repository.getLastSync();

    state = SettingsState(
      themeMode: savedTheme ?? ThemeMode.system,
      terrainMode: terrainMode,
      biometricConfigured: biometric,
      notificationsEnabled: notifications,
      lastSync: lastSync,
    );

    // Sync with global providers
    _ref.read(themeModeProvider.notifier).state = state.themeMode;
    _ref.read(terrainModeProvider.notifier).state = state.terrainMode;
  }

  Future<void> setThemeMode(ThemeMode mode) async {
    await _repository.setThemeMode(mode);
    state = state.copyWith(themeMode: mode);
    _ref.read(themeModeProvider.notifier).state = mode;
  }

  Future<void> toggleTerrainMode() async {
    final newValue = !state.terrainMode;
    await _repository.setTerrainMode(newValue);
    state = state.copyWith(terrainMode: newValue);
    _ref.read(terrainModeProvider.notifier).state = newValue;
  }

  Future<void> setBiometricConfigured(bool configured) async {
    await _repository.setBiometricConfigured(configured);
    state = state.copyWith(biometricConfigured: configured);
  }

  Future<void> toggleNotifications() async {
    final newValue = !state.notificationsEnabled;
    await _repository.setNotificationsEnabled(newValue);
    state = state.copyWith(notificationsEnabled: newValue);
  }

  Future<void> triggerSync() async {
    final syncService = _ref.read(syncServiceProvider);
    await syncService.syncAll();
    final lastSync = _repository.getLastSync();
    state = state.copyWith(lastSync: lastSync);
  }
}

final settingsNotifierProvider =
    StateNotifierProvider<SettingsNotifier, SettingsState>((ref) {
  return SettingsNotifier(
    repository: ref.read(settingsRepositoryProvider),
    ref: ref,
  );
});
