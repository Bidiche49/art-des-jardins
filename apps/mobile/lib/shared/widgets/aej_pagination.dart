import 'package:flutter/material.dart';

class AejPagination extends StatelessWidget {
  const AejPagination({
    super.key,
    required this.currentPage,
    required this.totalPages,
    required this.onPageChanged,
  });

  final int currentPage;
  final int totalPages;
  final ValueChanged<int> onPageChanged;

  @override
  Widget build(BuildContext context) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.center,
      children: [
        IconButton(
          icon: const Icon(Icons.chevron_left),
          onPressed:
              currentPage > 1 ? () => onPageChanged(currentPage - 1) : null,
          tooltip: 'Page precedente',
        ),
        ...List.generate(totalPages, (index) {
          final page = index + 1;
          final isActive = page == currentPage;
          return Padding(
            padding: const EdgeInsets.symmetric(horizontal: 2),
            child: TextButton(
              onPressed: isActive ? null : () => onPageChanged(page),
              style: TextButton.styleFrom(
                backgroundColor: isActive
                    ? Theme.of(context).colorScheme.primary
                    : null,
                foregroundColor: isActive
                    ? Theme.of(context).colorScheme.onPrimary
                    : null,
                minimumSize: const Size(36, 36),
                padding: EdgeInsets.zero,
              ),
              child: Text('$page'),
            ),
          );
        }),
        IconButton(
          icon: const Icon(Icons.chevron_right),
          onPressed: currentPage < totalPages
              ? () => onPageChanged(currentPage + 1)
              : null,
          tooltip: 'Page suivante',
        ),
      ],
    );
  }
}
