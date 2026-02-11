import 'package:flutter/material.dart';

import '../../core/theme/app_colors.dart';

enum AejConnectionStatus { online, offline, syncing }

class AejConnectionIndicator extends StatelessWidget {
  const AejConnectionIndicator({
    super.key,
    required this.status,
    this.size = 10,
  });

  final AejConnectionStatus status;
  final double size;

  Color get _color {
    switch (status) {
      case AejConnectionStatus.online:
        return AppColors.success;
      case AejConnectionStatus.offline:
        return AppColors.error;
      case AejConnectionStatus.syncing:
        return AppColors.warning;
    }
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      width: size,
      height: size,
      decoration: BoxDecoration(
        color: _color,
        shape: BoxShape.circle,
      ),
    );
  }
}
