import 'package:flutter/material.dart';

import '../../../../core/utils/validators.dart';
import '../../../../domain/enums/chantier_statut.dart';
import '../../../../domain/enums/type_prestation.dart';
import '../../../../domain/models/chantier.dart';
import '../../../../domain/models/client.dart';

class ChantierForm extends StatefulWidget {
  const ChantierForm({
    super.key,
    this.chantier,
    required this.clients,
    required this.onSubmit,
    this.isLoading = false,
  });

  final Chantier? chantier;
  final List<Client> clients;
  final void Function(Chantier chantier) onSubmit;
  final bool isLoading;

  @override
  State<ChantierForm> createState() => _ChantierFormState();
}

class _ChantierFormState extends State<ChantierForm> {
  final _formKey = GlobalKey<FormState>();

  late String? _clientId;
  late ChantierStatut _statut;
  late Set<TypePrestation> _selectedPrestations;
  late final TextEditingController _adresseCtrl;
  late final TextEditingController _codePostalCtrl;
  late final TextEditingController _villeCtrl;
  late final TextEditingController _descriptionCtrl;
  late final TextEditingController _surfaceCtrl;
  late final TextEditingController _notesCtrl;
  DateTime? _dateDebut;
  DateTime? _dateFin;

  bool get _isEditMode => widget.chantier != null;

  @override
  void initState() {
    super.initState();
    final c = widget.chantier;
    _clientId = c?.clientId;
    _statut = c?.statut ?? ChantierStatut.lead;
    _selectedPrestations = Set<TypePrestation>.from(c?.typePrestation ?? []);
    _adresseCtrl = TextEditingController(text: c?.adresse ?? '');
    _codePostalCtrl = TextEditingController(text: c?.codePostal ?? '');
    _villeCtrl = TextEditingController(text: c?.ville ?? '');
    _descriptionCtrl = TextEditingController(text: c?.description ?? '');
    _surfaceCtrl =
        TextEditingController(text: c?.surface?.toString() ?? '');
    _notesCtrl = TextEditingController(text: c?.notes ?? '');
    _dateDebut = c?.dateDebut;
    _dateFin = c?.dateFin;
  }

