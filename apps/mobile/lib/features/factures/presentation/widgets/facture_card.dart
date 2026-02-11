import 'package:flutter/material.dart';
import 'package:intl/intl.dart';

import '../../../../domain/enums/facture_statut.dart';
import '../../../../domain/models/facture.dart';
import '../../../../shared/widgets/aej_badge.dart';

class FactureCard extends StatelessWidget {
  const FactureCard({
    super.key,
    required this.facture,
    this.onTap,
  });

  final Facture facture;
  final VoidCallback? onTap;

  bool get isEnRetard {
    return facture.dateEcheance.isBefore(DateTime.now()) &&
        facture.statut != FactureStatut.payee &&
        facture.statut != FactureStatut.annulee;
  }

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
                  color: isEnRetard
                      ? theme.colorScheme.errorContainer
                      : theme.colorScheme.primaryContainer,
                  borderRadius: BorderRadius.circular(12),
                ),
                child: Icon(
                  Icons.receipt_long_outlined,
                  color: isEnRetard
                      ? theme.colorScheme.onErrorContainer
                      : theme.colorScheme.onPrimaryContainer,
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
                            facture.numero,
                            style: theme.textTheme.titleMedium?.copyWith(
                              fontWeight: FontWeight.w600,
                            ),
                          ),
                        ),
                        AejBadge(
                          label: facture.statut.label,
                          variant: factureStatutBadgeVariant(facture.statut),
                        ),
                        if (isEnRetard) ...[
                          const SizedBox(width: 4),
                          const AejBadge(
                            label: 'Retard',
                            variant: AejBadgeVariant.error,
                            size: AejBadgeSize.sm,
                          ),
                        ],
                      ],
                    ),
                    const SizedBox(height: 4),
                    Text(
                      dateFormat.format(facture.dateEmission),
                      style: theme.textTheme.bodySmall?.copyWith(
                        color: theme.colorScheme.onSurfaceVariant,
                      ),
                    ),
                    const SizedBox(height: 4),
                    Row(
                      children: [
                        Text(
                          '${facture.totalTTC.toStringAsFixed(2)} \u20ac TTC',
                          style: theme.textTheme.titleSmall?.copyWith(
                            fontWeight: FontWeight.bold,
                            color: theme.colorScheme.primary,
                          ),
                        ),
                        if (isEnRetard) ...[
                          const Spacer(),
                          Text(
                            'Ech. ${dateFormat.format(facture.dateEcheance)}',
                            style: theme.textTheme.bodySmall?.copyWith(
                              color: theme.colorScheme.error,
                              fontWeight: FontWeight.w500,
                            ),
                          ),
                        ],
                      ],
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

AejBadgeVariant factureStatutBadgeVariant(FactureStatut statut) {
  switch (statut) {
    case FactureStatut.brouillon:
      return AejBadgeVariant.secondary;
    case FactureStatut.envoyee:
      return AejBadgeVariant.info;
    case FactureStatut.payee:
      return AejBadgeVariant.success;
    case FactureStatut.annulee:
      return AejBadgeVariant.error;
  }
}
