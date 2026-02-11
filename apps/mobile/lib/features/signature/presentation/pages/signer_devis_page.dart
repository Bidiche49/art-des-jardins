import 'dart:convert';

import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../domain/signature_service.dart';
import '../providers/signature_providers.dart';
import '../widgets/signature_pad.dart';

class SignerDevisPage extends ConsumerStatefulWidget {
  const SignerDevisPage({super.key, required this.token});

  final String token;

  @override
  ConsumerState<SignerDevisPage> createState() => _SignerDevisPageState();
}

class _SignerDevisPageState extends ConsumerState<SignerDevisPage> {
  final _signaturePadKey = GlobalKey<SignaturePadState>();
  bool _cgvAccepted = false;
  bool _signatureDrawn = false;

  bool get _canSubmit =>
      _cgvAccepted &&
      _signatureDrawn &&
      ref.read(signerDevisNotifierProvider(widget.token)).pageState ==
          SignaturePageState.ready;

  @override
  Widget build(BuildContext context) {
    final state = ref.watch(signerDevisNotifierProvider(widget.token));
    final theme = Theme.of(context);

    return Scaffold(
      body: SafeArea(
        child: _buildBody(state, theme),
      ),
    );
  }

  Widget _buildBody(SignerDevisState state, ThemeData theme) {
    switch (state.pageState) {
      case SignaturePageState.loading:
        return const Center(
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              CircularProgressIndicator(),
              SizedBox(height: 16),
              Text('Chargement du devis...'),
            ],
          ),
        );

      case SignaturePageState.error:
        return _buildErrorView(theme, state.error, 'Erreur');

      case SignaturePageState.expired:
        return _buildErrorView(theme, state.error, 'Lien expire');

      case SignaturePageState.alreadySigned:
        return _buildAlreadySignedView(theme, state);

      case SignaturePageState.success:
        return _buildSuccessView(theme);

