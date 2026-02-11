import 'package:freezed_annotation/freezed_annotation.dart';

part 'search_result.freezed.dart';
part 'search_result.g.dart';

@freezed
abstract class SearchResult with _$SearchResult {
  const factory SearchResult({
    required String entity,
    required String entityId,
    required String title,
    String? subtitle,
    String? matchField,
  }) = _SearchResult;

  factory SearchResult.fromJson(Map<String, dynamic> json) =>
      _$SearchResultFromJson(json);
}
