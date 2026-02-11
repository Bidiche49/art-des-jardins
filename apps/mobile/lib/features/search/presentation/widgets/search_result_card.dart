import 'package:flutter/material.dart';

import '../../../../domain/models/search_result.dart';

class SearchResultCard extends StatelessWidget {
  const SearchResultCard({
    super.key,
    required this.result,
    required this.onTap,
  });

  final SearchResult result;
  final VoidCallback onTap;

  IconData get _icon {
    switch (result.entity) {
      case 'client':
        return Icons.person;
      case 'chantier':
        return Icons.construction;
      case 'devis':
        return Icons.description;
      case 'facture':
        return Icons.receipt_long;
      default:
        return Icons.article;
    }
  }

  Color _iconColor(BuildContext context) {
    switch (result.entity) {
      case 'client':
        return const Color(0xFF16A34A);
      case 'chantier':
        return const Color(0xFFD97706);
      case 'devis':
        return const Color(0xFF2563EB);
      case 'facture':
        return const Color(0xFF7C3AED);
      default:
        return Theme.of(context).colorScheme.primary;
    }
  }

  @override
  Widget build(BuildContext context) {
    return ListTile(
      leading: CircleAvatar(
        backgroundColor: _iconColor(context).withAlpha(30),
        child: Icon(_icon, color: _iconColor(context), size: 20),
      ),
      title: Text(
        result.title,
        maxLines: 1,
        overflow: TextOverflow.ellipsis,
      ),
      subtitle: result.subtitle != null
          ? Text(
              result.subtitle!,
              maxLines: 1,
              overflow: TextOverflow.ellipsis,
              style: Theme.of(context).textTheme.bodySmall,
            )
          : null,
      trailing: const Icon(Icons.chevron_right, size: 20),
      onTap: onTap,
    );
  }
}
