import 'package:flutter_test/flutter_test.dart';

import 'package:art_et_jardin/core/router/route_names.dart';

void main() {
  group('RouteNames', () {
    test('all route names are unique', () {
      final names = [
        RouteNames.login,
        RouteNames.signerDevis,
        RouteNames.dashboard,
        RouteNames.clients,
        RouteNames.chantiers,
        RouteNames.devis,
        RouteNames.calendar,
        RouteNames.analytics,
        RouteNames.clientDetail,
        RouteNames.clientCreate,
        RouteNames.chantierDetail,
        RouteNames.chantierCreate,
        RouteNames.chantierRentabilite,
        RouteNames.devisDetail,
        RouteNames.devisCreate,
        RouteNames.interventionDetail,
        RouteNames.interventionCreate,
        RouteNames.factureDetail,
        RouteNames.settings,
        RouteNames.search,
        RouteNames.scanner,
        RouteNames.notifications,
      ];
      expect(names.toSet().length, names.length,
          reason: 'All route names must be unique');
    });

    test('route paths match expected patterns', () {
      expect(RoutePaths.login, '/login');
      expect(RoutePaths.dashboard, '/');
      expect(RoutePaths.clients, '/clients');
      expect(RoutePaths.chantiers, '/chantiers');
      expect(RoutePaths.devis, '/devis');
      expect(RoutePaths.calendar, '/calendar');
      expect(RoutePaths.analytics, '/analytics');
    });

    test('detail routes contain :id parameter', () {
      expect(RoutePaths.clientDetail, contains(':id'));
      expect(RoutePaths.chantierDetail, contains(':id'));
      expect(RoutePaths.devisDetail, contains(':id'));
      expect(RoutePaths.interventionDetail, contains(':id'));
      expect(RoutePaths.factureDetail, contains(':id'));
    });

    test('signer route contains :token parameter', () {
      expect(RoutePaths.signerDevis, contains(':token'));
    });

    test('rentabilite route is nested under chantier', () {
      expect(RoutePaths.chantierRentabilite, startsWith('/chantiers/'));
      expect(RoutePaths.chantierRentabilite, contains(':id'));
      expect(RoutePaths.chantierRentabilite, endsWith('/rentabilite'));
    });
  });
}
