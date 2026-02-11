import 'package:flutter/material.dart';

class DevisTotaux extends StatelessWidget {
  const DevisTotaux({
    super.key,
    required this.totalHT,
    required this.totalTVA,
    required this.totalTTC,
  });

  final double totalHT;
  final double totalTVA;
  final double totalTTC;

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    return Card(
      color: theme.colorScheme.primaryContainer.withValues(alpha: 0.3),
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          children: [
            _TotauxRow(
              label: 'Total HT',
              value: totalHT,
              style: theme.textTheme.bodyLarge,
            ),
            const Divider(height: 16),
            _TotauxRow(
              label: 'Total TVA',
              value: totalTVA,
              style: theme.textTheme.bodyMedium?.copyWith(
                color: theme.colorScheme.onSurfaceVariant,
              ),
            ),
            const Divider(height: 16),
            _TotauxRow(
              label: 'Total TTC',
              value: totalTTC,
              style: theme.textTheme.titleLarge?.copyWith(
                fontWeight: FontWeight.bold,
                color: theme.colorScheme.primary,
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class _TotauxRow extends StatelessWidget {
  const _TotauxRow({
    required this.label,
    required this.value,
    this.style,
  });

  final String label;
  final double value;
  final TextStyle? style;

  @override
  Widget build(BuildContext context) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Text(label, style: style),
        Text('${value.toStringAsFixed(2)} \u20ac', style: style),
      ],
    );
  }
}
