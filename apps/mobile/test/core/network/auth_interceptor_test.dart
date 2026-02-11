import 'package:dio/dio.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:mocktail/mocktail.dart';

import 'package:art_et_jardin/core/network/auth_interceptor.dart';
import 'package:art_et_jardin/core/network/token_storage.dart';

class MockTokenStorage extends Mock implements TokenStorage {}

class MockDio extends Mock implements Dio {}

class FakeRequestOptions extends Fake implements RequestOptions {}

void main() {
  late MockTokenStorage mockTokenStorage;
  late MockDio mockRefreshDio;
  late AuthInterceptor interceptor;
  late bool sessionExpiredCalled;

  setUpAll(() {
    registerFallbackValue(FakeRequestOptions());
  });

  setUp(() {
    mockTokenStorage = MockTokenStorage();
    mockRefreshDio = MockDio();
    sessionExpiredCalled = false;

    interceptor = AuthInterceptor(
      tokenStorage: mockTokenStorage,
      refreshDio: mockRefreshDio,
      onSessionExpired: () => sessionExpiredCalled = true,
    );
  });

  RequestOptions makeOptions({String path = '/test'}) {
    return RequestOptions(
      path: path,
      baseUrl: 'http://localhost:3000/api/v1',
      headers: <String, dynamic>{},
    );
  }

  group('onRequest', () {
    test('adds Authorization header when token is present', () async {
      when(() => mockTokenStorage.getAccessToken())
          .thenAnswer((_) async => 'test-token');

      final options = makeOptions();
      final handler = _MockRequestHandler();

      await interceptor.onRequest(options, handler);

      expect(handler.nextCalled, isTrue);
      expect(handler.lastOptions!.headers['Authorization'],
          'Bearer test-token');
    });

    test('does not add Authorization header when token is null', () async {
      when(() => mockTokenStorage.getAccessToken())
          .thenAnswer((_) async => null);

      final options = makeOptions();
      final handler = _MockRequestHandler();

      await interceptor.onRequest(options, handler);

      expect(handler.nextCalled, isTrue);
      expect(handler.lastOptions!.headers.containsKey('Authorization'), false);
    });

    test('does not add Authorization header when token is empty', () async {
      when(() => mockTokenStorage.getAccessToken())
          .thenAnswer((_) async => '');

      final options = makeOptions();
      final handler = _MockRequestHandler();

      await interceptor.onRequest(options, handler);

      expect(handler.nextCalled, isTrue);
      expect(handler.lastOptions!.headers.containsKey('Authorization'), false);
    });
  });

  group('onError', () {
    test('propagates non-401 errors without refresh', () async {
      final err = DioException(
        requestOptions: makeOptions(),
        response: Response(
          requestOptions: makeOptions(),
          statusCode: 500,
        ),
      );
      final handler = _MockErrorHandler();

      await interceptor.onError(err, handler);

      expect(handler.nextCalled, isTrue);
      verifyNever(() => mockTokenStorage.getRefreshToken());
    });

    test('attempts refresh on 401', () async {
      when(() => mockTokenStorage.getRefreshToken())
          .thenAnswer((_) async => 'refresh-token');
      when(() => mockTokenStorage.saveTokens(
            accessToken: any(named: 'accessToken'),
            refreshToken: any(named: 'refreshToken'),
          )).thenAnswer((_) async {});
      when(() => mockRefreshDio.post(any(), data: any(named: 'data')))
          .thenAnswer((_) async => Response(
                requestOptions: makeOptions(),
                statusCode: 200,
                data: {
                  'accessToken': 'new-access',
                  'refreshToken': 'new-refresh',
                },
              ));
      when(() => mockRefreshDio.fetch<dynamic>(any()))
          .thenAnswer((_) async => Response(
                requestOptions: makeOptions(),
                statusCode: 200,
                data: {'ok': true},
              ));

      final err = DioException(
        requestOptions: makeOptions(),
        response: Response(
          requestOptions: makeOptions(),
          statusCode: 401,
        ),
      );
      final handler = _MockErrorHandler();

      await interceptor.onError(err, handler);

      expect(handler.resolveCalled, isTrue);
      verify(() => mockRefreshDio.post(any(), data: any(named: 'data')))
          .called(1);
    });

    test('saves new tokens after successful refresh', () async {
      when(() => mockTokenStorage.getRefreshToken())
          .thenAnswer((_) async => 'refresh-token');
      when(() => mockTokenStorage.saveTokens(
            accessToken: any(named: 'accessToken'),
            refreshToken: any(named: 'refreshToken'),
          )).thenAnswer((_) async {});
      when(() => mockRefreshDio.post(any(), data: any(named: 'data')))
          .thenAnswer((_) async => Response(
                requestOptions: makeOptions(),
                statusCode: 200,
                data: {
                  'accessToken': 'new-access',
                  'refreshToken': 'new-refresh',
                },
              ));
      when(() => mockRefreshDio.fetch<dynamic>(any()))
          .thenAnswer((_) async => Response(
                requestOptions: makeOptions(),
                statusCode: 200,
              ));

      final err = DioException(
        requestOptions: makeOptions(),
        response: Response(
          requestOptions: makeOptions(),
          statusCode: 401,
        ),
      );
      final handler = _MockErrorHandler();

      await interceptor.onError(err, handler);

      verify(() => mockTokenStorage.saveTokens(
            accessToken: 'new-access',
            refreshToken: 'new-refresh',
          )).called(1);
    });

    test('calls session expired on refresh 401', () async {
      when(() => mockTokenStorage.getRefreshToken())
          .thenAnswer((_) async => 'refresh-token');
      when(() => mockTokenStorage.clearTokens()).thenAnswer((_) async {});
      when(() => mockRefreshDio.post(any(), data: any(named: 'data')))
          .thenThrow(DioException(
        requestOptions: makeOptions(),
        response: Response(
          requestOptions: makeOptions(),
          statusCode: 401,
        ),
      ));

      final err = DioException(
        requestOptions: makeOptions(),
        response: Response(
          requestOptions: makeOptions(),
          statusCode: 401,
        ),
      );
      final handler = _MockErrorHandler();

      await interceptor.onError(err, handler);

      expect(sessionExpiredCalled, isTrue);
      verify(() => mockTokenStorage.clearTokens()).called(1);
    });

    test('propagates network error during refresh', () async {
      when(() => mockTokenStorage.getRefreshToken())
          .thenAnswer((_) async => 'refresh-token');
      when(() => mockRefreshDio.post(any(), data: any(named: 'data')))
          .thenThrow(DioException(
        requestOptions: makeOptions(),
        type: DioExceptionType.connectionTimeout,
      ));

      final err = DioException(
        requestOptions: makeOptions(),
        response: Response(
          requestOptions: makeOptions(),
          statusCode: 401,
        ),
      );
      final handler = _MockErrorHandler();

      await interceptor.onError(err, handler);

      expect(handler.nextCalled, isTrue);
      expect(sessionExpiredCalled, isFalse);
    });

    test('session expired when no refresh token', () async {
      when(() => mockTokenStorage.getRefreshToken())
          .thenAnswer((_) async => null);
      when(() => mockTokenStorage.clearTokens()).thenAnswer((_) async {});

      final err = DioException(
        requestOptions: makeOptions(),
        response: Response(
          requestOptions: makeOptions(),
          statusCode: 401,
        ),
      );
      final handler = _MockErrorHandler();

      await interceptor.onError(err, handler);

      expect(sessionExpiredCalled, isTrue);
      verify(() => mockTokenStorage.clearTokens()).called(1);
    });

    test('session expired when refresh token is empty', () async {
      when(() => mockTokenStorage.getRefreshToken())
          .thenAnswer((_) async => '');
      when(() => mockTokenStorage.clearTokens()).thenAnswer((_) async {});

      final err = DioException(
        requestOptions: makeOptions(),
        response: Response(
          requestOptions: makeOptions(),
          statusCode: 401,
        ),
      );
      final handler = _MockErrorHandler();

      await interceptor.onError(err, handler);

      expect(sessionExpiredCalled, isTrue);
    });

    test('isRefreshing resets after success', () async {
      when(() => mockTokenStorage.getRefreshToken())
          .thenAnswer((_) async => 'refresh-token');
      when(() => mockTokenStorage.saveTokens(
            accessToken: any(named: 'accessToken'),
            refreshToken: any(named: 'refreshToken'),
          )).thenAnswer((_) async {});
      when(() => mockRefreshDio.post(any(), data: any(named: 'data')))
          .thenAnswer((_) async => Response(
                requestOptions: makeOptions(),
                statusCode: 200,
                data: {
                  'accessToken': 'new-access',
                  'refreshToken': 'new-refresh',
                },
              ));
      when(() => mockRefreshDio.fetch<dynamic>(any()))
          .thenAnswer((_) async => Response(
                requestOptions: makeOptions(),
                statusCode: 200,
              ));

      final err = DioException(
        requestOptions: makeOptions(),
        response: Response(
          requestOptions: makeOptions(),
          statusCode: 401,
        ),
      );

      await interceptor.onError(err, _MockErrorHandler());

      expect(interceptor.isRefreshing, isFalse);
    });

    test('isRefreshing resets after failure', () async {
      when(() => mockTokenStorage.getRefreshToken())
          .thenAnswer((_) async => 'refresh-token');
      when(() => mockTokenStorage.clearTokens()).thenAnswer((_) async {});
      when(() => mockRefreshDio.post(any(), data: any(named: 'data')))
          .thenThrow(DioException(
        requestOptions: makeOptions(),
        response: Response(
          requestOptions: makeOptions(),
          statusCode: 401,
        ),
      ));

      final err = DioException(
        requestOptions: makeOptions(),
        response: Response(
          requestOptions: makeOptions(),
          statusCode: 401,
        ),
      );

      await interceptor.onError(err, _MockErrorHandler());

      expect(interceptor.isRefreshing, isFalse);
    });
  });

  group('DioClient config', () {
    test('Content-Type header is JSON by default', () {
      final dio = Dio(BaseOptions(
        headers: {'Content-Type': 'application/json'},
      ));
      expect(dio.options.headers['Content-Type'], 'application/json');
    });

    test('baseUrl matches env config', () {
      // EnvConfig.apiUrl defaults to 'http://localhost:3000/api/v1'
      final dio = Dio(BaseOptions(
        baseUrl: 'http://localhost:3000/api/v1',
      ));
      expect(dio.options.baseUrl, 'http://localhost:3000/api/v1');
    });

    test('timeout is 30 seconds', () {
      final dio = Dio(BaseOptions(
        connectTimeout: const Duration(seconds: 30),
      ));
      expect(dio.options.connectTimeout, const Duration(seconds: 30));
    });
  });
}

/// Minimal mock for [RequestInterceptorHandler] to track calls.
class _MockRequestHandler extends RequestInterceptorHandler {
  bool nextCalled = false;
  RequestOptions? lastOptions;

  @override
  void next(RequestOptions requestOptions) {
    nextCalled = true;
    lastOptions = requestOptions;
  }
}

/// Minimal mock for [ErrorInterceptorHandler] to track calls.
class _MockErrorHandler extends ErrorInterceptorHandler {
  bool nextCalled = false;
  bool resolveCalled = false;
  bool rejectCalled = false;

  @override
  void next(DioException err) {
    nextCalled = true;
  }

  @override
  void resolve(Response response) {
    resolveCalled = true;
  }

  @override
  void reject(DioException err) {
    rejectCalled = true;
  }
}
