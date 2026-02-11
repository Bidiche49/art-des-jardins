import 'package:flutter_test/flutter_test.dart';

import 'package:art_et_jardin/data/remote/dtos/api_response_dto.dart';
import 'package:art_et_jardin/data/remote/dtos/paginated_response_dto.dart';

void main() {
  group('PaginatedResponse', () {
    test('parses JSON with items', () {
      final json = {
        'items': [
          {'id': '1', 'name': 'Client A'},
          {'id': '2', 'name': 'Client B'},
        ],
        'page': 1,
        'total': 10,
        'hasNext': true,
      };

      final result = PaginatedResponse<Map<String, dynamic>>.fromJson(
        json,
        (item) => item as Map<String, dynamic>,
      );

      expect(result.items.length, 2);
      expect(result.items[0]['name'], 'Client A');
      expect(result.items[1]['name'], 'Client B');
    });

    test('parses page, total, hasNext', () {
      final json = {
        'items': [
          {'id': '1'},
        ],
        'page': 3,
        'total': 50,
        'hasNext': false,
      };

      final result = PaginatedResponse<Map<String, dynamic>>.fromJson(
        json,
        (item) => item as Map<String, dynamic>,
      );

      expect(result.page, 3);
      expect(result.total, 50);
      expect(result.hasNext, false);
    });

    test('handles empty items list', () {
      final json = {
        'items': <dynamic>[],
        'page': 1,
        'total': 0,
        'hasNext': false,
      };

      final result = PaginatedResponse<Map<String, dynamic>>.fromJson(
        json,
        (item) => item as Map<String, dynamic>,
      );

      expect(result.items, isEmpty);
      expect(result.isEmpty, isTrue);
      expect(result.count, 0);
    });
  });

  group('ApiResponse', () {
    test('parses data and message', () {
      final json = {
        'data': {'id': '1', 'name': 'Test'},
        'message': 'Success',
        'success': true,
      };

      final result = ApiResponse<Map<String, dynamic>>.fromJson(
        json,
        (data) => data as Map<String, dynamic>,
      );

      expect(result.data, isNotNull);
      expect(result.data!['name'], 'Test');
      expect(result.message, 'Success');
      expect(result.success, isTrue);
    });

    test('parses error response', () {
      final error = ApiResponse<String>.error('Something went wrong');

      expect(error.data, isNull);
      expect(error.message, 'Something went wrong');
      expect(error.success, isFalse);
    });

    test('works with different generic types', () {
      // With String
      final json = {
        'data': 'hello',
        'success': true,
      };

      final result = ApiResponse<String>.fromJson(
        json,
        (data) => data as String,
      );

      expect(result.data, 'hello');
      expect(result.success, isTrue);
    });
  });
}
