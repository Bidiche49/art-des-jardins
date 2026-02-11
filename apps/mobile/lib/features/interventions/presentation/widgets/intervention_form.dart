import 'package:flutter/material.dart';

import '../../../../domain/models/chantier.dart';
import '../../../../domain/models/intervention.dart';

class InterventionForm extends StatefulWidget {
  const InterventionForm({
    super.key,
    this.intervention,
    required this.chantiers,
    required this.onSubmit,
    this.isLoading = false,
    this.initialDate,
  });

  final Intervention? intervention;
  final List<Chantier> chantiers;
  final void Function(Intervention intervention) onSubmit;
  final bool isLoading;
  final DateTime? initialDate;

  @override
  State<InterventionForm> createState() => _InterventionFormState();
}

class _InterventionFormState extends State<InterventionForm> {
  final _formKey = GlobalKey<FormState>();

  late String? _chantierId;
  late final TextEditingController _descriptionCtrl;
  late final TextEditingController _notesCtrl;
  late final TextEditingController _dureeCtrl;
  DateTime? _date;
  TimeOfDay? _heureDebut;
  TimeOfDay? _heureFin;

  bool get _isEditMode => widget.intervention != null;

  @override
  void initState() {
    super.initState();
    final i = widget.intervention;
    _chantierId = i?.chantierId;
    _descriptionCtrl = TextEditingController(text: i?.description ?? '');
    _notesCtrl = TextEditingController(text: i?.notes ?? '');
    _dureeCtrl =
        TextEditingController(text: i?.dureeMinutes?.toString() ?? '');
    _date = i?.date ?? widget.initialDate;
    _heureDebut = i != null
        ? TimeOfDay(hour: i.heureDebut.hour, minute: i.heureDebut.minute)
        : null;
    _heureFin = i?.heureFin != null
        ? TimeOfDay(hour: i!.heureFin!.hour, minute: i.heureFin!.minute)
        : null;
  }

  @override
  void dispose() {
    _descriptionCtrl.dispose();
    _notesCtrl.dispose();
    _dureeCtrl.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Form(
      key: _formKey,
      child: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          // Chantier selector
          DropdownButtonFormField<String>(
            initialValue: _chantierId,
            decoration: const InputDecoration(labelText: 'Chantier *'),
            validator: (v) =>
                v == null || v.isEmpty ? 'Ce champ est requis' : null,
            items: widget.chantiers
                .map((c) => DropdownMenuItem(
                      value: c.id,
                      child: Text(c.description),
                    ))
                .toList(),
            onChanged: (v) => setState(() => _chantierId = v),
          ),
          const SizedBox(height: 12),

          // Date
          _DateField(
            label: 'Date *',
            value: _date,
            onChanged: (d) => setState(() => _date = d),
            validator: (d) => d == null ? 'Ce champ est requis' : null,
          ),
          const SizedBox(height: 12),

          // Heure debut
          _TimeField(
            label: 'Heure de debut *',
            value: _heureDebut,
            onChanged: (t) => setState(() => _heureDebut = t),
            validator: (t) => t == null ? 'Ce champ est requis' : null,
          ),
          const SizedBox(height: 12),

          // Heure fin
          _TimeField(
            label: 'Heure de fin',
            value: _heureFin,
            onChanged: (t) => setState(() => _heureFin = t),
          ),
          const SizedBox(height: 12),

          // Duree
          TextFormField(
            controller: _dureeCtrl,
            decoration: const InputDecoration(
              labelText: 'Duree (minutes)',
              suffixText: 'min',
            ),
            keyboardType: TextInputType.number,
            textInputAction: TextInputAction.next,
          ),
          const SizedBox(height: 12),

          // Description
          TextFormField(
            controller: _descriptionCtrl,
            decoration: const InputDecoration(labelText: 'Description'),
            maxLines: 3,
            textInputAction: TextInputAction.next,
          ),
          const SizedBox(height: 12),

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
    if (_date == null || _heureDebut == null) return;

    final now = DateTime.now();
    final heureDebutDt = DateTime(
      _date!.year,
      _date!.month,
      _date!.day,
      _heureDebut!.hour,
      _heureDebut!.minute,
    );
    final heureFinDt = _heureFin != null
        ? DateTime(
            _date!.year,
            _date!.month,
            _date!.day,
            _heureFin!.hour,
            _heureFin!.minute,
          )
        : null;

    final intervention = Intervention(
      id: widget.intervention?.id ?? '',
      chantierId: _chantierId!,
      employeId: widget.intervention?.employeId ?? '',
      date: _date!,
      heureDebut: heureDebutDt,
      heureFin: heureFinDt,
      dureeMinutes: _dureeCtrl.text.trim().isNotEmpty
          ? int.tryParse(_dureeCtrl.text.trim())
          : null,
      description: _descriptionCtrl.text.trim().isEmpty
          ? null
          : _descriptionCtrl.text.trim(),
      notes: _notesCtrl.text.trim().isEmpty ? null : _notesCtrl.text.trim(),
      photos: widget.intervention?.photos ?? [],
      valide: widget.intervention?.valide ?? false,
      createdAt: widget.intervention?.createdAt ?? now,
      updatedAt: now,
    );

    widget.onSubmit(intervention);
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

class _TimeField extends StatelessWidget {
  const _TimeField({
    required this.label,
    required this.value,
    required this.onChanged,
    this.validator,
  });

  final String label;
  final TimeOfDay? value;
  final void Function(TimeOfDay?) onChanged;
  final String? Function(TimeOfDay?)? validator;

  @override
  Widget build(BuildContext context) {
    final controller = TextEditingController(
      text: value != null
          ? '${value!.hour.toString().padLeft(2, '0')}:${value!.minute.toString().padLeft(2, '0')}'
          : '',
    );

    return TextFormField(
      controller: controller,
      decoration: InputDecoration(
        labelText: label,
        suffixIcon: const Icon(Icons.access_time),
      ),
      readOnly: true,
      onTap: () async {
        final picked = await showTimePicker(
          context: context,
          initialTime: value ?? TimeOfDay.now(),
        );
        if (picked != null) {
          onChanged(picked);
        }
      },
      validator: (_) => validator?.call(value),
    );
  }
}
