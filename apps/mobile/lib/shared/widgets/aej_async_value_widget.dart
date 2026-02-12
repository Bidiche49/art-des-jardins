import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import 'aej_error_retry.dart';
import 'aej_shimmer.dart';

/// Generic widget that handles AsyncValue states: loading, error, data.
class AejAsyncValueWidget<T> extends StatelessWidget {
  const AejAsyncValueWidget({
    super.key,
    required this.value,
    required this.data,
    this.loading,
    this.error,
    this.onRetry,
  });

  final AsyncValue<T> value;
  final Widget Function(T data) data;
  final Widget Function()? loading;
  final Widget Function(Object error, StackTrace? stackTrace)? error;
  final VoidCallback? onRetry;

  @override
  Widget build(BuildContext context) {
    return value.when(
      data: data,
      loading: () =>
          loading?.call() ?? const AejShimmerList(),
      error: (err, stack) =>
          error?.call(err, stack) ??
          AejErrorRetry(
            message: _errorMessage(err),
            onRetry: onRetry,
          ),
    );
  }

  String _errorMessage(Object error) {
    final msg = error.toString().toLowerCase();
    if (msg.contains('timeout')) {
      return 'Le serveur met trop de temps';
    }
    if (msg.contains('network') ||
        msg.contains('connection') ||
        msg.contains('socket')) {
      return 'Pas de connexion';
    }
    return 'Une erreur est survenue';
  }
}
