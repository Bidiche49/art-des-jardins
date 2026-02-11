import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

import 'package:art_et_jardin/features/scanner/presentation/widgets/scanner_overlay.dart';

void main() {
  group('ScannerOverlay', () {
    testWidgets('renders overlay widget', (tester) async {
      await tester.pumpWidget(
        const MaterialApp(
          home: Scaffold(
            body: SizedBox(
              width: 400,
              height: 600,
              child: ScannerOverlay(),
            ),
          ),
        ),
      );

      expect(find.byType(ScannerOverlay), findsOneWidget);
    });
  });
}
