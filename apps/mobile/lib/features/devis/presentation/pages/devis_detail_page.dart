import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:intl/intl.dart';

import '../../../../core/router/route_names.dart' as routes;
import '../../../../domain/enums/devis_statut.dart';
import '../../../../domain/models/devis.dart';
import '../../../../domain/models/ligne_devis.dart';
import '../../../../shared/widgets/aej_badge.dart';
import '../../../../shared/widgets/aej_spinner.dart';
import '../providers/devis_providers.dart';
import '../widgets/devis_card.dart' show statutBadgeVariant;

class DevisDetailPage extends ConsumerWidget {
  const DevisDetailPage({super.key, required this.devisId});

  final String devisId;

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final state = ref.watch(devisDetailNotifierProvider(devisId));

    return state.when(
      loading: () => const Scaffold(
        body: Center(child: AejSpinner()),
      ),
      error: (e, _) => Scaffold(
        appBar: AppBar(),
        body: Center(child: Text('Erreur: $e')),
      ),
      data: (devis) => _DevisDetailView(devis: devis),
    );
  }
}

class _DevisDetailView extends ConsumerWidget {
  const _DevisDetailView({required this.devis});

  final Devis devis;

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final theme = Theme.of(context);
    final dateFormat = DateFormat('dd/MM/yyyy');
    final lignesAsync = ref.watch(devisLignesProvider(devis.id));

