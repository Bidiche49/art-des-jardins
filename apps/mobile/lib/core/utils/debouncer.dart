import 'dart:async';

/// Timer-based debouncer with configurable delay.
class Debouncer {
  Debouncer({this.delay = const Duration(milliseconds: 500)});

  final Duration delay;
  Timer? _timer;

  /// Runs [action] after [delay], cancelling any pending invocation.
  void run(void Function() action) {
    _timer?.cancel();
    _timer = Timer(delay, action);
  }

  /// Cancels any pending invocation.
  void cancel() {
    _timer?.cancel();
    _timer = null;
  }

  /// Whether a call is currently pending.
  bool get isPending => _timer?.isActive ?? false;

  /// Dispose the debouncer (cancels pending).
  void dispose() {
    cancel();
  }
}
