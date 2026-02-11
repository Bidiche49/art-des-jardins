import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../../../../domain/enums/client_type.dart';
import '../../../../domain/models/client.dart';
import '../../../../shared/widgets/aej_badge.dart';
import '../../../../shared/widgets/aej_spinner.dart';
import '../providers/clients_providers.dart';
import '../widgets/client_form.dart';

class ClientDetailPage extends ConsumerWidget {
  const ClientDetailPage({super.key, required this.clientId});

  final String clientId;

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final state = ref.watch(clientDetailNotifierProvider(clientId));

    return state.when(
      loading: () => const Scaffold(
        body: Center(child: AejSpinner()),
      ),
      error: (error, _) => Scaffold(
        appBar: AppBar(title: const Text('Client')),
        body: Center(child: Text('Erreur: $error')),
      ),
      data: (client) => _ClientDetailView(
        client: client,
        clientId: clientId,
      ),
    );
  }
}

class _ClientDetailView extends ConsumerStatefulWidget {
  const _ClientDetailView({
    required this.client,
    required this.clientId,
  });

  final Client client;
  final String clientId;

  @override
  ConsumerState<_ClientDetailView> createState() => _ClientDetailViewState();
}

class _ClientDetailViewState extends ConsumerState<_ClientDetailView> {
  bool _isEditing = false;
  bool _isLoading = false;

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    if (_isEditing) {
      return Scaffold(
        appBar: AppBar(
          title: const Text('Modifier client'),
          leading: IconButton(
            icon: const Icon(Icons.close),
            onPressed: () => setState(() => _isEditing = false),
          ),
        ),
        body: ClientForm(
          client: widget.client,
          isLoading: _isLoading,
          onSubmit: _onUpdate,
        ),
      );
    }

    return Scaffold(
      appBar: AppBar(
        title: Text(widget.client.nom),
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
        onRefresh: () =>
            ref.read(clientDetailNotifierProvider(widget.clientId).notifier).refresh(),
        child: ListView(
          padding: const EdgeInsets.all(16),
          children: [
            // Header
            _buildHeader(theme),
            const SizedBox(height: 24),
            // Contact
            _buildSection(theme, 'Contact', [
              _buildInfoRow(Icons.email_outlined, 'Email', widget.client.email),
              _buildInfoRow(
                  Icons.phone_outlined, 'Telephone', widget.client.telephone),
              if (widget.client.telephoneSecondaire != null)
                _buildInfoRow(Icons.phone_outlined, 'Tel. secondaire',
                    widget.client.telephoneSecondaire!),
            ]),
            const SizedBox(height: 16),
            // Adresse
            _buildSection(theme, 'Adresse', [
              _buildInfoRow(
                  Icons.location_on_outlined, 'Adresse', widget.client.adresse),
              _buildInfoRow(Icons.pin_drop_outlined, 'Code postal',
                  widget.client.codePostal),
              _buildInfoRow(
                  Icons.location_city_outlined, 'Ville', widget.client.ville),
            ]),
            if (widget.client.notes != null && widget.client.notes!.isNotEmpty) ...[
              const SizedBox(height: 16),
              _buildSection(theme, 'Notes', [
                Padding(
                  padding: const EdgeInsets.symmetric(vertical: 4),
                  child: Text(
                    widget.client.notes!,
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
    final client = widget.client;
    final displayName = _getDisplayName(client);

    return Row(
      children: [
        CircleAvatar(
          radius: 32,
          backgroundColor: theme.colorScheme.primaryContainer,
          child: Text(
            client.nom.isNotEmpty ? client.nom[0].toUpperCase() : '?',
            style: TextStyle(
              fontSize: 24,
              color: theme.colorScheme.onPrimaryContainer,
              fontWeight: FontWeight.bold,
            ),
          ),
        ),
        const SizedBox(width: 16),
        Expanded(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(displayName, style: theme.textTheme.headlineSmall),
              const SizedBox(height: 4),
              AejBadge(
                label: client.type.label,
                variant: _badgeVariant(client.type),
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

  String _getDisplayName(Client client) {
    if (client.prenom != null && client.prenom!.isNotEmpty) {
      return '${client.nom} ${client.prenom}';
    }
    if (client.raisonSociale != null && client.raisonSociale!.isNotEmpty) {
      return '${client.nom} - ${client.raisonSociale}';
    }
    return client.nom;
  }

  AejBadgeVariant _badgeVariant(ClientType type) {
    switch (type) {
      case ClientType.particulier:
        return AejBadgeVariant.primary;
      case ClientType.professionnel:
        return AejBadgeVariant.info;
      case ClientType.syndic:
        return AejBadgeVariant.warning;
    }
  }

  Future<void> _onUpdate(Client client) async {
    setState(() => _isLoading = true);
    try {
      await ref
          .read(clientDetailNotifierProvider(widget.clientId).notifier)
          .updateClient(client);
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
        title: const Text('Supprimer ce client ?'),
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
        .read(clientDetailNotifierProvider(widget.clientId).notifier)
        .deleteClient();
    if (mounted) router.pop();
  }
}
