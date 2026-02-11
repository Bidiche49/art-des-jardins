import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../../../core/utils/currency_utils.dart';
import '../../../../shared/widgets/aej_badge.dart';
import '../../../../shared/widgets/aej_empty_state.dart';
import '../../../../shared/widgets/aej_spinner.dart';
import '../providers/dashboard_providers.dart';
import '../widgets/kpi_card.dart';

class FinancePage extends ConsumerWidget {
  const FinancePage({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final state = ref.watch(financeNotifierProvider);

    return DefaultTabController(
      length: 4,
      child: Scaffold(
        appBar: AppBar(
          title: const Text('Finance'),
          bottom: const TabBar(
            isScrollable: true,
            tabs: [
              Tab(text: 'Resume'),
              Tab(text: 'Par client'),
              Tab(text: 'Impayes'),
              Tab(text: 'Previsionnel'),
            ],
          ),
        ),
        body: state.isLoading && state.revenueByMonth.isEmpty
            ? const Center(child: AejSpinner())
            : TabBarView(
                children: [
                  _ResumeTab(state: state),
                  _ParClientTab(state: state),
                  _ImpayesTab(state: state),
                  _PrevisionnelTab(state: state),
                ],
              ),
      ),
    );
  }
}

class _ResumeTab extends StatelessWidget {
  const _ResumeTab({required this.state});

  final FinanceState state;

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    return RefreshIndicator(
      onRefresh: () => Future.value(),
      child: ListView(
        padding: const EdgeInsets.all(16),
        children: [
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
                value: CurrencyUtils.formatEUR(state.totalCA),
                icon: Icons.euro,
                iconColor: const Color(0xFF16A34A),
              ),
              KpiCard(
                title: 'Impayes',
                value: CurrencyUtils.formatEUR(state.totalImpayees),
                icon: Icons.warning_amber,
                iconColor: const Color(0xFFDC2626),
              ),
              KpiCard(
                title: 'Marge brute',
                value: CurrencyUtils.formatEUR(state.totalCA * 0.35),
                icon: Icons.trending_up,
                iconColor: const Color(0xFF2563EB),
                subtitle: '35%',
              ),
              KpiCard(
                title: 'Marge nette',
                value: CurrencyUtils.formatEUR(state.totalCA * 0.15),
                icon: Icons.account_balance,
                iconColor: const Color(0xFF8B5CF6),
                subtitle: '15%',
              ),
            ],
          ),
          const SizedBox(height: 24),

          Text(
            'Detail mensuel',
            style: theme.textTheme.titleMedium?.copyWith(
              fontWeight: FontWeight.bold,
            ),
          ),
          const SizedBox(height: 8),
          Card(
            child: _MonthlyTable(revenue: state.revenueByMonth),
          ),

          if (state.error != null) ...[
            const SizedBox(height: 16),
            Text(
              state.error!,
              style: TextStyle(color: theme.colorScheme.error),
            ),
          ],
        ],
      ),
    );
  }
}

class _MonthlyTable extends StatelessWidget {
  const _MonthlyTable({required this.revenue});

  final List<double> revenue;

