import 'dart:async';

import 'package:flutter/material.dart';

class AejSearchInput extends StatefulWidget {
  const AejSearchInput({
    super.key,
    required this.onChanged,
    this.hint = 'Rechercher...',
    this.debounceDuration = const Duration(milliseconds: 300),
  });

  final ValueChanged<String> onChanged;
  final String hint;
  final Duration debounceDuration;

  @override
  State<AejSearchInput> createState() => AejSearchInputState();
}

class AejSearchInputState extends State<AejSearchInput> {
  final _controller = TextEditingController();
  Timer? _debounce;

  @override
  void dispose() {
    _debounce?.cancel();
    _controller.dispose();
    super.dispose();
  }

  void _onChanged(String value) {
    _debounce?.cancel();
    _debounce = Timer(widget.debounceDuration, () {
      widget.onChanged(value);
    });
    setState(() {});
  }

  void clear() {
    _controller.clear();
    _debounce?.cancel();
    widget.onChanged('');
    setState(() {});
  }

  @override
  Widget build(BuildContext context) {
    return TextField(
      controller: _controller,
      onChanged: _onChanged,
      decoration: InputDecoration(
        hintText: widget.hint,
        prefixIcon: const Icon(Icons.search),
        suffixIcon: _controller.text.isNotEmpty
            ? IconButton(
                icon: const Icon(Icons.clear),
                onPressed: clear,
              )
            : null,
        border: const OutlineInputBorder(
          borderRadius: BorderRadius.all(Radius.circular(8)),
        ),
      ),
    );
  }
}
