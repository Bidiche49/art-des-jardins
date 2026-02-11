import 'package:flutter/material.dart';
import 'package:intl/intl.dart';

import '../../../../domain/enums/absence_type.dart';
import '../../../../domain/models/absence.dart';
import '../../../../shared/widgets/aej_badge.dart';

class AbsenceCard extends StatelessWidget {
  const AbsenceCard({
    super.key,
    required this.absence,
    this.showActions = false,
    this.onValidate,
    this.onRefuse,
  });

  final Absence absence;
  final bool showActions;
  final VoidCallback? onValidate;
  final VoidCallback? onRefuse;

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final dateFormat = DateFormat('dd/MM/yyyy');
    final days = absence.dateFin.difference(absence.dateDebut).inDays + 1;

    return Card(
      margin: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
      child: Padding(
        padding: const EdgeInsets.all(12),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                Icon(
                  _typeIcon(absence.type),
                  color: _typeColor(absence.type),
                  size: 20,
                ),
                const SizedBox(width: 8),
                Expanded(
                  child: Text(
                    absence.type.label,
                    style: theme.textTheme.titleSmall?.copyWith(
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                ),
                AejBadge(
                  label: absence.validee ? 'Validee' : 'En attente',
                  variant: absence.validee
                      ? AejBadgeVariant.success
                      : AejBadgeVariant.warning,
                ),
              ],
            ),
            const SizedBox(height: 8),
            Row(
              children: [
                const Icon(Icons.date_range, size: 16, color: Colors.grey),
                const SizedBox(width: 4),
                Text(
                  '${dateFormat.format(absence.dateDebut)} - ${dateFormat.format(absence.dateFin)}',
                  style: theme.textTheme.bodySmall,
                ),
                const SizedBox(width: 8),
                Text(
                  '$days jour${days > 1 ? 's' : ''}',
                  style: theme.textTheme.bodySmall?.copyWith(
                    color: Colors.grey,
                  ),
                ),
              ],
            ),
            if (absence.motif != null && absence.motif!.isNotEmpty) ...[
              const SizedBox(height: 4),
              Text(
                absence.motif!,
                style: theme.textTheme.bodySmall?.copyWith(
                  color: Colors.grey.shade700,
                ),
              ),
            ],
            if (showActions && !absence.validee) ...[
              const Divider(height: 16),
              Row(
                mainAxisAlignment: MainAxisAlignment.end,
                children: [
                  TextButton.icon(
                    onPressed: onRefuse,
                    icon: const Icon(Icons.close, size: 18),
                    label: const Text('Refuser'),
                    style: TextButton.styleFrom(foregroundColor: Colors.red),
                  ),
                  const SizedBox(width: 8),
                  FilledButton.icon(
                    onPressed: onValidate,
                    icon: const Icon(Icons.check, size: 18),
                    label: const Text('Valider'),
                  ),
                ],
              ),
            ],
          ],
        ),
      ),
    );
  }

  IconData _typeIcon(AbsenceType type) {
    switch (type) {
      case AbsenceType.conge:
        return Icons.beach_access;
      case AbsenceType.maladie:
        return Icons.local_hospital;
      case AbsenceType.formation:
        return Icons.school;
      case AbsenceType.autre:
        return Icons.event_busy;
    }
  }

  Color _typeColor(AbsenceType type) {
    switch (type) {
      case AbsenceType.conge:
        return Colors.blue;
      case AbsenceType.maladie:
        return Colors.red;
      case AbsenceType.formation:
        return Colors.orange;
      case AbsenceType.autre:
        return Colors.grey;
    }
  }
}
