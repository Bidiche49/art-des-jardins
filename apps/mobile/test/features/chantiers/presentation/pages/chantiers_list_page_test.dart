import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:mocktail/mocktail.dart';

import 'package:art_et_jardin/domain/enums/chantier_statut.dart';
import 'package:art_et_jardin/domain/models/chantier.dart';
import 'package:art_et_jardin/features/chantiers/domain/chantiers_repository.dart';
import 'package:art_et_jardin/features/chantiers/presentation/pages/chantiers_list_page.dart';
import 'package:art_et_jardin/features/chantiers/presentation/providers/chantiers_providers.dart';
import 'package:art_et_jardin/features/chantiers/presentation/widgets/chantier_card.dart';
import 'package:art_et_jardin/shared/widgets/aej_empty_state.dart';

class MockChantiersRepository extends Mock implements ChantiersRepository {}

Chantier _testChantier({
  String id = 'ch1',
  ChantierStatut statut = ChantierStatut.lead,
  String description = 'Amenagement jardin',
  String adresse = '1 rue du Parc',
  String ville = 'Angers',
}) =>
    Chantier(
      id: id,
      clientId: 'c1',
      adresse: adresse,
      codePostal: '49000',
      ville: ville,
      description: description,
      statut: statut,
      typePrestation: [],
      createdAt: DateTime(2026, 1, 1),
      updatedAt: DateTime(2026, 1, 1),
    );

Widget _wrapWithProviders({
  required List<Chantier> chantiers,
}) {
  final mockRepo = MockChantiersRepository();
  when(() => mockRepo.getAll()).thenAnswer((_) async => chantiers);
  when(() => mockRepo.create(any())).thenAnswer((_) async => _testChantier());
  when(() => mockRepo.delete(any())).thenAnswer((_) async {});

  return ProviderScope(
    overrides: [
      chantiersRepositoryProvider.overrideWithValue(mockRepo),
    ],
    child: const MaterialApp(
      home: ChantiersListPage(),
    ),
  );
}

void main() {
  setUpAll(() {
    registerFallbackValue(_testChantier());
  });

  group('ChantiersListPage', () {
    testWidgets('affiche la liste de chantiers (cards)', (tester) async {
      await tester.pumpWidget(_wrapWithProviders(
        chantiers: [
          _testChantier(id: 'ch1', description: 'Jardin'),
          _testChantier(id: 'ch2', description: 'Elagage'),
        ],
      ));
      await tester.pumpAndSettle();

      expect(find.byType(ChantierCard), findsNWidgets(2));
    });

    testWidgets('chaque card affiche description, statut, adresse',
        (tester) async {
      await tester.pumpWidget(_wrapWithProviders(
        chantiers: [
          _testChantier(
            description: 'Amenagement jardin',
            adresse: '1 rue du Parc',
            ville: 'Angers',
          ),
        ],
      ));
      await tester.pumpAndSettle();

      expect(find.text('Amenagement jardin'), findsOneWidget);
      expect(find.text('1 rue du Parc, Angers'), findsOneWidget);
      expect(find.text('Lead'), findsWidgets); // Badge + filter chip
    });

    testWidgets('bouton FAB "+" visible', (tester) async {
      await tester.pumpWidget(
          _wrapWithProviders(chantiers: [_testChantier()]));
      await tester.pumpAndSettle();

      expect(find.byType(FloatingActionButton), findsOneWidget);
      expect(find.byIcon(Icons.add), findsOneWidget);
    });

    testWidgets('champ recherche filtre la liste', (tester) async {
      await tester.pumpWidget(_wrapWithProviders(
        chantiers: [
          _testChantier(id: 'ch1', description: 'Amenagement jardin'),
          _testChantier(id: 'ch2', description: 'Elagage chene'),
        ],
      ));
      await tester.pumpAndSettle();

      expect(find.byType(ChantierCard), findsNWidgets(2));

      await tester.enterText(find.byType(TextField), 'elagage');
      await tester.pumpAndSettle(const Duration(milliseconds: 400));

      expect(find.byType(ChantierCard), findsOneWidget);
    });

    testWidgets('liste vide -> AejEmptyState', (tester) async {
      await tester.pumpWidget(_wrapWithProviders(chantiers: []));
      await tester.pumpAndSettle();

      expect(find.byType(AejEmptyState), findsOneWidget);
      expect(find.text('Aucun chantier'), findsOneWidget);
    });

    testWidgets('chips Tous visible et selectionne par defaut',
        (tester) async {
      await tester.pumpWidget(
          _wrapWithProviders(chantiers: [_testChantier()]));
      await tester.pumpAndSettle();

      expect(find.widgetWithText(FilterChip, 'Tous'), findsOneWidget);
    });

    testWidgets('recherche par ville fonctionne', (tester) async {
      await tester.pumpWidget(_wrapWithProviders(
        chantiers: [
          _testChantier(
              id: 'ch1', description: 'Jardin', ville: 'Angers'),
          _testChantier(
              id: 'ch2', description: 'Parc', ville: 'Nantes'),
        ],
      ));
      await tester.pumpAndSettle();

      await tester.enterText(find.byType(TextField), 'nantes');
      await tester.pumpAndSettle(const Duration(milliseconds: 400));

      expect(find.byType(ChantierCard), findsOneWidget);
    });
  });
}
