import 'package:flutter/material.dart';

import '../../../../core/utils/currency_utils.dart';
import '../../../../domain/models/facture.dart';
import '../../../../domain/models/intervention.dart';
import '../../../../shared/widgets/aej_badge.dart';

class UpcomingInterventionsList extends StatelessWidget {
  const UpcomingInterventionsList({
    super.key,
    required this.interventions,
    this.onTap,
  });

  final List<Intervention> interventions;
  final void Function(Intervention)? onTap;

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    if (interventions.isEmpty) {
      return Padding(
        padding: const EdgeInsets.all(16),
        child: Text(
          'Aucune intervention prevue',
          style: theme.textTheme.bodyMedium?.copyWith(
            color: theme.colorScheme.onSurfaceVariant,
          ),
        ),
      );
    }

    return Column(
      children: interventions.take(5).map((intervention) {
        final dateStr = _formatDate(intervention.date);
        final timeStr = _formatTime(intervention.heureDebut);

        return ListTile(
          leading: Container(
            padding: const EdgeInsets.all(8),
            decoration: BoxDecoration(
              color: theme.colorScheme.primaryContainer,
              borderRadius: BorderRadius.circular(8),
            ),
            child: Icon(
              Icons.build,
              size: 20,
              color: theme.colorScheme.onPrimaryContainer,
            ),
          ),
          title: Text(
            intervention.description ?? 'Intervention',
            maxLines: 1,
            overflow: TextOverflow.ellipsis,
          ),
          subtitle: Text('$dateStr a $timeStr'),
          trailing: intervention.valide
              ? const AejBadge(
                  label: 'Valide',
                  variant: AejBadgeVariant.success,
                  size: AejBadgeSize.sm,
                )
              : const AejBadge(
                  label: 'En cours',
                  variant: AejBadgeVariant.warning,
                  size: AejBadgeSize.sm,
                ),
          onTap: onTap != null ? () => onTap!(intervention) : null,
        );
      }).toList(),
    );
  }

  String _formatDate(DateTime date) {
    const jours = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];
    return '${jours[date.weekday - 1]} ${date.day}/${date.month}';
  }

  String _formatTime(DateTime time) {
    return '${time.hour.toString().padLeft(2, '0')}:${time.minute.toString().padLeft(2, '0')}';
  }
}

class ImpayeesAlert extends StatelessWidget {
  const ImpayeesAlert({
    super.key,
    required this.factures,
    this.onTap,
  });

  final List<Facture> factures;
  final VoidCallback? onTap;

  @override
  Widget build(BuildContext context) {
    if (factures.isEmpty) return const SizedBox.shrink();

    final theme = Theme.of(context);
    final totalImpayees = factures.fold(0.0, (sum, f) => sum + f.totalTTC);

    return GestureDetector(
      behavior: HitTestBehavior.opaque,
      onTap: onTap,
      child: Container(
        margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
        padding: const EdgeInsets.all(12),
        decoration: BoxDecoration(
          color: theme.colorScheme.errorContainer,
          borderRadius: BorderRadius.circular(12),
        ),
        child: Row(
          children: [
            Icon(
              Icons.warning_amber_rounded,
              color: theme.colorScheme.onErrorContainer,
            ),
            const SizedBox(width: 12),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    '${factures.length} facture${factures.length > 1 ? 's' : ''} impayee${factures.length > 1 ? 's' : ''}',
                    style: theme.textTheme.titleSmall?.copyWith(
                      color: theme.colorScheme.onErrorContainer,
                    ),
                  ),
                  Text(
                    'Total: ${CurrencyUtils.formatEUR(totalImpayees)}',
                    style: theme.textTheme.bodySmall?.copyWith(
                      color: theme.colorScheme.onErrorContainer,
                    ),
                  ),
                ],
              ),
            ),
            Icon(
              Icons.chevron_right,
              color: theme.colorScheme.onErrorContainer,
            ),
          ],
        ),
      ),
    );
  }
}
