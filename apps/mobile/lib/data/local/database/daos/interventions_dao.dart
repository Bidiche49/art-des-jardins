import 'package:drift/drift.dart';

import '../app_database.dart';
import '../tables/interventions_table.dart';

part 'interventions_dao.g.dart';

@DriftAccessor(tables: [InterventionsTable])
class InterventionsDao extends DatabaseAccessor<AppDatabase>
    with _$InterventionsDaoMixin {
  InterventionsDao(super.db);

  Future<List<InterventionsTableData>> getAll() =>
      select(interventionsTable).get();

  Future<InterventionsTableData?> getById(String id) =>
      (select(interventionsTable)..where((t) => t.id.equals(id)))
          .getSingleOrNull();

  Future<List<InterventionsTableData>> getByChantier(String chantierId) =>
      (select(interventionsTable)
            ..where((t) => t.chantierId.equals(chantierId)))
          .get();

  Future<List<InterventionsTableData>> getByDate(DateTime date) {
    final startOfDay = DateTime(date.year, date.month, date.day);
    final endOfDay = startOfDay.add(const Duration(days: 1));
    return (select(interventionsTable)
          ..where((t) =>
              t.date.isBiggerOrEqualValue(startOfDay) &
              t.date.isSmallerThanValue(endOfDay)))
        .get();
  }

  Future<int> insertOne(InterventionsTableCompanion entry) =>
      into(interventionsTable).insert(entry);

  Future<bool> updateOne(InterventionsTableCompanion entry) =>
      update(interventionsTable).replace(entry);

  Future<int> deleteById(String id) =>
      (delete(interventionsTable)..where((t) => t.id.equals(id))).go();
}
