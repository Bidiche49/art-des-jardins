import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../../../core/network/connectivity_service.dart';
import '../../../../core/network/dio_client.dart';
import '../../../../domain/enums/user_role.dart';
import '../../../../domain/models/absence.dart';
import '../../../../domain/models/daily_weather.dart';
import '../../../../domain/models/intervention.dart';
import '../../../../services/sync/sync_providers.dart';
import '../../../auth/domain/auth_state.dart';
import '../../../auth/presentation/auth_notifier.dart';
import '../../../interventions/domain/interventions_repository.dart';
import '../../../interventions/presentation/providers/interventions_providers.dart';
import '../../data/absences_repository_impl.dart';
import '../../data/weather_service_impl.dart';
import '../../domain/absences_repository.dart';
import '../../domain/weather_service.dart';

// ============== Providers ==============

final absencesDaoProvider = Provider((ref) {
  return ref.read(appDatabaseProvider).absencesDao;
});

final absencesRepositoryProvider = Provider<AbsencesRepository>((ref) {
  return AbsencesRepositoryImpl(
    absencesDao: ref.read(absencesDaoProvider),
    authDio: ref.read(authDioProvider),
    connectivityService: ref.read(connectivityServiceProvider),
    syncService: ref.read(syncServiceProvider),
  );
});

final weatherServiceProvider = Provider<WeatherService>((ref) {
  return WeatherServiceImpl();
});

// ============== Calendar Notifier ==============

final calendarNotifierProvider =
    StateNotifierProvider<CalendarNotifier, CalendarState>((ref) {
  return CalendarNotifier(
    interventionsRepository: ref.read(interventionsRepositoryProvider),
    absencesRepository: ref.read(absencesRepositoryProvider),
  );
});

class CalendarState {
  const CalendarState({
    this.interventions = const [],
    this.absences = const [],
    this.isLoading = false,
    this.error,
    this.focusedDay,
    this.selectedDay,
  });

  final List<Intervention> interventions;
  final List<Absence> absences;
  final bool isLoading;
  final String? error;
  final DateTime? focusedDay;
  final DateTime? selectedDay;

  CalendarState copyWith({
    List<Intervention>? interventions,
    List<Absence>? absences,
    bool? isLoading,
    String? error,
    DateTime? focusedDay,
    DateTime? selectedDay,
  }) {
    return CalendarState(
      interventions: interventions ?? this.interventions,
      absences: absences ?? this.absences,
      isLoading: isLoading ?? this.isLoading,
      error: error,
      focusedDay: focusedDay ?? this.focusedDay,
      selectedDay: selectedDay ?? this.selectedDay,
    );
  }
}

class CalendarNotifier extends StateNotifier<CalendarState> {
  CalendarNotifier({
    required this.interventionsRepository,
    required this.absencesRepository,
  }) : super(CalendarState(focusedDay: DateTime.now())) {
    loadMonth(DateTime.now());
  }

  final InterventionsRepository interventionsRepository;
  final AbsencesRepository absencesRepository;

  Future<void> loadMonth(DateTime month) async {
    state = state.copyWith(isLoading: true);
    try {
      final firstDay = DateTime(month.year, month.month, 1);
      final lastDay = DateTime(month.year, month.month + 1, 0);

      final interventions = await interventionsRepository.getByDateRange(
        firstDay,
        lastDay,
      );
      final absences = await absencesRepository.getAll();

      state = state.copyWith(
        interventions: interventions,
        absences: absences,
        isLoading: false,
      );
    } catch (e) {
      state = state.copyWith(isLoading: false, error: e.toString());
    }
  }

  void selectDay(DateTime day) {
    state = state.copyWith(selectedDay: day);
  }

  void changeFocusedDay(DateTime day) {
    state = state.copyWith(focusedDay: day);
    loadMonth(day);
  }

  List<Intervention> interventionsForDay(DateTime day) {
    final dayStart = DateTime(day.year, day.month, day.day);
    return state.interventions.where((i) {
      final iDay = DateTime(i.date.year, i.date.month, i.date.day);
      return iDay == dayStart;
    }).toList();
  }

  List<Absence> absencesForDay(DateTime day) {
    final dayStart = DateTime(day.year, day.month, day.day);
    return state.absences.where((a) {
      final start = DateTime(a.dateDebut.year, a.dateDebut.month, a.dateDebut.day);
      final end = DateTime(a.dateFin.year, a.dateFin.month, a.dateFin.day);
      return !dayStart.isBefore(start) && !dayStart.isAfter(end);
    }).toList();
  }

