import 'package:flutter/material.dart';

/// Terrain mode theme adjustments for outdoor usage.
///
/// Increases touch targets, font sizes, and spacing
/// to make the app easier to use with gloves or in bright sunlight.
class TerrainTheme {
  const TerrainTheme._();

  static const double minInteractiveDimension = 64.0;
  static const double fontSizeIncrease = 4.0;
  static const double spacingMultiplier = 2.0;

  /// Applies terrain adjustments to an existing [ThemeData].
  static ThemeData apply(ThemeData base) {
    final textTheme = base.textTheme;
    return base.copyWith(
      materialTapTargetSize: MaterialTapTargetSize.padded,
      textTheme: textTheme.copyWith(
        bodyLarge: textTheme.bodyLarge?.copyWith(
          fontSize: (textTheme.bodyLarge?.fontSize ?? 16) + fontSizeIncrease,
        ),
        bodyMedium: textTheme.bodyMedium?.copyWith(
          fontSize: (textTheme.bodyMedium?.fontSize ?? 14) + fontSizeIncrease,
        ),
        bodySmall: textTheme.bodySmall?.copyWith(
          fontSize: (textTheme.bodySmall?.fontSize ?? 12) + fontSizeIncrease,
        ),
        titleLarge: textTheme.titleLarge?.copyWith(
          fontSize: (textTheme.titleLarge?.fontSize ?? 22) + fontSizeIncrease,
        ),
        titleMedium: textTheme.titleMedium?.copyWith(
          fontSize: (textTheme.titleMedium?.fontSize ?? 16) + fontSizeIncrease,
        ),
        labelLarge: textTheme.labelLarge?.copyWith(
          fontSize: (textTheme.labelLarge?.fontSize ?? 14) + fontSizeIncrease,
        ),
      ),
      elevatedButtonTheme: ElevatedButtonThemeData(
        style: (base.elevatedButtonTheme.style ?? const ButtonStyle()).copyWith(
          minimumSize:
              const WidgetStatePropertyAll(Size(0, minInteractiveDimension)),
          padding: const WidgetStatePropertyAll(
            EdgeInsets.symmetric(horizontal: 32, vertical: 20),
          ),
        ),
      ),
      inputDecorationTheme: base.inputDecorationTheme.copyWith(
        contentPadding: const EdgeInsets.symmetric(horizontal: 20, vertical: 20),
      ),
      cardTheme: base.cardTheme.copyWith(
        margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 16),
      ),
    );
  }
}
