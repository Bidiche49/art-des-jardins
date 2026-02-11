import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../../../domain/models/sync_conflict.dart';
import '../../../../services/sync/sync_providers.dart';
import '../../../../shared/widgets/aej_badge.dart';
import '../../../../shared/widgets/aej_empty_state.dart';

class ConflictResolutionPage extends ConsumerWidget {
  const ConflictResolutionPage({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final conflicts = ref.watch(conflictNotifierProvider);

    return Scaffold(
      appBar: AppBar(
        title: Text('Conflits (${conflicts.length})'),
      ),
      body: conflicts.isEmpty
          ? const AejEmptyState(
              icon: Icons.check_circle_outline,
              title: 'Aucun conflit',
              description: 'Toutes les modifications sont synchronisees.',
            )
          : ListView.builder(
              padding: const EdgeInsets.all(16),
              itemCount: conflicts.length,
              itemBuilder: (context, index) {
                return Padding(
                  padding: const EdgeInsets.only(bottom: 16),
                  child: _ConflictCard(
                    conflict: conflicts[index],
                    onResolve: (strategy, mergeData) {
                      ref
                          .read(conflictNotifierProvider.notifier)
                          .resolveConflict(
                            conflictId: conflicts[index].id,
                            strategy: strategy,
                            mergeOverrides: mergeData,
                          );
                      ScaffoldMessenger.of(context).showSnackBar(
                        const SnackBar(content: Text('Conflit resolu')),
                      );
                    },
                  ),
                );
              },
            ),
    );
  }
}

class _ConflictCard extends StatelessWidget {
  const _ConflictCard({
    required this.conflict,
    required this.onResolve,
  });

