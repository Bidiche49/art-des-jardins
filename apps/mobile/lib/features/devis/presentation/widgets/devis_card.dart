import 'package:flutter/material.dart';
import 'package:intl/intl.dart';

import '../../../../domain/enums/devis_statut.dart';
import '../../../../domain/models/devis.dart';
import '../../../../shared/widgets/aej_badge.dart';

class DevisCard extends StatelessWidget {
  const DevisCard({
    super.key,
    required this.devis,
    this.onTap,
  });

  final Devis devis;
  final VoidCallback? onTap;

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final dateFormat = DateFormat('dd/MM/yyyy');

    return Card(
      margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 4),
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(12),
        child: Padding(
          padding: const EdgeInsets.all(16),
          child: Row(
            children: [
              Container(
                width: 48,
                height: 48,
                decoration: BoxDecoration(
                  color: theme.colorScheme.primaryContainer,
                  borderRadius: BorderRadius.circular(12),
                ),
                child: Icon(
                  Icons.description_outlined,
                  color: theme.colorScheme.onPrimaryContainer,
                ),
              ),
              const SizedBox(width: 16),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      children: [
                        Expanded(
                          child: Text(
                            devis.numero,
                            style: theme.textTheme.titleMedium?.copyWith(
                              fontWeight: FontWeight.w600,
                            ),
                          ),
                        ),
                        AejBadge(
                          label: devis.statut.label,
                          variant: statutBadgeVariant(devis.statut),
                        ),
                      ],
                    ),
                    const SizedBox(height: 4),
                    Text(
                      dateFormat.format(devis.dateEmission),
                      style: theme.textTheme.bodySmall?.copyWith(
                        color: theme.colorScheme.onSurfaceVariant,
                      ),
                    ),
                    const SizedBox(height: 4),
                    Text(
                      '${devis.totalTTC.toStringAsFixed(2)} \u20ac TTC',
                      style: theme.textTheme.titleSmall?.copyWith(
                        fontWeight: FontWeight.bold,
                        color: theme.colorScheme.primary,
                      ),
                    ),
                  ],
                ),
              ),
              const Icon(Icons.chevron_right),
            ],
          ),
        ),
      ),
    );
  }
}

AejBadgeVariant statutBadgeVariant(DevisStatut statut) {
  switch (statut) {
    case DevisStatut.brouillon:
      return AejBadgeVariant.secondary;
    case DevisStatut.envoye:
      return AejBadgeVariant.info;
    case DevisStatut.signe:
    case DevisStatut.accepte:
      return AejBadgeVariant.success;
    case DevisStatut.refuse:
      return AejBadgeVariant.error;
    case DevisStatut.expire:
      return AejBadgeVariant.warning;
  }
}
