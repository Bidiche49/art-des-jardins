import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../../../services/sync/sync_providers.dart';
import '../providers/settings_providers.dart';

class SettingsPage extends ConsumerWidget {
  const SettingsPage({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final settings = ref.watch(settingsNotifierProvider);
    final notifier = ref.read(settingsNotifierProvider.notifier);
    final pendingSync = ref.watch(pendingSyncCountProvider);

    return ListView(
      padding: const EdgeInsets.all(16),
      children: [
        // Theme section
        const _SectionHeader(title: 'Apparence'),
        const SizedBox(height: 8),
        _ThemeSelector(
          currentMode: settings.themeMode,
          onChanged: notifier.setThemeMode,
        ),
        const SizedBox(height: 16),

        // Terrain mode
        const _SectionHeader(title: 'Mode terrain'),
        const SizedBox(height: 8),
        SwitchListTile(
          title: const Text('Mode terrain'),
          subtitle: const Text(
            'Grosses cibles tactiles, police agrandie',
          ),
          value: settings.terrainMode,
          onChanged: (_) => notifier.toggleTerrainMode(),
          secondary: const Icon(Icons.terrain),
        ),
        const SizedBox(height: 16),

        // Biometric
        const _SectionHeader(title: 'Biometrie'),
        const SizedBox(height: 8),
        SwitchListTile(
          title: const Text('Connexion biometrique'),
          subtitle: Text(
            settings.biometricConfigured ? 'Configure' : 'Non configure',
          ),
          value: settings.biometricConfigured,
          onChanged: (value) => notifier.setBiometricConfigured(value),
          secondary: const Icon(Icons.fingerprint),
        ),
        const SizedBox(height: 16),

        // Notifications
        const _SectionHeader(title: 'Notifications'),
        const SizedBox(height: 8),
        SwitchListTile(
          title: const Text('Notifications push'),
          subtitle: const Text('Recevoir les alertes en temps reel'),
          value: settings.notificationsEnabled,
          onChanged: (_) => notifier.toggleNotifications(),
          secondary: const Icon(Icons.notifications),
        ),
        const SizedBox(height: 16),

        // Sync
        const _SectionHeader(title: 'Synchronisation'),
        const SizedBox(height: 8),
        ListTile(
          leading: const Icon(Icons.sync),
          title: const Text('Synchronisation'),
          subtitle: Text(
            pendingSync.when(
              data: (count) =>
                  count > 0 ? '$count elements en attente' : 'A jour',
              loading: () => 'Chargement...',
              error: (_, _) => 'Erreur',
            ),
          ),
          trailing: FilledButton.icon(
            onPressed: () => notifier.triggerSync(),
            icon: const Icon(Icons.sync),
            label: const Text('Sync'),
          ),
        ),
        if (settings.lastSync != null) ...[
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 16),
            child: Text(
              'Derniere sync : ${_formatDate(settings.lastSync!)}',
              style: Theme.of(context).textTheme.bodySmall,
            ),
          ),
        ],
        const SizedBox(height: 24),

        // Version
        Center(
          child: Text(
            'Art & Jardin v1.0.0',
            style: Theme.of(context).textTheme.bodySmall?.copyWith(
                  color: Theme.of(context).colorScheme.outline,
                ),
          ),
        ),
      ],
    );
  }

  String _formatDate(DateTime date) {
    final d = date.toLocal();
    return '${d.day.toString().padLeft(2, '0')}/${d.month.toString().padLeft(2, '0')}/${d.year} '
        '${d.hour.toString().padLeft(2, '0')}:${d.minute.toString().padLeft(2, '0')}';
  }
}

class _SectionHeader extends StatelessWidget {
  const _SectionHeader({required this.title});
  final String title;

  @override
  Widget build(BuildContext context) {
    return Text(
      title,
      style: Theme.of(context).textTheme.titleMedium?.copyWith(
            fontWeight: FontWeight.bold,
            color: Theme.of(context).colorScheme.primary,
          ),
    );
  }
}

class _ThemeSelector extends StatelessWidget {
  const _ThemeSelector({
    required this.currentMode,
    required this.onChanged,
  });

  final ThemeMode currentMode;
  final ValueChanged<ThemeMode> onChanged;

  @override
  Widget build(BuildContext context) {
    return SegmentedButton<ThemeMode>(
      segments: const [
        ButtonSegment(
          value: ThemeMode.light,
          icon: Icon(Icons.light_mode),
          label: Text('Clair'),
        ),
        ButtonSegment(
          value: ThemeMode.dark,
          icon: Icon(Icons.dark_mode),
          label: Text('Sombre'),
        ),
        ButtonSegment(
          value: ThemeMode.system,
          icon: Icon(Icons.settings_brightness),
          label: Text('Systeme'),
        ),
      ],
      selected: {currentMode},
      onSelectionChanged: (Set<ThemeMode> selected) {
        onChanged(selected.first);
      },
    );
  }
}
