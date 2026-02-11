import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:intl/intl.dart';
import 'package:table_calendar/table_calendar.dart';

import '../../../../core/router/route_names.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../domain/enums/absence_type.dart';
import '../../../../domain/models/absence.dart';
import '../../../../domain/models/intervention.dart';
import '../../../../shared/widgets/aej_spinner.dart';
import '../providers/calendar_providers.dart';
import '../widgets/weather_widget.dart';

class CalendarPage extends ConsumerStatefulWidget {
  const CalendarPage({super.key});

  @override
  ConsumerState<CalendarPage> createState() => _CalendarPageState();
}

class _CalendarPageState extends ConsumerState<CalendarPage> {
  CalendarFormat _calendarFormat = CalendarFormat.month;
  DateTime _focusedDay = DateTime.now();
  DateTime? _selectedDay;

  @override
  Widget build(BuildContext context) {
    final calendarState = ref.watch(calendarNotifierProvider);
    ref.watch(weatherNotifierProvider);

    return Scaffold(
      appBar: AppBar(
        title: const Text('Calendrier'),
        actions: [
          IconButton(
            icon: const Icon(Icons.today),
            onPressed: () {
              setState(() {
                _focusedDay = DateTime.now();
                _selectedDay = DateTime.now();
              });
              ref
                  .read(calendarNotifierProvider.notifier)
                  .changeFocusedDay(DateTime.now());
            },
          ),
          IconButton(
            icon: const Icon(Icons.event_busy),
            tooltip: 'Absences',
            onPressed: () => context.pushNamed(RouteNames.absences),
          ),
        ],
      ),
      body: RefreshIndicator(
        onRefresh: () async {
          await ref.read(calendarNotifierProvider.notifier).refresh();
          await ref.read(weatherNotifierProvider.notifier).refresh();
        },
        child: ListView(
          children: [
            const WeatherBanner(),
            TableCalendar<dynamic>(
              locale: 'fr_FR',
              firstDay: DateTime.utc(2024, 1, 1),
              lastDay: DateTime.utc(2030, 12, 31),
              focusedDay: _focusedDay,
              calendarFormat: _calendarFormat,
              selectedDayPredicate: (day) => isSameDay(_selectedDay, day),
              onDaySelected: (selectedDay, focusedDay) {
                setState(() {
                  _selectedDay = selectedDay;
                  _focusedDay = focusedDay;
                });
                ref
                    .read(calendarNotifierProvider.notifier)
                    .selectDay(selectedDay);
              },
              onFormatChanged: (format) {
                setState(() => _calendarFormat = format);
              },
              onPageChanged: (focusedDay) {
                _focusedDay = focusedDay;
                ref
                    .read(calendarNotifierProvider.notifier)
                    .changeFocusedDay(focusedDay);
              },
              eventLoader: (day) {
                final notifier = ref.read(calendarNotifierProvider.notifier);
                final interventions = notifier.interventionsForDay(day);
                final absences = notifier.absencesForDay(day);
                return [...interventions, ...absences];
              },
              calendarBuilders: CalendarBuilders(
                markerBuilder: (context, day, events) {
                  if (events.isEmpty) return null;
                  return Positioned(
                    bottom: 1,
                    child: Row(
                      mainAxisSize: MainAxisSize.min,
                      children: events.take(3).map((e) {
                        final color = e is Intervention
                            ? AppColors.primary
                            : _absenceColor(e is Absence ? e.type : null);
                        return Container(
                          width: 6,
                          height: 6,
                          margin: const EdgeInsets.symmetric(horizontal: 0.5),
                          decoration: BoxDecoration(
                            shape: BoxShape.circle,
                            color: color,
                          ),
                        );
                      }).toList(),
                    ),
                  );
                },
              ),
              headerStyle: HeaderStyle(
                formatButtonVisible: true,
                titleCentered: true,
                formatButtonShowsNext: false,
                formatButtonDecoration: BoxDecoration(
                  border: Border.all(color: AppColors.primary),
                  borderRadius: BorderRadius.circular(8),
                ),
                formatButtonTextStyle:
                    const TextStyle(color: AppColors.primary, fontSize: 12),
              ),
              calendarStyle: CalendarStyle(
                todayDecoration: BoxDecoration(
                  color: AppColors.primary.withValues(alpha: 0.3),
                  shape: BoxShape.circle,
                ),
                selectedDecoration: const BoxDecoration(
                  color: AppColors.primary,
                  shape: BoxShape.circle,
                ),
                markerDecoration: const BoxDecoration(
                  color: AppColors.primary,
                  shape: BoxShape.circle,
                ),
              ),
            ),
            if (calendarState.isLoading)
              const Padding(
                padding: EdgeInsets.all(16),
                child: Center(child: AejSpinner()),
              ),
            if (_selectedDay != null) ...[
              const Divider(height: 1),
              _DayEventsSection(
                day: _selectedDay!,
                interventions: ref
                    .read(calendarNotifierProvider.notifier)
                    .interventionsForDay(_selectedDay!),
                absences: ref
                    .read(calendarNotifierProvider.notifier)
                    .absencesForDay(_selectedDay!),
              ),
            ],
          ],
        ),
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: () {
          context.pushNamed(RouteNames.absenceCreate);
        },
        child: const Icon(Icons.add),
      ),
    );
  }

