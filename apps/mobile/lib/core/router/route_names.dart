class RouteNames {
  const RouteNames._();

  // Auth
  static const String login = 'login';

  // Public
  static const String signerDevis = 'signer-devis';

  // Main tabs
  static const String dashboard = 'dashboard';
  static const String clients = 'clients';
  static const String chantiers = 'chantiers';
  static const String devis = 'devis';
  static const String calendar = 'calendar';
  static const String analytics = 'analytics';

  // Detail routes
  static const String clientDetail = 'client-detail';
  static const String clientCreate = 'client-create';
  static const String chantierDetail = 'chantier-detail';
  static const String chantierCreate = 'chantier-create';
  static const String chantierRentabilite = 'chantier-rentabilite';
  static const String devisDetail = 'devis-detail';
  static const String devisCreate = 'devis-create';
  static const String interventions = 'interventions';
  static const String interventionDetail = 'intervention-detail';
  static const String interventionCreate = 'intervention-create';
  static const String factureDetail = 'facture-detail';

  // Sync
  static const String conflicts = 'conflicts';

  // Utility
  static const String settings = 'settings';
  static const String search = 'search';
  static const String scanner = 'scanner';
  static const String notifications = 'notifications';
}

class RoutePaths {
  const RoutePaths._();

  static const String login = '/login';
  static const String signerDevis = '/signer/:token';
  static const String dashboard = '/';
  static const String clients = '/clients';
  static const String clientDetail = '/clients/:id';
  static const String clientCreate = '/clients/new';
  static const String chantiers = '/chantiers';
  static const String chantierDetail = '/chantiers/:id';
  static const String chantierCreate = '/chantiers/new';
  static const String chantierRentabilite = '/chantiers/:id/rentabilite';
  static const String devis = '/devis';
  static const String devisDetail = '/devis/:id';
  static const String devisCreate = '/devis/new';
  static const String calendar = '/calendar';
  static const String analytics = '/analytics';
  static const String interventions = '/interventions';
  static const String interventionDetail = '/interventions/:id';
  static const String interventionCreate = '/interventions/new';
  static const String factureDetail = '/factures/:id';
  static const String conflicts = '/conflicts';
  static const String settings = '/settings';
  static const String search = '/search';
  static const String scanner = '/scanner';
  static const String notifications = '/notifications';
}
