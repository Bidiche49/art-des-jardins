import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../../../../domain/models/chantier.dart';
import '../../../../domain/models/devis.dart';
import '../providers/devis_providers.dart';
import '../widgets/devis_totaux.dart';
import '../widgets/ligne_devis_row.dart';
import '../widgets/template_picker.dart';

class DevisBuilderPage extends ConsumerStatefulWidget {
  const DevisBuilderPage({
    super.key,
    required this.chantiers,
    this.existingDevis,
  });

  final List<Chantier> chantiers;
  final Devis? existingDevis;

  @override
  ConsumerState<DevisBuilderPage> createState() => _DevisBuilderPageState();
}

class _DevisBuilderPageState extends ConsumerState<DevisBuilderPage> {
  @override
  void initState() {
    super.initState();
    final notifier = ref.read(devisBuilderNotifierProvider.notifier);

    if (widget.existingDevis != null) {
      // Load existing devis for editing
      final devis = widget.existingDevis!;
      ref
          .read(devisLignesProvider(devis.id).future)
          .then((lignes) {
        notifier.loadExistingDevis(devis, lignes);
      });
    } else {
      notifier.reset();
    }
  }

  @override
  Widget build(BuildContext context) {
    final builderState = ref.watch(devisBuilderNotifierProvider);
    final notifier = ref.read(devisBuilderNotifierProvider.notifier);
    final theme = Theme.of(context);

    return Scaffold(
      appBar: AppBar(
        title: Text(widget.existingDevis != null
            ? 'Modifier le devis'
            : 'Nouveau devis'),
        actions: [
          TextButton.icon(
            onPressed: builderState.isSaving ? null : () => _saveBrouillon(),
            icon: const Icon(Icons.save_outlined),
            label: const Text('Brouillon'),
          ),
        ],
      ),
      body: Column(
        children: [
          Expanded(
            child: ListView(
              padding: const EdgeInsets.all(16),
              children: [
                // Chantier selector
                DropdownButtonFormField<String>(
                  initialValue: builderState.chantierId,
                  decoration: const InputDecoration(
                    labelText: 'Chantier *',
                    prefixIcon: Icon(Icons.business),
                  ),
                  items: widget.chantiers
                      .map((c) => DropdownMenuItem(
                            value: c.id,
                            child: Text(
                              c.description.length > 40
                                  ? '${c.description.substring(0, 40)}...'
                                  : c.description,
                            ),
                          ))
                      .toList(),
                  onChanged: (val) {
                    if (val != null) notifier.setChantier(val);
                  },
                ),
                const SizedBox(height: 16),

                // Lignes header
                Row(
                  children: [
                    Icon(Icons.list, color: theme.colorScheme.primary),
                    const SizedBox(width: 8),
                    Text('Lignes', style: theme.textTheme.titleMedium),
                    const Spacer(),
                    TextButton.icon(
                      onPressed: () => _showTemplatePicker(),
                      icon: const Icon(Icons.file_copy_outlined, size: 18),
                      label: const Text('Template'),
                    ),
                    const SizedBox(width: 4),
                    FilledButton.icon(
                      onPressed: () => notifier.addLigne(),
                      icon: const Icon(Icons.add, size: 18),
                      label: const Text('Ligne'),
                    ),
                  ],
                ),
                const SizedBox(height: 8),

                // Lignes list
                if (builderState.lignes.isEmpty)
                  Card(
                    child: Padding(
                      padding: const EdgeInsets.all(32),
                      child: Center(
                        child: Column(
                          children: [
                            Icon(Icons.add_circle_outline,
                                size: 48,
                                color: theme.colorScheme.onSurfaceVariant),
                            const SizedBox(height: 8),
                            Text(
                              'Ajoutez des lignes au devis',
                              style: theme.textTheme.bodyMedium?.copyWith(
                                color: theme.colorScheme.onSurfaceVariant,
                              ),
                            ),
                          ],
                        ),
                      ),
                    ),
                  )
                else
                  ...builderState.lignes.asMap().entries.map(
                        (entry) => LigneDevisRow(
                          key: ValueKey(entry.value.id),
                          ligne: entry.value,
                          index: entry.key,
                          onUpdate: notifier.updateLigne,
                          onRemove: notifier.removeLigne,
                        ),
                      ),
                const SizedBox(height: 16),

                // Notes
                TextFormField(
                  initialValue: builderState.notes,
                  decoration: const InputDecoration(
                    labelText: 'Notes internes',
                    prefixIcon: Icon(Icons.notes),
                  ),
                  maxLines: 3,
                  onChanged: (v) => notifier.setNotes(v.isEmpty ? null : v),
                ),
                const SizedBox(height: 12),

                // Conditions
                TextFormField(
                  initialValue: builderState.conditionsParticulieres,
                  decoration: const InputDecoration(
                    labelText: 'Conditions particulières',
                    prefixIcon: Icon(Icons.gavel),
                  ),
                  maxLines: 3,
                  onChanged: (v) =>
                      notifier.setConditions(v.isEmpty ? null : v),
                ),
                const SizedBox(height: 16),

                // Error
                if (builderState.error != null)
                  Padding(
                    padding: const EdgeInsets.only(bottom: 16),
                    child: Text(
                      builderState.error!,
                      style: TextStyle(color: theme.colorScheme.error),
                    ),
                  ),
              ],
            ),
          ),

          // Bottom bar with totaux + send button
          Container(
            decoration: BoxDecoration(
              color: theme.colorScheme.surface,
              boxShadow: [
                BoxShadow(
                  color: Colors.black.withValues(alpha: 0.1),
                  blurRadius: 8,
                  offset: const Offset(0, -2),
                ),
              ],
            ),
            child: SafeArea(
              child: Padding(
                padding: const EdgeInsets.all(16),
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    DevisTotaux(
                      totalHT: builderState.totalHT,
                      totalTVA: builderState.totalTVA,
                      totalTTC: builderState.totalTTC,
                    ),
                    const SizedBox(height: 12),
                    SizedBox(
                      width: double.infinity,
                      child: FilledButton.icon(
                        onPressed: builderState.isSaving
                            ? null
                            : () => _envoyerDevis(),
                        icon: builderState.isSaving
                            ? const SizedBox(
                                width: 18,
                                height: 18,
                                child:
                                    CircularProgressIndicator(strokeWidth: 2),
                              )
                            : const Icon(Icons.send),
                        label: const Text('Envoyer le devis'),
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }

  Future<void> _saveBrouillon() async {
    final notifier = ref.read(devisBuilderNotifierProvider.notifier);
    final devis = await notifier.saveBrouillon();
    if (devis != null && mounted) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Brouillon sauvegardé')),
      );
    }
  }

  Future<void> _envoyerDevis() async {
    final notifier = ref.read(devisBuilderNotifierProvider.notifier);
    final devis = await notifier.envoyerDevis();
    if (devis != null && mounted) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Devis envoyé')),
      );
      context.pop(devis);
    }
  }

  void _showTemplatePicker() {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      builder: (_) => TemplatePicker(
        onSelect: (template) {
          ref.read(devisBuilderNotifierProvider.notifier).importTemplate(template);
        },
      ),
    );
  }
}
