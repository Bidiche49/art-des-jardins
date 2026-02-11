import 'package:flutter/material.dart';

import '../../../../domain/enums/client_type.dart';

class ClientFilters extends StatelessWidget {
  const ClientFilters({
    super.key,
    required this.selectedType,
    required this.onTypeChanged,
  });

  final ClientType? selectedType;
  final void Function(ClientType?) onTypeChanged;

  @override
  Widget build(BuildContext context) {
    return SingleChildScrollView(
      scrollDirection: Axis.horizontal,
      padding: const EdgeInsets.symmetric(horizontal: 16),
      child: Row(
        children: [
          FilterChip(
            label: const Text('Tous'),
            selected: selectedType == null,
            onSelected: (_) => onTypeChanged(null),
          ),
          const SizedBox(width: 8),
          for (final type in ClientType.values) ...[
            FilterChip(
              label: Text(type.label),
              selected: selectedType == type,
              onSelected: (_) =>
                  onTypeChanged(selectedType == type ? null : type),
            ),
            const SizedBox(width: 8),
          ],
        ],
      ),
    );
  }
}
