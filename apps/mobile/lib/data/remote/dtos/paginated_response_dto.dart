/// Generic paginated API response.
class PaginatedResponse<T> {
  const PaginatedResponse({
    required this.items,
    required this.page,
    required this.total,
    required this.hasNext,
  });

  final List<T> items;
  final int page;
  final int total;
  final bool hasNext;

  factory PaginatedResponse.fromJson(
    Map<String, dynamic> json,
    T Function(dynamic json) fromJsonT,
  ) {
    final rawItems = json['items'] as List<dynamic>? ?? [];
    return PaginatedResponse(
      items: rawItems.map(fromJsonT).toList(),
      page: json['page'] as int? ?? 1,
      total: json['total'] as int? ?? 0,
      hasNext: json['hasNext'] as bool? ?? false,
    );
  }

  bool get isEmpty => items.isEmpty;
  int get count => items.length;
}
