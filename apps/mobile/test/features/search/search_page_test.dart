import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:mocktail/mocktail.dart';

import 'package:art_et_jardin/domain/models/search_result.dart';
import 'package:art_et_jardin/features/search/domain/search_repository.dart';
import 'package:art_et_jardin/features/search/presentation/providers/search_providers.dart';
import 'package:art_et_jardin/features/search/presentation/pages/search_page.dart';

class MockSearchRepository extends Mock implements SearchRepository {}

void main() {
  late MockSearchRepository mockRepository;

  setUp(() {
    mockRepository = MockSearchRepository();
  });

  Widget buildTestWidget() {
    return ProviderScope(
      overrides: [
        searchRepositoryProvider.overrideWithValue(mockRepository),
      ],
      child: const MaterialApp(
        home: SearchPage(),
      ),
    );
  }

  group('SearchPage', () {
    testWidgets('renders search field', (tester) async {
      await tester.pumpWidget(buildTestWidget());
      await tester.pumpAndSettle();

      expect(find.byType(TextField), findsOneWidget);
    });

    testWidgets('shows initial empty state with search hint', (tester) async {
      await tester.pumpWidget(buildTestWidget());
      await tester.pumpAndSettle();

      expect(find.text('Rechercher'), findsOneWidget);
      expect(find.text('Tapez au moins 2 caracteres pour lancer la recherche'),
          findsOneWidget);
    });

    testWidgets('shows no results state', (tester) async {
      when(() => mockRepository.search('xyz'))
          .thenAnswer((_) async => []);

      await tester.pumpWidget(buildTestWidget());
      await tester.pumpAndSettle();

      // Type search query
      await tester.enterText(find.byType(TextField), 'xyz');
      await tester.pump(const Duration(milliseconds: 250));
      await tester.pumpAndSettle();

      expect(find.text('Aucun resultat'), findsOneWidget);
    });

    testWidgets('shows grouped results by section', (tester) async {
      when(() => mockRepository.search('test')).thenAnswer((_) async => [
            const SearchResult(
                entity: 'client', entityId: 'c1', title: 'Client Test'),
            const SearchResult(
                entity: 'chantier',
                entityId: 'ch1',
                title: 'Chantier Test'),
          ]);

      await tester.pumpWidget(buildTestWidget());
      await tester.pumpAndSettle();

      await tester.enterText(find.byType(TextField), 'test');
      await tester.pump(const Duration(milliseconds: 250));
      await tester.pumpAndSettle();

      expect(find.text('Clients'), findsOneWidget);
      expect(find.text('Chantiers'), findsOneWidget);
      expect(find.text('Client Test'), findsOneWidget);
      expect(find.text('Chantier Test'), findsOneWidget);
    });

    testWidgets('shows entity-specific icons', (tester) async {
      when(() => mockRepository.search('test')).thenAnswer((_) async => [
            const SearchResult(
                entity: 'client', entityId: 'c1', title: 'Un Client'),
          ]);

      await tester.pumpWidget(buildTestWidget());
      await tester.pumpAndSettle();

      await tester.enterText(find.byType(TextField), 'test');
      await tester.pump(const Duration(milliseconds: 250));
      await tester.pumpAndSettle();

      expect(find.byIcon(Icons.person), findsOneWidget);
    });
  });
}
