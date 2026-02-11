import 'package:flutter/material.dart';
import 'package:flutter/services.dart';

enum AejButtonVariant { primary, secondary, outline, ghost, danger }

enum AejButtonSize { sm, md, lg }

class AejButton extends StatefulWidget {
  const AejButton({
    super.key,
    required this.label,
    this.onPressed,
    this.variant = AejButtonVariant.primary,
    this.size = AejButtonSize.md,
    this.isLoading = false,
    this.fullWidth = false,
    this.iconLeft,
    this.iconRight,
  });

  final String label;
  final VoidCallback? onPressed;
  final AejButtonVariant variant;
  final AejButtonSize size;
  final bool isLoading;
  final bool fullWidth;
  final IconData? iconLeft;
  final IconData? iconRight;

  @override
  State<AejButton> createState() => _AejButtonState();
}

class _AejButtonState extends State<AejButton>
    with SingleTickerProviderStateMixin {
  late AnimationController _scaleController;
  late Animation<double> _scaleAnimation;

  @override
  void initState() {
    super.initState();
    _scaleController = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 100),
    );
    _scaleAnimation = Tween<double>(begin: 1.0, end: 0.98).animate(
      CurvedAnimation(parent: _scaleController, curve: Curves.easeInOut),
    );
  }

  @override
  void dispose() {
    _scaleController.dispose();
    super.dispose();
  }

  double get _height {
    switch (widget.size) {
      case AejButtonSize.sm:
        return 36;
      case AejButtonSize.md:
        return 44;
      case AejButtonSize.lg:
        return 48;
    }
  }

  double get _fontSize {
    switch (widget.size) {
      case AejButtonSize.sm:
        return 13;
      case AejButtonSize.md:
        return 14;
      case AejButtonSize.lg:
        return 16;
    }
  }

  bool get _isDisabled => widget.onPressed == null || widget.isLoading;

  void _onTapDown(TapDownDetails _) {
    if (!_isDisabled) _scaleController.forward();
  }

  void _onTapUp(TapUpDetails _) {
    _scaleController.reverse();
  }

  void _onTapCancel() {
    _scaleController.reverse();
  }

  void _onTap() {
    if (_isDisabled) return;
    HapticFeedback.lightImpact();
    widget.onPressed?.call();
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final colors = _resolveColors(theme);

    final content = Row(
      mainAxisSize: widget.fullWidth ? MainAxisSize.max : MainAxisSize.min,
      mainAxisAlignment: MainAxisAlignment.center,
      children: [
        if (widget.isLoading) ...[
          SizedBox(
            width: 16,
            height: 16,
            child: CircularProgressIndicator(
              strokeWidth: 2,
              color: colors.foreground,
            ),
          ),
          const SizedBox(width: 8),
        ],
        if (widget.iconLeft != null && !widget.isLoading) ...[
          Icon(widget.iconLeft, size: 18, color: colors.foreground),
          const SizedBox(width: 8),
        ],
        Text(
          widget.label,
          style: TextStyle(
            fontSize: _fontSize,
            fontWeight: FontWeight.w600,
            color: colors.foreground,
          ),
        ),
        if (widget.iconRight != null) ...[
          const SizedBox(width: 8),
          Icon(widget.iconRight, size: 18, color: colors.foreground),
        ],
      ],
    );

    return ScaleTransition(
      scale: _scaleAnimation,
      child: GestureDetector(
        onTapDown: _onTapDown,
        onTapUp: _onTapUp,
        onTapCancel: _onTapCancel,
        onTap: _onTap,
        child: Container(
          height: _height,
          width: widget.fullWidth ? double.infinity : null,
          padding: const EdgeInsets.symmetric(horizontal: 16),
          decoration: BoxDecoration(
            color: _isDisabled ? colors.background.withAlpha(128) : colors.background,
            borderRadius: BorderRadius.circular(8),
            border: colors.border != null
                ? Border.all(color: _isDisabled ? colors.border!.withAlpha(128) : colors.border!)
                : null,
          ),
          alignment: Alignment.center,
          child: content,
        ),
      ),
    );
  }

  _ButtonColors _resolveColors(ThemeData theme) {
    switch (widget.variant) {
      case AejButtonVariant.primary:
        return _ButtonColors(
          background: theme.colorScheme.primary,
          foreground: theme.colorScheme.onPrimary,
        );
      case AejButtonVariant.secondary:
        return _ButtonColors(
          background: theme.colorScheme.secondaryContainer,
          foreground: theme.colorScheme.onSecondaryContainer,
        );
      case AejButtonVariant.outline:
        return _ButtonColors(
          background: Colors.transparent,
          foreground: theme.colorScheme.primary,
          border: theme.colorScheme.outline,
        );
      case AejButtonVariant.ghost:
        return _ButtonColors(
          background: Colors.transparent,
          foreground: theme.colorScheme.onSurface,
        );
      case AejButtonVariant.danger:
        return _ButtonColors(
          background: theme.colorScheme.error,
          foreground: theme.colorScheme.onError,
        );
    }
  }
}

class _ButtonColors {
  const _ButtonColors({
    required this.background,
    required this.foreground,
    this.border,
  });

  final Color background;
  final Color foreground;
  final Color? border;
}