  Color _absenceColor(AbsenceType? type) {
    switch (type) {
      case AbsenceType.conge:
        return Colors.blue;
      case AbsenceType.maladie:
        return Colors.red;
      case AbsenceType.formation:
        return Colors.orange;
      case AbsenceType.autre:
      case null:
        return Colors.grey;
    }
  }
}

class _DayEventsSection extends StatelessWidget {
  const _DayEventsSection({
    required this.day,
    required this.interventions,
    required this.absences,
  });

  final DateTime day;
  final List<Intervention> interventions;
  final List<Absence> absences;

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final dateFormat = DateFormat('EEEE d MMMM', 'fr_FR');
    final timeFormat = DateFormat('HH:mm');

    if (interventions.isEmpty && absences.isEmpty) {
      return Padding(
        padding: const EdgeInsets.all(24),
        child: Center(
          child: Text(
            'Aucun evenement le ${dateFormat.format(day)}',
            style: theme.textTheme.bodyMedium?.copyWith(color: Colors.grey),
          ),
        ),
      );
    }

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Padding(
          padding: const EdgeInsets.fromLTRB(16, 12, 16, 8),
          child: Text(
            dateFormat.format(day),
            style: theme.textTheme.titleMedium?.copyWith(
              fontWeight: FontWeight.bold,
            ),
          ),
        ),
        ...interventions.map((i) => ListTile(
              leading: const Icon(Icons.build, color: AppColors.primary),
              title: Text(i.description ?? 'Intervention'),
              subtitle: Text(
                '${timeFormat.format(i.heureDebut)}${i.heureFin != null ? ' - ${timeFormat.format(i.heureFin!)}' : ''}',
              ),
              trailing: i.valide
                  ? const Icon(Icons.check_circle, color: Colors.green)
                  : null,
              onTap: () {
                context.pushNamed(
                  RouteNames.interventionDetail,
                  pathParameters: {'id': i.id},
                );
              },
            )),
        ...absences.map((a) => ListTile(
              leading: Icon(
                Icons.event_busy,
                color: _typeColor(a.type),
              ),
              title: Text(a.type.label),
              subtitle: Text(a.motif ?? ''),
              trailing: a.validee
                  ? const Icon(Icons.check_circle, color: Colors.green)
                  : const Icon(Icons.hourglass_empty, color: Colors.orange),
            )),
      ],
    );
  }

  Color _typeColor(AbsenceType type) {
    switch (type) {
      case AbsenceType.conge:
        return Colors.blue;
      case AbsenceType.maladie:
        return Colors.red;
      case AbsenceType.formation:
        return Colors.orange;
      case AbsenceType.autre:
        return Colors.grey;
    }
  }
}
