import 'package:flutter_test/flutter_test.dart';
import 'package:mocktail/mocktail.dart';

import 'package:art_et_jardin/domain/models/search_result.dart';
import 'package:art_et_jardin/features/search/domain/search_repository.dart';
import 'package:art_et_jardin/features/search/presentation/providers/search_providers.dart';

class MockSearchRepository extends Mock implements SearchRepository {}

void main() {
  late SearchNotifier notifier;
  late MockSearchRepository mockRepository;

  setUp(() {
    mockRepository = MockSearchRepository();
    notifier = SearchNotifier(repository: mockRepository);
  });

  tearDown(() {
    notifier.dispose();
  });

  group('SearchNotifier', () {
    test('initial state is empty', () {
      expect(notifier.state.query, '');
      expect(notifier.state.results, isEmpty);
      expect(notifier.state.isLoading, false);
      expect(notifier.state.hasSearched, false);
    });

    test('search < 2 chars clears results without API call', () async {
      await notifier.search('a');

      expect(notifier.state.query, 'a');
      expect(notifier.state.results, isEmpty);
      verifyNever(() => mockRepository.search(any()));
    });

    test('search >= 2 chars calls repository', () async {
      when(() => mockRepository.search('ab'))
          .thenAnswer((_) async => [
                const SearchResult(
                  entity: 'client',
                  entityId: 'c1',
                  title: 'Test AB',
                ),
              ]);

      await notifier.search('ab');

      expect(notifier.state.results.length, 1);
      expect(notifier.state.hasSearched, true);
      verify(() => mockRepository.search('ab')).called(1);
    });

    test('search error sets error state', () async {
      when(() => mockRepository.search('test'))
          .thenThrow(Exception('Network error'));

      await notifier.search('test');

      expect(notifier.state.error, isNotNull);
      expect(notifier.state.hasSearched, true);
      expect(notifier.state.isLoading, false);
    });

    test('clear resets state', () async {
      when(() => mockRepository.search('test'))
          .thenAnswer((_) async => [
                const SearchResult(
                  entity: 'client',
                  entityId: 'c1',
                  title: 'Test',
                ),
              ]);

      await notifier.search('test');
      notifier.clear();

      expect(notifier.state.query, '');
      expect(notifier.state.results, isEmpty);
      expect(notifier.state.hasSearched, false);
    });

    test('groupedResults groups by entity type', () async {
      when(() => mockRepository.search('test'))
          .thenAnswer((_) async => [
                const SearchResult(
                    entity: 'client', entityId: 'c1', title: 'Client 1'),
                const SearchResult(
                    entity: 'chantier', entityId: 'ch1', title: 'Chantier 1'),
                const SearchResult(
                    entity: 'client', entityId: 'c2', title: 'Client 2'),
              ]);

      await notifier.search('test');

      final grouped = notifier.state.groupedResults;
      expect(grouped.keys, containsAll(['client', 'chantier']));
      expect(grouped['client']!.length, 2);
      expect(grouped['chantier']!.length, 1);
    });
  });
}
