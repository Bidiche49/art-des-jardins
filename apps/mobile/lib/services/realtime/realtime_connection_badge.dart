import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../core/theme/app_colors.dart';
import 'realtime_providers.dart';
import 'realtime_service.dart';

/// Small badge indicating the real-time connection status.
///
/// Green dot = connected, red dot = disconnected, amber = connecting.
class RealtimeConnectionBadge extends ConsumerWidget {
  const RealtimeConnectionBadge({super.key, this.size = 10});

  final double size;

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final state = ref.watch(realtimeNotifierProvider);
    return Tooltip(
      message: _tooltipFor(state.connectionState),
      child: Container(
        width: size,
        height: size,
        decoration: BoxDecoration(
          color: _colorFor(state.connectionState),
          shape: BoxShape.circle,
        ),
      ),
    );
  }

  Color _colorFor(RealtimeConnectionState state) {
    switch (state) {
      case RealtimeConnectionState.connected:
        return AppColors.success;
      case RealtimeConnectionState.connecting:
        return AppColors.warning;
      case RealtimeConnectionState.disconnected:
        return AppColors.error;
    }
  }

  String _tooltipFor(RealtimeConnectionState state) {
    switch (state) {
      case RealtimeConnectionState.connected:
        return 'Temps reel connecte';
      case RealtimeConnectionState.connecting:
        return 'Connexion en cours...';
      case RealtimeConnectionState.disconnected:
        return 'Temps reel deconnecte';
    }
  }
}
