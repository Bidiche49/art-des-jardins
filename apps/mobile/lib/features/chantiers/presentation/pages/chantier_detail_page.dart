import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../../../../core/router/route_names.dart';
import '../../../../domain/enums/chantier_statut.dart';
import '../../../../domain/models/chantier.dart';
import '../../../../domain/models/client.dart';
import '../../../../shared/widgets/aej_badge.dart';
import '../../../../shared/widgets/aej_spinner.dart';
import '../../../clients/presentation/providers/clients_providers.dart';
import '../providers/chantiers_providers.dart';
import '../widgets/chantier_card.dart';
import '../widgets/chantier_form.dart';

class ChantierDetailPage extends ConsumerWidget {
  const ChantierDetailPage({super.key, required this.chantierId});

  final String chantierId;

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final state = ref.watch(chantierDetailNotifierProvider(chantierId));

    return state.when(
      loading: () => const Scaffold(
        body: Center(child: AejSpinner()),
      ),
      error: (error, _) => Scaffold(
        appBar: AppBar(title: const Text('Chantier')),
        body: Center(child: Text('Erreur: $error')),
      ),
      data: (chantier) => _ChantierDetailView(
        chantier: chantier,
        chantierId: chantierId,
      ),
    );
  }
}

class _ChantierDetailView extends ConsumerStatefulWidget {
  const _ChantierDetailView({
    required this.chantier,
    required this.chantierId,
  });

  final Chantier chantier;
  final String chantierId;

  @override
  ConsumerState<_ChantierDetailView> createState() =>
      _ChantierDetailViewState();
}

class _ChantierDetailViewState extends ConsumerState<_ChantierDetailView> {
  bool _isEditing = false;
  bool _isLoading = false;

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    if (_isEditing) {
      final clientsState = ref.watch(clientsListNotifierProvider);
      final clients = clientsState.valueOrNull ?? <Client>[];

      return Scaffold(
        appBar: AppBar(
          title: const Text('Modifier chantier'),
          leading: IconButton(
            icon: const Icon(Icons.close),
            onPressed: () => setState(() => _isEditing = false),
          ),
        ),
        body: ChantierForm(
          chantier: widget.chantier,
          clients: clients,
          isLoading: _isLoading,
          onSubmit: _onUpdate,
        ),
      );
    }

