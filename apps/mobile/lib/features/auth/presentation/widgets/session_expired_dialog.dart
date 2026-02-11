import 'package:flutter/material.dart';

class SessionExpiredDialog extends StatelessWidget {
  const SessionExpiredDialog({super.key, this.onReconnect});

  final VoidCallback? onReconnect;

  static Future<void> show(BuildContext context, {VoidCallback? onReconnect}) {
    return showDialog<void>(
      context: context,
      barrierDismissible: false,
      builder: (_) => SessionExpiredDialog(onReconnect: onReconnect),
    );
  }

  @override
  Widget build(BuildContext context) {
    return AlertDialog(
      title: const Text('Session expiree'),
      content: const Text(
        'Votre session a expire. Veuillez vous reconnecter.',
      ),
      actions: [
        FilledButton(
          onPressed: () {
            Navigator.of(context).pop();
            onReconnect?.call();
          },
          child: const Text('Se reconnecter'),
        ),
      ],
    );
  }
}
