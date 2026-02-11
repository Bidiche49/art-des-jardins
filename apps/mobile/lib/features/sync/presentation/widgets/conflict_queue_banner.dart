import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../../../services/sync/sync_providers.dart';

class ConflictQueueBanner extends ConsumerWidget {
  const ConflictQueueBanner({super.key, this.onTap});

  final VoidCallback? onTap;

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final conflictCount = ref.watch(conflictCountProvider);

    if (conflictCount == 0) return const SizedBox.shrink();

    return GestureDetector(
      onTap: onTap,
      child: Container(
        width: double.infinity,
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
        color: const Color(0xFFFEF3C7),
        child: Row(
          children: [
            const Icon(
              Icons.warning_amber_rounded,
              color: Color(0xFF92400E),
              size: 20,
            ),
            const SizedBox(width: 12),
            Expanded(
              child: Text(
                '$conflictCount conflit${conflictCount > 1 ? 's' : ''} en attente de resolution',
                style: const TextStyle(
                  color: Color(0xFF92400E),
                  fontWeight: FontWeight.w600,
                  fontSize: 14,
                ),
              ),
            ),
            const Icon(
              Icons.chevron_right,
              color: Color(0xFF92400E),
              size: 20,
            ),
          ],
        ),
      ),
    );
  }
}
