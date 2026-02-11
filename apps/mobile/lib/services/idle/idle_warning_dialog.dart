import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import 'idle_service.dart';

/// Dialog shown when idle warning triggers, with countdown.
class IdleWarningDialog extends ConsumerWidget {
  const IdleWarningDialog({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final countdown = ref.watch(idleCountdownProvider);

    return AlertDialog(
      title: const Text('Session inactive'),
      content: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          const Icon(Icons.timer_off, size: 48, color: Colors.amber),
          const SizedBox(height: 16),
          const Text(
            'Votre session va expirer par inactivite.',
            textAlign: TextAlign.center,
          ),
          const SizedBox(height: 8),
          countdown.when(
            data: (seconds) => Text(
              'Expiration dans ${seconds}s',
              style: Theme.of(context).textTheme.titleLarge?.copyWith(
                    fontWeight: FontWeight.bold,
                    color: seconds <= 30 ? Colors.red : Colors.amber,
                  ),
            ),
            loading: () => const Text('...'),
            error: (_, _) => const SizedBox.shrink(),
          ),
        ],
      ),
      actions: [
        TextButton(
          onPressed: () {
            ref.read(idleServiceProvider).resetTimer();
            Navigator.of(context).pop();
          },
          child: const Text('Continuer'),
        ),
      ],
    );
  }
}
