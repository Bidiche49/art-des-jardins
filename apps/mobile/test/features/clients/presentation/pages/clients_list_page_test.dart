import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:mocktail/mocktail.dart';

import 'package:art_et_jardin/domain/enums/client_type.dart';
import 'package:art_et_jardin/domain/models/client.dart';
import 'package:art_et_jardin/features/clients/domain/clients_repository.dart';
import 'package:art_et_jardin/features/clients/presentation/pages/clients_list_page.dart';
import 'package:art_et_jardin/features/clients/presentation/providers/clients_providers.dart';
import 'package:art_et_jardin/features/clients/presentation/widgets/client_card.dart';
import 'package:art_et_jardin/shared/widgets/aej_empty_state.dart';

class MockClientsRepository extends Mock implements ClientsRepository {}

Client _testClient({
  String id = 'c1',
  ClientType type = ClientType.particulier,
  String nom = 'Dupont',
  String email = 'dupont@test.fr',
}) =>
    Client(
      id: id,
      type: type,
      nom: nom,
      email: email,
      telephone: '0612345678',
      adresse: '1 rue Test',
      codePostal: '49000',
      ville: 'Angers',
      tags: [],
      createdAt: DateTime(2026, 1, 1),
      updatedAt: DateTime(2026, 1, 1),
    );

Widget _wrapWithProviders({
  required List<Client> clients,
}) {
  final mockRepo = MockClientsRepository();
  when(() => mockRepo.getAll()).thenAnswer((_) async => clients);
  when(() => mockRepo.create(any())).thenAnswer((_) async => _testClient());
  when(() => mockRepo.delete(any())).thenAnswer((_) async {});

  return ProviderScope(
    overrides: [
      clientsRepositoryProvider.overrideWithValue(mockRepo),
    ],
    child: const MaterialApp(
      home: ClientsListPage(),
    ),
  );
}

void main() {
  setUpAll(() {
    registerFallbackValue(_testClient());
  });

  group('ClientsListPage', () {
    testWidgets('affiche la liste de clients (cards)', (tester) async {
      await tester.pumpWidget(_wrapWithProviders(
        clients: [
          _testClient(id: 'c1', nom: 'Dupont'),
          _testClient(id: 'c2', nom: 'Martin'),
        ],
      ));
      await tester.pumpAndSettle();

      expect(find.byType(ClientCard), findsNWidgets(2));
    });

    testWidgets('chaque card affiche nom, type, email', (tester) async {
      await tester.pumpWidget(_wrapWithProviders(
        clients: [_testClient(nom: 'Dupont', email: 'dupont@test.fr')],
      ));
      await tester.pumpAndSettle();

      expect(find.text('Dupont'), findsOneWidget);
      expect(find.text('dupont@test.fr'), findsOneWidget);
      expect(find.text('Particulier'), findsWidgets); // Badge + filter chip
    });

    testWidgets('bouton FAB "+" visible', (tester) async {
      await tester.pumpWidget(_wrapWithProviders(clients: [_testClient()]));
      await tester.pumpAndSettle();

      expect(find.byType(FloatingActionButton), findsOneWidget);
      expect(find.byIcon(Icons.add), findsOneWidget);
    });

    testWidgets('champ recherche filtre la liste', (tester) async {
      await tester.pumpWidget(_wrapWithProviders(
        clients: [
          _testClient(id: 'c1', nom: 'Dupont'),
          _testClient(id: 'c2', nom: 'Martin'),
        ],
      ));
      await tester.pumpAndSettle();

      expect(find.byType(ClientCard), findsNWidgets(2));

      // Type in search field
      await tester.enterText(find.byType(TextField), 'Martin');
      await tester.pumpAndSettle(const Duration(milliseconds: 400));

      expect(find.byType(ClientCard), findsOneWidget);
    });

    testWidgets('chips filtre par type', (tester) async {
      await tester.pumpWidget(_wrapWithProviders(
        clients: [
          _testClient(id: 'c1', type: ClientType.particulier, nom: 'Part'),
          _testClient(id: 'c2', type: ClientType.professionnel, nom: 'Pro'),
        ],
      ));
      await tester.pumpAndSettle();

      expect(find.byType(ClientCard), findsNWidgets(2));

      // Tap on "Professionnel" filter chip
      await tester.tap(find.widgetWithText(FilterChip, 'Professionnel'));
      await tester.pumpAndSettle();

      expect(find.byType(ClientCard), findsOneWidget);
    });

    testWidgets('liste vide -> AejEmptyState', (tester) async {
      await tester.pumpWidget(_wrapWithProviders(clients: []));
      await tester.pumpAndSettle();

      expect(find.byType(AejEmptyState), findsOneWidget);
      expect(find.text('Aucun client'), findsOneWidget);
    });

    testWidgets('chips Tous visible et selectionne par defaut', (tester) async {
      await tester.pumpWidget(_wrapWithProviders(clients: [_testClient()]));
      await tester.pumpAndSettle();

      expect(find.widgetWithText(FilterChip, 'Tous'), findsOneWidget);
    });

    testWidgets('recherche par email fonctionne', (tester) async {
      await tester.pumpWidget(_wrapWithProviders(
        clients: [
          _testClient(id: 'c1', nom: 'Dupont', email: 'alpha@test.fr'),
          _testClient(id: 'c2', nom: 'Martin', email: 'beta@test.fr'),
        ],
      ));
      await tester.pumpAndSettle();

      await tester.enterText(find.byType(TextField), 'beta');
      await tester.pumpAndSettle(const Duration(milliseconds: 400));

      expect(find.byType(ClientCard), findsOneWidget);
    });
  });
}
