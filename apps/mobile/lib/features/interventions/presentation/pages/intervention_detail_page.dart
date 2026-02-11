import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../../../../domain/models/chantier.dart';
import '../../../../domain/models/intervention.dart';
import '../../../../shared/widgets/aej_badge.dart';
import '../../../../shared/widgets/aej_spinner.dart';
import '../../../chantiers/presentation/providers/chantiers_providers.dart';
import '../providers/interventions_providers.dart';
import '../widgets/intervention_form.dart';
import '../widgets/photo_capture.dart';
import '../widgets/photo_gallery.dart';

class InterventionDetailPage extends ConsumerWidget {
  const InterventionDetailPage({super.key, required this.interventionId});

  final String interventionId;

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final state =
        ref.watch(interventionDetailNotifierProvider(interventionId));

    return state.when(
      loading: () => const Scaffold(
        body: Center(child: AejSpinner()),
      ),
      error: (error, _) => Scaffold(
        appBar: AppBar(title: const Text('Intervention')),
        body: Center(child: Text('Erreur: $error')),
      ),
      data: (intervention) => _InterventionDetailView(
        intervention: intervention,
        interventionId: interventionId,
      ),
    );
  }
}

class _InterventionDetailView extends ConsumerStatefulWidget {
  const _InterventionDetailView({
    required this.intervention,
    required this.interventionId,
  });

  final Intervention intervention;
  final String interventionId;

  @override
  ConsumerState<_InterventionDetailView> createState() =>
      _InterventionDetailViewState();
}

class _InterventionDetailViewState
    extends ConsumerState<_InterventionDetailView> {
  bool _isEditing = false;
  bool _isLoading = false;

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    if (_isEditing) {
      final chantiersState = ref.watch(chantiersListNotifierProvider);
      final chantiers = chantiersState.valueOrNull ?? <Chantier>[];

      return Scaffold(
        appBar: AppBar(
          title: const Text('Modifier intervention'),
          leading: IconButton(
            icon: const Icon(Icons.close),
            onPressed: () => setState(() => _isEditing = false),
          ),
        ),
        body: InterventionForm(
          intervention: widget.intervention,
          chantiers: chantiers,
          isLoading: _isLoading,
          onSubmit: _onUpdate,
        ),
      );
    }

    return Scaffold(
      appBar: AppBar(
        title: Text(widget.intervention.description ?? 'Intervention'),
        actions: [
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
            .read(interventionDetailNotifierProvider(widget.interventionId)
                .notifier)
            .refresh(),
        child: ListView(
          padding: const EdgeInsets.all(16),
          children: [
            // Header
            _buildHeader(theme),
            const SizedBox(height: 24),

            // Informations
            _buildSection(theme, 'Informations', [
              _buildInfoRow(Icons.calendar_today, 'Date',
                  _formatDate(widget.intervention.date)),
              _buildInfoRow(Icons.access_time, 'Heure debut',
                  _formatTime(widget.intervention.heureDebut)),
              if (widget.intervention.heureFin != null)
                _buildInfoRow(Icons.access_time_filled, 'Heure fin',
                    _formatTime(widget.intervention.heureFin!)),
              if (widget.intervention.dureeMinutes != null)
                _buildInfoRow(Icons.timer, 'Duree',
                    '${widget.intervention.dureeMinutes} min'),
            ]),
            const SizedBox(height: 16),

            // Description
            if (widget.intervention.description != null &&
                widget.intervention.description!.isNotEmpty) ...[
              _buildSection(theme, 'Description', [
                Padding(
                  padding: const EdgeInsets.symmetric(vertical: 4),
                  child: Text(
                    widget.intervention.description!,
                    style: theme.textTheme.bodyMedium,
                  ),
                ),
              ]),
              const SizedBox(height: 16),
            ],

            // Notes
            if (widget.intervention.notes != null &&
                widget.intervention.notes!.isNotEmpty) ...[
              _buildSection(theme, 'Notes', [
                Padding(
                  padding: const EdgeInsets.symmetric(vertical: 4),
                  child: Text(
                    widget.intervention.notes!,
                    style: theme.textTheme.bodyMedium,
                  ),
                ),
              ]),
              const SizedBox(height: 16),
            ],

            // Photos
            _buildSection(theme, 'Photos', [
              if (widget.intervention.photos.isEmpty)
                const Padding(
                  padding: EdgeInsets.symmetric(vertical: 8),
                  child: Text('Aucune photo'),
                )
              else
                PhotoGallery(
                  photoUrls: widget.intervention.photos,
                ),
            ]),
            const SizedBox(height: 8),
            PhotoCapture(
              onCapture: (type) {
                // Photo capture handled by PhotoService
              },
            ),
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
            Icons.build_outlined,
            size: 28,
            color: theme.colorScheme.onPrimaryContainer,
          ),
        ),
        const SizedBox(width: 16),
        Expanded(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                widget.intervention.description ?? 'Intervention',
                style: theme.textTheme.headlineSmall,
              ),
              const SizedBox(height: 4),
              AejBadge(
                label: widget.intervention.valide ? 'Validee' : 'En cours',
                variant: widget.intervention.valide
                    ? AejBadgeVariant.success
                    : AejBadgeVariant.warning,
              ),
            ],
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

  String _formatTime(DateTime dt) {
    return '${dt.hour.toString().padLeft(2, '0')}:${dt.minute.toString().padLeft(2, '0')}';
  }

  Future<void> _onUpdate(Intervention intervention) async {
    setState(() => _isLoading = true);
    try {
      await ref
          .read(interventionDetailNotifierProvider(widget.interventionId)
              .notifier)
          .updateIntervention(intervention);
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
        title: const Text('Supprimer cette intervention ?'),
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
        .read(interventionDetailNotifierProvider(widget.interventionId)
            .notifier)
        .deleteIntervention();
    if (mounted) router.pop();
  }
}
