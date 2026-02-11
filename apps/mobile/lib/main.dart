import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import 'bootstrap.dart';
import 'core/theme/app_theme.dart';
import 'core/theme/terrain_theme.dart';
import 'core/theme/theme_provider.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  await bootstrap();
  runApp(const ProviderScope(child: ArtEtJardinApp()));
}

class ArtEtJardinApp extends ConsumerWidget {
  const ArtEtJardinApp({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final themeMode = ref.watch(themeModeProvider);
    final terrainMode = ref.watch(terrainModeProvider);

    var lightTheme = AppTheme.light;
    var darkTheme = AppTheme.dark;

    if (terrainMode) {
      lightTheme = TerrainTheme.apply(lightTheme);
      darkTheme = TerrainTheme.apply(darkTheme);
    }

    return MaterialApp(
      title: 'Art & Jardin',
      debugShowCheckedModeBanner: false,
      themeMode: themeMode,
      theme: lightTheme,
      darkTheme: darkTheme,
      home: const Scaffold(
        body: Center(
          child: Text(
            'Art & Jardin',
            style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold),
          ),
        ),
      ),
    );
  }
}
