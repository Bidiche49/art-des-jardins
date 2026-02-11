import 'package:flutter_test/flutter_test.dart';
import 'package:art_et_jardin/core/errors/failures.dart';

void main() {
  group('Failures', () {
    test('each failure type has a default message', () {
      expect(const ServerFailure().message, isNotEmpty);
      expect(const CacheFailure().message, isNotEmpty);
      expect(const NetworkFailure().message, isNotEmpty);
      expect(const AuthFailure().message, isNotEmpty);
      expect(const ValidationFailure().message, isNotEmpty);
    });

    test('custom message overrides default', () {
      const failure = ServerFailure('custom error');
      expect(failure.message, 'custom error');
    });

    test('pattern matching is exhaustive on sealed class', () {
      final failures = <Failure>[
        const ServerFailure(),
        const CacheFailure(),
        const NetworkFailure(),
        const AuthFailure(),
        const ValidationFailure(),
      ];

      for (final failure in failures) {
        final result = switch (failure) {
          ServerFailure() => 'server',
          CacheFailure() => 'cache',
          NetworkFailure() => 'network',
          AuthFailure() => 'auth',
          ValidationFailure() => 'validation',
        };
        expect(result, isNotEmpty);
      }
    });

    test('equality between identical instances', () {
      const a = ServerFailure('test');
      const b = ServerFailure('test');
      expect(a, equals(b));
      expect(a.hashCode, equals(b.hashCode));
    });

    test('inequality between different types with same message', () {
      const server = ServerFailure('error');
      const cache = CacheFailure('error');
      expect(server, isNot(equals(cache)));
    });

    test('toString includes type and message', () {
      const failure = NetworkFailure('offline');
      expect(failure.toString(), contains('NetworkFailure'));
      expect(failure.toString(), contains('offline'));
    });
  });
}
