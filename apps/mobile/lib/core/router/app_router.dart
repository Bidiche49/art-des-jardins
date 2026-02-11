import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../../features/auth/domain/auth_state.dart';
import '../../features/auth/presentation/auth_notifier.dart';
import '../../features/auth/presentation/pages/login_page.dart';
import '../../features/chantiers/presentation/pages/chantier_detail_page.dart';
import '../../features/chantiers/presentation/pages/chantiers_list_page.dart';
import '../../features/chantiers/presentation/pages/rentabilite_page.dart';
import '../../features/chantiers/presentation/widgets/chantier_form.dart';
import '../../features/clients/presentation/pages/client_detail_page.dart';
import '../../features/clients/presentation/pages/clients_list_page.dart';
import '../../features/clients/presentation/providers/clients_providers.dart';
import '../../features/clients/presentation/widgets/client_form.dart';
import '../../features/interventions/presentation/pages/intervention_detail_page.dart';
import '../../features/interventions/presentation/pages/interventions_list_page.dart';
import '../../features/interventions/presentation/widgets/intervention_form.dart';
import '../../features/chantiers/presentation/providers/chantiers_providers.dart' show chantiersListNotifierProvider;
import '../../features/sync/presentation/pages/conflict_resolution_page.dart';
import '../../shared/layouts/app_shell.dart';
import 'route_names.dart';

// Placeholder pages for routes not yet implemented
class _PlaceholderPage extends StatelessWidget {
  const _PlaceholderPage({required this.title});
  final String title;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Center(child: Text(title)),
    );
  }
}

