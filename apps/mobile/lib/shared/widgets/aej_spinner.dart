import 'package:flutter/material.dart';

enum AejSpinnerSize { sm, md, lg }

class AejSpinner extends StatelessWidget {
  const AejSpinner({super.key, this.size = AejSpinnerSize.md, this.color});

  final AejSpinnerSize size;
  final Color? color;

  double get _dimension {
    switch (size) {
      case AejSpinnerSize.sm:
        return 16;
      case AejSpinnerSize.md:
        return 24;
      case AejSpinnerSize.lg:
        return 40;
    }
  }

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      width: _dimension,
      height: _dimension,
      child: CircularProgressIndicator(
        strokeWidth: size == AejSpinnerSize.sm ? 2 : 3,
        color: color,
      ),
    );
  }
}

class AejLoadingOverlay extends StatelessWidget {
  const AejLoadingOverlay({
    super.key,
    required this.isLoading,
    required this.child,
  });

  final bool isLoading;
  final Widget child;

  @override
  Widget build(BuildContext context) {
    return Stack(
      children: [
        child,
        if (isLoading)
          Positioned.fill(
            child: Container(
              color: Colors.black26,
              alignment: Alignment.center,
              child: const AejSpinner(size: AejSpinnerSize.lg),
            ),
          ),
      ],
    );
  }
}
