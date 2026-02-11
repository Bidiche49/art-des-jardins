import '../../../domain/models/search_result.dart';

abstract class SearchRepository {
  Future<List<SearchResult>> search(String query);
  Future<List<SearchResult>> searchByEntity(String query, String entity);
}
