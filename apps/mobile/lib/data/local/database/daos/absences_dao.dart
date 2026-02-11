import 'package:drift/drift.dart';

import '../app_database.dart';
import '../tables/absences_table.dart';

part 'absences_dao.g.dart';

@DriftAccessor(tables: [AbsencesTable])
class AbsencesDao extends DatabaseAccessor<AppDatabase>
    with _$AbsencesDaoMixin {
  AbsencesDao(super.db);

  Future<List<AbsencesTableData>> getAll() =>
      select(absencesTable).get();

  Future<AbsencesTableData?> getById(String id) =>
      (select(absencesTable)..where((t) => t.id.equals(id)))
          .getSingleOrNull();

  Future<List<AbsencesTableData>> getByUserId(String userId) =>
      (select(absencesTable)..where((t) => t.userId.equals(userId)))
          .get();

  Future<List<AbsencesTableData>> getPending() =>
      (select(absencesTable)..where((t) => t.validee.equals(false)))
          .get();

  Future<int> insertOne(AbsencesTableCompanion entry) =>
      into(absencesTable).insert(entry);

  Future<bool> updateOne(AbsencesTableCompanion entry) =>
      update(absencesTable).replace(entry);

  Future<int> deleteById(String id) =>
      (delete(absencesTable)..where((t) => t.id.equals(id))).go();
}
