/// API endpoint constants.
class ApiEndpoints {
  const ApiEndpoints._();

  // Auth
  static const String login = '/auth/login';
  static const String refreshToken = '/auth/refresh';
  static const String logout = '/auth/logout';
  static const String me = '/auth/me';

  // Clients
  static const String clients = '/clients';
  static String client(String id) => '/clients/$id';

  // Chantiers
  static const String chantiers = '/chantiers';
  static String chantier(String id) => '/chantiers/$id';
  static String chantierInterventions(String id) => '/chantiers/$id/interventions';

  // Devis
  static const String devis = '/devis';
  static String devisById(String id) => '/devis/$id';
  static String devisSign(String id) => '/devis/$id/sign';
  static String devisPdf(String id) => '/devis/$id/pdf';

  // Factures
  static const String factures = '/factures';
  static String facture(String id) => '/factures/$id';
  static String facturePdf(String id) => '/factures/$id/pdf';

  // Interventions
  static const String interventions = '/interventions';
  static String intervention(String id) => '/interventions/$id';
  static String interventionPhotos(String id) => '/interventions/$id/photos';

  // Calendar
  static const String calendar = '/calendar';
  static const String absences = '/calendar/absences';
  static String absence(String id) => '/calendar/absences/$id';

  // Users
  static const String users = '/users';
  static String user(String id) => '/users/$id';

  // Stats
  static const String stats = '/stats/dashboard';

  // Sync
  static const String syncPull = '/sync/pull';
  static const String syncPush = '/sync/push';

  // Signature (public, no auth)
  static String signatureLoad(String token) => '/signature/$token';
  static String signatureSign(String token) => '/signature/$token/sign';

  // Onboarding
  static const String onboardingStep = '/auth/onboarding/step';
  static const String onboardingComplete = '/auth/onboarding/complete';

  // Notifications
  static const String notificationsSubscribe = '/notifications/subscribe';
  static const String notificationsUnsubscribe = '/notifications/unsubscribe';

  // Templates
  static const String templates = '/templates';

  // Search
  static const String search = '/search';
}