final routerProvider = Provider<GoRouter>((ref) {
  final authState = ref.watch(authNotifierProvider);

  return GoRouter(
    initialLocation: RoutePaths.dashboard,
    redirect: (context, state) {
      final isAuthenticated = authState is AuthAuthenticated;
      final path = state.matchedLocation;

      // Public routes
      if (path == RoutePaths.login || path.startsWith('/signer/')) {
        if (isAuthenticated && path == RoutePaths.login) {
          return RoutePaths.dashboard;
        }
        return null;
      }

      // Protected routes
      if (!isAuthenticated) {
        return RoutePaths.login;
      }

      return null;
    },
    routes: [
      // Auth
      GoRoute(
        path: RoutePaths.login,
        name: RouteNames.login,
        builder: (context, state) => const LoginPage(),
      ),

      // Public
      GoRoute(
        path: RoutePaths.signerDevis,
        name: RouteNames.signerDevis,
        builder: (context, state) {
          final token = state.pathParameters['token']!;
          return _PlaceholderPage(title: 'Signer devis: $token');
        },
      ),

      // Shell route with BottomNav
      ShellRoute(
        builder: (context, state, child) => AppShell(child: child),
        routes: [
          GoRoute(
            path: RoutePaths.dashboard,
            name: RouteNames.dashboard,
            builder: (context, state) =>
                const _PlaceholderPage(title: 'Dashboard'),
          ),
          GoRoute(
            path: RoutePaths.clients,
            name: RouteNames.clients,
            builder: (context, state) => const ClientsListPage(),
            routes: [
              GoRoute(
                path: 'new',
                name: RouteNames.clientCreate,
                builder: (context, state) => Scaffold(
                  appBar: AppBar(title: const Text('Nouveau client')),
                  body: ClientForm(
                    onSubmit: (client) {
                      context.pop(client);
                    },
                  ),
                ),
              ),
              GoRoute(
                path: ':id',
                name: RouteNames.clientDetail,
                builder: (context, state) {
                  final id = state.pathParameters['id']!;
                  return ClientDetailPage(clientId: id);
                },
              ),
            ],
          ),
          GoRoute(
            path: RoutePaths.chantiers,
            name: RouteNames.chantiers,
            builder: (context, state) => const ChantiersListPage(),
            routes: [
              GoRoute(
                path: 'new',
                name: RouteNames.chantierCreate,
                builder: (context, state) => Consumer(
                  builder: (context, ref, _) {
                    final clientsState =
                        ref.watch(clientsListNotifierProvider);
                    final clients = clientsState.valueOrNull ?? [];
                    return Scaffold(
                      appBar:
                          AppBar(title: const Text('Nouveau chantier')),
                      body: ChantierForm(
                        clients: clients,
                        onSubmit: (chantier) {
                          context.pop(chantier);
                        },
                      ),
                    );
                  },
                ),
              ),
              GoRoute(
                path: ':id',
                name: RouteNames.chantierDetail,
                builder: (context, state) {
                  final id = state.pathParameters['id']!;
                  return ChantierDetailPage(chantierId: id);
                },
                routes: [
                  GoRoute(
                    path: 'rentabilite',
                    name: RouteNames.chantierRentabilite,
                    builder: (context, state) {
                      final id = state.pathParameters['id']!;
                      return RentabilitePage(chantierId: id);
                    },
                  ),
                ],
              ),
            ],
          ),
          GoRoute(
            path: RoutePaths.devis,
            name: RouteNames.devis,
            builder: (context, state) =>
                const _PlaceholderPage(title: 'Devis'),
            routes: [
              GoRoute(
                path: 'new',
                name: RouteNames.devisCreate,
                builder: (context, state) =>
                    const _PlaceholderPage(title: 'Nouveau devis'),
              ),
              GoRoute(
                path: ':id',
                name: RouteNames.devisDetail,
                builder: (context, state) {
                  final id = state.pathParameters['id']!;
                  return _PlaceholderPage(title: 'Devis $id');
                },
              ),
            ],
          ),
          GoRoute(
            path: RoutePaths.calendar,
            name: RouteNames.calendar,
            builder: (context, state) =>
                const _PlaceholderPage(title: 'Calendrier'),
          ),
          GoRoute(
            path: RoutePaths.analytics,
            name: RouteNames.analytics,
            builder: (context, state) =>
                const _PlaceholderPage(title: 'Analytics'),
          ),
          GoRoute(
            path: RoutePaths.interventions,
            name: RouteNames.interventions,
            builder: (context, state) =>
                const InterventionsListPage(),
            routes: [
              GoRoute(
                path: 'new',
                name: RouteNames.interventionCreate,
                builder: (context, state) => Consumer(
                  builder: (context, ref, _) {
                    final chantiersState =
                        ref.watch(chantiersListNotifierProvider);
                    final chantiers = chantiersState.valueOrNull ?? [];
                    return Scaffold(
                      appBar: AppBar(
                          title: const Text('Nouvelle intervention')),
                      body: InterventionForm(
                        chantiers: chantiers,
                        onSubmit: (intervention) {
                          context.pop(intervention);
                        },
                      ),
                    );
                  },
                ),
              ),
              GoRoute(
                path: ':id',
                name: RouteNames.interventionDetail,
                builder: (context, state) {
                  final id = state.pathParameters['id']!;
                  return InterventionDetailPage(interventionId: id);
                },
              ),
            ],
          ),
          GoRoute(
            path: RoutePaths.factureDetail,
            name: RouteNames.factureDetail,
            builder: (context, state) {
              final id = state.pathParameters['id']!;
              return _PlaceholderPage(title: 'Facture $id');
            },
          ),
          GoRoute(
            path: RoutePaths.conflicts,
            name: RouteNames.conflicts,
            builder: (context, state) =>
                const ConflictResolutionPage(),
          ),
          GoRoute(
            path: RoutePaths.settings,
            name: RouteNames.settings,
            builder: (context, state) =>
                const _PlaceholderPage(title: 'Parametres'),
          ),
          GoRoute(
            path: RoutePaths.search,
            name: RouteNames.search,
            builder: (context, state) =>
                const _PlaceholderPage(title: 'Recherche'),
          ),
          GoRoute(
            path: RoutePaths.scanner,
            name: RouteNames.scanner,
            builder: (context, state) =>
                const _PlaceholderPage(title: 'Scanner QR'),
          ),
          GoRoute(
            path: RoutePaths.notifications,
            name: RouteNames.notifications,
            builder: (context, state) =>
                const _PlaceholderPage(title: 'Notifications'),
          ),
        ],
      ),
    ],
    errorBuilder: (context, state) =>
        const _PlaceholderPage(title: 'Page introuvable'),
  );
});
