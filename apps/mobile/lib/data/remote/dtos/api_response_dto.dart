/// Generic API response wrapper.
class ApiResponse<T> {
  const ApiResponse({
    required this.data,
    this.message,
    this.success = true,
  });

  final T? data;
  final String? message;
  final bool success;

  factory ApiResponse.fromJson(
    Map<String, dynamic> json,
    T Function(dynamic json) fromJsonT,
  ) {
    return ApiResponse(
      data: json['data'] != null ? fromJsonT(json['data']) : null,
      message: json['message'] as String?,
      success: json['success'] as bool? ?? true,
    );
  }

  factory ApiResponse.error(String message) {
    return ApiResponse(
      data: null,
      message: message,
      success: false,
    );
  }
}