    return Scaffold(
      appBar: AppBar(
        title: Text(widget.chantier.description),
        actions: [
          IconButton(
            icon: const Icon(Icons.bar_chart),
            onPressed: () => context.goNamed(
              RouteNames.chantierRentabilite,
              pathParameters: {'id': widget.chantierId},
            ),
          ),
          IconButton(
            icon: const Icon(Icons.edit),
            onPressed: () => setState(() => _isEditing = true),
          ),
          IconButton(
            icon: const Icon(Icons.delete_outline),
            onPressed: () => _confirmDelete(context),
          ),
        ],
      ),
      body: RefreshIndicator(
        onRefresh: () => ref
            .read(chantierDetailNotifierProvider(widget.chantierId).notifier)
            .refresh(),
        child: ListView(
          padding: const EdgeInsets.all(16),
          children: [
            // Header with statut
            _buildHeader(theme),
            const SizedBox(height: 24),

            // Statut inline change
            _buildStatutSelector(theme),
            const SizedBox(height: 16),

            // Adresse
            _buildSection(theme, 'Adresse', [
              _buildInfoRow(Icons.location_on_outlined, 'Adresse',
                  widget.chantier.adresse),
              _buildInfoRow(Icons.pin_drop_outlined, 'Code postal',
                  widget.chantier.codePostal),
              _buildInfoRow(Icons.location_city_outlined, 'Ville',
                  widget.chantier.ville),
            ]),
            const SizedBox(height: 16),

            // Infos
            _buildSection(theme, 'Informations', [
              if (widget.chantier.surface != null)
                _buildInfoRow(Icons.square_foot, 'Surface',
                    '${widget.chantier.surface} m²'),
              if (widget.chantier.typePrestation.isNotEmpty)
                Padding(
                  padding: const EdgeInsets.symmetric(vertical: 6),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text('Prestations',
                          style: theme.textTheme.labelSmall?.copyWith(
                            color: theme.colorScheme.onSurfaceVariant,
                          )),
                      const SizedBox(height: 4),
                      Wrap(
                        spacing: 4,
                        runSpacing: 4,
                        children: widget.chantier.typePrestation
                            .map((t) => AejBadge(
                                  label: t.label,
                                  variant: AejBadgeVariant.primary,
                                  size: AejBadgeSize.sm,
                                ))
                            .toList(),
                      ),
                    ],
                  ),
                ),
            ]),
            const SizedBox(height: 16),

            // Dates
            if (widget.chantier.dateDebut != null ||
                widget.chantier.dateFin != null)
              _buildSection(theme, 'Dates', [
                if (widget.chantier.dateDebut != null)
                  _buildInfoRow(Icons.calendar_today, 'Debut',
                      _formatDate(widget.chantier.dateDebut!)),
                if (widget.chantier.dateFin != null)
                  _buildInfoRow(Icons.event, 'Fin',
                      _formatDate(widget.chantier.dateFin!)),
              ]),

            if (widget.chantier.notes != null &&
                widget.chantier.notes!.isNotEmpty) ...[
              const SizedBox(height: 16),
              _buildSection(theme, 'Notes', [
                Padding(
                  padding: const EdgeInsets.symmetric(vertical: 4),
                  child: Text(
                    widget.chantier.notes!,
                    style: theme.textTheme.bodyMedium,
                  ),
                ),
              ]),
            ],
          ],
        ),
      ),
    );
  }

  Widget _buildHeader(ThemeData theme) {
    return Row(
      children: [
        CircleAvatar(
          radius: 32,
          backgroundColor: theme.colorScheme.primaryContainer,
          child: Icon(
            Icons.construction,
            size: 28,
            color: theme.colorScheme.onPrimaryContainer,
          ),
        ),
        const SizedBox(width: 16),
        Expanded(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(widget.chantier.description,
                  style: theme.textTheme.headlineSmall),
              const SizedBox(height: 4),
              AejBadge(
                label: widget.chantier.statut.label,
                variant: statutBadgeVariant(widget.chantier.statut),
              ),
            ],
          ),
        ),
      ],
    );
  }

  Widget _buildStatutSelector(ThemeData theme) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text('Changer le statut', style: theme.textTheme.titleSmall),
        const SizedBox(height: 8),
        SingleChildScrollView(
          scrollDirection: Axis.horizontal,
          child: Row(
            children: ChantierStatut.values.map((statut) {
              final isSelected = widget.chantier.statut == statut;
              return Padding(
                padding: const EdgeInsets.only(right: 8),
                child: ChoiceChip(
                  label: Text(statut.label),
                  selected: isSelected,
                  onSelected: isSelected
                      ? null
                      : (_) => _onStatutChange(statut),
                ),
              );
            }).toList(),
          ),
        ),
      ],
    );
  }

  Widget _buildSection(ThemeData theme, String title, List<Widget> children) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(title, style: theme.textTheme.titleSmall),
        const SizedBox(height: 8),
        Card(
          child: Padding(
            padding: const EdgeInsets.all(12),
            child: Column(children: children),
          ),
        ),
      ],
    );
  }

  Widget _buildInfoRow(IconData icon, String label, String value) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 6),
      child: Row(
        children: [
          Icon(icon, size: 20, color: Theme.of(context).colorScheme.primary),
          const SizedBox(width: 12),
          Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(label,
                  style: Theme.of(context).textTheme.labelSmall?.copyWith(
                        color: Theme.of(context).colorScheme.onSurfaceVariant,
                      )),
              Text(value, style: Theme.of(context).textTheme.bodyMedium),
            ],
          ),
        ],
      ),
    );
  }

  String _formatDate(DateTime date) {
    return '${date.day.toString().padLeft(2, '0')}/${date.month.toString().padLeft(2, '0')}/${date.year}';
  }

  Future<void> _onStatutChange(ChantierStatut newStatut) async {
    final updated = widget.chantier.copyWith(statut: newStatut);
    await ref
        .read(chantierDetailNotifierProvider(widget.chantierId).notifier)
        .updateChantier(updated);
  }

  Future<void> _onUpdate(Chantier chantier) async {
    setState(() => _isLoading = true);
    try {
      await ref
          .read(chantierDetailNotifierProvider(widget.chantierId).notifier)
          .updateChantier(chantier);
      if (mounted) {
        setState(() {
          _isEditing = false;
          _isLoading = false;
        });
      }
    } catch (_) {
      if (mounted) setState(() => _isLoading = false);
    }
  }

  Future<void> _confirmDelete(BuildContext context) async {
    final router = GoRouter.of(context);
    final confirmed = await showDialog<bool>(
      context: context,
      builder: (ctx) => AlertDialog(
        title: const Text('Supprimer ce chantier ?'),
        content: const Text('Cette action est irreversible.'),
        actions: [
          TextButton(
            onPressed: () => Navigator.of(ctx).pop(false),
            child: const Text('Annuler'),
          ),
          FilledButton(
            onPressed: () => Navigator.of(ctx).pop(true),
            style: FilledButton.styleFrom(
              backgroundColor: Theme.of(ctx).colorScheme.error,
            ),
            child: const Text('Supprimer'),
          ),
        ],
      ),
    );

    if (confirmed != true || !mounted) return;

    await ref
        .read(chantierDetailNotifierProvider(widget.chantierId).notifier)
        .deleteChantier();
    if (mounted) router.pop();
  }
}
