import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../../../domain/models/prestation_template.dart';
import '../providers/devis_providers.dart';

class TemplatePicker extends ConsumerWidget {
  const TemplatePicker({
    super.key,
    required this.onSelect,
  });

  final void Function(PrestationTemplate template) onSelect;

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final templatesAsync = ref.watch(templatesProvider);
    final theme = Theme.of(context);

    return templatesAsync.when(
      loading: () => const SizedBox(
        height: 200,
        child: Center(child: CircularProgressIndicator()),
      ),
      error: (e, _) => SizedBox(
        height: 200,
        child: Center(child: Text('Erreur: $e')),
      ),
      data: (templates) {
        if (templates.isEmpty) {
          return const SizedBox(
            height: 200,
            child: Center(child: Text('Aucun template disponible')),
          );
        }

        // Group by category
        final grouped = <String, List<PrestationTemplate>>{};
        for (final t in templates) {
          grouped.putIfAbsent(t.category, () => []).add(t);
        }

        return SizedBox(
          height: 400,
          child: ListView(
            children: grouped.entries.map((entry) {
              return Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Padding(
                    padding:
                        const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                    child: Text(
                      entry.key.toUpperCase(),
                      style: theme.textTheme.labelLarge?.copyWith(
                        color: theme.colorScheme.primary,
                      ),
                    ),
                  ),
                  ...entry.value.map((template) => ListTile(
                        title: Text(template.name),
                        subtitle: Text(
                          '${template.unitPriceHT.toStringAsFixed(2)} \u20ac/${template.unit} - TVA ${template.tvaRate}%',
                        ),
                        trailing: const Icon(Icons.add_circle_outline),
                        onTap: () {
                          onSelect(template);
                          Navigator.of(context).pop();
                        },
                      )),
                ],
              );
            }).toList(),
          ),
        );
      },
    );
  }
}
