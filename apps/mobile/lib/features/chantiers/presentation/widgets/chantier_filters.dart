import 'package:flutter/material.dart';

import '../../../../domain/enums/chantier_statut.dart';

class ChantierFilters extends StatelessWidget {
  const ChantierFilters({
    super.key,
    required this.selectedStatut,
    required this.onStatutChanged,
  });

  final ChantierStatut? selectedStatut;
  final void Function(ChantierStatut?) onStatutChanged;

  @override
  Widget build(BuildContext context) {
    return SingleChildScrollView(
      scrollDirection: Axis.horizontal,
      padding: const EdgeInsets.symmetric(horizontal: 16),
      child: Row(
        children: [
          FilterChip(
            label: const Text('Tous'),
            selected: selectedStatut == null,
            onSelected: (_) => onStatutChanged(null),
          ),
          const SizedBox(width: 8),
          for (final statut in ChantierStatut.values) ...[
            FilterChip(
              label: Text(statut.label),
              selected: selectedStatut == statut,
              onSelected: (_) =>
                  onStatutChanged(selectedStatut == statut ? null : statut),
            ),
            const SizedBox(width: 8),
          ],
        ],
      ),
    );
  }
}
