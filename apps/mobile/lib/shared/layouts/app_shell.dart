import 'dart:async';

import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../../core/router/route_names.dart';
import '../../features/auth/domain/auth_state.dart';
import '../../features/auth/presentation/auth_notifier.dart';
import '../../features/onboarding/presentation/providers/onboarding_providers.dart';
import '../../features/onboarding/presentation/widgets/onboarding_overlay.dart';
import '../../services/biometric/biometric_service.dart';
import '../../services/idle/idle_service.dart';
import '../../services/idle/idle_warning_dialog.dart';

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

class AppShell extends ConsumerStatefulWidget {
  const AppShell({super.key, required this.child});

  final Widget child;

  @override
  ConsumerState<AppShell> createState() => _AppShellState();
}

class _AppShellState extends ConsumerState<AppShell> with WidgetsBindingObserver {
  StreamSubscription<IdleState>? _idleSubscription;
  bool _warningDialogShown = false;

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addObserver(this);
    _startIdleService();
  }

  void _startIdleService() {
    final authState = ref.read(authNotifierProvider);
    if (authState is AuthAuthenticated) {
      final idleService = ref.read(idleServiceProvider);
      idleService.start(authState.user.role);

      // Initialize onboarding after first frame (deferred to avoid provider modification during build)
      final role = authState.user.role;
      WidgetsBinding.instance.addPostFrameCallback((_) {
        if (!mounted) return;
        ref.read(onboardingNotifierProvider.notifier).initialize(role);
      });

      _idleSubscription = idleService.stateStream.listen((state) {
        if (!mounted) return;
        switch (state) {
          case IdleState.active:
            if (_warningDialogShown) {
              Navigator.of(context, rootNavigator: true).pop();
              _warningDialogShown = false;
            }
          case IdleState.warning:
            if (!_warningDialogShown) {
              _warningDialogShown = true;
              showDialog(
                context: context,
                barrierDismissible: false,
                builder: (_) => const IdleWarningDialog(),
              ).then((_) {
                _warningDialogShown = false;
              });
            }
          case IdleState.expired:
            if (_warningDialogShown) {
              Navigator.of(context, rootNavigator: true).pop();
              _warningDialogShown = false;
            }
            _handleExpiration();
        }
      });
    }
  }

  Future<void> _handleExpiration() async {
    final biometricService = ref.read(biometricServiceProvider);
    final isAvailable = await biometricService.isAvailable();
    final isConfigured = biometricService.isConfigured;

    if (isAvailable && isConfigured) {
      final authenticated = await biometricService.authenticate();
      if (authenticated) {
        ref.read(idleServiceProvider).resetTimer();
        return;
      }
    }

    // Biometric not available/configured or failed -> logout
    await ref.read(authNotifierProvider.notifier).logout();
  }

  @override
  void didChangeAppLifecycleState(AppLifecycleState state) {
    final idleService = ref.read(idleServiceProvider);
    switch (state) {
      case AppLifecycleState.paused:
      case AppLifecycleState.inactive:
        idleService.onBackground();
      case AppLifecycleState.resumed:
        idleService.onForeground();
      default:
        break;
    }
  }

  @override
  void dispose() {
    WidgetsBinding.instance.removeObserver(this);
    _idleSubscription?.cancel();
    super.dispose();
  }

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
  Widget build(BuildContext context) {
    final location = GoRouterState.of(context).matchedLocation;
    final currentIndex = _currentIndex(location);

    // Reset idle timer on any navigation/interaction
    ref.read(idleServiceProvider).resetTimer();

    return GestureDetector(
      behavior: HitTestBehavior.opaque,
      onTap: () => ref.read(idleServiceProvider).resetTimer(),
      onPanDown: (_) => ref.read(idleServiceProvider).resetTimer(),
      child: Stack(
        children: [
          Scaffold(
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
            body: SafeArea(child: widget.child),
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
          ),
          const OnboardingOverlay(),
        ],
      ),
    );
  }
}
