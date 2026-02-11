import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:local_auth/local_auth.dart';

import '../../data/local/preferences/app_preferences.dart';

final biometricServiceProvider = Provider<BiometricService>((ref) {
  final prefs = ref.watch(appPreferencesProvider);
  return BiometricService(
    auth: LocalAuthentication(),
    preferences: prefs,
  );
});

class BiometricService {
  BiometricService({
    required LocalAuthentication auth,
    required AppPreferences preferences,
  })  : _auth = auth,
        _preferences = preferences;

  final LocalAuthentication _auth;
  final AppPreferences _preferences;

  Future<bool> isAvailable() async {
    final canCheck = await _auth.canCheckBiometrics;
    final isDeviceSupported = await _auth.isDeviceSupported();
    return canCheck && isDeviceSupported;
  }

  Future<List<BiometricType>> getAvailableBiometrics() async {
    return _auth.getAvailableBiometrics();
  }

  Future<BiometricType?> getBiometricType() async {
    final biometrics = await _auth.getAvailableBiometrics();
    if (biometrics.contains(BiometricType.face)) return BiometricType.face;
    if (biometrics.contains(BiometricType.fingerprint)) {
      return BiometricType.fingerprint;
    }
    if (biometrics.contains(BiometricType.iris)) return BiometricType.iris;
    if (biometrics.isNotEmpty) return biometrics.first;
    return null;
  }

  Future<bool> authenticate() async {
    return _auth.authenticate(
      localizedReason: 'Authentifiez-vous pour acceder a l\'application',
      options: const AuthenticationOptions(
        stickyAuth: true,
        biometricOnly: true,
      ),
    );
  }

  bool get isConfigured => _preferences.biometricConfigured;

  Future<void> setConfigured(bool configured) async {
    await _preferences.setBiometricConfigured(configured);
  }
}
