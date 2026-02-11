import 'dart:async';

import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../../../../core/router/route_names.dart';
import '../../../../domain/models/search_result.dart';
import '../../../../shared/widgets/aej_empty_state.dart';
import '../../../../shared/widgets/aej_spinner.dart';
import '../providers/search_providers.dart';
import '../widgets/search_result_card.dart';

class SearchPage extends ConsumerStatefulWidget {
  const SearchPage({super.key});

  @override
  ConsumerState<SearchPage> createState() => _SearchPageState();
}

class _SearchPageState extends ConsumerState<SearchPage> {
  final _controller = TextEditingController();
  final _focusNode = FocusNode();
  Timer? _debounce;

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      _focusNode.requestFocus();
    });
  }

  @override
  void dispose() {
    _debounce?.cancel();
    _controller.dispose();
    _focusNode.dispose();
    super.dispose();
  }

  void _onChanged(String value) {
    _debounce?.cancel();
    _debounce = Timer(const Duration(milliseconds: 200), () {
      ref.read(searchNotifierProvider.notifier).search(value);
    });
  }

  void _onClear() {
    _controller.clear();
    ref.read(searchNotifierProvider.notifier).clear();
    _focusNode.requestFocus();
  }

  void _navigateToResult(SearchResult result) {
    switch (result.entity) {
      case 'client':
        context.pushNamed(RouteNames.clientDetail,
            pathParameters: {'id': result.entityId});
      case 'chantier':
        context.pushNamed(RouteNames.chantierDetail,
            pathParameters: {'id': result.entityId});
      case 'devis':
        context.pushNamed(RouteNames.devisDetail,
            pathParameters: {'id': result.entityId});
      case 'facture':
        context.pushNamed(RouteNames.factureDetail,
            pathParameters: {'id': result.entityId});
    }
  }

  String _entityLabel(String entity) {
    switch (entity) {
      case 'client':
        return 'Clients';
      case 'chantier':
        return 'Chantiers';
      case 'devis':
        return 'Devis';
      case 'facture':
        return 'Factures';
      default:
        return entity;
    }
  }

  @override
  Widget build(BuildContext context) {
    final searchState = ref.watch(searchNotifierProvider);

    return Scaffold(
      appBar: AppBar(
        title: TextField(
          controller: _controller,
          focusNode: _focusNode,
          onChanged: _onChanged,
          decoration: InputDecoration(
            hintText: 'Rechercher clients, chantiers, devis...',
            border: InputBorder.none,
            suffixIcon: _controller.text.isNotEmpty
                ? IconButton(
                    icon: const Icon(Icons.clear),
                    onPressed: _onClear,
                  )
                : null,
          ),
          style: Theme.of(context).textTheme.bodyLarge,
        ),
        leading: IconButton(
          icon: const Icon(Icons.arrow_back),
          onPressed: () => context.pop(),
        ),
      ),
      body: _buildBody(searchState),
    );
  }

  Widget _buildBody(SearchState searchState) {
    if (searchState.isLoading) {
      return const Center(child: AejSpinner());
    }

    if (searchState.error != null) {
      return AejEmptyState(
        icon: Icons.error_outline,
        title: 'Erreur de recherche',
        description: searchState.error,
      );
    }

    if (!searchState.hasSearched) {
      return const AejEmptyState(
        icon: Icons.search,
        title: 'Rechercher',
        description: 'Tapez au moins 2 caracteres pour lancer la recherche',
      );
    }

    if (searchState.results.isEmpty) {
      return AejEmptyState(
        icon: Icons.search_off,
        title: 'Aucun resultat',
        description: 'Aucun resultat pour "${searchState.query}"',
      );
    }

    final grouped = searchState.groupedResults;
    return ListView.builder(
      itemCount: grouped.length,
      itemBuilder: (context, index) {
        final entity = grouped.keys.elementAt(index);
        final results = grouped[entity]!;
        return _buildSection(entity, results);
      },
    );
  }

  Widget _buildSection(String entity, List<SearchResult> results) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Padding(
          padding: const EdgeInsets.fromLTRB(16, 16, 16, 4),
          child: Text(
            _entityLabel(entity),
            style: Theme.of(context).textTheme.titleSmall?.copyWith(
                  color: Theme.of(context).colorScheme.primary,
                  fontWeight: FontWeight.w600,
                ),
          ),
        ),
        ...results.map((r) => SearchResultCard(
              result: r,
              onTap: () => _navigateToResult(r),
            )),
        const Divider(height: 1),
      ],
    );
  }
}
