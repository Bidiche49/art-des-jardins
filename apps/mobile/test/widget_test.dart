import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_test/flutter_test.dart';

import 'package:art_et_jardin/main.dart';

void main() {
  testWidgets('App renders Art & Jardin title', (WidgetTester tester) async {
    await tester.pumpWidget(
      const ProviderScope(child: ArtEtJardinApp()),
    );

    expect(find.text('Art & Jardin'), findsOneWidget);
  });

  testWidgets('App uses Material 3 green theme', (WidgetTester tester) async {
    await tester.pumpWidget(
      const ProviderScope(child: ArtEtJardinApp()),
    );

    final MaterialApp app = tester.widget(find.byType(MaterialApp));
    final theme = app.theme!;
    expect(theme.useMaterial3, isTrue);
    expect(theme.colorScheme.primary, isNotNull);
  });
}
