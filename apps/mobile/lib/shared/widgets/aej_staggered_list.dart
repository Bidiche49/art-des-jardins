import 'package:flutter/material.dart';

/// Staggered fade-in animation for list items.
class AejStaggeredList extends StatefulWidget {
  const AejStaggeredList({
    super.key,
    required this.children,
    this.staggerDelay = const Duration(milliseconds: 50),
    this.animationDuration = const Duration(milliseconds: 300),
  });

  final List<Widget> children;
  final Duration staggerDelay;
  final Duration animationDuration;

  @override
  State<AejStaggeredList> createState() => _AejStaggeredListState();
}

class _AejStaggeredListState extends State<AejStaggeredList>
    with TickerProviderStateMixin {
  final List<AnimationController> _controllers = [];
  final List<Animation<double>> _fadeAnimations = [];
  final List<Animation<Offset>> _slideAnimations = [];

  @override
  void initState() {
    super.initState();
    _initAnimations();
  }

  void _initAnimations() {
    for (int i = 0; i < widget.children.length; i++) {
      final controller = AnimationController(
        vsync: this,
        duration: widget.animationDuration,
      );
      _controllers.add(controller);
      _fadeAnimations.add(
        CurvedAnimation(parent: controller, curve: Curves.easeOut),
      );
      _slideAnimations.add(
        Tween<Offset>(
          begin: const Offset(0, 0.1),
          end: Offset.zero,
        ).animate(CurvedAnimation(parent: controller, curve: Curves.easeOut)),
      );

      Future.delayed(widget.staggerDelay * i, () {
        if (mounted) controller.forward();
      });
    }
  }

  @override
  void dispose() {
    for (final controller in _controllers) {
      controller.dispose();
    }
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Column(
      children: List.generate(widget.children.length, (i) {
        if (i >= _fadeAnimations.length) return widget.children[i];
        return FadeTransition(
          opacity: _fadeAnimations[i],
          child: SlideTransition(
            position: _slideAnimations[i],
            child: widget.children[i],
          ),
        );
      }),
    );
  }
}
