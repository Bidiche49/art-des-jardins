import 'package:flutter/material.dart';

enum AejBadgeVariant { primary, secondary, success, warning, error, info }

enum AejBadgeSize { sm, md }

class AejBadge extends StatelessWidget {
  const AejBadge({
    super.key,
    required this.label,
    this.variant = AejBadgeVariant.primary,
    this.size = AejBadgeSize.md,
  });

  final String label;
  final AejBadgeVariant variant;
  final AejBadgeSize size;

  @override
  Widget build(BuildContext context) {
    final colors = _resolveColors(context);

    return Container(
      padding: EdgeInsets.symmetric(
        horizontal: size == AejBadgeSize.sm ? 6 : 10,
        vertical: size == AejBadgeSize.sm ? 2 : 4,
      ),
      decoration: BoxDecoration(
        color: colors.$1,
        borderRadius: BorderRadius.circular(size == AejBadgeSize.sm ? 4 : 6),
      ),
      child: Text(
        label,
        style: TextStyle(
          color: colors.$2,
          fontSize: size == AejBadgeSize.sm ? 11 : 12,
          fontWeight: FontWeight.w600,
        ),
      ),
    );
  }

  (Color background, Color foreground) _resolveColors(BuildContext context) {
    final cs = Theme.of(context).colorScheme;
    switch (variant) {
      case AejBadgeVariant.primary:
        return (cs.primaryContainer, cs.onPrimaryContainer);
      case AejBadgeVariant.secondary:
        return (cs.secondaryContainer, cs.onSecondaryContainer);
      case AejBadgeVariant.success:
        return (const Color(0xFFDCFCE7), const Color(0xFF166534));
      case AejBadgeVariant.warning:
        return (const Color(0xFFFEF3C7), const Color(0xFF92400E));
      case AejBadgeVariant.error:
        return (cs.errorContainer, cs.onErrorContainer);
      case AejBadgeVariant.info:
        return (const Color(0xFFDBEAFE), const Color(0xFF1E40AF));
    }
  }
}