  int eventsForDay(DateTime day) {
    return interventionsForDay(day).length + absencesForDay(day).length;
  }

  Future<void> refresh() async {
    final day = state.focusedDay ?? DateTime.now();
    await loadMonth(day);
  }
}

// ============== Weather Notifier ==============

final weatherNotifierProvider =
    StateNotifierProvider<WeatherNotifier, AsyncValue<List<DailyWeather>>>(
        (ref) {
  return WeatherNotifier(weatherService: ref.read(weatherServiceProvider));
});

class WeatherNotifier extends StateNotifier<AsyncValue<List<DailyWeather>>> {
  WeatherNotifier({required WeatherService weatherService})
      : _weatherService = weatherService,
        super(const AsyncValue.loading()) {
    loadWeather();
  }

  final WeatherService _weatherService;

  // Angers coordinates
  static const double _latitude = 47.4784;
  static const double _longitude = -0.5632;

  Future<void> loadWeather() async {
    state = const AsyncValue.loading();
    try {
      final forecast = await _weatherService.get7DayForecast(
        latitude: _latitude,
        longitude: _longitude,
      );
      state = AsyncValue.data(forecast);
    } catch (e, st) {
      state = AsyncValue.error(e, st);
    }
  }

  DailyWeather? weatherForDate(String dateStr) {
    if (!state.hasValue) return null;
    try {
      return state.value!.firstWhere((w) => w.date == dateStr);
    } catch (_) {
      return null;
    }
  }

  Future<void> refresh() => loadWeather();
}

// ============== Absences Notifier ==============

final absencesNotifierProvider =
    StateNotifierProvider<AbsencesNotifier, AbsencesState>((ref) {
  final authState = ref.read(authNotifierProvider);
  final isPatron = authState is AuthAuthenticated &&
      authState.user.role == UserRole.patron;
  final userId =
      authState is AuthAuthenticated ? authState.user.id : '';

  return AbsencesNotifier(
    repository: ref.read(absencesRepositoryProvider),
    currentUserId: userId,
    isPatron: isPatron,
  );
});

class AbsencesState {
  const AbsencesState({
    this.myAbsences = const [],
    this.pendingAbsences = const [],
    this.allAbsences = const [],
    this.isLoading = false,
    this.error,
  });

  final List<Absence> myAbsences;
  final List<Absence> pendingAbsences;
  final List<Absence> allAbsences;
  final bool isLoading;
  final String? error;

  AbsencesState copyWith({
    List<Absence>? myAbsences,
    List<Absence>? pendingAbsences,
    List<Absence>? allAbsences,
    bool? isLoading,
    String? error,
  }) {
    return AbsencesState(
      myAbsences: myAbsences ?? this.myAbsences,
      pendingAbsences: pendingAbsences ?? this.pendingAbsences,
      allAbsences: allAbsences ?? this.allAbsences,
      isLoading: isLoading ?? this.isLoading,
      error: error,
    );
  }
}

class AbsencesNotifier extends StateNotifier<AbsencesState> {
  AbsencesNotifier({
    required AbsencesRepository repository,
    required this.currentUserId,
    required this.isPatron,
  })  : _repository = repository,
        super(const AbsencesState()) {
    loadAbsences();
  }

  final AbsencesRepository _repository;
  final String currentUserId;
  final bool isPatron;

  Future<void> loadAbsences() async {
    state = state.copyWith(isLoading: true);
    try {
      final myAbsences = await _repository.getMyAbsences(currentUserId);
      List<Absence> pending = [];
      List<Absence> all = [];
      if (isPatron) {
        pending = await _repository.getPendingAbsences();
        all = await _repository.getAll();
      }
      state = state.copyWith(
        myAbsences: myAbsences,
        pendingAbsences: pending,
        allAbsences: all,
        isLoading: false,
      );
    } catch (e) {
      state = state.copyWith(isLoading: false, error: e.toString());
    }
  }

  Future<void> createAbsence(Absence absence) async {
    await _repository.create(absence);
    await loadAbsences();
  }

  Future<void> validateAbsence(String id) async {
    await _repository.validate(id);
    await loadAbsences();
  }

  Future<void> refuseAbsence(String id) async {
    try {
      await _repository.refuse(id);
    } catch (_) {
      // Expected - refuse deletes the absence
    }
    await loadAbsences();
  }

  Future<void> deleteAbsence(String id) async {
    await _repository.delete(id);
    await loadAbsences();
  }

  Future<void> refresh() => loadAbsences();

  int calculateDays(Absence absence) {
    return absence.dateFin.difference(absence.dateDebut).inDays + 1;
  }
}