  final SyncConflict conflict;
  final void Function(String strategy, Map<String, dynamic>? mergeData)
      onResolve;

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    return Card(
      clipBehavior: Clip.antiAlias,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Padding(
            padding: const EdgeInsets.all(16),
            child: Row(
              children: [
                AejBadge(
                  label: conflict.entityType,
                  variant: AejBadgeVariant.warning,
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: Text(
                    conflict.entityLabel,
                    style: theme.textTheme.titleMedium,
                  ),
                ),
              ],
            ),
          ),
          const Divider(height: 1),
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
            child: _ComparisonTable(conflict: conflict),
          ),
          const Divider(height: 1),
          Padding(
            padding: const EdgeInsets.all(12),
            child: Row(
              children: [
                Expanded(
                  child: TextButton(
                    onPressed: () => onResolve('local', null),
                    child: const Text('Garder ma version'),
                  ),
                ),
                Expanded(
                  child: TextButton(
                    onPressed: () => onResolve('server', null),
                    child: const Text('Garder version serveur'),
                  ),
                ),
                Expanded(
                  child: FilledButton.tonal(
                    onPressed: () => _openMergeEditor(context),
                    child: const Text('Fusionner'),
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  void _openMergeEditor(BuildContext context) {
    showModalBottomSheet<Map<String, dynamic>>(
      context: context,
      isScrollControlled: true,
      builder: (sheetContext) => _MergeEditorSheet(conflict: conflict),
    ).then((result) {
      if (result != null) {
        onResolve('merge', result);
      }
    });
  }
}

class _ComparisonTable extends StatelessWidget {
  const _ComparisonTable({required this.conflict});
  final SyncConflict conflict;

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final allFields = <String>{
      ...conflict.localVersion.keys,
      ...conflict.serverVersion.keys,
    }..removeAll(
        const {'id', 'version', 'createdAt', 'updatedAt', 'created_at', 'updated_at'});

    final sortedFields = allFields.toList()..sort();

    return Table(
      columnWidths: const {
        0: FlexColumnWidth(1),
        1: FlexColumnWidth(1),
        2: FlexColumnWidth(1),
      },
      children: [
        TableRow(
          decoration: BoxDecoration(
            color: theme.colorScheme.surfaceContainerHighest,
          ),
          children: [
            _headerCell('Champ', theme),
            _headerCell('Local', theme),
            _headerCell('Serveur', theme),
          ],
        ),
        for (final field in sortedFields)
          TableRow(
            decoration: conflict.conflictingFields.contains(field)
                ? const BoxDecoration(color: Color(0xFFFEF3C7))
                : null,
            children: [
              _cell(field, theme, bold: true),
              _cell(
                conflict.localVersion[field]?.toString() ?? '-',
                theme,
              ),
              _cell(
                conflict.serverVersion[field]?.toString() ?? '-',
                theme,
              ),
            ],
          ),
      ],
    );
  }

  Widget _headerCell(String text, ThemeData theme) {
    return Padding(
      padding: const EdgeInsets.all(8),
      child: Text(
        text,
        style: theme.textTheme.labelMedium
            ?.copyWith(fontWeight: FontWeight.bold),
      ),
    );
  }

  Widget _cell(String text, ThemeData theme, {bool bold = false}) {
    return Padding(
      padding: const EdgeInsets.all(8),
      child: Text(
        text,
        style: theme.textTheme.bodySmall?.copyWith(
          fontWeight: bold ? FontWeight.w600 : null,
        ),
      ),
    );
  }
}

class _MergeEditorSheet extends StatefulWidget {
  const _MergeEditorSheet({required this.conflict});
  final SyncConflict conflict;

  @override
  State<_MergeEditorSheet> createState() => _MergeEditorSheetState();
}

class _MergeEditorSheetState extends State<_MergeEditorSheet> {
  final Map<String, String> _selections = {};

  bool get _isValid =>
      widget.conflict.conflictingFields.every(_selections.containsKey);

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    return DraggableScrollableSheet(
      initialChildSize: 0.7,
      maxChildSize: 0.9,
      minChildSize: 0.5,
      expand: false,
      builder: (context, scrollController) {
        return Padding(
          padding: const EdgeInsets.all(16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Center(
                child: Container(
                  width: 40,
                  height: 4,
                  decoration: BoxDecoration(
                    color: theme.colorScheme.onSurfaceVariant.withAlpha(64),
                    borderRadius: BorderRadius.circular(2),
                  ),
                ),
              ),
              const SizedBox(height: 16),
              Text(
                'Fusionner les champs',
                style: theme.textTheme.titleLarge,
              ),
              const SizedBox(height: 8),
              Text(
                'Choisissez la valeur a conserver pour chaque champ en conflit.',
                style: theme.textTheme.bodyMedium?.copyWith(
                  color: theme.colorScheme.onSurfaceVariant,
                ),
              ),
              const SizedBox(height: 16),
              Expanded(
                child: ListView.builder(
                  controller: scrollController,
                  itemCount: widget.conflict.conflictingFields.length,
                  itemBuilder: (context, index) {
                    final field = widget.conflict.conflictingFields[index];
                    final localValue =
                        widget.conflict.localVersion[field]?.toString() ?? '-';
                    final serverValue =
                        widget.conflict.serverVersion[field]?.toString() ?? '-';

                    return Card(
                      margin: const EdgeInsets.only(bottom: 12),
                      child: Padding(
                        padding: const EdgeInsets.all(12),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(field, style: theme.textTheme.titleSmall),
                            const SizedBox(height: 8),
                            RadioGroup<String>(
                              groupValue: _selections[field],
                              onChanged: (v) {
                                if (v != null) {
                                  setState(() => _selections[field] = v);
                                }
                              },
                              child: Column(
                                children: [
                                  RadioListTile<String>(
                                    title: const Text('Ma version'),
                                    subtitle: Text(localValue),
                                    value: 'local',
                                    dense: true,
                                  ),
                                  RadioListTile<String>(
                                    title: const Text('Version serveur'),
                                    subtitle: Text(serverValue),
                                    value: 'server',
                                    dense: true,
                                  ),
                                ],
                              ),
                            ),
                          ],
                        ),
                      ),
                    );
                  },
                ),
              ),
              const SizedBox(height: 8),
              SizedBox(
                width: double.infinity,
                child: FilledButton(
                  onPressed: _isValid ? _save : null,
                  child: const Text('Sauvegarder'),
                ),
              ),
            ],
          ),
        );
      },
    );
  }

  void _save() {
    final overrides = <String, dynamic>{};
    for (final entry in _selections.entries) {
      if (entry.value == 'local') {
        overrides[entry.key] = widget.conflict.localVersion[entry.key];
      } else {
        overrides[entry.key] = widget.conflict.serverVersion[entry.key];
      }
    }
    Navigator.of(context).pop(overrides);
  }
}
