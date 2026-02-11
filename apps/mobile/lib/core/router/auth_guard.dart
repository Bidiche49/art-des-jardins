import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../../features/auth/domain/auth_state.dart';
import '../../features/auth/presentation/auth_notifier.dart';
import 'route_names.dart';

const _publicPaths = [
  RoutePaths.login,
];

bool _isPublicPath(String path) {
  if (_publicPaths.contains(path)) return true;
  // /signer/:token is public
  if (path.startsWith('/signer/')) return true;
  return false;
}

String? authGuard(GoRouterState state, AuthState authState) {
  final isAuthenticated = authState is AuthAuthenticated;
  final path = state.matchedLocation;

  if (!isAuthenticated && !_isPublicPath(path)) {
    return RoutePaths.login;
  }

  if (isAuthenticated && path == RoutePaths.login) {
    return RoutePaths.dashboard;
  }

  return null;
}

final authGuardProvider = Provider<String? Function(GoRouterState)>((ref) {
  final authState = ref.watch(authNotifierProvider);
  return (GoRouterState state) => authGuard(state, authState);
});