  @override
  void dispose() {
    _adresseCtrl.dispose();
    _codePostalCtrl.dispose();
    _villeCtrl.dispose();
    _descriptionCtrl.dispose();
    _surfaceCtrl.dispose();
    _notesCtrl.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Form(
      key: _formKey,
      child: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          // Client selector
          DropdownButtonFormField<String>(
            initialValue: _clientId,
            decoration: const InputDecoration(labelText: 'Client *'),
            validator: (v) =>
                v == null || v.isEmpty ? 'Ce champ est requis' : null,
            items: widget.clients
                .map((c) => DropdownMenuItem(
                      value: c.id,
                      child: Text(c.nom),
                    ))
                .toList(),
            onChanged: (v) => setState(() => _clientId = v),
          ),
          const SizedBox(height: 12),

          // Description
          TextFormField(
            controller: _descriptionCtrl,
            decoration: const InputDecoration(labelText: 'Description *'),
            validator: Validators.required,
            textInputAction: TextInputAction.next,
          ),
          const SizedBox(height: 12),

          // Adresse
          TextFormField(
            controller: _adresseCtrl,
            decoration: const InputDecoration(labelText: 'Adresse *'),
            validator: Validators.required,
            textInputAction: TextInputAction.next,
          ),
          const SizedBox(height: 12),

          // Code postal
          TextFormField(
            controller: _codePostalCtrl,
            decoration: const InputDecoration(labelText: 'Code postal *'),
            validator: Validators.postalCode,
            keyboardType: TextInputType.number,
            textInputAction: TextInputAction.next,
          ),
          const SizedBox(height: 12),

          // Ville
          TextFormField(
            controller: _villeCtrl,
            decoration: const InputDecoration(labelText: 'Ville *'),
            validator: Validators.required,
            textInputAction: TextInputAction.next,
          ),
          const SizedBox(height: 16),

          // Type prestation multi-select
          Text('Types de prestation',
              style: Theme.of(context).textTheme.titleSmall),
          const SizedBox(height: 8),
          Wrap(
            spacing: 8,
            runSpacing: 4,
            children: TypePrestation.values.map((type) {
              return FilterChip(
                label: Text(type.label),
                selected: _selectedPrestations.contains(type),
                onSelected: (selected) {
                  setState(() {
                    if (selected) {
                      _selectedPrestations.add(type);
                    } else {
                      _selectedPrestations.remove(type);
                    }
                  });
                },
              );
            }).toList(),
          ),
          const SizedBox(height: 16),

          // Surface
          TextFormField(
            controller: _surfaceCtrl,
            decoration: const InputDecoration(
              labelText: 'Surface (m²)',
              suffixText: 'm²',
            ),
            keyboardType: TextInputType.number,
            textInputAction: TextInputAction.next,
          ),
          const SizedBox(height: 16),

          // Date debut
          _DateField(
            label: 'Date de debut',
            value: _dateDebut,
            onChanged: (d) => setState(() => _dateDebut = d),
          ),
          const SizedBox(height: 12),

          // Date fin
          _DateField(
            label: 'Date de fin',
            value: _dateFin,
            onChanged: (d) => setState(() => _dateFin = d),
            validator: (d) {
              if (d != null && _dateDebut != null && d.isBefore(_dateDebut!)) {
                return 'La date de fin doit etre apres la date de debut';
              }
              return null;
            },
          ),
          const SizedBox(height: 16),

          // Statut (edit mode only)
          if (_isEditMode) ...[
            Text('Statut', style: Theme.of(context).textTheme.titleSmall),
            const SizedBox(height: 8),
            DropdownButtonFormField<ChantierStatut>(
              initialValue: _statut,
              decoration: const InputDecoration(labelText: 'Statut'),
              items: ChantierStatut.values
                  .map((s) => DropdownMenuItem(
                        value: s,
                        child: Text(s.label),
                      ))
                  .toList(),
              onChanged: (v) {
                if (v != null) setState(() => _statut = v);
              },
            ),
            const SizedBox(height: 16),
          ],

          // Notes
          TextFormField(
            controller: _notesCtrl,
            decoration: const InputDecoration(labelText: 'Notes'),
            maxLines: 3,
            textInputAction: TextInputAction.done,
          ),
          const SizedBox(height: 24),

          // Submit
          SizedBox(
            width: double.infinity,
            child: FilledButton(
              onPressed: widget.isLoading ? null : _submit,
              child: widget.isLoading
                  ? const SizedBox(
                      width: 20,
                      height: 20,
                      child: CircularProgressIndicator(strokeWidth: 2),
                    )
                  : Text(_isEditMode ? 'Modifier' : 'Creer'),
            ),
          ),
        ],
      ),
    );
  }

  void _submit() {
    if (!_formKey.currentState!.validate()) return;

    // Validate date fin >= date debut
    if (_dateFin != null && _dateDebut != null && _dateFin!.isBefore(_dateDebut!)) {
      return;
    }

    final now = DateTime.now();
    final chantier = Chantier(
      id: widget.chantier?.id ?? '',
      clientId: _clientId!,
      adresse: _adresseCtrl.text.trim(),
      codePostal: _codePostalCtrl.text.trim(),
      ville: _villeCtrl.text.trim(),
      description: _descriptionCtrl.text.trim(),
      typePrestation: _selectedPrestations.toList(),
      surface: _surfaceCtrl.text.trim().isNotEmpty
          ? double.tryParse(_surfaceCtrl.text.trim())
          : null,
      statut: _statut,
      dateDebut: _dateDebut,
      dateFin: _dateFin,
      notes:
          _notesCtrl.text.trim().isEmpty ? null : _notesCtrl.text.trim(),
      photos: widget.chantier?.photos ?? [],
      createdAt: widget.chantier?.createdAt ?? now,
      updatedAt: now,
    );

    widget.onSubmit(chantier);
  }
}

class _DateField extends StatelessWidget {
  const _DateField({
    required this.label,
    required this.value,
    required this.onChanged,
    this.validator,
  });

  final String label;
  final DateTime? value;
  final void Function(DateTime?) onChanged;
  final String? Function(DateTime?)? validator;

  @override
  Widget build(BuildContext context) {
    final controller = TextEditingController(
      text: value != null
          ? '${value!.day.toString().padLeft(2, '0')}/${value!.month.toString().padLeft(2, '0')}/${value!.year}'
          : '',
    );

    return TextFormField(
      controller: controller,
      decoration: InputDecoration(
        labelText: label,
        suffixIcon: const Icon(Icons.calendar_today),
      ),
      readOnly: true,
      onTap: () async {
        final picked = await showDatePicker(
          context: context,
          initialDate: value ?? DateTime.now(),
          firstDate: DateTime(2020),
          lastDate: DateTime(2030),
        );
        if (picked != null) {
          onChanged(picked);
        }
      },
      validator: (_) => validator?.call(value),
    );
  }
}
