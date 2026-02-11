import 'package:flutter/material.dart';

class AejTableColumn {
  const AejTableColumn({required this.label, this.flex = 1});
  final String label;
  final int flex;
}

class AejTable extends StatelessWidget {
  const AejTable({
    super.key,
    required this.columns,
    required this.rows,
    this.onRowTap,
  });

  final List<AejTableColumn> columns;
  final List<List<Widget>> rows;
  final void Function(int index)? onRowTap;

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        // Header
        Container(
          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
          decoration: BoxDecoration(
            color: Theme.of(context).colorScheme.surfaceContainerHighest,
            borderRadius:
                const BorderRadius.vertical(top: Radius.circular(8)),
          ),
          child: Row(
            children: columns
                .map((col) => Expanded(
                      flex: col.flex,
                      child: Text(
                        col.label,
                        style: Theme.of(context).textTheme.labelMedium?.copyWith(
                              fontWeight: FontWeight.w600,
                            ),
                      ),
                    ))
                .toList(),
          ),
        ),
        // Rows
        ...rows.asMap().entries.map((entry) {
          final index = entry.key;
          final cells = entry.value;
          return InkWell(
            onTap: onRowTap != null ? () => onRowTap!(index) : null,
            child: Container(
              padding:
                  const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
              decoration: BoxDecoration(
                border: Border(
                  bottom: BorderSide(
                    color: Theme.of(context).dividerColor,
                    width: 0.5,
                  ),
                ),
              ),
              child: Row(
                children: cells
                    .asMap()
                    .entries
                    .map((e) => Expanded(
                          flex: columns[e.key].flex,
                          child: e.value,
                        ))
                    .toList(),
              ),
            ),
          );
        }),
      ],
    );
  }
}