      case SignaturePageState.ready:
      case SignaturePageState.signing:
        return _buildSignatureView(theme, state);
    }
  }

  Widget _buildErrorView(ThemeData theme, String? error, String title) {
    return Center(
      child: Padding(
        padding: const EdgeInsets.all(24),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Container(
              width: 64,
              height: 64,
              decoration: BoxDecoration(
                color: theme.colorScheme.errorContainer,
                shape: BoxShape.circle,
              ),
              child: Icon(Icons.close,
                  size: 32, color: theme.colorScheme.onErrorContainer),
            ),
            const SizedBox(height: 16),
            Text(title,
                style: theme.textTheme.headlineSmall
                    ?.copyWith(fontWeight: FontWeight.bold)),
            const SizedBox(height: 8),
            Text(
              error ?? 'Une erreur est survenue',
              textAlign: TextAlign.center,
              style: theme.textTheme.bodyMedium?.copyWith(
                color: theme.colorScheme.onSurfaceVariant,
              ),
            ),
            const SizedBox(height: 24),
            Text(
              'Si vous avez besoin d\'assistance, contactez-nous.',
              textAlign: TextAlign.center,
              style: theme.textTheme.bodySmall?.copyWith(
                color: theme.colorScheme.onSurfaceVariant,
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildAlreadySignedView(ThemeData theme, SignerDevisState state) {
    return SingleChildScrollView(
      padding: const EdgeInsets.all(24),
      child: Column(
        children: [
          Container(
            width: 64,
            height: 64,
            decoration: const BoxDecoration(
              color: Color(0xFFDCFCE7),
              shape: BoxShape.circle,
            ),
            child: const Icon(Icons.check, size: 32, color: Color(0xFF166534)),
          ),
          const SizedBox(height: 16),
          Text('Devis deja signe',
              style: theme.textTheme.headlineSmall
                  ?.copyWith(fontWeight: FontWeight.bold)),
          if (state.signedAt != null) ...[
            const SizedBox(height: 8),
            Text(
              'Signe le ${state.signedAt}',
              style: theme.textTheme.bodyMedium?.copyWith(
                color: theme.colorScheme.onSurfaceVariant,
              ),
            ),
          ],
          if (state.devisData != null) ...[
            const SizedBox(height: 24),
            _buildDevisReadOnly(theme, state.devisData!),
          ],
        ],
      ),
    );
  }

  Widget _buildSuccessView(ThemeData theme) {
    return SingleChildScrollView(
      padding: const EdgeInsets.all(24),
      child: Column(
        children: [
          const SizedBox(height: 32),
          Container(
            width: 80,
            height: 80,
            decoration: const BoxDecoration(
              color: Color(0xFFDCFCE7),
              shape: BoxShape.circle,
            ),
            child: const Icon(Icons.check, size: 40, color: Color(0xFF166534)),
          ),
          const SizedBox(height: 24),
          Text('Merci !',
              style: theme.textTheme.headlineMedium
                  ?.copyWith(fontWeight: FontWeight.bold)),
          const SizedBox(height: 12),
          Text(
            'Votre signature a bien ete enregistree.',
            style: theme.textTheme.bodyLarge?.copyWith(
              color: theme.colorScheme.onSurfaceVariant,
            ),
          ),
          const SizedBox(height: 8),
          Text(
            'Un email de confirmation vous a ete envoye.',
            style: theme.textTheme.bodyMedium?.copyWith(
              color: theme.colorScheme.onSurfaceVariant,
            ),
          ),
          const SizedBox(height: 32),
          Card(
            color: const Color(0xFFF0FDF4),
            child: Padding(
              padding: const EdgeInsets.all(16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text('Et maintenant ?',
                      style: theme.textTheme.titleMedium?.copyWith(
                        fontWeight: FontWeight.w600,
                        color: const Color(0xFF166534),
                      )),
                  const SizedBox(height: 12),
                  _buildStepItem(
                      'Vous allez recevoir un email de confirmation'),
                  _buildStepItem(
                      'Nous allons vous contacter pour planifier l\'intervention'),
                  _buildStepItem(
                      'Un acompte de 30% vous sera demande a la confirmation'),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildStepItem(String text) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 4),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Icon(Icons.check_circle, size: 20, color: Color(0xFF166534)),
          const SizedBox(width: 8),
          Expanded(
            child: Text(text,
                style: const TextStyle(
                    fontSize: 14, color: Color(0xFF166534))),
          ),
        ],
      ),
    );
  }

  Widget _buildSignatureView(ThemeData theme, SignerDevisState state) {
    final isSigning = state.pageState == SignaturePageState.signing;

    return SingleChildScrollView(
      padding: const EdgeInsets.all(24),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          Text(
            'Signez votre devis',
            style: theme.textTheme.headlineSmall
                ?.copyWith(fontWeight: FontWeight.bold),
            textAlign: TextAlign.center,
          ),
          const SizedBox(height: 8),
          Text(
            'Consultez le devis ci-dessous puis signez electroniquement',
            style: theme.textTheme.bodyMedium?.copyWith(
              color: theme.colorScheme.onSurfaceVariant,
            ),
            textAlign: TextAlign.center,
          ),
          const SizedBox(height: 16),

          if (state.error != null)
            Container(
              margin: const EdgeInsets.only(bottom: 16),
              padding: const EdgeInsets.all(12),
              decoration: BoxDecoration(
                color: theme.colorScheme.errorContainer,
                borderRadius: BorderRadius.circular(8),
              ),
              child: Text(
                state.error!,
                style: TextStyle(color: theme.colorScheme.onErrorContainer),
              ),
            ),

          // Devis read-only
          if (state.devisData != null)
            _buildDevisReadOnly(theme, state.devisData!),

          const SizedBox(height: 24),

          // Signature pad
          SignaturePad(
            key: _signaturePadKey,
            disabled: isSigning,
            onSignatureChange: (isEmpty, _) {
              setState(() => _signatureDrawn = !isEmpty);
            },
          ),

          const SizedBox(height: 24),

          // CGV checkbox
          Card(
            child: Padding(
              padding: const EdgeInsets.all(16),
              child: Row(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Checkbox(
                    value: _cgvAccepted,
                    onChanged: isSigning
                        ? null
                        : (v) => setState(() => _cgvAccepted = v ?? false),
                  ),
                  const SizedBox(width: 8),
                  Expanded(
                    child: GestureDetector(
                      onTap: isSigning
                          ? null
                          : () =>
                              setState(() => _cgvAccepted = !_cgvAccepted),
                      child: Text(
                        'J\'ai lu et j\'accepte les Conditions Generales de Vente. '
                        'Je confirme ma commande et m\'engage a regler le montant '
                        'indique selon les modalites prevues.',
                        style: theme.textTheme.bodySmall,
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ),

          const SizedBox(height: 24),

          // Submit button
          SizedBox(
            height: 56,
            child: FilledButton(
              onPressed: _canSubmit ? _onSubmit : null,
              child: isSigning
                  ? const SizedBox(
                      width: 24,
                      height: 24,
                      child: CircularProgressIndicator(
                        strokeWidth: 2,
                        color: Colors.white,
                      ),
                    )
                  : const Text('Signer le devis',
                      style: TextStyle(fontSize: 18)),
            ),
          ),

          const SizedBox(height: 16),
          Text(
            'Signature electronique conforme aux articles 1366 et 1367 du Code civil.\n'
            'Votre adresse IP et la date seront enregistrees.',
            textAlign: TextAlign.center,
            style: theme.textTheme.bodySmall?.copyWith(
              color: theme.colorScheme.onSurfaceVariant,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildDevisReadOnly(ThemeData theme, SignatureDevisData data) {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                Icon(Icons.description_outlined,
                    color: theme.colorScheme.primary),
                const SizedBox(width: 8),
                Text('Devis ${data.numero}',
                    style: theme.textTheme.titleMedium
                        ?.copyWith(fontWeight: FontWeight.w600)),
              ],
            ),
            if (data.clientNom.isNotEmpty) ...[
              const SizedBox(height: 8),
              Text('Client : ${data.clientNom}',
                  style: theme.textTheme.bodyMedium),
            ],
            const Divider(height: 24),

            // Lignes
            if (data.lignes.isNotEmpty) ...[
              Text('Lignes du devis',
                  style: theme.textTheme.titleSmall
                      ?.copyWith(fontWeight: FontWeight.w600)),
              const SizedBox(height: 8),
              ...data.lignes.map((l) {
                final desc = l['description'] as String? ?? '';
                final qte = (l['quantite'] as num?)?.toDouble() ?? 0;
                final unite = l['unite'] as String? ?? '';
                final prix = (l['prixUnitaireHT'] as num?)?.toDouble() ?? 0;
                final tva = (l['tva'] as num?)?.toDouble() ?? 0;
                final montant = qte * prix;
                return Padding(
                  padding: const EdgeInsets.symmetric(vertical: 4),
                  child: Row(
                    children: [
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(desc, style: theme.textTheme.bodyMedium),
                            Text(
                              '$qte $unite x ${prix.toStringAsFixed(2)} \u20ac (TVA $tva%)',
                              style: theme.textTheme.bodySmall?.copyWith(
                                color: theme.colorScheme.onSurfaceVariant,
                              ),
                            ),
                          ],
                        ),
                      ),
                      Text(
                        '${montant.toStringAsFixed(2)} \u20ac',
                        style: theme.textTheme.bodyMedium
                            ?.copyWith(fontWeight: FontWeight.w600),
                      ),
                    ],
                  ),
                );
              }),
              const Divider(height: 24),
            ],

            // Totaux
            _buildTotauxRow(theme, 'Total HT', data.totalHT),
            _buildTotauxRow(theme, 'Total TVA', data.totalTVA),
            _buildTotauxRow(theme, 'Total TTC', data.totalTTC, bold: true),

            // Notes / conditions
            if (data.notes != null && data.notes!.isNotEmpty) ...[
              const Divider(height: 24),
              Text('Notes', style: theme.textTheme.titleSmall),
              const SizedBox(height: 4),
              Text(data.notes!, style: theme.textTheme.bodySmall),
            ],
            if (data.conditionsParticulieres != null &&
                data.conditionsParticulieres!.isNotEmpty) ...[
              const Divider(height: 24),
              Text('Conditions particulieres',
                  style: theme.textTheme.titleSmall),
              const SizedBox(height: 4),
              Text(data.conditionsParticulieres!,
                  style: theme.textTheme.bodySmall),
            ],
          ],
        ),
      ),
    );
  }

  Widget _buildTotauxRow(ThemeData theme, String label, double value,
      {bool bold = false}) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 2),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(label, style: theme.textTheme.bodyMedium),
          Text(
            '${value.toStringAsFixed(2)} \u20ac',
            style: theme.textTheme.bodyMedium?.copyWith(
              fontWeight: bold ? FontWeight.bold : null,
              color: bold ? theme.colorScheme.primary : null,
            ),
          ),
        ],
      ),
    );
  }

  Future<void> _onSubmit() async {
    final padState = _signaturePadKey.currentState;
    if (padState == null || padState.isEmpty) return;

    final pngBytes = await padState.toPngBytes();
    if (pngBytes == null) return;

    final base64Signature = base64Encode(pngBytes);

    ref.read(signerDevisNotifierProvider(widget.token).notifier).signDevis(
          signatureBase64: base64Signature,
          cgvAccepted: _cgvAccepted,
        );
  }
}
