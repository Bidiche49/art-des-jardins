import 'dart:typed_data';
import 'dart:ui' as ui;

import 'package:flutter/material.dart';

class SignaturePad extends StatefulWidget {
  const SignaturePad({
    super.key,
    this.onSignatureChange,
    this.disabled = false,
    this.strokeWidth = 2.0,
    this.strokeColor = Colors.black,
    this.backgroundColor = Colors.white,
  });

  final void Function(bool isEmpty, Uint8List? pngBytes)? onSignatureChange;
  final bool disabled;
  final double strokeWidth;
  final Color strokeColor;
  final Color backgroundColor;

  @override
  State<SignaturePad> createState() => SignaturePadState();
}

class SignaturePadState extends State<SignaturePad> {
  final List<List<Offset>> _strokes = [];
  List<Offset> _currentStroke = [];
  bool _isEmpty = true;

  bool get isEmpty => _isEmpty;

  void clear() {
    setState(() {
      _strokes.clear();
      _currentStroke = [];
      _isEmpty = true;
    });
    widget.onSignatureChange?.call(true, null);
  }

  Future<Uint8List?> toPngBytes() async {
    if (_isEmpty) return null;

    final recorder = ui.PictureRecorder();
    final canvas = Canvas(recorder);
    const size = Size(600, 200);

    // Background
    canvas.drawRect(
      Offset.zero & size,
      Paint()..color = widget.backgroundColor,
    );

    // Draw strokes
    final paint = Paint()
      ..color = widget.strokeColor
      ..strokeWidth = widget.strokeWidth
      ..strokeCap = StrokeCap.round
      ..style = PaintingStyle.stroke;

    for (final stroke in _strokes) {
      if (stroke.length < 2) continue;
      final path = Path()..moveTo(stroke[0].dx, stroke[0].dy);
      for (int i = 1; i < stroke.length; i++) {
        path.lineTo(stroke[i].dx, stroke[i].dy);
      }
      canvas.drawPath(path, paint);
    }

    final picture = recorder.endRecording();
    final image = await picture.toImage(size.width.toInt(), size.height.toInt());
    final byteData = await image.toByteData(format: ui.ImageByteFormat.png);
    return byteData?.buffer.asUint8List();
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          'Votre signature',
          style: theme.textTheme.titleMedium?.copyWith(
            fontWeight: FontWeight.w600,
          ),
        ),
        const SizedBox(height: 8),
        Container(
          height: 200,
          decoration: BoxDecoration(
            color: widget.backgroundColor,
            border: Border.all(color: theme.colorScheme.outline),
            borderRadius: BorderRadius.circular(8),
          ),
          child: Stack(
            children: [
              GestureDetector(
                behavior: HitTestBehavior.opaque,
                onPanStart: widget.disabled ? null : _onPanStart,
                onPanUpdate: widget.disabled ? null : _onPanUpdate,
                onPanEnd: widget.disabled ? null : _onPanEnd,
                child: CustomPaint(
                  size: const Size(double.infinity, 200),
                  painter: _SignaturePainter(
                    strokes: _strokes,
                    currentStroke: _currentStroke,
                    strokeWidth: widget.strokeWidth,
                    strokeColor: widget.strokeColor,
                  ),
                ),
              ),
              if (_isEmpty)
                IgnorePointer(
                  child: Center(
                    child: Text(
                      'Dessinez votre signature ici',
                      style: theme.textTheme.bodyMedium?.copyWith(
                        color: theme.colorScheme.onSurfaceVariant,
                      ),
                    ),
                  ),
                ),
              if (!_isEmpty)
                Positioned(
                  top: 4,
                  right: 4,
                  child: IconButton(
                    icon: Icon(Icons.clear,
                        size: 20, color: theme.colorScheme.onSurfaceVariant),
                    onPressed: widget.disabled ? null : clear,
                    tooltip: 'Effacer',
                  ),
                ),
            ],
          ),
        ),
      ],
    );
  }

  void _onPanStart(DragStartDetails details) {
    setState(() {
      _currentStroke = [details.localPosition];
    });
  }

  void _onPanUpdate(DragUpdateDetails details) {
    setState(() {
      _currentStroke = [..._currentStroke, details.localPosition];
    });
  }

  void _onPanEnd(DragEndDetails details) {
    setState(() {
      _strokes.add(_currentStroke);
      _currentStroke = [];
      _isEmpty = false;
    });
    widget.onSignatureChange?.call(false, null);
  }
}

class _SignaturePainter extends CustomPainter {
  _SignaturePainter({
    required this.strokes,
    required this.currentStroke,
    required this.strokeWidth,
    required this.strokeColor,
  });

  final List<List<Offset>> strokes;
  final List<Offset> currentStroke;
  final double strokeWidth;
  final Color strokeColor;

  @override
  void paint(Canvas canvas, Size size) {
    final paint = Paint()
      ..color = strokeColor
      ..strokeWidth = strokeWidth
      ..strokeCap = StrokeCap.round
      ..style = PaintingStyle.stroke;

    for (final stroke in strokes) {
      _drawStroke(canvas, stroke, paint);
    }
    _drawStroke(canvas, currentStroke, paint);
  }

  void _drawStroke(Canvas canvas, List<Offset> stroke, Paint paint) {
    if (stroke.length < 2) return;
    final path = Path()..moveTo(stroke[0].dx, stroke[0].dy);
    for (int i = 1; i < stroke.length; i++) {
      path.lineTo(stroke[i].dx, stroke[i].dy);
    }
    canvas.drawPath(path, paint);
  }

  @override
  bool shouldRepaint(covariant _SignaturePainter oldDelegate) => true;
}
