import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../../../core/utils/currency_utils.dart';
import '../../../../shared/widgets/aej_spinner.dart';
import '../providers/dashboard_providers.dart';
import '../widgets/chart_widget.dart';
import '../widgets/kpi_card.dart';

class AnalyticsPage extends ConsumerWidget {
  const AnalyticsPage({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final state = ref.watch(analyticsNotifierProvider);
    final theme = Theme.of(context);

    return Scaffold(
      appBar: AppBar(
        title: const Text('Analytics'),
      ),
      body: RefreshIndicator(
        onRefresh: () =>
            ref.read(analyticsNotifierProvider.notifier).refresh(),
        child: ListView(
          padding: const EdgeInsets.all(16),
          children: [
            // Year Selector
            _YearSelector(
              selectedYear: state.selectedYear ?? DateTime.now().year,
              onYearChanged: (year) {
                ref.read(analyticsNotifierProvider.notifier).changeYear(year);
              },
            ),
            const SizedBox(height: 16),

            if (state.isLoading && state.stats == null) ...[
              const SizedBox(
                height: 200,
                child: Center(child: AejSpinner()),
              ),
            ] else ...[
              // KPI Row
              if (state.stats != null)
                GridView.count(
                  crossAxisCount: 2,
                  shrinkWrap: true,
                  physics: const NeverScrollableScrollPhysics(),
                  mainAxisSpacing: 8,
                  crossAxisSpacing: 8,
                  childAspectRatio: 1.5,
                  children: [
                    KpiCard(
                      title: 'CA Total',
                      value: CurrencyUtils.formatEUR(state.totalRevenue),
                      icon: Icons.euro,
                      iconColor: const Color(0xFF16A34A),
                    ),
                    KpiCard(
                      title: 'Evolution',
                      value: '${state.evolutionPercent >= 0 ? '+' : ''}${state.evolutionPercent.toStringAsFixed(1)}%',
                      icon: state.evolutionPercent >= 0
                          ? Icons.trending_up
                          : Icons.trending_down,
                      iconColor: state.evolutionPercent >= 0
                          ? const Color(0xFF16A34A)
                          : const Color(0xFFDC2626),
                      trend: state.evolutionPercent,
                    ),
                    KpiCard(
                      title: 'Clients',
                      value: state.stats!.clientsTotal.toString(),
                      icon: Icons.people,
                      iconColor: const Color(0xFF2563EB),
                    ),
                    KpiCard(
                      title: 'Chantiers actifs',
                      value: state.stats!.chantiersEnCours.toString(),
                      icon: Icons.construction,
                      iconColor: const Color(0xFFF59E0B),
                    ),
                  ],
                ),
              const SizedBox(height: 24),

              // Revenue Chart
              Text(
                'Chiffre d\'affaires mensuel',
                style: theme.textTheme.titleMedium?.copyWith(
                  fontWeight: FontWeight.bold,
                ),
              ),
              const SizedBox(height: 12),
              Card(
                child: Padding(
                  padding: const EdgeInsets.all(16),
                  child: state.revenueByMonth.isNotEmpty
                      ? RevenueBarChart(
                          data: state.revenueByMonth,
                          previousYearData:
                              state.previousYearRevenue.isNotEmpty
                                  ? state.previousYearRevenue
                                  : null,
                        )
                      : const SizedBox(
                          height: 200,
                          child: Center(
                              child: Text('Aucune donnee disponible')),
                        ),
                ),
              ),
              const SizedBox(height: 16),

              // Comparison legend
              if (state.previousYearRevenue.isNotEmpty) ...[
                Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    _LegendItem(
                      color: theme.colorScheme.primary,
                      label: '${state.selectedYear}',
                    ),
                    const SizedBox(width: 16),
                    _LegendItem(
                      color: theme.colorScheme.primary.withAlpha(80),
                      label: '${(state.selectedYear ?? DateTime.now().year) - 1}',
                    ),
                  ],
                ),
              ],

              if (state.error != null) ...[
                const SizedBox(height: 16),
                Text(
                  state.error!,
                  style: TextStyle(color: theme.colorScheme.error),
                ),
              ],
            ],
          ],
        ),
      ),
    );
  }
}

class _YearSelector extends StatelessWidget {
  const _YearSelector({
    required this.selectedYear,
    required this.onYearChanged,
  });

  final int selectedYear;
  final void Function(int) onYearChanged;

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    return Row(
      mainAxisAlignment: MainAxisAlignment.center,
      children: [
        IconButton(
          icon: const Icon(Icons.chevron_left),
          onPressed: selectedYear > 2020
              ? () => onYearChanged(selectedYear - 1)
              : null,
        ),
        Container(
          padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 8),
          decoration: BoxDecoration(
            color: theme.colorScheme.primaryContainer,
            borderRadius: BorderRadius.circular(20),
          ),
          child: Text(
            '$selectedYear',
            style: theme.textTheme.titleMedium?.copyWith(
              fontWeight: FontWeight.bold,
              color: theme.colorScheme.onPrimaryContainer,
            ),
          ),
        ),
        IconButton(
          icon: const Icon(Icons.chevron_right),
          onPressed: selectedYear < DateTime.now().year
              ? () => onYearChanged(selectedYear + 1)
              : null,
        ),
      ],
    );
  }
}

class _LegendItem extends StatelessWidget {
  const _LegendItem({required this.color, required this.label});

  final Color color;
  final String label;

  @override
  Widget build(BuildContext context) {
    return Row(
      mainAxisSize: MainAxisSize.min,
      children: [
        Container(
          width: 12,
          height: 12,
          decoration: BoxDecoration(
            color: color,
            borderRadius: BorderRadius.circular(2),
          ),
        ),
        const SizedBox(width: 4),
        Text(label, style: Theme.of(context).textTheme.bodySmall),
      ],
    );
  }
}
