import 'package:flutter/material.dart';

class AejOfflineBanner extends StatelessWidget {
  const AejOfflineBanner({
    super.key,
    required this.isOffline,
    this.message = 'Mode hors ligne',
  });

  final bool isOffline;
  final String message;

  @override
  Widget build(BuildContext context) {
    if (!isOffline) return const SizedBox.shrink();

    return Container(
      width: double.infinity,
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
      color: Theme.of(context).colorScheme.errorContainer,
      child: Row(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(
            Icons.cloud_off,
            size: 16,
            color: Theme.of(context).colorScheme.onErrorContainer,
          ),
          const SizedBox(width: 8),
          Text(
            message,
            style: TextStyle(
              color: Theme.of(context).colorScheme.onErrorContainer,
              fontSize: 13,
              fontWeight: FontWeight.w500,
            ),
          ),
        ],
      ),
    );
  }
}
