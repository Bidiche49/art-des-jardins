import 'package:flutter/material.dart';

import '../../../../core/utils/validators.dart';
import '../../../../domain/enums/client_type.dart';
import '../../../../domain/models/client.dart';

class ClientForm extends StatefulWidget {
  const ClientForm({
    super.key,
    this.client,
    required this.onSubmit,
    this.isLoading = false,
  });

  final Client? client;
  final void Function(Client client) onSubmit;
  final bool isLoading;

  @override
  State<ClientForm> createState() => _ClientFormState();
}

class _ClientFormState extends State<ClientForm> {
  final _formKey = GlobalKey<FormState>();

  late ClientType _type;
  late final TextEditingController _nomCtrl;
  late final TextEditingController _prenomCtrl;
  late final TextEditingController _raisonSocialeCtrl;
  late final TextEditingController _emailCtrl;
  late final TextEditingController _telephoneCtrl;
  late final TextEditingController _telephoneSecCtrl;
  late final TextEditingController _adresseCtrl;
  late final TextEditingController _codePostalCtrl;
  late final TextEditingController _villeCtrl;
  late final TextEditingController _notesCtrl;

  bool get _isEditMode => widget.client != null;

  @override
  void initState() {
    super.initState();
    final c = widget.client;
    _type = c?.type ?? ClientType.particulier;
    _nomCtrl = TextEditingController(text: c?.nom ?? '');
    _prenomCtrl = TextEditingController(text: c?.prenom ?? '');
    _raisonSocialeCtrl = TextEditingController(text: c?.raisonSociale ?? '');
    _emailCtrl = TextEditingController(text: c?.email ?? '');
    _telephoneCtrl = TextEditingController(text: c?.telephone ?? '');
    _telephoneSecCtrl = TextEditingController(text: c?.telephoneSecondaire ?? '');
    _adresseCtrl = TextEditingController(text: c?.adresse ?? '');
    _codePostalCtrl = TextEditingController(text: c?.codePostal ?? '');
    _villeCtrl = TextEditingController(text: c?.ville ?? '');
    _notesCtrl = TextEditingController(text: c?.notes ?? '');
  }

  @override
  void dispose() {
    _nomCtrl.dispose();
    _prenomCtrl.dispose();
    _raisonSocialeCtrl.dispose();
    _emailCtrl.dispose();
    _telephoneCtrl.dispose();
    _telephoneSecCtrl.dispose();
    _adresseCtrl.dispose();
    _codePostalCtrl.dispose();
    _villeCtrl.dispose();
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
          // Type selector
          Text('Type de client',
              style: Theme.of(context).textTheme.titleSmall),
          const SizedBox(height: 8),
          Wrap(
            spacing: 8,
            children: ClientType.values.map((type) {
              return ChoiceChip(
                label: Text(type.label),
                selected: _type == type,
                onSelected: (_) => setState(() => _type = type),
              );
            }).toList(),
          ),
          const SizedBox(height: 16),

          // Nom
          TextFormField(
            controller: _nomCtrl,
            decoration: const InputDecoration(labelText: 'Nom *'),
            validator: Validators.required,
            textInputAction: TextInputAction.next,
          ),
          const SizedBox(height: 12),

          // Prenom (particulier only)
          if (_type == ClientType.particulier)
            TextFormField(
              controller: _prenomCtrl,
              decoration: const InputDecoration(labelText: 'Prenom'),
              textInputAction: TextInputAction.next,
            ),

          // Raison sociale (pro/syndic only)
          if (_type != ClientType.particulier)
            TextFormField(
              controller: _raisonSocialeCtrl,
              decoration: const InputDecoration(labelText: 'Raison sociale'),
              textInputAction: TextInputAction.next,
            ),

          const SizedBox(height: 12),

          // Email
          TextFormField(
            controller: _emailCtrl,
            decoration: const InputDecoration(labelText: 'Email *'),
            validator: Validators.email,
            keyboardType: TextInputType.emailAddress,
            textInputAction: TextInputAction.next,
          ),
          const SizedBox(height: 12),

          // Telephone
          TextFormField(
            controller: _telephoneCtrl,
            decoration: const InputDecoration(labelText: 'Telephone *'),
            validator: Validators.phoneFR,
            keyboardType: TextInputType.phone,
            textInputAction: TextInputAction.next,
          ),
          const SizedBox(height: 12),

          // Telephone secondaire
          TextFormField(
            controller: _telephoneSecCtrl,
            decoration:
                const InputDecoration(labelText: 'Telephone secondaire'),
            keyboardType: TextInputType.phone,
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

    final now = DateTime.now();
    final client = Client(
      id: widget.client?.id ?? '',
      type: _type,
      nom: _nomCtrl.text.trim(),
      prenom:
          _type == ClientType.particulier ? _prenomCtrl.text.trim() : null,
      raisonSociale:
          _type != ClientType.particulier ? _raisonSocialeCtrl.text.trim() : null,
      email: _emailCtrl.text.trim(),
      telephone: _telephoneCtrl.text.trim(),
      telephoneSecondaire: _telephoneSecCtrl.text.trim().isEmpty
          ? null
          : _telephoneSecCtrl.text.trim(),
      adresse: _adresseCtrl.text.trim(),
      codePostal: _codePostalCtrl.text.trim(),
      ville: _villeCtrl.text.trim(),
      notes: _notesCtrl.text.trim().isEmpty ? null : _notesCtrl.text.trim(),
      tags: widget.client?.tags ?? [],
      createdAt: widget.client?.createdAt ?? now,
      updatedAt: now,
    );

    widget.onSubmit(client);
  }
}
