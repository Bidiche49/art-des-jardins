import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

import 'package:art_et_jardin/shared/widgets/aej_button.dart';
import 'package:art_et_jardin/shared/widgets/aej_card.dart';
import 'package:art_et_jardin/shared/widgets/aej_modal.dart';
import 'package:art_et_jardin/shared/widgets/aej_input.dart';
import 'package:art_et_jardin/shared/widgets/aej_select.dart';
import 'package:art_et_jardin/shared/widgets/aej_textarea.dart';
import 'package:art_et_jardin/shared/widgets/aej_badge.dart';
import 'package:art_et_jardin/shared/widgets/aej_table.dart';
import 'package:art_et_jardin/shared/widgets/aej_pagination.dart';
import 'package:art_et_jardin/shared/widgets/aej_search_input.dart';
import 'package:art_et_jardin/shared/widgets/aej_spinner.dart';
import 'package:art_et_jardin/shared/widgets/aej_empty_state.dart';
import 'package:art_et_jardin/shared/widgets/aej_offline_banner.dart';
import 'package:art_et_jardin/shared/widgets/aej_connection_indicator.dart';

Widget _wrap(Widget child) => MaterialApp(home: Scaffold(body: child));

void main() {
  // ============== AejButton ==============
  group('AejButton', () {
    testWidgets('renders primary variant', (tester) async {
      await tester.pumpWidget(_wrap(
        AejButton(label: 'Click me', onPressed: () {}),
      ));
      expect(find.text('Click me'), findsOneWidget);
    });

    testWidgets('renders all 5 variants without crash', (tester) async {
      for (final variant in AejButtonVariant.values) {
        await tester.pumpWidget(_wrap(
          AejButton(
            label: variant.name,
            variant: variant,
            onPressed: () {},
          ),
        ));
        expect(find.text(variant.name), findsOneWidget);
      }
    });

    testWidgets('sm size has height 36', (tester) async {
      await tester.pumpWidget(_wrap(
        AejButton(label: 'Small', size: AejButtonSize.sm, onPressed: () {}),
      ));
      final box = tester.getSize(find.byType(AejButton));
      expect(box.height, 36);
    });

    testWidgets('md size has height 44', (tester) async {
      await tester.pumpWidget(_wrap(
        AejButton(label: 'Medium', size: AejButtonSize.md, onPressed: () {}),
      ));
      final box = tester.getSize(find.byType(AejButton));
      expect(box.height, 44);
    });

    testWidgets('lg size has height 48', (tester) async {
      await tester.pumpWidget(_wrap(
        AejButton(label: 'Large', size: AejButtonSize.lg, onPressed: () {}),
      ));
      final box = tester.getSize(find.byType(AejButton));
      expect(box.height, 48);
    });

    testWidgets('loading shows spinner and disables tap', (tester) async {
      var tapped = false;
      await tester.pumpWidget(_wrap(
        AejButton(
          label: 'Loading',
          isLoading: true,
          onPressed: () => tapped = true,
        ),
      ));
      expect(find.byType(CircularProgressIndicator), findsOneWidget);
      await tester.tap(find.byType(GestureDetector).first);
      expect(tapped, isFalse);
    });

    testWidgets('onPressed called on tap', (tester) async {
      var tapped = false;
      await tester.pumpWidget(_wrap(
        AejButton(label: 'Tap me', onPressed: () => tapped = true),
      ));
      await tester.tap(find.byType(GestureDetector).first);
      expect(tapped, isTrue);
    });

    testWidgets('onPressed NOT called when null', (tester) async {
      // Should not crash
      await tester.pumpWidget(_wrap(
        const AejButton(label: 'Disabled'),
      ));
      await tester.tap(find.byType(GestureDetector).first);
      await tester.pump();
    });

    testWidgets('icon left displayed', (tester) async {
      await tester.pumpWidget(_wrap(
        AejButton(
          label: 'Add',
          iconLeft: Icons.add,
          onPressed: () {},
        ),
      ));
      expect(find.byIcon(Icons.add), findsOneWidget);
    });

    testWidgets('icon right displayed', (tester) async {
      await tester.pumpWidget(_wrap(
        AejButton(
          label: 'Next',
          iconRight: Icons.arrow_forward,
          onPressed: () {},
        ),
      ));
      expect(find.byIcon(Icons.arrow_forward), findsOneWidget);
    });

    testWidgets('full width stretches button', (tester) async {
      await tester.pumpWidget(_wrap(
        AejButton(label: 'Full', fullWidth: true, onPressed: () {}),
      ));
      final size = tester.getSize(find.byType(AejButton));
      // Should be close to screen width (800 default test env)
      expect(size.width, greaterThan(400));
    });

    testWidgets('label text displayed correctly', (tester) async {
      await tester.pumpWidget(_wrap(
        AejButton(label: 'Valider le devis', onPressed: () {}),
      ));
      expect(find.text('Valider le devis'), findsOneWidget);
    });
  });

  // ============== AejCard ==============
  group('AejCard', () {
    testWidgets('renders with child', (tester) async {
      await tester.pumpWidget(_wrap(
        const AejCard(child: Text('Content')),
      ));
      expect(find.text('Content'), findsOneWidget);
    });

    testWidgets('clickable when onTap provided', (tester) async {
      var tapped = false;
      await tester.pumpWidget(_wrap(
        AejCard(child: const Text('Click'), onTap: () => tapped = true),
      ));
      await tester.tap(find.byType(InkWell).first);
      expect(tapped, isTrue);
    });

    testWidgets('no InkWell when onTap not provided', (tester) async {
      await tester.pumpWidget(_wrap(
        const AejCard(child: Text('No click')),
      ));
      expect(find.byType(InkWell), findsNothing);
    });

    testWidgets('header and footer shown', (tester) async {
      await tester.pumpWidget(_wrap(
        const AejCard(
          header: Text('Header'),
          footer: Text('Footer'),
          child: Text('Body'),
        ),
      ));
      expect(find.text('Header'), findsOneWidget);
      expect(find.text('Body'), findsOneWidget);
      expect(find.text('Footer'), findsOneWidget);
    });

    testWidgets('padding variants render', (tester) async {
      for (final p in AejCardPadding.values) {
        await tester.pumpWidget(_wrap(
          AejCard(padding: p, child: Text(p.name)),
        ));
        expect(find.text(p.name), findsOneWidget);
      }
    });

    testWidgets('elevation applies', (tester) async {
      await tester.pumpWidget(_wrap(
        const AejCard(elevation: 4, child: Text('Elevated')),
      ));
      final card = tester.widget<Card>(find.byType(Card));
      expect(card.elevation, 4);
    });
  });

  // ============== AejModal ==============
  group('AejModal', () {
    testWidgets('shows bottom sheet on narrow screen', (tester) async {
      // Default test screen is 800x600
      tester.view.physicalSize = const Size(400, 800);
      tester.view.devicePixelRatio = 1.0;
      addTearDown(tester.view.resetPhysicalSize);
      addTearDown(tester.view.resetDevicePixelRatio);

      await tester.pumpWidget(MaterialApp(
        home: Builder(
          builder: (ctx) => ElevatedButton(
            onPressed: () => AejModal.show(
              context: ctx,
              title: 'Bottom Sheet',
              content: const Text('Content'),
            ),
            child: const Text('Open'),
          ),
        ),
      ));
      await tester.tap(find.text('Open'));
      await tester.pumpAndSettle();

      expect(find.text('Bottom Sheet'), findsOneWidget);
      expect(find.text('Content'), findsOneWidget);
    });

    testWidgets('shows dialog on wide screen', (tester) async {
      tester.view.physicalSize = const Size(1200, 800);
      tester.view.devicePixelRatio = 1.0;
      addTearDown(tester.view.resetPhysicalSize);
      addTearDown(tester.view.resetDevicePixelRatio);

      await tester.pumpWidget(MaterialApp(
        home: Builder(
          builder: (ctx) => ElevatedButton(
            onPressed: () => AejModal.show(
              context: ctx,
              title: 'Dialog',
              content: const Text('Dialog Content'),
            ),
            child: const Text('Open'),
          ),
        ),
      ));
      await tester.tap(find.text('Open'));
      await tester.pumpAndSettle();

      expect(find.text('Dialog'), findsOneWidget);
      expect(find.byType(Dialog), findsOneWidget);
    });

    testWidgets('close button visible', (tester) async {
      await tester.pumpWidget(MaterialApp(
        home: Builder(
          builder: (ctx) => ElevatedButton(
            onPressed: () => AejModal.show(
              context: ctx,
              title: 'Modal',
              content: const Text('Body'),
            ),
            child: const Text('Open'),
          ),
        ),
      ));
      await tester.tap(find.text('Open'));
      await tester.pumpAndSettle();

      expect(find.byIcon(Icons.close), findsOneWidget);
    });

    testWidgets('title shown in header', (tester) async {
      await tester.pumpWidget(MaterialApp(
        home: Builder(
          builder: (ctx) => ElevatedButton(
            onPressed: () => AejModal.show(
              context: ctx,
              title: 'Mon titre',
              content: const Text('Body'),
            ),
            child: const Text('Open'),
          ),
        ),
      ));
      await tester.tap(find.text('Open'));
      await tester.pumpAndSettle();

      expect(find.text('Mon titre'), findsOneWidget);
    });

    testWidgets('actions shown in footer', (tester) async {
      await tester.pumpWidget(MaterialApp(
        home: Builder(
          builder: (ctx) => ElevatedButton(
            onPressed: () => AejModal.show(
              context: ctx,
              title: 'Actions',
              content: const Text('Body'),
              actions: [
                TextButton(onPressed: () {}, child: const Text('Annuler')),
                FilledButton(onPressed: () {}, child: const Text('Valider')),
              ],
            ),
            child: const Text('Open'),
          ),
        ),
      ));
      await tester.tap(find.text('Open'));
      await tester.pumpAndSettle();

      expect(find.text('Annuler'), findsOneWidget);
      expect(find.text('Valider'), findsOneWidget);
    });
  });

  // ============== AejInput ==============
  group('AejInput', () {
    testWidgets('label displayed', (tester) async {
      await tester.pumpWidget(_wrap(const AejInput(label: 'Email')));
      expect(find.text('Email'), findsOneWidget);
    });

    testWidgets('hint text displayed', (tester) async {
      await tester.pumpWidget(_wrap(const AejInput(hint: 'Entrez...')));
      expect(find.text('Entrez...'), findsOneWidget);
    });

    testWidgets('error text displayed', (tester) async {
      await tester.pumpWidget(
          _wrap(const AejInput(errorText: 'Champ requis')));
      expect(find.text('Champ requis'), findsOneWidget);
    });

    testWidgets('prefix icon displayed', (tester) async {
      await tester.pumpWidget(
          _wrap(const AejInput(prefixIcon: Icons.email)));
      expect(find.byIcon(Icons.email), findsOneWidget);
    });

    testWidgets('suffix icon displayed', (tester) async {
      await tester
          .pumpWidget(_wrap(const AejInput(suffixIcon: Icons.visibility)));
      expect(find.byIcon(Icons.visibility), findsOneWidget);
    });

    testWidgets('text input works with controller', (tester) async {
      final controller = TextEditingController();
      await tester.pumpWidget(_wrap(AejInput(controller: controller)));
      await tester.enterText(find.byType(TextFormField), 'hello');
      expect(controller.text, 'hello');
      controller.dispose();
    });

    testWidgets('validation triggered on form submit', (tester) async {
      final formKey = GlobalKey<FormState>();
      await tester.pumpWidget(MaterialApp(
        home: Scaffold(
          body: Form(
            key: formKey,
            child: AejInput(
              label: 'Email',
              validator: (v) => v == null || v.isEmpty ? 'Requis' : null,
            ),
          ),
        ),
      ));
      formKey.currentState!.validate();
      await tester.pump();
      expect(find.text('Requis'), findsOneWidget);
    });

    testWidgets('focus works', (tester) async {
      final focusNode = FocusNode();
      await tester.pumpWidget(_wrap(AejInput(focusNode: focusNode)));
      focusNode.requestFocus();
      await tester.pump();
      expect(focusNode.hasFocus, isTrue);
      focusNode.dispose();
    });
  });

  // ============== AejSearchInput ==============
  group('AejSearchInput', () {
    testWidgets('search icon visible', (tester) async {
      await tester.pumpWidget(_wrap(AejSearchInput(onChanged: (_) {})));
      expect(find.byIcon(Icons.search), findsOneWidget);
    });

    testWidgets('debounce: callback NOT called before 300ms', (tester) async {
      String? result;
      await tester.pumpWidget(_wrap(
        AejSearchInput(onChanged: (v) => result = v),
      ));
      await tester.enterText(find.byType(TextField), 'hello');
      await tester.pump(const Duration(milliseconds: 100));
      expect(result, isNull);
    });

    testWidgets('debounce: callback called after 300ms', (tester) async {
      String? result;
      await tester.pumpWidget(_wrap(
        AejSearchInput(onChanged: (v) => result = v),
      ));
      await tester.enterText(find.byType(TextField), 'hello');
      await tester.pump(const Duration(milliseconds: 350));
      expect(result, 'hello');
    });

    testWidgets('clear button visible when text present', (tester) async {
      await tester.pumpWidget(_wrap(AejSearchInput(onChanged: (_) {})));
      await tester.enterText(find.byType(TextField), 'test');
      await tester.pump();
      expect(find.byIcon(Icons.clear), findsOneWidget);
    });

    testWidgets('clear button clears text', (tester) async {
      String? result;
      await tester.pumpWidget(_wrap(
        AejSearchInput(onChanged: (v) => result = v),
      ));
      await tester.enterText(find.byType(TextField), 'test');
      await tester.pump();
      await tester.tap(find.byIcon(Icons.clear));
      await tester.pump();
      expect(result, '');
    });

    testWidgets('onChanged with debounced value', (tester) async {
      final values = <String>[];
      await tester.pumpWidget(_wrap(
        AejSearchInput(onChanged: (v) => values.add(v)),
      ));
      await tester.enterText(find.byType(TextField), 'a');
      await tester.pump(const Duration(milliseconds: 100));
      await tester.enterText(find.byType(TextField), 'ab');
      await tester.pump(const Duration(milliseconds: 100));
      await tester.enterText(find.byType(TextField), 'abc');
      await tester.pump(const Duration(milliseconds: 350));
      // Only the last value after debounce
      expect(values, ['abc']);
    });
  });

  // ============== Other components ==============
  group('AejSelect', () {
    testWidgets('shows dropdown and selects value', (tester) async {
      String? selected;
      await tester.pumpWidget(_wrap(
        AejSelect<String>(
          label: 'Type',
          items: const [
            AejSelectItem(value: 'a', label: 'Option A'),
            AejSelectItem(value: 'b', label: 'Option B'),
          ],
          onChanged: (v) => selected = v,
        ),
      ));
      expect(find.text('Type'), findsOneWidget);
      await tester.tap(find.byType(DropdownButtonFormField<String>));
      await tester.pumpAndSettle();
      await tester.tap(find.text('Option A').last);
      await tester.pumpAndSettle();
      expect(selected, 'a');
    });
  });

  group('AejTextarea', () {
    testWidgets('multi-line with default 3 rows', (tester) async {
      await tester.pumpWidget(_wrap(
        const AejTextarea(label: 'Notes'),
      ));
      expect(find.byType(TextFormField), findsOneWidget);
      expect(find.text('Notes'), findsOneWidget);
    });
  });

  group('AejBadge', () {
    testWidgets('6 variants render correctly', (tester) async {
      for (final variant in AejBadgeVariant.values) {
        await tester.pumpWidget(_wrap(
          AejBadge(label: variant.name, variant: variant),
        ));
        expect(find.text(variant.name), findsOneWidget);
      }
    });

    testWidgets('2 sizes render', (tester) async {
      for (final size in AejBadgeSize.values) {
        await tester.pumpWidget(_wrap(
          AejBadge(label: 'Badge', size: size),
        ));
        expect(find.text('Badge'), findsOneWidget);
      }
    });
  });

  group('AejTable', () {
    testWidgets('shows headers and rows', (tester) async {
      await tester.pumpWidget(_wrap(
        const AejTable(
          columns: [
            AejTableColumn(label: 'Nom'),
            AejTableColumn(label: 'Email'),
          ],
          rows: [
            [Text('Dupont'), Text('dupont@test.fr')],
            [Text('Martin'), Text('martin@test.fr')],
          ],
        ),
      ));
      expect(find.text('Nom'), findsOneWidget);
      expect(find.text('Email'), findsOneWidget);
      expect(find.text('Dupont'), findsOneWidget);
      expect(find.text('Martin'), findsOneWidget);
    });

    testWidgets('rows clickable when onRowTap provided', (tester) async {
      int? tappedIndex;
      await tester.pumpWidget(_wrap(
        AejTable(
          columns: const [AejTableColumn(label: 'Nom')],
          rows: const [
            [Text('Row 1')],
            [Text('Row 2')],
          ],
          onRowTap: (i) => tappedIndex = i,
        ),
      ));
      await tester.tap(find.text('Row 2'));
      expect(tappedIndex, 1);
    });
  });

  group('AejPagination', () {
    testWidgets('previous and next buttons shown', (tester) async {
      await tester.pumpWidget(_wrap(
        AejPagination(
          currentPage: 2,
          totalPages: 5,
          onPageChanged: (_) {},
        ),
      ));
      expect(find.byIcon(Icons.chevron_left), findsOneWidget);
      expect(find.byIcon(Icons.chevron_right), findsOneWidget);
    });

    testWidgets('page numbers shown', (tester) async {
      await tester.pumpWidget(_wrap(
        AejPagination(
          currentPage: 1,
          totalPages: 3,
          onPageChanged: (_) {},
        ),
      ));
      expect(find.text('1'), findsOneWidget);
      expect(find.text('2'), findsOneWidget);
      expect(find.text('3'), findsOneWidget);
    });
  });

  group('AejSpinner', () {
    testWidgets('3 sizes render', (tester) async {
      for (final size in AejSpinnerSize.values) {
        await tester.pumpWidget(_wrap(AejSpinner(size: size)));
        expect(find.byType(CircularProgressIndicator), findsOneWidget);
      }
    });

    testWidgets('LoadingOverlay covers content', (tester) async {
      await tester.pumpWidget(_wrap(
        const AejLoadingOverlay(
          isLoading: true,
          child: Text('Content'),
        ),
      ));
      expect(find.text('Content'), findsOneWidget);
      expect(find.byType(CircularProgressIndicator), findsOneWidget);
    });
  });

  group('AejEmptyState', () {
    testWidgets('shows icon, title, description, CTA', (tester) async {
      await tester.pumpWidget(_wrap(
        AejEmptyState(
          icon: Icons.inbox,
          title: 'Aucun client',
          description: 'Commencez par ajouter un client',
          actionLabel: 'Ajouter',
          onAction: () {},
        ),
      ));
      expect(find.byIcon(Icons.inbox), findsOneWidget);
      expect(find.text('Aucun client'), findsOneWidget);
      expect(find.text('Commencez par ajouter un client'), findsOneWidget);
      expect(find.text('Ajouter'), findsOneWidget);
    });

    testWidgets('CTA clickable', (tester) async {
      var clicked = false;
      await tester.pumpWidget(_wrap(
        AejEmptyState(
          icon: Icons.inbox,
          title: 'Vide',
          actionLabel: 'Action',
          onAction: () => clicked = true,
        ),
      ));
      await tester.tap(find.text('Action'));
      expect(clicked, isTrue);
    });
  });

  group('AejOfflineBanner', () {
    testWidgets('shows when offline', (tester) async {
      await tester.pumpWidget(_wrap(
        const AejOfflineBanner(isOffline: true),
      ));
      expect(find.text('Mode hors ligne'), findsOneWidget);
      expect(find.byIcon(Icons.cloud_off), findsOneWidget);
    });

    testWidgets('hidden when online', (tester) async {
      await tester.pumpWidget(_wrap(
        const AejOfflineBanner(isOffline: false),
      ));
      expect(find.text('Mode hors ligne'), findsNothing);
    });
  });

  group('AejConnectionIndicator', () {
    testWidgets('green dot when online', (tester) async {
      await tester.pumpWidget(_wrap(
        const AejConnectionIndicator(status: AejConnectionStatus.online),
      ));
      final container = tester.widget<Container>(find.byType(Container).last);
      final decoration = container.decoration as BoxDecoration;
      expect(decoration.color, const Color(0xFF16A34A)); // AppColors.success
    });

    testWidgets('red dot when offline', (tester) async {
      await tester.pumpWidget(_wrap(
        const AejConnectionIndicator(status: AejConnectionStatus.offline),
      ));
      final container = tester.widget<Container>(find.byType(Container).last);
      final decoration = container.decoration as BoxDecoration;
      expect(decoration.color, const Color(0xFFDC2626)); // AppColors.error
    });

    testWidgets('yellow dot when syncing', (tester) async {
      await tester.pumpWidget(_wrap(
        const AejConnectionIndicator(status: AejConnectionStatus.syncing),
      ));
      final container = tester.widget<Container>(find.byType(Container).last);
      final decoration = container.decoration as BoxDecoration;
      expect(decoration.color, const Color(0xFFF59E0B)); // AppColors.warning
    });
  });
}
