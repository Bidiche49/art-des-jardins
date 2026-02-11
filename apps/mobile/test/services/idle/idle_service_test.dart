import 'package:flutter_test/flutter_test.dart';

import 'package:art_et_jardin/domain/enums/user_role.dart';
import 'package:art_et_jardin/services/idle/idle_service.dart';

void main() {
  late IdleService service;

  // Use short durations for testing
  IdleService createService({
    Duration patronTimeout = const Duration(milliseconds: 300),
    Duration employeTimeout = const Duration(milliseconds: 600),
    Duration warningBefore = const Duration(milliseconds: 100),
  }) {
    return IdleService(
      patronTimeout: patronTimeout,
      employeTimeout: employeTimeout,
      warningBefore: warningBefore,
    );
  }

  tearDown(() {
    service.dispose();
  });

  group('IdleService - patron timer', () {
    test('patron timeout is 30 minutes by default', () {
      service = IdleService();
      service.start(UserRole.patron);
      expect(service.timeout, const Duration(minutes: 30));
    });

    test('patron triggers warning before timeout', () async {
      service = createService(
        patronTimeout: const Duration(milliseconds: 300),
        warningBefore: const Duration(milliseconds: 100),
      );

      final states = <IdleState>[];
      service.stateStream.listen(states.add);

      service.start(UserRole.patron);

      // Wait for warning (300 - 100 = 200ms)
      await Future.delayed(const Duration(milliseconds: 250));
      expect(states, contains(IdleState.warning));
    });

    test('patron triggers expired after timeout', () async {
      service = createService(
        patronTimeout: const Duration(milliseconds: 200),
        warningBefore: const Duration(milliseconds: 50),
      );

      final states = <IdleState>[];
      service.stateStream.listen(states.add);

      service.start(UserRole.patron);

      await Future.delayed(const Duration(milliseconds: 300));
      expect(states, contains(IdleState.expired));
    });
  });

  group('IdleService - employe timer', () {
    test('employe timeout is 2 hours by default', () {
      service = IdleService();
      service.start(UserRole.employe);
      expect(service.timeout, const Duration(hours: 2));
    });

    test('employe triggers warning before timeout', () async {
      service = createService(
        employeTimeout: const Duration(milliseconds: 300),
        warningBefore: const Duration(milliseconds: 100),
      );

      final states = <IdleState>[];
      service.stateStream.listen(states.add);

      service.start(UserRole.employe);

      await Future.delayed(const Duration(milliseconds: 250));
      expect(states, contains(IdleState.warning));
    });
  });

  group('IdleService - reset', () {
    test('reset on interaction resets timer', () async {
      service = createService(
        patronTimeout: const Duration(milliseconds: 200),
        warningBefore: const Duration(milliseconds: 50),
      );

      final states = <IdleState>[];
      service.stateStream.listen(states.add);

      service.start(UserRole.patron);

      // Wait 100ms then reset
      await Future.delayed(const Duration(milliseconds: 100));
      service.resetTimer();

      // Allow stream event to be delivered
      await Future.delayed(Duration.zero);

      // Should emit active
      expect(states, contains(IdleState.active));
    });

    test('reset on navigation prevents expiration', () async {
      service = createService(
        patronTimeout: const Duration(milliseconds: 200),
        warningBefore: const Duration(milliseconds: 50),
      );

      final states = <IdleState>[];
      service.stateStream.listen(states.add);

      service.start(UserRole.patron);

      // Reset at 100ms
      await Future.delayed(const Duration(milliseconds: 100));
      service.resetTimer();

      // Wait past original timeout (200ms from start, but we reset at 100ms)
      await Future.delayed(const Duration(milliseconds: 150));

      // Should NOT have expired yet (timer was reset)
      expect(states.where((s) => s == IdleState.expired), isEmpty);
    });

    test('continue in warning dialog resets timer', () async {
      service = createService(
        patronTimeout: const Duration(milliseconds: 300),
        warningBefore: const Duration(milliseconds: 100),
      );

      final states = <IdleState>[];
      service.stateStream.listen(states.add);

      service.start(UserRole.patron);

      // Wait for warning
      await Future.delayed(const Duration(milliseconds: 250));
      expect(states, contains(IdleState.warning));

      // Simulate "continue" button press
      service.resetTimer();

      // Allow stream event to be delivered
      await Future.delayed(Duration.zero);

      // Should emit active after reset
      expect(states.last, IdleState.active);
    });
  });

  group('IdleService - countdown', () {
    test('warning emits countdown seconds', () async {
      service = createService(
        patronTimeout: const Duration(milliseconds: 400),
        warningBefore: const Duration(milliseconds: 200),
      );

      final countdowns = <int>[];
      service.countdownStream.listen(countdowns.add);

      service.start(UserRole.patron);

      // Wait for warning + some countdown ticks (warning duration is very short in test)
      await Future.delayed(const Duration(milliseconds: 300));
      // Should have received at least one countdown value
      expect(countdowns, isNotEmpty);
    });
  });

  group('IdleService - lifecycle', () {
    test('app in background continues timer', () async {
      service = createService(
        patronTimeout: const Duration(milliseconds: 200),
        warningBefore: const Duration(milliseconds: 50),
      );

      final states = <IdleState>[];
      service.stateStream.listen(states.add);

      service.start(UserRole.patron);
      service.onBackground();

      // Timer should still be running
      await Future.delayed(const Duration(milliseconds: 300));
      expect(states, contains(IdleState.expired));
    });

    test('app in foreground checks if expired', () async {
      service = createService(
        patronTimeout: const Duration(milliseconds: 100),
        warningBefore: const Duration(milliseconds: 20),
      );

      final states = <IdleState>[];
      service.stateStream.listen(states.add);

      service.start(UserRole.patron);

      // Wait for expiration
      await Future.delayed(const Duration(milliseconds: 200));

      // Clear states list
      states.clear();

      // Simulate returning from background
      service.onForeground();

      // Allow stream event to be delivered
      await Future.delayed(Duration.zero);

      // Should detect expiration
      expect(states, contains(IdleState.expired));
    });

    test('app in foreground within timeout does not expire', () async {
      service = createService(
        patronTimeout: const Duration(milliseconds: 500),
        warningBefore: const Duration(milliseconds: 100),
      );

      final states = <IdleState>[];
      service.stateStream.listen(states.add);

      service.start(UserRole.patron);
      service.onBackground();

      // Quick return before timeout
      await Future.delayed(const Duration(milliseconds: 50));
      service.onForeground();

      expect(states.where((s) => s == IdleState.expired), isEmpty);
    });
  });

  group('IdleService - start/stop', () {
    test('isRunning reflects service state', () {
      service = createService();

      expect(service.isRunning, false);
      service.start(UserRole.patron);
      expect(service.isRunning, true);
      service.stop();
      expect(service.isRunning, false);
    });

    test('resetTimer does nothing when not running', () {
      service = createService();

      // Should not throw
      service.resetTimer();
      expect(service.isRunning, false);
    });
  });
}
