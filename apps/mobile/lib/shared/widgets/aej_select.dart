import 'package:flutter/material.dart';

class AejSelectItem<T> {
  const AejSelectItem({required this.value, required this.label});
  final T value;
  final String label;
}

class AejSelect<T> extends StatelessWidget {
  const AejSelect({
    super.key,
    required this.items,
    required this.onChanged,
    this.value,
    this.label,
    this.hint,
    this.errorText,
    this.enabled = true,
  });

  final List<AejSelectItem<T>> items;
  final ValueChanged<T?> onChanged;
  final T? value;
  final String? label;
  final String? hint;
  final String? errorText;
  final bool enabled;

  @override
  Widget build(BuildContext context) {
    return DropdownButtonFormField<T>(
      initialValue: value,
      items: items
          .map((item) => DropdownMenuItem<T>(
                value: item.value,
                child: Text(item.label),
              ))
          .toList(),
      onChanged: enabled ? onChanged : null,
      decoration: InputDecoration(
        labelText: label,
        hintText: hint,
        errorText: errorText,
        border: const OutlineInputBorder(
          borderRadius: BorderRadius.all(Radius.circular(8)),
        ),
      ),
    );
  }
}