    return Scaffold(
      appBar: AppBar(
        title: Text(devis.numero),
        actions: [
          if (devis.statut == DevisStatut.brouillon)
            IconButton(
              icon: const Icon(Icons.edit),
              onPressed: () {
                // Navigate to builder in edit mode
                context.pushNamed(
                  routes.RouteNames.devisCreate,
                  extra: devis,
                );
              },
            ),
          PopupMenuButton<String>(
            onSelected: (action) => _handleAction(context, ref, action),
            itemBuilder: (context) => [
              if (devis.statut == DevisStatut.brouillon)
                const PopupMenuItem(
                  value: 'envoyer',
                  child: ListTile(
                    leading: Icon(Icons.send),
                    title: Text('Envoyer'),
                    dense: true,
                  ),
                ),
              if (devis.pdfUrl != null)
                const PopupMenuItem(
                  value: 'pdf',
                  child: ListTile(
                    leading: Icon(Icons.picture_as_pdf),
                    title: Text('Télécharger PDF'),
                    dense: true,
                  ),
                ),
              if (devis.statut == DevisStatut.brouillon)
                const PopupMenuItem(
                  value: 'supprimer',
                  child: ListTile(
                    leading: Icon(Icons.delete, color: Colors.red),
                    title:
                        Text('Supprimer', style: TextStyle(color: Colors.red)),
                    dense: true,
                  ),
                ),
            ],
          ),
        ],
      ),
      body: RefreshIndicator(
        onRefresh: () =>
            ref.read(devisDetailNotifierProvider(devis.id).notifier).load(),
        child: ListView(
          padding: const EdgeInsets.all(16),
          children: [
            // Header
            Row(
              children: [
                Container(
                  width: 56,
                  height: 56,
                  decoration: BoxDecoration(
                    color: theme.colorScheme.primaryContainer,
                    borderRadius: BorderRadius.circular(16),
                  ),
                  child: Icon(
                    Icons.description_outlined,
                    size: 32,
                    color: theme.colorScheme.onPrimaryContainer,
                  ),
                ),
                const SizedBox(width: 16),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(devis.numero,
                          style: theme.textTheme.headlineSmall),
                      const SizedBox(height: 4),
                      AejBadge(
                        label: devis.statut.label,
                        variant: statutBadgeVariant(devis.statut),
                      ),
                    ],
                  ),
                ),
              ],
            ),
            const SizedBox(height: 24),

            // Informations
            _buildSection(
              context,
              'Informations',
              Icons.info_outline,
              [
                _buildInfoRow(context, Icons.calendar_today, 'Émission',
                    dateFormat.format(devis.dateEmission)),
                _buildInfoRow(context, Icons.event, 'Validité',
                    dateFormat.format(devis.dateValidite)),
                if (devis.dateAcceptation != null)
                  _buildInfoRow(context, Icons.check_circle, 'Accepté le',
                      dateFormat.format(devis.dateAcceptation!)),
              ],
            ),

            // Totaux
            _buildSection(
              context,
              'Montants',
              Icons.euro,
              [
                _buildInfoRow(context, null, 'Total HT',
                    '${devis.totalHT.toStringAsFixed(2)} \u20ac'),
                _buildInfoRow(context, null, 'Total TVA',
                    '${devis.totalTVA.toStringAsFixed(2)} \u20ac'),
                _buildInfoRow(context, null, 'Total TTC',
                    '${devis.totalTTC.toStringAsFixed(2)} \u20ac',
                    bold: true),
              ],
            ),

            // Lignes
            lignesAsync.when(
              loading: () =>
                  const Center(child: Padding(
                    padding: EdgeInsets.all(16),
                    child: CircularProgressIndicator(),
                  )),
              error: (_, _) => const SizedBox.shrink(),
              data: (lignes) => _buildLignesSection(context, lignes),
            ),

            // Notes
            if (devis.notes != null && devis.notes!.isNotEmpty)
              _buildSection(
                context,
                'Notes',
                Icons.notes,
                [
                  Padding(
                    padding: const EdgeInsets.symmetric(vertical: 4),
                    child: Text(devis.notes!),
                  ),
                ],
              ),

            // Conditions
            if (devis.conditionsParticulieres != null &&
                devis.conditionsParticulieres!.isNotEmpty)
              _buildSection(
                context,
                'Conditions particulières',
                Icons.gavel,
                [
                  Padding(
                    padding: const EdgeInsets.symmetric(vertical: 4),
                    child: Text(devis.conditionsParticulieres!),
                  ),
                ],
              ),
          ],
        ),
      ),
    );
  }

  Widget _buildSection(
    BuildContext context,
    String title,
    IconData icon,
    List<Widget> children,
  ) {
    final theme = Theme.of(context);
    return Card(
      margin: const EdgeInsets.only(bottom: 16),
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                Icon(icon, size: 20, color: theme.colorScheme.primary),
                const SizedBox(width: 8),
                Text(title, style: theme.textTheme.titleMedium),
              ],
            ),
            const Divider(height: 24),
            ...children,
          ],
        ),
      ),
    );
  }

  Widget _buildInfoRow(
    BuildContext context,
    IconData? icon,
    String label,
    String value, {
    bool bold = false,
  }) {
    final theme = Theme.of(context);
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 4),
      child: Row(
        children: [
          if (icon != null) ...[
            Icon(icon, size: 16, color: theme.colorScheme.onSurfaceVariant),
            const SizedBox(width: 8),
          ],
          Text(label,
              style: theme.textTheme.bodyMedium
                  ?.copyWith(color: theme.colorScheme.onSurfaceVariant)),
          const Spacer(),
          Text(
            value,
            style: theme.textTheme.bodyMedium?.copyWith(
              fontWeight: bold ? FontWeight.bold : null,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildLignesSection(BuildContext context, List<LigneDevis> lignes) {
    if (lignes.isEmpty) return const SizedBox.shrink();
    final theme = Theme.of(context);

    return _buildSection(
      context,
      'Lignes (${lignes.length})',
      Icons.list,
      lignes
          .map((l) => Padding(
                padding: const EdgeInsets.symmetric(vertical: 4),
                child: Row(
                  children: [
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(l.description,
                              style: theme.textTheme.bodyMedium),
                          Text(
                            '${l.quantite} ${l.unite} x ${l.prixUnitaireHT.toStringAsFixed(2)} \u20ac (TVA ${l.tva}%)',
                            style: theme.textTheme.bodySmall?.copyWith(
                              color: theme.colorScheme.onSurfaceVariant,
                            ),
                          ),
                        ],
                      ),
                    ),
                    Text(
                      '${l.montantTTC.toStringAsFixed(2)} \u20ac',
                      style: theme.textTheme.bodyMedium?.copyWith(
                        fontWeight: FontWeight.w600,
                      ),
                    ),
                  ],
                ),
              ))
          .toList(),
    );
  }

  void _handleAction(BuildContext context, WidgetRef ref, String action) async {
    final notifier =
        ref.read(devisDetailNotifierProvider(devis.id).notifier);
    switch (action) {
      case 'envoyer':
        final confirm = await showDialog<bool>(
          context: context,
          builder: (ctx) => AlertDialog(
            title: const Text('Envoyer le devis ?'),
            content:
                const Text('Le devis sera marqué comme envoyé au client.'),
            actions: [
              TextButton(
                  onPressed: () => Navigator.pop(ctx, false),
                  child: const Text('Annuler')),
              FilledButton(
                  onPressed: () => Navigator.pop(ctx, true),
                  child: const Text('Envoyer')),
            ],
          ),
        );
        if (confirm == true) {
          await notifier.updateStatut(DevisStatut.envoye);
        }
        break;
      case 'supprimer':
        final confirm = await showDialog<bool>(
          context: context,
          builder: (ctx) => AlertDialog(
            title: const Text('Supprimer le devis ?'),
            content: const Text('Cette action est irréversible.'),
            actions: [
              TextButton(
                  onPressed: () => Navigator.pop(ctx, false),
                  child: const Text('Annuler')),
              FilledButton(
                  onPressed: () => Navigator.pop(ctx, true),
                  style:
                      FilledButton.styleFrom(backgroundColor: Colors.red),
                  child: const Text('Supprimer')),
            ],
          ),
        );
        if (confirm == true && context.mounted) {
          await notifier.deleteDevis();
          if (context.mounted) context.pop();
        }
        break;
      case 'pdf':
        // PDF download handled externally
        break;
    }
  }
}

