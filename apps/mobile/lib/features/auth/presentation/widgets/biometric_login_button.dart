import 'package:flutter/material.dart';
import 'package:local_auth/local_auth.dart';

class BiometricLoginButton extends StatelessWidget {
  const BiometricLoginButton({
    super.key,
    required this.onPressed,
    this.biometricType,
    this.isLoading = false,
  });

  final VoidCallback onPressed;
  final BiometricType? biometricType;
  final bool isLoading;

  IconData get _icon {
    switch (biometricType) {
      case BiometricType.face:
        return Icons.face;
      case BiometricType.fingerprint:
        return Icons.fingerprint;
      case BiometricType.iris:
        return Icons.remove_red_eye;
      default:
        return Icons.fingerprint;
    }
  }

  String get _label {
    switch (biometricType) {
      case BiometricType.face:
        return 'Face ID';
      case BiometricType.fingerprint:
        return 'Empreinte';
      case BiometricType.iris:
        return 'Iris';
      default:
        return 'Biometrie';
    }
  }

  @override
  Widget build(BuildContext context) {
    return OutlinedButton.icon(
      onPressed: isLoading ? null : onPressed,
      icon: isLoading
          ? const SizedBox(
              width: 20,
              height: 20,
              child: CircularProgressIndicator(strokeWidth: 2),
            )
          : Icon(_icon, size: 24),
      label: Text(_label),
      style: OutlinedButton.styleFrom(
        minimumSize: const Size(double.infinity, 48),
      ),
    );
  }
}
