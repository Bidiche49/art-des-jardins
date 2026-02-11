import 'package:flutter/material.dart';

import '../../../../domain/enums/client_type.dart';
import '../../../../domain/models/client.dart';
import '../../../../shared/widgets/aej_badge.dart';

class ClientCard extends StatelessWidget {
  const ClientCard({
    super.key,
    required this.client,
    this.onTap,
  });

  final Client client;
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
                child: Text(
                  client.nom.isNotEmpty ? client.nom[0].toUpperCase() : '?',
                  style: TextStyle(
                    color: theme.colorScheme.onPrimaryContainer,
                    fontWeight: FontWeight.bold,
                  ),
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
                            _displayName,
                            style: theme.textTheme.titleSmall,
                            overflow: TextOverflow.ellipsis,
                          ),
                        ),
                        const SizedBox(width: 8),
                        AejBadge(
                          label: client.type.label,
                          variant: _badgeVariant,
                          size: AejBadgeSize.sm,
                        ),
                      ],
                    ),
                    const SizedBox(height: 4),
                    Text(
                      client.email,
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

  String get _displayName {
    if (client.prenom != null && client.prenom!.isNotEmpty) {
      return '${client.nom} ${client.prenom}';
    }
    if (client.raisonSociale != null && client.raisonSociale!.isNotEmpty) {
      return '${client.nom} - ${client.raisonSociale}';
    }
    return client.nom;
  }

  AejBadgeVariant get _badgeVariant {
    switch (client.type) {
      case ClientType.particulier:
        return AejBadgeVariant.primary;
      case ClientType.professionnel:
        return AejBadgeVariant.info;
      case ClientType.syndic:
        return AejBadgeVariant.warning;
    }
  }
}
