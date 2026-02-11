import 'package:art_et_jardin/domain/enums/sync_status.dart';
import 'package:art_et_jardin/domain/enums/user_role.dart';
import 'package:art_et_jardin/domain/models/auth_response.dart';
import 'package:art_et_jardin/domain/models/daily_weather.dart';
import 'package:art_et_jardin/domain/models/dashboard_stats.dart';
import 'package:art_et_jardin/domain/models/prestation_template.dart';
import 'package:art_et_jardin/domain/models/rentabilite_data.dart';
import 'package:art_et_jardin/domain/models/search_result.dart';
import 'package:art_et_jardin/domain/models/sync_conflict.dart';
import 'package:art_et_jardin/domain/models/sync_queue_item.dart';
import 'package:art_et_jardin/domain/models/user.dart';
import 'package:flutter_test/flutter_test.dart';

void main() {
  Map<String, dynamic> fullDashboardStatsJson() => {
        'clientsTotal': 42,
        'chantiersEnCours': 8,
        'devisEnAttente': 5,
        'facturesImpayees': 3,
        'caMois': 12500.50,
        'caAnnee': 95000.0,
      };

  Map<String, dynamic> fullDailyWeatherJson() => {
        'date': '2026-01-20',
        'tempMax': 12.5,
        'tempMin': 3.0,
        'precipitation': 2.5,
        'windSpeed': 15.0,
        'weatherCode': 61,
        'icon': '🌧️',
        'description': 'Pluie legere',
      };

  Map<String, dynamic> fullAuthResponseJson() => {
        'user': {
          'id': 'u1-uuid',
          'email': 'patron@artjardin.fr',
          'nom': 'Tardy',
          'prenom': 'Nicolas',
          'role': 'patron',
          'actif': true,
          'onboardingCompleted': false,
          'onboardingStep': 0,
          'createdAt': '2026-01-15T10:30:00.000Z',
          'updatedAt': '2026-01-15T10:30:00.000Z',
        },
        'accessToken': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.test',
        'refreshToken': 'refresh-token-value',
      };

  Map<String, dynamic> fullSyncQueueItemJson() => {
        'id': 'sq1-uuid',
        'operation': 'create',
        'entity': 'client',
        'entityId': 'c1-uuid',
        'data': {'nom': 'Martin', 'email': 'jean@example.com'},
        'timestamp': 1737000000000,
        'retryCount': 0,
        'lastError': null,
        'status': 'pending',
      };

  Map<String, dynamic> fullSyncConflictJson() => {
        'id': 'sc1-uuid',
        'entityType': 'intervention',
        'entityId': 'i1-uuid',
        'entityLabel': 'Intervention 20/01/2026',
        'localVersion': {'notes': 'Version locale'},
        'serverVersion': {'notes': 'Version serveur'},
        'localTimestamp': '2026-01-20T10:00:00.000Z',
        'serverTimestamp': '2026-01-20T10:05:00.000Z',
        'conflictingFields': ['notes'],
        'resolvedAt': null,
      };

  Map<String, dynamic> fullSearchResultJson() => {
        'entity': 'client',
        'entityId': 'c1-uuid',
        'title': 'Martin Jean',
        'subtitle': '49000 Angers',
        'matchField': 'nom',
      };

  Map<String, dynamic> fullRentabiliteDataJson() => {
        'chantierId': 'ch1-uuid',
        'totalHeures': 120.5,
        'coutMainOeuvre': 5422.5,
        'totalMateriel': 1500.0,
        'totalDevis': 9000.0,
        'marge': 2077.5,
        'margePercent': 23.08,
      };

  Map<String, dynamic> fullPrestationTemplateJson() => {
        'id': 'pt1-uuid',
        'name': 'Tonte standard',
        'description': 'Tonte pelouse avec ramassage',
        'category': 'entretien',
        'unit': 'm2',
        'unitPriceHT': 1.50,
        'tvaRate': 20.0,
        'isGlobal': true,
        'createdBy': null,
        'createdAt': '2026-01-15T10:30:00.000Z',
        'updatedAt': '2026-01-15T10:30:00.000Z',
      };

  group('DashboardStats', () {
    test('fromJson -> toJson round-trip', () {
      final stats = DashboardStats.fromJson(fullDashboardStatsJson());
      final json = stats.toJson();
      final stats2 = DashboardStats.fromJson(json);
      expect(stats2, stats);
    });

    test('fromJson with API JSON snapshot', () {
      final stats = DashboardStats.fromJson(fullDashboardStatsJson());
      expect(stats.clientsTotal, 42);
      expect(stats.chantiersEnCours, 8);
      expect(stats.caMois, 12500.50);
    });

    test('defaults to zero values', () {
      const stats = DashboardStats();
      expect(stats.clientsTotal, 0);
      expect(stats.caMois, 0.0);
    });
  });

  group('DailyWeather', () {
    test('fromJson -> toJson round-trip', () {
      final weather = DailyWeather.fromJson(fullDailyWeatherJson());
      final json = weather.toJson();
      final weather2 = DailyWeather.fromJson(json);
      expect(weather2, weather);
    });

    test('fromJson with API JSON snapshot', () {
      final weather = DailyWeather.fromJson(fullDailyWeatherJson());
      expect(weather.date, '2026-01-20');
      expect(weather.tempMax, 12.5);
      expect(weather.precipitation, 2.5);
      expect(weather.weatherCode, 61);
    });
  });

  group('AuthResponse', () {
    test('fromJson -> toJson round-trip', () {
      final auth = AuthResponse.fromJson(fullAuthResponseJson());
      final json = auth.toJson();
      final auth2 = AuthResponse.fromJson(json);
      expect(auth2, auth);
    });

    test('fromJson with API JSON snapshot', () {
      final auth = AuthResponse.fromJson(fullAuthResponseJson());
      expect(auth.user.nom, 'Tardy');
      expect(auth.user.role, UserRole.patron);
      expect(auth.accessToken, startsWith('eyJ'));
      expect(auth.refreshToken, 'refresh-token-value');
    });

    test('nested User is correctly deserialized', () {
      final auth = AuthResponse.fromJson(fullAuthResponseJson());
      expect(auth.user, isA<User>());
      expect(auth.user.email, 'patron@artjardin.fr');
    });
  });

  group('SyncQueueItem', () {
    test('fromJson -> toJson round-trip', () {
      final item = SyncQueueItem.fromJson(fullSyncQueueItemJson());
      final json = item.toJson();
      final item2 = SyncQueueItem.fromJson(json);
      expect(item2, item);
    });

    test('fromJson with API JSON snapshot', () {
      final item = SyncQueueItem.fromJson(fullSyncQueueItemJson());
      expect(item.operation, 'create');
      expect(item.entity, 'client');
      expect(item.status, SyncStatus.pending);
      expect(item.data, {'nom': 'Martin', 'email': 'jean@example.com'});
    });
  });

  group('SyncConflict', () {
    test('fromJson -> toJson round-trip', () {
      final conflict = SyncConflict.fromJson(fullSyncConflictJson());
      final json = conflict.toJson();
      final conflict2 = SyncConflict.fromJson(json);
      expect(conflict2, conflict);
    });

    test('fromJson with API JSON snapshot', () {
      final conflict = SyncConflict.fromJson(fullSyncConflictJson());
      expect(conflict.entityType, 'intervention');
      expect(conflict.conflictingFields, ['notes']);
      expect(conflict.resolvedAt, isNull);
    });
  });

  group('SearchResult', () {
    test('fromJson -> toJson round-trip', () {
      final result = SearchResult.fromJson(fullSearchResultJson());
      final json = result.toJson();
      final result2 = SearchResult.fromJson(json);
      expect(result2, result);
    });

    test('fromJson with API JSON snapshot', () {
      final result = SearchResult.fromJson(fullSearchResultJson());
      expect(result.entity, 'client');
      expect(result.title, 'Martin Jean');
      expect(result.matchField, 'nom');
    });
  });

  group('RentabiliteData', () {
    test('fromJson -> toJson round-trip', () {
      final data = RentabiliteData.fromJson(fullRentabiliteDataJson());
      final json = data.toJson();
      final data2 = RentabiliteData.fromJson(json);
      expect(data2, data);
    });

    test('fromJson with API JSON snapshot', () {
      final data = RentabiliteData.fromJson(fullRentabiliteDataJson());
      expect(data.chantierId, 'ch1-uuid');
      expect(data.totalHeures, 120.5);
      expect(data.marge, 2077.5);
      expect(data.margePercent, 23.08);
    });

    test('defaults to zero values', () {
      const data = RentabiliteData(chantierId: 'x');
      expect(data.totalHeures, 0.0);
      expect(data.marge, 0.0);
    });
  });

  group('PrestationTemplate', () {
    test('fromJson -> toJson round-trip', () {
      final tpl = PrestationTemplate.fromJson(fullPrestationTemplateJson());
      final json = tpl.toJson();
      final tpl2 = PrestationTemplate.fromJson(json);
      expect(tpl2, tpl);
    });

    test('fromJson with API JSON snapshot', () {
      final tpl = PrestationTemplate.fromJson(fullPrestationTemplateJson());
      expect(tpl.name, 'Tonte standard');
      expect(tpl.category, 'entretien');
      expect(tpl.unitPriceHT, 1.50);
      expect(tpl.isGlobal, true);
    });

    test('default tvaRate is 20.0', () {
      final tpl = PrestationTemplate(
        id: 'x',
        name: 'Test',
        category: 'divers',
        unit: 'h',
        unitPriceHT: 50,
        createdAt: DateTime.now(),
        updatedAt: DateTime.now(),
      );
      expect(tpl.tvaRate, 20.0);
    });
  });
}
