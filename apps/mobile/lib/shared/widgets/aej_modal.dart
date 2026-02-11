import 'package:flutter/material.dart';

enum AejModalSize { sm, md, lg, xl }

class AejModal {
  const AejModal._();

  static Future<T?> show<T>({
    required BuildContext context,
    required String title,
    required Widget content,
    AejModalSize size = AejModalSize.md,
    List<Widget>? actions,
    bool dismissible = true,
  }) {
    final width = MediaQuery.of(context).size.width;
    final isDesktop = width >= 600;

    if (isDesktop) {
      return showDialog<T>(
        context: context,
        barrierDismissible: dismissible,
        builder: (ctx) => _AejDialogContent(
          title: title,
          content: content,
          size: size,
          actions: actions,
        ),
      );
    }

    return showModalBottomSheet<T>(
      context: context,
      isDismissible: dismissible,
      isScrollControlled: true,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(16)),
      ),
      builder: (ctx) => _AejBottomSheetContent(
        title: title,
        content: content,
        size: size,
        actions: actions,
      ),
    );
  }
}

class _AejDialogContent extends StatelessWidget {
  const _AejDialogContent({
    required this.title,
    required this.content,
    required this.size,
    this.actions,
  });

  final String title;
  final Widget content;
  final AejModalSize size;
  final List<Widget>? actions;

  double get _maxWidth {
    switch (size) {
      case AejModalSize.sm:
        return 340;
      case AejModalSize.md:
        return 480;
      case AejModalSize.lg:
        return 640;
      case AejModalSize.xl:
        return 800;
    }
  }

  @override
  Widget build(BuildContext context) {
    return Dialog(
      child: ConstrainedBox(
        constraints: BoxConstraints(maxWidth: _maxWidth),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            Padding(
              padding: const EdgeInsets.fromLTRB(24, 24, 8, 0),
              child: Row(
                children: [
                  Expanded(
                    child: Text(
                      title,
                      style: Theme.of(context).textTheme.titleLarge,
                    ),
                  ),
                  IconButton(
                    icon: const Icon(Icons.close),
                    onPressed: () => Navigator.of(context).pop(),
                  ),
                ],
              ),
            ),
            Flexible(
              child: SingleChildScrollView(
                padding: const EdgeInsets.all(24),
                child: content,
              ),
            ),
            if (actions != null)
              Padding(
                padding: const EdgeInsets.fromLTRB(24, 0, 24, 24),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.end,
                  children: actions!,
                ),
              ),
          ],
        ),
      ),
    );
  }
}

class _AejBottomSheetContent extends StatelessWidget {
  const _AejBottomSheetContent({
    required this.title,
    required this.content,
    required this.size,
    this.actions,
  });

  final String title;
  final Widget content;
  final AejModalSize size;
  final List<Widget>? actions;

  double get _maxHeight {
    switch (size) {
      case AejModalSize.sm:
        return 0.35;
      case AejModalSize.md:
        return 0.5;
      case AejModalSize.lg:
        return 0.75;
      case AejModalSize.xl:
        return 0.9;
    }
  }

  @override
  Widget build(BuildContext context) {
    return ConstrainedBox(
      constraints: BoxConstraints(
        maxHeight: MediaQuery.of(context).size.height * _maxHeight,
      ),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          // Drag handle
          Center(
            child: Container(
              width: 40,
              height: 4,
              margin: const EdgeInsets.symmetric(vertical: 12),
              decoration: BoxDecoration(
                color: Theme.of(context).colorScheme.onSurfaceVariant.withAlpha(76),
                borderRadius: BorderRadius.circular(2),
              ),
            ),
          ),
          Padding(
            padding: const EdgeInsets.fromLTRB(16, 0, 8, 0),
            child: Row(
              children: [
                Expanded(
                  child: Text(
                    title,
                    style: Theme.of(context).textTheme.titleLarge,
                  ),
                ),
                IconButton(
                  icon: const Icon(Icons.close),
                  onPressed: () => Navigator.of(context).pop(),
                ),
              ],
            ),
          ),
          const Divider(),
          Flexible(
            child: SingleChildScrollView(
              padding: const EdgeInsets.all(16),
              child: content,
            ),
          ),
          if (actions != null)
            Padding(
              padding: const EdgeInsets.fromLTRB(16, 8, 16, 16),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.end,
                children: actions!,
              ),
            ),
        ],
      ),
    );
  }
}
