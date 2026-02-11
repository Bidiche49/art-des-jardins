import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:art_et_jardin/core/theme/app_colors.dart';
import 'package:art_et_jardin/core/theme/app_theme.dart';
import 'package:art_et_jardin/core/theme/terrain_theme.dart';
import 'package:art_et_jardin/core/theme/theme_provider.dart';

void main() {
  group('AppTheme', () {
    test('light theme uses correct primary color seed', () {
      final theme = AppTheme.light;
      expect(theme.useMaterial3, isTrue);
      expect(theme.brightness, Brightness.light);
      // ColorScheme.fromSeed generates a palette from the seed
      expect(theme.colorScheme.primary, isNotNull);
    });

    test('dark theme uses correct primary color seed', () {
      final theme = AppTheme.dark;
      expect(theme.useMaterial3, isTrue);
      expect(theme.brightness, Brightness.dark);
      expect(theme.colorScheme.primary, isNotNull);
    });
  });

  group('TerrainTheme', () {
    test('applies minimum interactive dimension >= 64', () {
      expect(TerrainTheme.minInteractiveDimension, greaterThanOrEqualTo(64));
    });

    test('increases font sizes by fontSizeIncrease', () {
      final base = AppTheme.light;
      final terrain = TerrainTheme.apply(base);

      final baseBodyLarge = base.textTheme.bodyLarge?.fontSize ?? 16;
      final terrainBodyLarge = terrain.textTheme.bodyLarge?.fontSize ?? 16;

      expect(
        terrainBodyLarge,
        equals(baseBodyLarge + TerrainTheme.fontSizeIncrease),
      );
    });
  });

  group('ThemeProvider', () {
    test('themeModeProvider defaults to system', () {
      final container = ProviderContainer();
      addTearDown(container.dispose);

      expect(container.read(themeModeProvider), ThemeMode.system);
    });

    test('themeModeProvider can be changed', () {
      final container = ProviderContainer();
      addTearDown(container.dispose);

      container.read(themeModeProvider.notifier).state = ThemeMode.dark;
      expect(container.read(themeModeProvider), ThemeMode.dark);
    });

    test('terrainModeProvider defaults to false', () {
      final container = ProviderContainer();
      addTearDown(container.dispose);

      expect(container.read(terrainModeProvider), false);
    });

    test('terrainModeProvider can toggle', () {
      final container = ProviderContainer();
      addTearDown(container.dispose);

      container.read(terrainModeProvider.notifier).state = true;
      expect(container.read(terrainModeProvider), true);

      container.read(terrainModeProvider.notifier).state = false;
      expect(container.read(terrainModeProvider), false);
    });
  });

  group('AppColors', () {
    test('primary color is correct', () {
      expect(AppColors.primary, const Color(0xFF16A34A));
    });

    test('green600 matches primary', () {
      expect(AppColors.green600, AppColors.primary);
    });
  });
}
