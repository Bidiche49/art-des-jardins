import 'package:flutter/material.dart';

class AejTextarea extends StatelessWidget {
  const AejTextarea({
    super.key,
    this.controller,
    this.label,
    this.hint,
    this.errorText,
    this.onChanged,
    this.validator,
    this.enabled = true,
    this.minLines = 3,
    this.maxLines = 6,
  });

  final TextEditingController? controller;
  final String? label;
  final String? hint;
  final String? errorText;
  final ValueChanged<String>? onChanged;
  final String? Function(String?)? validator;
  final bool enabled;
  final int minLines;
  final int maxLines;

  @override
  Widget build(BuildContext context) {
    return TextFormField(
      controller: controller,
      decoration: InputDecoration(
        labelText: label,
        hintText: hint,
        errorText: errorText,
        border: const OutlineInputBorder(
          borderRadius: BorderRadius.all(Radius.circular(8)),
        ),
        alignLabelWithHint: true,
      ),
      onChanged: onChanged,
      validator: validator,
      enabled: enabled,
      minLines: minLines,
      maxLines: maxLines,
      keyboardType: TextInputType.multiline,
    );
  }
}
