import 'package:flutter/material.dart';

import '../../../../domain/enums/photo_type.dart';

class PhotoCapture extends StatelessWidget {
  const PhotoCapture({
    super.key,
    required this.onCapture,
  });

  final void Function(PhotoType type) onCapture;

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text('Ajouter une photo', style: theme.textTheme.titleSmall),
        const SizedBox(height: 8),
        Row(
          children: PhotoType.values.map((type) {
            return Padding(
              padding: const EdgeInsets.only(right: 8),
              child: FilledButton.tonal(
                onPressed: () => onCapture(type),
                style: FilledButton.styleFrom(
                  backgroundColor: _colorForType(type, theme),
                ),
                child: Row(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    Icon(Icons.camera_alt, size: 16,
                        color: _textColorForType(type, theme)),
                    const SizedBox(width: 4),
                    Text(type.label,
                        style: TextStyle(
                            color: _textColorForType(type, theme))),
                  ],
                ),
              ),
            );
          }).toList(),
        ),
      ],
    );
  }

  Color _colorForType(PhotoType type, ThemeData theme) {
    switch (type) {
      case PhotoType.before:
        return Colors.blue.shade100;
      case PhotoType.during:
        return Colors.orange.shade100;
      case PhotoType.after:
        return Colors.green.shade100;
    }
  }

  Color _textColorForType(PhotoType type, ThemeData theme) {
    switch (type) {
      case PhotoType.before:
        return Colors.blue.shade900;
      case PhotoType.during:
        return Colors.orange.shade900;
      case PhotoType.after:
        return Colors.green.shade900;
    }
  }
}
