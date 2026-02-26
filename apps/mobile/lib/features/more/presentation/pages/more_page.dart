import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../../../../core/router/route_names.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../domain/enums/user_role.dart';
import '../../../../features/auth/domain/auth_state.dart';
import '../../../../features/auth/presentation/auth_notifier.dart';

class _MoreItem {
  const _MoreItem({
    required this.icon,
    required this.label,
    required this.routeName,
    this.color,
  });

  final IconData icon;
  final String label;
  final String routeName;
  final Color? color;
}

const _patronItems = [
  _MoreItem(
    icon: Icons.dashboard_outlined,
    label: 'Dashboard',
    routeName: RouteNames.dashboard,
    color: AppColors.primary,
  ),
  _MoreItem(
    icon: Icons.description_outlined,
    label: 'Devis',
    routeName: RouteNames.devis,
    color: AppColors.info,
  ),
  _MoreItem(
    icon: Icons.receipt_long_outlined,
    label: 'Factures',
    routeName: RouteNames.factures,
    color: AppColors.secondary,
  ),
  _MoreItem(
    icon: Icons.bar_chart_outlined,
    label: 'Analytics',
    routeName: RouteNames.analytics,
  ),
  _MoreItem(
    icon: Icons.euro_outlined,
    label: 'Finance',
    routeName: RouteNames.finance,
    color: AppColors.olive600,
  ),
  _MoreItem(
    icon: Icons.build_outlined,
    label: 'Interventions',
    routeName: RouteNames.interventions,
  ),
  _MoreItem(
    icon: Icons.qr_code_scanner,
    label: 'Scanner',
    routeName: RouteNames.scanner,
  ),
  _MoreItem(
    icon: Icons.sync_outlined,
    label: 'Conflits sync',
    routeName: RouteNames.conflicts,
    color: AppColors.warning,
  ),
  _MoreItem(
    icon: Icons.settings_outlined,
    label: 'Parametres',
    routeName: RouteNames.settings,
  ),
];

const _employeItems = [
  _MoreItem(
    icon: Icons.qr_code_scanner,
    label: 'Scanner',
    routeName: RouteNames.scanner,
  ),
  _MoreItem(
    icon: Icons.sync_outlined,
    label: 'Conflits sync',
    routeName: RouteNames.conflicts,
    color: AppColors.warning,
  ),
  _MoreItem(
    icon: Icons.event_busy_outlined,
    label: 'Absences',
    routeName: RouteNames.absences,
  ),
  _MoreItem(
    icon: Icons.settings_outlined,
    label: 'Parametres',
    routeName: RouteNames.settings,
  ),
];

class MorePage extends ConsumerWidget {
  const MorePage({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final authState = ref.watch(authNotifierProvider);
    final role = authState is AuthAuthenticated
        ? authState.user.role
        : UserRole.employe;

    final items = role == UserRole.patron ? _patronItems : _employeItems;
    final theme = Theme.of(context);

    return ListView.separated(
      padding: const EdgeInsets.symmetric(vertical: 8),
      itemCount: items.length,
      separatorBuilder: (_, __) => const Divider(height: 1, indent: 56),
      itemBuilder: (context, index) {
        final item = items[index];
        final color = item.color ?? theme.colorScheme.onSurface;

        return ListTile(
          leading: Container(
            width: 40,
            height: 40,
            decoration: BoxDecoration(
              color: color.withAlpha(25),
              borderRadius: BorderRadius.circular(10),
            ),
            child: Icon(item.icon, color: color, size: 22),
          ),
          title: Text(item.label),
          trailing: const Icon(Icons.chevron_right, size: 20),
          onTap: () => context.goNamed(item.routeName),
        );
      },
    );
  }
}
