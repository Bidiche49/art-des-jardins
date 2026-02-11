import 'package:flutter/material.dart';

import '../../../../domain/models/intervention.dart';
import '../../../../shared/widgets/aej_badge.dart';

class InterventionCard extends StatelessWidget {
  const InterventionCard({
    super.key,
    required this.intervention,
    this.onTap,
  });

  final Intervention intervention;
  final VoidCallback? onTap;

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    return Card(
      clipBehavior: Clip.antiAlias,
      child: InkWell(
        onTap: onTap,
        child: Padding(
          padding: const EdgeInsets.all(12),
          child: Row(
            children: [
              CircleAvatar(
                backgroundColor: theme.colorScheme.primaryContainer,
                child: Icon(
                  Icons.build_outlined,
                  color: theme.colorScheme.onPrimaryContainer,
                ),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      children: [
                        Expanded(
                          child: Text(
                            intervention.description ?? 'Intervention',
                            style: theme.textTheme.titleSmall,
                            overflow: TextOverflow.ellipsis,
                          ),
                        ),
                        const SizedBox(width: 8),
                        AejBadge(
                          label: intervention.valide ? 'Validee' : 'En cours',
                          variant: intervention.valide
                              ? AejBadgeVariant.success
                              : AejBadgeVariant.warning,
                          size: AejBadgeSize.sm,
                        ),
                      ],
                    ),
                    const SizedBox(height: 4),
                    Row(
                      children: [
                        Icon(Icons.access_time,
                            size: 14,
                            color: theme.colorScheme.onSurfaceVariant),
                        const SizedBox(width: 4),
                        Text(
                          _formatTimeRange(),
                          style: theme.textTheme.bodySmall?.copyWith(
                            color: theme.colorScheme.onSurfaceVariant,
                          ),
                        ),
                        if (intervention.photos.isNotEmpty) ...[
                          const SizedBox(width: 12),
                          Icon(Icons.photo_camera,
                              size: 14,
                              color: theme.colorScheme.onSurfaceVariant),
                          const SizedBox(width: 2),
                          Text(
                            '${intervention.photos.length}',
                            style: theme.textTheme.bodySmall?.copyWith(
                              color: theme.colorScheme.onSurfaceVariant,
                            ),
                          ),
                        ],
                      ],
                    ),
                  ],
                ),
              ),
              const SizedBox(width: 8),
              Icon(
                Icons.chevron_right,
                color: theme.colorScheme.onSurfaceVariant,
              ),
            ],
          ),
        ),
      ),
    );
  }

  String _formatTimeRange() {
    final start = _formatTime(intervention.heureDebut);
    if (intervention.heureFin != null) {
      return '$start - ${_formatTime(intervention.heureFin!)}';
    }
    if (intervention.dureeMinutes != null) {
      return '$start (${intervention.dureeMinutes} min)';
    }
    return start;
  }

  String _formatTime(DateTime dt) {
    return '${dt.hour.toString().padLeft(2, '0')}:${dt.minute.toString().padLeft(2, '0')}';
  }
}
