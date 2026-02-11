import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:intl/intl.dart';

import '../../../../domain/enums/absence_type.dart';
import '../../../../domain/models/absence.dart';
import '../../../auth/domain/auth_state.dart';
import '../../../auth/presentation/auth_notifier.dart';
import '../providers/calendar_providers.dart';

class AbsenceFormPage extends ConsumerStatefulWidget {
  const AbsenceFormPage({super.key});

  @override
  ConsumerState<AbsenceFormPage> createState() => _AbsenceFormPageState();
}

class _AbsenceFormPageState extends ConsumerState<AbsenceFormPage> {
  final _formKey = GlobalKey<FormState>();
  AbsenceType _type = AbsenceType.conge;
  DateTime _dateDebut = DateTime.now();
  DateTime _dateFin = DateTime.now();
  final _motifController = TextEditingController();
  bool _isSubmitting = false;

  @override
  void dispose() {
    _motifController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final dateFormat = DateFormat('dd/MM/yyyy');

    return Scaffold(
      appBar: AppBar(
        title: const Text('Nouvelle absence'),
      ),
      body: Form(
        key: _formKey,
        child: ListView(
          padding: const EdgeInsets.all(16),
          children: [
            Text(
              'Type d\'absence',
              style: Theme.of(context).textTheme.titleSmall,
            ),
            const SizedBox(height: 8),
            Wrap(
              spacing: 8,
              children: AbsenceType.values.map((type) {
                return ChoiceChip(
                  label: Text(type.label),
                  selected: _type == type,
                  onSelected: (selected) {
                    if (selected) setState(() => _type = type);
                  },
                );
              }).toList(),
            ),
            const SizedBox(height: 24),
            ListTile(
              contentPadding: EdgeInsets.zero,
              title: const Text('Date de debut'),
              subtitle: Text(dateFormat.format(_dateDebut)),
              trailing: const Icon(Icons.calendar_today),
              onTap: () async {
                final picked = await showDatePicker(
                  context: context,
                  initialDate: _dateDebut,
                  firstDate: DateTime.now(),
                  lastDate: DateTime.now().add(const Duration(days: 365)),
                );
                if (picked != null) {
                  setState(() {
                    _dateDebut = picked;
                    if (_dateFin.isBefore(_dateDebut)) {
                      _dateFin = _dateDebut;
                    }
                  });
                }
              },
            ),
            const Divider(),
            ListTile(
              contentPadding: EdgeInsets.zero,
              title: const Text('Date de fin'),
              subtitle: Text(dateFormat.format(_dateFin)),
              trailing: const Icon(Icons.calendar_today),
              onTap: () async {
                final picked = await showDatePicker(
                  context: context,
                  initialDate: _dateFin.isBefore(_dateDebut)
                      ? _dateDebut
                      : _dateFin,
                  firstDate: _dateDebut,
                  lastDate: DateTime.now().add(const Duration(days: 365)),
                );
                if (picked != null) {
                  setState(() => _dateFin = picked);
                }
              },
            ),
            const SizedBox(height: 16),
            Text(
              '${_dateFin.difference(_dateDebut).inDays + 1} jour(s)',
              style: Theme.of(context).textTheme.bodySmall?.copyWith(
                    color: Colors.grey,
                  ),
            ),
            const SizedBox(height: 16),
            TextFormField(
              controller: _motifController,
              decoration: const InputDecoration(
                labelText: 'Motif (optionnel)',
                border: OutlineInputBorder(),
              ),
              maxLines: 3,
            ),
            const SizedBox(height: 24),
            FilledButton(
              onPressed: _isSubmitting ? null : _submit,
              child: _isSubmitting
                  ? const SizedBox(
                      height: 20,
                      width: 20,
                      child: CircularProgressIndicator(strokeWidth: 2),
                    )
                  : const Text('Demander l\'absence'),
            ),
          ],
        ),
      ),
    );
  }

  Future<void> _submit() async {
    if (!_formKey.currentState!.validate()) return;
    if (_dateFin.isBefore(_dateDebut)) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('La date de fin doit etre apres la date de debut'),
        ),
      );
      return;
    }

    setState(() => _isSubmitting = true);

    final authState = ref.read(authNotifierProvider);
    final userId = authState is AuthAuthenticated ? authState.user.id : '';
    final now = DateTime.now();

    final absence = Absence(
      id: 'temp-${now.millisecondsSinceEpoch}',
      userId: userId,
      dateDebut: _dateDebut,
      dateFin: _dateFin,
      type: _type,
      motif: _motifController.text.isEmpty ? null : _motifController.text,
      createdAt: now,
      updatedAt: now,
    );

    try {
      await ref.read(absencesNotifierProvider.notifier).createAbsence(absence);
      if (mounted) context.pop();
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Erreur: $e')),
        );
      }
    } finally {
      if (mounted) setState(() => _isSubmitting = false);
    }
  }
}
