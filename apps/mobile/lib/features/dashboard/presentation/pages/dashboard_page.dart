import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../../../../core/router/route_names.dart';
import '../../../../core/utils/currency_utils.dart';
import '../../../../shared/widgets/aej_spinner.dart';
import '../providers/dashboard_providers.dart';
import '../widgets/activity_feed.dart';
import '../widgets/chart_widget.dart';
import '../widgets/kpi_card.dart';

class DashboardPage extends ConsumerWidget {
  const DashboardPage({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final state = ref.watch(dashboardNotifierProvider);
    final theme = Theme.of(context);

    if (state.isLoading && state.stats == null) {
      return const Scaffold(
        body: Center(child: AejSpinner()),
      );
    }

    return Scaffold(
      appBar: AppBar(
        title: const Text('Dashboard'),
        actions: [
          IconButton(
            icon: const Icon(Icons.analytics_outlined),
            onPressed: () => context.pushNamed(RouteNames.analytics),
          ),
        ],
      ),
      body: RefreshIndicator(
        onRefresh: () =>
            ref.read(dashboardNotifierProvider.notifier).refresh(),
        child: ListView(
          padding: const EdgeInsets.all(16),
          children: [
            // KPI Grid
            if (state.stats != null) ...[
              _buildKpiGrid(context, state),
              const SizedBox(height: 24),
            ],

            // Revenue Chart
            Text(
              'CA mensuel',
              style: theme.textTheme.titleMedium?.copyWith(
                fontWeight: FontWeight.bold,
              ),
            ),
            const SizedBox(height: 12),
            Card(
              child: Padding(
                padding: const EdgeInsets.all(16),
                child: _RevenueSection(),
              ),
            ),
            const SizedBox(height: 24),

            // Impayees Alert
            if (state.facturesImpayees.isNotEmpty) ...[
              ImpayeesAlert(
                factures: state.facturesImpayees,
                onTap: () => context.pushNamed(RouteNames.factures),
              ),
              const SizedBox(height: 24),
            ],

            // Upcoming interventions
            Text(
              'Interventions a venir',
              style: theme.textTheme.titleMedium?.copyWith(
                fontWeight: FontWeight.bold,
              ),
            ),
            const SizedBox(height: 8),
            Card(
              child: UpcomingInterventionsList(
                interventions: state.upcomingInterventions,
                onTap: (intervention) {
                  context.pushNamed(
                    RouteNames.interventionDetail,
                    pathParameters: {'id': intervention.id},
                  );
                },
              ),
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
      ),
    );
  }

  Widget _buildKpiGrid(BuildContext context, DashboardState state) {
    final stats = state.stats!;
    return GridView.count(
      crossAxisCount: 2,
      shrinkWrap: true,
      physics: const NeverScrollableScrollPhysics(),
      mainAxisSpacing: 8,
      crossAxisSpacing: 8,
      childAspectRatio: 1.4,
      children: [
        KpiCard(
          title: 'Clients',
          value: stats.clientsTotal.toString(),
          icon: Icons.people,
          iconColor: const Color(0xFF2563EB),
        ),
        KpiCard(
          title: 'Chantiers en cours',
          value: stats.chantiersEnCours.toString(),
          icon: Icons.construction,
          iconColor: const Color(0xFF16A34A),
        ),
        KpiCard(
          title: 'Devis en attente',
          value: stats.devisEnAttente.toString(),
          icon: Icons.description,
          iconColor: const Color(0xFFF59E0B),
        ),
        KpiCard(
          title: 'CA du mois',
          value: CurrencyUtils.formatEUR(stats.caMois),
          icon: Icons.euro,
          iconColor: const Color(0xFF8B5CF6),
          subtitle: 'Annee: ${CurrencyUtils.formatEUR(stats.caAnnee)}',
        ),
      ],
    );
  }
}

class _RevenueSection extends ConsumerWidget {
  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final analyticsState = ref.watch(analyticsNotifierProvider);

    if (analyticsState.isLoading && analyticsState.revenueByMonth.isEmpty) {
      return const SizedBox(
        height: 200,
        child: Center(child: AejSpinner(size: AejSpinnerSize.sm)),
      );
    }

    if (analyticsState.revenueByMonth.isEmpty) {
      return const SizedBox(
        height: 200,
        child: Center(child: Text('Aucune donnee disponible')),
      );
    }

    return RevenueBarChart(data: analyticsState.revenueByMonth);
  }
}
