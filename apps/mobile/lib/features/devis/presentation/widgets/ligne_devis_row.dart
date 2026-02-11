import 'package:flutter/material.dart';

import '../../../../domain/models/ligne_devis.dart';

class LigneDevisRow extends StatefulWidget {
  const LigneDevisRow({
    super.key,
    required this.ligne,
    required this.index,
    required this.onUpdate,
    required this.onRemove,
  });

  final LigneDevis ligne;
  final int index;
  final void Function(int index, LigneDevis ligne) onUpdate;
  final void Function(int index) onRemove;

  @override
  State<LigneDevisRow> createState() => _LigneDevisRowState();
}

class _LigneDevisRowState extends State<LigneDevisRow> {
  late TextEditingController _descController;
  late TextEditingController _qteController;
  late TextEditingController _uniteController;
  late TextEditingController _prixController;
  late TextEditingController _tvaController;

  @override
  void initState() {
    super.initState();
    _descController = TextEditingController(text: widget.ligne.description);
    _qteController =
        TextEditingController(text: widget.ligne.quantite.toString());
    _uniteController = TextEditingController(text: widget.ligne.unite);
    _prixController =
        TextEditingController(text: widget.ligne.prixUnitaireHT.toString());
    _tvaController = TextEditingController(text: widget.ligne.tva.toString());
  }

  @override
  void didUpdateWidget(LigneDevisRow oldWidget) {
    super.didUpdateWidget(oldWidget);
    if (oldWidget.ligne.id != widget.ligne.id) {
      _descController.text = widget.ligne.description;
      _qteController.text = widget.ligne.quantite.toString();
      _uniteController.text = widget.ligne.unite;
      _prixController.text = widget.ligne.prixUnitaireHT.toString();
      _tvaController.text = widget.ligne.tva.toString();
    }
  }

  @override
  void dispose() {
    _descController.dispose();
    _qteController.dispose();
    _uniteController.dispose();
    _prixController.dispose();
    _tvaController.dispose();
    super.dispose();
  }

  void _notifyUpdate() {
    final updated = widget.ligne.copyWith(
      description: _descController.text,
      quantite: double.tryParse(_qteController.text) ?? 0,
      unite: _uniteController.text,
      prixUnitaireHT: double.tryParse(_prixController.text) ?? 0,
      tva: double.tryParse(_tvaController.text) ?? 20,
    );
    widget.onUpdate(widget.index, updated);
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final montantHT = widget.ligne.montantHT;

    return Card(
      margin: const EdgeInsets.symmetric(vertical: 4),
      child: Padding(
        padding: const EdgeInsets.all(12),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                Text(
                  'Ligne ${widget.index + 1}',
                  style: theme.textTheme.titleSmall,
                ),
                const Spacer(),
                Text(
                  '${montantHT.toStringAsFixed(2)} \u20ac HT',
                  style: theme.textTheme.titleSmall?.copyWith(
                    fontWeight: FontWeight.bold,
                    color: theme.colorScheme.primary,
                  ),
                ),
                const SizedBox(width: 8),
                IconButton(
                  icon: const Icon(Icons.delete_outline, size: 20),
                  onPressed: () => widget.onRemove(widget.index),
                  color: theme.colorScheme.error,
                  iconSize: 20,
                  visualDensity: VisualDensity.compact,
                ),
              ],
            ),
            const SizedBox(height: 8),
            TextFormField(
              controller: _descController,
              decoration: const InputDecoration(
                labelText: 'Description',
                isDense: true,
              ),
              onChanged: (_) => _notifyUpdate(),
            ),
            const SizedBox(height: 8),
            Row(
              children: [
                Expanded(
                  flex: 2,
                  child: TextFormField(
                    controller: _qteController,
                    decoration: const InputDecoration(
                      labelText: 'Qté',
                      isDense: true,
                    ),
                    keyboardType: TextInputType.number,
                    onChanged: (_) => _notifyUpdate(),
                  ),
                ),
                const SizedBox(width: 8),
                Expanded(
                  flex: 2,
                  child: TextFormField(
                    controller: _uniteController,
                    decoration: const InputDecoration(
                      labelText: 'Unité',
                      isDense: true,
                    ),
                    onChanged: (_) => _notifyUpdate(),
                  ),
                ),
                const SizedBox(width: 8),
                Expanded(
                  flex: 3,
                  child: TextFormField(
                    controller: _prixController,
                    decoration: const InputDecoration(
                      labelText: 'Prix HT',
                      isDense: true,
                      suffixText: '\u20ac',
                    ),
                    keyboardType: TextInputType.number,
                    onChanged: (_) => _notifyUpdate(),
                  ),
                ),
                const SizedBox(width: 8),
                Expanded(
                  flex: 2,
                  child: TextFormField(
                    controller: _tvaController,
                    decoration: const InputDecoration(
                      labelText: 'TVA %',
                      isDense: true,
                    ),
                    keyboardType: TextInputType.number,
                    onChanged: (_) => _notifyUpdate(),
                  ),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }
}
