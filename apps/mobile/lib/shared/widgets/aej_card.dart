import 'package:flutter/material.dart';

enum AejCardPadding { sm, md, lg }

class AejCard extends StatelessWidget {
  const AejCard({
    super.key,
    required this.child,
    this.onTap,
    this.padding = AejCardPadding.md,
    this.elevation = 1,
    this.header,
    this.footer,
  });

  final Widget child;
  final VoidCallback? onTap;
  final AejCardPadding padding;
  final double elevation;
  final Widget? header;
  final Widget? footer;

  EdgeInsets get _padding {
    switch (padding) {
      case AejCardPadding.sm:
        return const EdgeInsets.all(8);
      case AejCardPadding.md:
        return const EdgeInsets.all(16);
      case AejCardPadding.lg:
        return const EdgeInsets.all(24);
    }
  }

  @override
  Widget build(BuildContext context) {
    final card = Card(
      elevation: elevation,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
      clipBehavior: Clip.antiAlias,
      child: Column(
        mainAxisSize: MainAxisSize.min,
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          if (header != null)
            Padding(
              padding: EdgeInsets.only(
                left: _padding.left,
                right: _padding.right,
                top: _padding.top,
              ),
              child: header!,
            ),
          Padding(padding: _padding, child: child),
          if (footer != null)
            Padding(
              padding: EdgeInsets.only(
                left: _padding.left,
                right: _padding.right,
                bottom: _padding.bottom,
              ),
              child: footer!,
            ),
        ],
      ),
    );

    if (onTap != null) {
      return InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(12),
        child: card,
      );
    }

    return card;
  }
}
