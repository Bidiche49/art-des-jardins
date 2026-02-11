import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

import 'package:art_et_jardin/features/signature/presentation/widgets/signature_pad.dart';

Widget _wrap(Widget child) => MaterialApp(home: Scaffold(body: child));

void main() {
  group('SignaturePad', () {
    testWidgets('affiche placeholder quand vide', (tester) async {
      await tester.pumpWidget(_wrap(const SignaturePad()));
      expect(find.text('Dessinez votre signature ici'), findsOneWidget);
    });

    testWidgets('affiche titre', (tester) async {
      await tester.pumpWidget(_wrap(const SignaturePad()));
      expect(find.text('Votre signature'), findsOneWidget);
    });

    testWidgets('state isEmpty est true au debut', (tester) async {
      final key = GlobalKey<SignaturePadState>();
      await tester.pumpWidget(_wrap(SignaturePad(key: key)));

      expect(key.currentState!.isEmpty, true);
    });

    testWidgets('clear remet isEmpty a true', (tester) async {
      final key = GlobalKey<SignaturePadState>();
      bool? callbackEmpty;
      await tester.pumpWidget(_wrap(SignaturePad(
        key: key,
        onSignatureChange: (empty, _) => callbackEmpty = empty,
      )));

      // Manually call clear (simulates a cleared state)
      key.currentState!.clear();
      await tester.pump();

      expect(key.currentState!.isEmpty, true);
      expect(callbackEmpty, true);
    });

    testWidgets('toPngBytes retourne null si vide', (tester) async {
      final key = GlobalKey<SignaturePadState>();
      await tester.pumpWidget(_wrap(SignaturePad(key: key)));

      final bytes = await key.currentState!.toPngBytes();
      expect(bytes, isNull);
    });

    testWidgets('pas de bouton clear quand vide', (tester) async {
      await tester.pumpWidget(_wrap(const SignaturePad()));
      expect(find.byIcon(Icons.clear), findsNothing);
    });

    testWidgets('desactive quand disabled - pas de callbacks pan', (tester) async {
      bool changed = false;
      await tester.pumpWidget(_wrap(SignaturePad(
        disabled: true,
        onSignatureChange: (_, _) => changed = true,
      )));

      // Try to interact - since disabled, pan handlers are null
      // Even with gesture, nothing should happen
      final finder = find.byType(SignaturePad);
      final center = tester.getCenter(finder);
      final gesture = await tester.startGesture(center);
      await gesture.moveBy(const Offset(100, 30));
      await gesture.up();
      await tester.pump();

      expect(changed, false);
    });
  });
}
