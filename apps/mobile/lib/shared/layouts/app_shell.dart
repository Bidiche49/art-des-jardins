import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../../core/router/route_names.dart';

class _NavItem {
  const _NavItem({
    required this.icon,
    required this.activeIcon,
    required this.label,
    required this.path,
  });

  final IconData icon;
  final IconData activeIcon;
  final String label;
  final String path;
}

const _navItems = [
  _NavItem(
    icon: Icons.dashboard_outlined,
    activeIcon: Icons.dashboard,
    label: 'Dashboard',
    path: RoutePaths.dashboard,
  ),
  _NavItem(
    icon: Icons.people_outlined,
    activeIcon: Icons.people,
    label: 'Clients',
    path: RoutePaths.clients,
  ),
  _NavItem(
    icon: Icons.construction_outlined,
    activeIcon: Icons.construction,
    label: 'Chantiers',
    path: RoutePaths.chantiers,
  ),
  _NavItem(
    icon: Icons.description_outlined,
    activeIcon: Icons.description,
    label: 'Devis',
    path: RoutePaths.devis,
  ),
  _NavItem(
    icon: Icons.calendar_month_outlined,
    activeIcon: Icons.calendar_month,
    label: 'Calendrier',
    path: RoutePaths.calendar,
  ),
  _NavItem(
    icon: Icons.bar_chart_outlined,
    activeIcon: Icons.bar_chart,
    label: 'Analytics',
    path: RoutePaths.analytics,
  ),
];

class AppShell extends ConsumerWidget {
  const AppShell({super.key, required this.child});

  final Widget child;

  int _currentIndex(String location) {
    for (int i = 0; i < _navItems.length; i++) {
      final path = _navItems[i].path;
      if (path == '/' && location == '/') return i;
      if (path != '/' && location.startsWith(path)) return i;
    }
    return 0;
  }

  String _titleForLocation(String location) {
    if (location == '/') return 'Dashboard';
    if (location.startsWith('/clients')) return 'Clients';
    if (location.startsWith('/chantiers')) return 'Chantiers';
    if (location.startsWith('/devis')) return 'Devis';
    if (location.startsWith('/calendar')) return 'Calendrier';
    if (location.startsWith('/analytics')) return 'Analytics';
    if (location.startsWith('/interventions')) return 'Interventions';
    if (location.startsWith('/factures')) return 'Factures';
    if (location.startsWith('/settings')) return 'Parametres';
    if (location.startsWith('/search')) return 'Recherche';
    if (location.startsWith('/scanner')) return 'Scanner';
    if (location.startsWith('/notifications')) return 'Notifications';
    return 'Art & Jardin';
  }

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final location =
        GoRouterState.of(context).matchedLocation;
    final currentIndex = _currentIndex(location);

    return Scaffold(
      appBar: AppBar(
        title: Text(_titleForLocation(location)),
        actions: [
          IconButton(
            icon: const Icon(Icons.search),
            onPressed: () => context.pushNamed(RouteNames.search),
            tooltip: 'Rechercher',
          ),
          IconButton(
            icon: const Icon(Icons.notifications_outlined),
            onPressed: () => context.pushNamed(RouteNames.notifications),
            tooltip: 'Notifications',
          ),
          IconButton(
            icon: const Icon(Icons.settings_outlined),
            onPressed: () => context.pushNamed(RouteNames.settings),
            tooltip: 'Parametres',
          ),
        ],
      ),
      body: SafeArea(child: child),
      bottomNavigationBar: NavigationBar(
        selectedIndex: currentIndex,
        onDestinationSelected: (index) {
          context.go(_navItems[index].path);
        },
        destinations: _navItems
            .map((item) => NavigationDestination(
                  icon: Icon(item.icon),
                  selectedIcon: Icon(item.activeIcon),
                  label: item.label,
                ))
            .toList(),
      ),
    );
  }
}
