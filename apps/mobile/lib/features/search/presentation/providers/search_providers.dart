import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../../../core/network/connectivity_service.dart';
import '../../../../core/network/dio_client.dart';
import '../../../../domain/models/search_result.dart';
import '../../../../services/sync/sync_providers.dart';
import '../../data/search_repository_impl.dart';
import '../../domain/search_repository.dart';

// ============== Repository ==============

final searchRepositoryProvider = Provider<SearchRepository>((ref) {
  final db = ref.read(appDatabaseProvider);
  return SearchRepositoryImpl(
    clientsDao: db.clientsDao,
    chantiersDao: db.chantiersDao,
    devisDao: db.devisDao,
    facturesDao: db.facturesDao,
    authDio: ref.read(authDioProvider),
    connectivityService: ref.read(connectivityServiceProvider),
  );
});

// ============== Search Notifier ==============

final searchNotifierProvider =
    StateNotifierProvider<SearchNotifier, SearchState>((ref) {
  return SearchNotifier(
    repository: ref.read(searchRepositoryProvider),
  );
});

class SearchState {
  const SearchState({
    this.query = '',
    this.results = const [],
    this.isLoading = false,
    this.error,
    this.hasSearched = false,
  });

  final String query;
  final List<SearchResult> results;
  final bool isLoading;
  final String? error;
  final bool hasSearched;

  Map<String, List<SearchResult>> get groupedResults {
    final grouped = <String, List<SearchResult>>{};
    for (final result in results) {
      grouped.putIfAbsent(result.entity, () => []).add(result);
    }
    return grouped;
  }

  SearchState copyWith({
    String? query,
    List<SearchResult>? results,
    bool? isLoading,
    String? error,
    bool? hasSearched,
  }) {
    return SearchState(
      query: query ?? this.query,
      results: results ?? this.results,
      isLoading: isLoading ?? this.isLoading,
      error: error,
      hasSearched: hasSearched ?? this.hasSearched,
    );
  }
}

class SearchNotifier extends StateNotifier<SearchState> {
  SearchNotifier({required SearchRepository repository})
      : _repository = repository,
        super(const SearchState());

  final SearchRepository _repository;

  Future<void> search(String query) async {
    if (query.length < 2) {
      state = SearchState(query: query);
      return;
    }

    state = state.copyWith(query: query, isLoading: true);
    try {
      final results = await _repository.search(query);
      state = state.copyWith(
        results: results,
        isLoading: false,
        hasSearched: true,
      );
    } catch (e) {
      state = state.copyWith(
        isLoading: false,
        error: e.toString(),
        hasSearched: true,
      );
    }
  }

  void clear() {
    state = const SearchState();
  }
}