  static const _monthNames = [
    'Janvier', 'Fevrier', 'Mars', 'Avril', 'Mai', 'Juin',
    'Juillet', 'Aout', 'Septembre', 'Octobre', 'Novembre', 'Decembre',
  ];

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    return Padding(
      padding: const EdgeInsets.all(12),
      child: Column(
        children: [
          Row(
            children: [
              Expanded(
                child: Text(
                  'Mois',
                  style: theme.textTheme.bodySmall?.copyWith(
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ),
              Text(
                'CA',
                style: theme.textTheme.bodySmall?.copyWith(
                  fontWeight: FontWeight.bold,
                ),
              ),
            ],
          ),
          const Divider(),
          ...List.generate(revenue.length, (i) {
            return Padding(
              padding: const EdgeInsets.symmetric(vertical: 4),
              child: Row(
                children: [
                  Expanded(child: Text(_monthNames[i])),
                  Text(
                    CurrencyUtils.formatEUR(revenue[i]),
                    style: theme.textTheme.bodyMedium?.copyWith(
                      fontWeight: FontWeight.w500,
                    ),
                  ),
                ],
              ),
            );
          }),
          const Divider(),
          Row(
            children: [
              Expanded(
                child: Text(
                  'Total',
                  style: theme.textTheme.bodyMedium?.copyWith(
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ),
              Text(
                CurrencyUtils.formatEUR(
                    revenue.fold(0.0, (sum, v) => sum + v)),
                style: theme.textTheme.bodyMedium?.copyWith(
                  fontWeight: FontWeight.bold,
                  color: theme.colorScheme.primary,
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }
}

class _ParClientTab extends StatelessWidget {
  const _ParClientTab({required this.state});

  final FinanceState state;

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final sortedEntries = state.revenueByClient.entries.toList()
      ..sort((a, b) => b.value.compareTo(a.value));

    if (sortedEntries.isEmpty) {
      return const AejEmptyState(
        icon: Icons.people_outline,
        title: 'Aucune donnee',
        description: 'Pas de CA par client pour cette annee',
      );
    }

    final total = sortedEntries.fold(0.0, (sum, e) => sum + e.value);

    return ListView.builder(
      padding: const EdgeInsets.all(16),
      itemCount: sortedEntries.length,
      itemBuilder: (context, index) {
        final entry = sortedEntries[index];
        final percent = total > 0 ? (entry.value / total * 100) : 0.0;

        return Card(
          child: Padding(
            padding: const EdgeInsets.all(12),
            child: Row(
              children: [
                CircleAvatar(
                  radius: 18,
                  backgroundColor: theme.colorScheme.primaryContainer,
                  child: Text(
                    entry.key.isNotEmpty ? entry.key[0].toUpperCase() : '?',
                    style: TextStyle(
                      color: theme.colorScheme.onPrimaryContainer,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        entry.key,
                        style: theme.textTheme.bodyMedium?.copyWith(
                          fontWeight: FontWeight.w600,
                        ),
                      ),
                      const SizedBox(height: 4),
                      ClipRRect(
                        borderRadius: BorderRadius.circular(4),
                        child: LinearProgressIndicator(
                          value: percent / 100,
                          minHeight: 6,
                        ),
                      ),
                    ],
                  ),
                ),
                const SizedBox(width: 12),
                Column(
                  crossAxisAlignment: CrossAxisAlignment.end,
                  children: [
                    Text(
                      CurrencyUtils.formatEUR(entry.value),
                      style: theme.textTheme.bodyMedium?.copyWith(
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    Text(
                      '${percent.toStringAsFixed(1)}%',
                      style: theme.textTheme.bodySmall?.copyWith(
                        color: theme.colorScheme.onSurfaceVariant,
                      ),
                    ),
                  ],
                ),
              ],
            ),
          ),
        );
      },
    );
  }
}

class _ImpayesTab extends StatelessWidget {
  const _ImpayesTab({required this.state});

  final FinanceState state;

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final factures = state.facturesImpayees;

    if (factures.isEmpty) {
      return const AejEmptyState(
        icon: Icons.check_circle_outline,
        title: 'Aucun impaye',
        description: 'Toutes les factures sont a jour',
      );
    }

    return ListView(
      padding: const EdgeInsets.all(16),
      children: [
        Card(
          color: theme.colorScheme.errorContainer,
          child: Padding(
            padding: const EdgeInsets.all(16),
            child: Row(
              children: [
                Icon(Icons.warning_amber,
                    color: theme.colorScheme.onErrorContainer),
                const SizedBox(width: 12),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        'Total impayes',
                        style: theme.textTheme.titleSmall?.copyWith(
                          color: theme.colorScheme.onErrorContainer,
                        ),
                      ),
                      Text(
                        CurrencyUtils.formatEUR(state.totalImpayees),
                        style: theme.textTheme.headlineSmall?.copyWith(
                          color: theme.colorScheme.onErrorContainer,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),
        ),
        const SizedBox(height: 16),
        ...factures.map((f) => Card(
              child: ListTile(
                leading: const Icon(Icons.receipt_long),
                title: Text(f.numero),
                subtitle: Text(
                    'Echeance: ${f.dateEcheance.day}/${f.dateEcheance.month}/${f.dateEcheance.year}'),
                trailing: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  crossAxisAlignment: CrossAxisAlignment.end,
                  children: [
                    Text(
                      CurrencyUtils.formatEUR(f.totalTTC),
                      style: theme.textTheme.bodyMedium?.copyWith(
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    AejBadge(
                      label: _daysLate(f.dateEcheance),
                      variant: AejBadgeVariant.error,
                      size: AejBadgeSize.sm,
                    ),
                  ],
                ),
              ),
            )),
      ],
    );
  }

  String _daysLate(DateTime echeance) {
    final days = DateTime.now().difference(echeance).inDays;
    if (days <= 0) return 'A venir';
    return '$days j. retard';
  }
}

class _PrevisionnelTab extends StatelessWidget {
  const _PrevisionnelTab({required this.state});

  final FinanceState state;

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    return ListView(
      padding: const EdgeInsets.all(16),
      children: [
        KpiCard(
          title: 'CA realise',
          value: CurrencyUtils.formatEUR(state.totalCA),
          icon: Icons.check_circle,
          iconColor: const Color(0xFF16A34A),
        ),
        const SizedBox(height: 8),
        KpiCard(
          title: 'Devis en attente (potentiel)',
          value: CurrencyUtils.formatEUR(state.devisEnAttenteMontant),
          icon: Icons.hourglass_bottom,
          iconColor: const Color(0xFFF59E0B),
          subtitle: 'Montant des devis envoyes non signes',
        ),
        const SizedBox(height: 8),
        KpiCard(
          title: 'CA previsionnel',
          value: CurrencyUtils.formatEUR(
              state.totalCA + state.devisEnAttenteMontant),
          icon: Icons.timeline,
          iconColor: const Color(0xFF2563EB),
          subtitle: 'Realise + potentiel',
        ),
        const SizedBox(height: 24),
        Card(
          child: Padding(
            padding: const EdgeInsets.all(16),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  'Indicateurs',
                  style: theme.textTheme.titleMedium?.copyWith(
                    fontWeight: FontWeight.bold,
                  ),
                ),
                const SizedBox(height: 12),
                _IndicatorRow(
                  label: 'Impayes a recouvrer',
                  value: CurrencyUtils.formatEUR(state.totalImpayees),
                  color: const Color(0xFFDC2626),
                ),
                const SizedBox(height: 8),
                _IndicatorRow(
                  label: 'Marge brute estimee (35%)',
                  value: CurrencyUtils.formatEUR(state.totalCA * 0.35),
                  color: const Color(0xFF16A34A),
                ),
                const SizedBox(height: 8),
                _IndicatorRow(
                  label: 'Marge nette estimee (15%)',
                  value: CurrencyUtils.formatEUR(state.totalCA * 0.15),
                  color: const Color(0xFF2563EB),
                ),
              ],
            ),
          ),
        ),
      ],
    );
  }
}

class _IndicatorRow extends StatelessWidget {
  const _IndicatorRow({
    required this.label,
    required this.value,
    required this.color,
  });

  final String label;
  final String value;
  final Color color;

  @override
  Widget build(BuildContext context) {
    return Row(
      children: [
        Container(
          width: 8,
          height: 8,
          decoration: BoxDecoration(
            color: color,
            shape: BoxShape.circle,
          ),
        ),
        const SizedBox(width: 8),
        Expanded(child: Text(label)),
        Text(
          value,
          style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                fontWeight: FontWeight.w600,
              ),
        ),
      ],
    );
  }
}
