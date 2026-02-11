import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

/// Provides the current [ThemeMode] (light/dark/system).
final themeModeProvider = StateProvider<ThemeMode>(
  (ref) => ThemeMode.system,
);

/// Provides whether terrain mode is active.
final terrainModeProvider = StateProvider<bool>(
  (ref) => false,
);
