import 'dart:async';

import 'package:dio/dio.dart';

import 'api_endpoints.dart';
import 'token_storage.dart';

/// Event emitted when user session expires and must re-login.
typedef SessionExpiredCallback = void Function();

/// Dio interceptor that injects JWT and handles automatic refresh.
///
/// When a 401 is received, queues all concurrent requests and
/// attempts a single token refresh. On success, replays all queued
/// requests. On failure, clears tokens and calls [onSessionExpired].
class AuthInterceptor extends Interceptor {
  AuthInterceptor({
    required this.tokenStorage,
    required this.refreshDio,
    this.onSessionExpired,
  });

  final TokenStorage tokenStorage;

  /// A separate Dio instance used exclusively for refresh requests
  /// to avoid interceptor recursion.
  final Dio refreshDio;

  final SessionExpiredCallback? onSessionExpired;

  bool _isRefreshing = false;
  final List<_QueuedRequest> _queue = [];

  bool get isRefreshing => _isRefreshing;

  @override
  Future<void> onRequest(
    RequestOptions options,
    RequestInterceptorHandler handler,
  ) async {
    final token = await tokenStorage.getAccessToken();
    if (token != null && token.isNotEmpty) {
      options.headers['Authorization'] = 'Bearer $token';
    }
    handler.next(options);
  }

  @override
  Future<void> onError(
    DioException err,
    ErrorInterceptorHandler handler,
  ) async {
    if (err.response?.statusCode != 401) {
      return handler.next(err);
    }

    if (_isRefreshing) {
      // Another refresh is already in progress; queue this request.
      _queue.add(_QueuedRequest(
        requestOptions: err.requestOptions,
        handler: handler,
      ));
      return;
    }

    _isRefreshing = true;

    try {
      final refreshToken = await tokenStorage.getRefreshToken();
      if (refreshToken == null || refreshToken.isEmpty) {
        await _handleSessionExpired(handler, err);
        return;
      }

      final response = await refreshDio.post(
        ApiEndpoints.refreshToken,
        data: {'refreshToken': refreshToken},
      );

      final data = response.data as Map<String, dynamic>;
      final newAccessToken = data['accessToken'] as String;
      final newRefreshToken = data['refreshToken'] as String;

      await tokenStorage.saveTokens(
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
      );

      _isRefreshing = false;

      // Replay the original request.
      final opts = err.requestOptions;
      opts.headers['Authorization'] = 'Bearer $newAccessToken';

      try {
        final retryResponse = await refreshDio.fetch(opts);
        handler.resolve(retryResponse);
      } on DioException catch (e) {
        handler.next(e);
      }

      // Replay all queued requests.
      _replayQueue(newAccessToken);
    } on DioException catch (e) {
      _isRefreshing = false;

      if (e.response?.statusCode == 401) {
        await _handleSessionExpired(handler, err);
        _rejectQueue(err);
      } else {
        handler.next(e);
        _rejectQueue(err);
      }
    } catch (_) {
      _isRefreshing = false;
      handler.next(err);
      _rejectQueue(err);
    }
  }

  Future<void> _handleSessionExpired(
    ErrorInterceptorHandler handler,
    DioException err,
  ) async {
    _isRefreshing = false;
    await tokenStorage.clearTokens();
    onSessionExpired?.call();
    handler.next(err);
  }

  void _replayQueue(String newToken) {
    final queue = List<_QueuedRequest>.from(_queue);
    _queue.clear();
    for (final queued in queue) {
      queued.requestOptions.headers['Authorization'] = 'Bearer $newToken';
      refreshDio.fetch(queued.requestOptions).then(
            (response) => queued.handler.resolve(response),
            onError: (Object e) {
              if (e is DioException) {
                queued.handler.next(e);
              } else {
                queued.handler.next(DioException(
                  requestOptions: queued.requestOptions,
                  error: e,
                ));
              }
            },
          );
    }
  }

  void _rejectQueue(DioException err) {
    final queue = List<_QueuedRequest>.from(_queue);
    _queue.clear();
    for (final queued in queue) {
      queued.handler.next(err);
    }
  }
}

class _QueuedRequest {
  const _QueuedRequest({
    required this.requestOptions,
    required this.handler,
  });

  final RequestOptions requestOptions;
  final ErrorInterceptorHandler handler;
}
