import 'package:flutter/material.dart';

import '../../../../domain/enums/chantier_statut.dart';
import '../../../../domain/models/chantier.dart';
import '../../../../shared/widgets/aej_badge.dart';

class ChantierCard extends StatelessWidget {
  const ChantierCard({
    super.key,
    required this.chantier,
    this.onTap,
  });

  final Chantier chantier;
  final VoidCallback? onTap;

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    return Card(
      clipBehavior: Clip.antiAlias,
      child: InkWell(
        onTap: onTap,
        child: Padding(
          padding: const EdgeInsets.all(16),
          child: Row(
            children: [
              CircleAvatar(
                backgroundColor: theme.colorScheme.primaryContainer,
                child: Icon(
                  Icons.construction,
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
                            chantier.description,
                            style: theme.textTheme.titleSmall,
                            overflow: TextOverflow.ellipsis,
                          ),
                        ),
                        const SizedBox(width: 8),
                        AejBadge(
                          label: chantier.statut.label,
                          variant: statutBadgeVariant(chantier.statut),
                          size: AejBadgeSize.sm,
                        ),
                      ],
                    ),
                    const SizedBox(height: 4),
                    Text(
                      '${chantier.adresse}, ${chantier.ville}',
                      style: theme.textTheme.bodySmall?.copyWith(
                        color: theme.colorScheme.onSurfaceVariant,
                      ),
                      overflow: TextOverflow.ellipsis,
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
}

AejBadgeVariant statutBadgeVariant(ChantierStatut statut) {
  switch (statut) {
    case ChantierStatut.lead:
      return AejBadgeVariant.info;
    case ChantierStatut.visitePlanifiee:
      return AejBadgeVariant.info;
    case ChantierStatut.devisEnvoye:
      return AejBadgeVariant.warning;
    case ChantierStatut.accepte:
      return AejBadgeVariant.success;
    case ChantierStatut.planifie:
      return AejBadgeVariant.primary;
    case ChantierStatut.enCours:
      return AejBadgeVariant.primary;
    case ChantierStatut.termine:
      return AejBadgeVariant.success;
    case ChantierStatut.facture:
      return AejBadgeVariant.secondary;
    case ChantierStatut.annule:
      return AejBadgeVariant.error;
  }
}
