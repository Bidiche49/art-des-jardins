import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../../../core/network/connectivity_service.dart';
import '../../../../core/network/dio_client.dart';
import '../../../../domain/models/intervention.dart';
import '../../../../services/sync/sync_providers.dart';
import '../../data/interventions_repository_impl.dart';
import '../../domain/interventions_repository.dart';

// ============== Repository ==============

final interventionsDaoProvider = Provider((ref) {
  return ref.read(appDatabaseProvider).interventionsDao;
});

final interventionsRepositoryProvider =
    Provider<InterventionsRepository>((ref) {
  return InterventionsRepositoryImpl(
    interventionsDao: ref.read(interventionsDaoProvider),
    authDio: ref.read(authDioProvider),
    connectivityService: ref.read(connectivityServiceProvider),
    syncService: ref.read(syncServiceProvider),
  );
});

// ============== Week View Notifier ==============

final interventionsWeekNotifierProvider = StateNotifierProvider<
    InterventionsWeekNotifier, AsyncValue<List<Intervention>>>((ref) {
  return InterventionsWeekNotifier(
      repository: ref.read(interventionsRepositoryProvider));
});

DateTime _getMonday(DateTime date) {
  return DateTime(date.year, date.month, date.day)
      .subtract(Duration(days: date.weekday - 1));
}

class InterventionsWeekNotifier
    extends StateNotifier<AsyncValue<List<Intervention>>> {
  InterventionsWeekNotifier({required InterventionsRepository repository})
      : _repository = repository,
        _weekStart = _getMonday(DateTime.now()),
        super(const AsyncValue.loading()) {
    loadWeek();
  }

  final InterventionsRepository _repository;
  DateTime _weekStart;

  DateTime get weekStart => _weekStart;
  DateTime get weekEnd => _weekStart.add(const Duration(days: 6));

  Future<void> loadWeek() async {
    state = const AsyncValue.loading();
    try {
      final interventions =
          await _repository.getByDateRange(_weekStart, weekEnd);
      state = AsyncValue.data(interventions);
    } catch (e, st) {
      state = AsyncValue.error(e, st);
    }
  }

  void nextWeek() {
    _weekStart = _weekStart.add(const Duration(days: 7));
    loadWeek();
  }

  void previousWeek() {
    _weekStart = _weekStart.subtract(const Duration(days: 7));
    loadWeek();
  }

  void goToCurrentWeek() {
    _weekStart = _getMonday(DateTime.now());
    loadWeek();
  }

  List<Intervention> interventionsForDay(DateTime day) {
    if (!state.hasValue) return [];
    final dayStart = DateTime(day.year, day.month, day.day);
    return state.value!.where((i) {
      final iDay = DateTime(i.date.year, i.date.month, i.date.day);
      return iDay == dayStart;
    }).toList();
  }

  Future<void> addIntervention(Intervention intervention) async {
    await _repository.create(intervention);
    await loadWeek();
  }

  Future<void> removeIntervention(String id) async {
    await _repository.delete(id);
    await loadWeek();
  }

  Future<void> refresh() => loadWeek();
}

// ============== Detail Notifier ==============

final interventionDetailNotifierProvider = StateNotifierProvider.family<
    InterventionDetailNotifier,
    AsyncValue<Intervention>,
    String>((ref, interventionId) {
  return InterventionDetailNotifier(
    repository: ref.read(interventionsRepositoryProvider),
    interventionId: interventionId,
  );
});

class InterventionDetailNotifier
    extends StateNotifier<AsyncValue<Intervention>> {
  InterventionDetailNotifier({
    required InterventionsRepository repository,
    required String interventionId,
  })  : _repository = repository,
        _interventionId = interventionId,
        super(const AsyncValue.loading()) {
    load();
  }

  final InterventionsRepository _repository;
  final String _interventionId;

  Future<void> load() async {
    state = const AsyncValue.loading();
    try {
      final intervention = await _repository.getById(_interventionId);
      state = AsyncValue.data(intervention);
    } catch (e, st) {
      state = AsyncValue.error(e, st);
    }
  }

  Future<void> updateIntervention(Intervention intervention) async {
    final updated = await _repository.update(intervention);
    state = AsyncValue.data(updated);
  }

  Future<void> deleteIntervention() async {
    await _repository.delete(_interventionId);
  }

  Future<void> refresh() => load();
}
