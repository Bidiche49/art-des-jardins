import 'package:flutter/material.dart';

/// Error display with retry button.
class AejErrorRetry extends StatelessWidget {
  const AejErrorRetry({
    super.key,
    required this.message,
    this.onRetry,
    this.icon = Icons.error_outline,
  });

  final String message;
  final VoidCallback? onRetry;
  final IconData icon;

  /// Factory for network errors.
  factory AejErrorRetry.network({VoidCallback? onRetry}) {
    return AejErrorRetry(
      message: 'Pas de connexion',
      icon: Icons.wifi_off,
      onRetry: onRetry,
    );
  }

  /// Factory for server errors.
  factory AejErrorRetry.server({VoidCallback? onRetry}) {
    return AejErrorRetry(
      message: 'Une erreur est survenue',
      icon: Icons.cloud_off,
      onRetry: onRetry,
    );
  }

  /// Factory for timeout errors.
  factory AejErrorRetry.timeout({VoidCallback? onRetry}) {
    return AejErrorRetry(
      message: 'Le serveur met trop de temps',
      icon: Icons.hourglass_empty,
      onRetry: onRetry,
    );
  }

  @override
  Widget build(BuildContext context) {
    return Center(
      child: Padding(
        padding: const EdgeInsets.all(32),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Icon(
              icon,
              size: 64,
              color: Theme.of(context).colorScheme.error.withAlpha(180),
            ),
            const SizedBox(height: 16),
            Text(
              message,
              style: Theme.of(context).textTheme.titleMedium,
              textAlign: TextAlign.center,
            ),
            if (onRetry != null) ...[
              const SizedBox(height: 24),
              FilledButton.icon(
                onPressed: onRetry,
                icon: const Icon(Icons.refresh),
                label: const Text('Reessayer'),
              ),
            ],
          ],
        ),
      ),
    );
  }
}
