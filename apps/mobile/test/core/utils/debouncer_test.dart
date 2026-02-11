import 'package:fake_async/fake_async.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:art_et_jardin/core/utils/debouncer.dart';

void main() {
  group('Debouncer', () {
    test('executes action after delay', () {
      FakeAsync().run((async) {
        final debouncer = Debouncer(delay: const Duration(milliseconds: 100));
        int count = 0;

        debouncer.run(() => count++);
        expect(count, 0);

        async.elapse(const Duration(milliseconds: 100));
        expect(count, 1);

        debouncer.dispose();
      });
    });

    test('only executes last call on rapid invocations', () {
      FakeAsync().run((async) {
        final debouncer = Debouncer(delay: const Duration(milliseconds: 100));
        int count = 0;

        debouncer.run(() => count++);
        debouncer.run(() => count++);
        debouncer.run(() => count++);

        async.elapse(const Duration(milliseconds: 100));
        expect(count, 1); // Only the last one fires

        debouncer.dispose();
      });
    });

    test('cancel prevents execution', () {
      FakeAsync().run((async) {
        final debouncer = Debouncer(delay: const Duration(milliseconds: 100));
        int count = 0;

        debouncer.run(() => count++);
        debouncer.cancel();

        async.elapse(const Duration(milliseconds: 200));
        expect(count, 0);

        debouncer.dispose();
      });
    });
  });
}
