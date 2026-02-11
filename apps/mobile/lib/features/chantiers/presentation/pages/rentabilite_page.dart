import 'package:fl_chart/fl_chart.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../../../domain/models/rentabilite_data.dart';
import '../../../../shared/widgets/aej_spinner.dart';
import '../providers/chantiers_providers.dart';

class RentabilitePage extends ConsumerWidget {
  const RentabilitePage({super.key, required this.chantierId});

  final String chantierId;

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final rentabiliteState = ref.watch(rentabiliteProvider(chantierId));

    return Scaffold(
      appBar: AppBar(title: const Text('Rentabilite')),
      body: rentabiliteState.when(
        loading: () => const Center(child: AejSpinner()),
        error: (error, _) => Center(child: Text('Erreur: $error')),
        data: (data) => _RentabiliteContent(data: data),
      ),
    );
  }
}

class _RentabiliteContent extends StatelessWidget {
  const _RentabiliteContent({required this.data});

  final RentabiliteData data;

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    return ListView(
      padding: const EdgeInsets.all(16),
      children: [
        // Marge percentage headline
        _buildMargeCard(theme),
        const SizedBox(height: 24),

        // Summary cards
        Row(
          children: [
            Expanded(child: _buildMetricCard(theme, 'CA', data.totalDevis, Colors.green)),
            const SizedBox(width: 12),
            Expanded(child: _buildMetricCard(theme, 'Couts', data.coutMainOeuvre, Colors.red)),
          ],
        ),
        const SizedBox(height: 12),
        Row(
          children: [
            Expanded(child: _buildMetricCard(theme, 'Marge', data.marge, Colors.blue)),
            const SizedBox(width: 12),
            Expanded(child: _buildMetricCard(theme, 'Heures', data.totalHeures, Colors.orange, suffix: 'h')),
          ],
        ),
        const SizedBox(height: 24),

        // Pie chart
        if (data.totalDevis > 0) ...[
          Text('Repartition', style: theme.textTheme.titleMedium),
          const SizedBox(height: 16),
          SizedBox(
            height: 200,
            child: PieChart(
              PieChartData(
                sections: _buildPieSections(),
                centerSpaceRadius: 40,
                sectionsSpace: 2,
              ),
            ),
          ),
          const SizedBox(height: 16),
          _buildLegend(theme),
          const SizedBox(height: 24),
        ],

        // Bar chart
        if (data.totalDevis > 0) ...[
          Text('CA vs Couts', style: theme.textTheme.titleMedium),
          const SizedBox(height: 16),
          SizedBox(
            height: 200,
            child: BarChart(
              BarChartData(
                barGroups: _buildBarGroups(),
                titlesData: FlTitlesData(
                  topTitles: const AxisTitles(sideTitles: SideTitles(showTitles: false)),
                  rightTitles: const AxisTitles(sideTitles: SideTitles(showTitles: false)),
                  bottomTitles: AxisTitles(
                    sideTitles: SideTitles(
                      showTitles: true,
                      getTitlesWidget: (value, meta) {
                        switch (value.toInt()) {
                          case 0:
                            return const Text('CA');
                          case 1:
                            return const Text('Couts');
                          case 2:
                            return const Text('Marge');
                          default:
                            return const Text('');
                        }
                      },
                    ),
                  ),
                ),
                gridData: const FlGridData(show: false),
                borderData: FlBorderData(show: false),
              ),
            ),
          ),
        ],
      ],
    );
  }

  Widget _buildMargeCard(ThemeData theme) {
    final isPositive = data.margePercent >= 0;
    final color = isPositive ? Colors.green : Colors.red;

    return Card(
      child: Padding(
        padding: const EdgeInsets.all(24),
        child: Column(
          children: [
            Text('Taux de marge', style: theme.textTheme.titleSmall),
            const SizedBox(height: 8),
            Text(
              '${data.margePercent.toStringAsFixed(1)}%',
              style: theme.textTheme.displaySmall?.copyWith(
                color: color,
                fontWeight: FontWeight.bold,
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildMetricCard(
      ThemeData theme, String label, double value, Color color,
      {String suffix = '\u20ac'}) {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          children: [
            Text(label, style: theme.textTheme.labelMedium),
            const SizedBox(height: 4),
            Text(
              '${value.toStringAsFixed(2)}$suffix',
              style: theme.textTheme.titleLarge?.copyWith(
                color: color,
                fontWeight: FontWeight.bold,
              ),
            ),
          ],
        ),
      ),
    );
  }

  List<PieChartSectionData> _buildPieSections() {
    final total = data.coutMainOeuvre + data.totalMateriel + data.marge.abs();
    if (total <= 0) return [];

    final sections = <PieChartSectionData>[];

    if (data.coutMainOeuvre > 0) {
      sections.add(PieChartSectionData(
        value: data.coutMainOeuvre,
        title: '${(data.coutMainOeuvre / total * 100).toStringAsFixed(0)}%',
        color: Colors.red.shade400,
        radius: 50,
        titleStyle: const TextStyle(fontSize: 12, color: Colors.white, fontWeight: FontWeight.bold),
      ));
    }

    if (data.totalMateriel > 0) {
      sections.add(PieChartSectionData(
        value: data.totalMateriel,
        title: '${(data.totalMateriel / total * 100).toStringAsFixed(0)}%',
        color: Colors.orange.shade400,
        radius: 50,
        titleStyle: const TextStyle(fontSize: 12, color: Colors.white, fontWeight: FontWeight.bold),
      ));
    }

    if (data.marge > 0) {
      sections.add(PieChartSectionData(
        value: data.marge,
        title: '${(data.marge / total * 100).toStringAsFixed(0)}%',
        color: Colors.green.shade400,
        radius: 50,
        titleStyle: const TextStyle(fontSize: 12, color: Colors.white, fontWeight: FontWeight.bold),
      ));
    }

    return sections;
  }

  Widget _buildLegend(ThemeData theme) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.center,
      children: [
        _legendItem(theme, 'Main d\'oeuvre', Colors.red.shade400),
        const SizedBox(width: 16),
        _legendItem(theme, 'Materiel', Colors.orange.shade400),
        const SizedBox(width: 16),
        _legendItem(theme, 'Marge', Colors.green.shade400),
      ],
    );
  }

  Widget _legendItem(ThemeData theme, String label, Color color) {
    return Row(
      mainAxisSize: MainAxisSize.min,
      children: [
        Container(width: 12, height: 12, color: color),
        const SizedBox(width: 4),
        Text(label, style: theme.textTheme.bodySmall),
      ],
    );
  }

  List<BarChartGroupData> _buildBarGroups() {
    return [
      BarChartGroupData(x: 0, barRods: [
        BarChartRodData(toY: data.totalDevis, color: Colors.green.shade400, width: 30),
      ]),
      BarChartGroupData(x: 1, barRods: [
        BarChartRodData(toY: data.coutMainOeuvre, color: Colors.red.shade400, width: 30),
      ]),
      BarChartGroupData(x: 2, barRods: [
        BarChartRodData(toY: data.marge > 0 ? data.marge : 0, color: Colors.blue.shade400, width: 30),
      ]),
    ];
  }
}
