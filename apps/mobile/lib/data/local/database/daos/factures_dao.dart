import 'package:drift/drift.dart';

import '../app_database.dart';
import '../tables/factures_table.dart';

part 'factures_dao.g.dart';

@DriftAccessor(tables: [FacturesTable])
class FacturesDao extends DatabaseAccessor<AppDatabase>
    with _$FacturesDaoMixin {
  FacturesDao(super.db);

  Future<List<FacturesTableData>> getAll() => select(facturesTable).get();

  Future<FacturesTableData?> getById(String id) =>
      (select(facturesTable)..where((t) => t.id.equals(id)))
          .getSingleOrNull();

  Future<List<FacturesTableData>> getByDevis(String devisId) =>
      (select(facturesTable)..where((t) => t.devisId.equals(devisId))).get();

  Future<List<FacturesTableData>> getEnRetard() {
    final now = DateTime.now();
    return (select(facturesTable)
          ..where((t) =>
              t.dateEcheance.isSmallerThanValue(now) &
              t.statut.isNotIn(['payee', 'annulee'])))
        .get();
  }

  Future<int> insertOne(FacturesTableCompanion entry) =>
      into(facturesTable).insert(entry);

  Future<bool> updateOne(FacturesTableCompanion entry) =>
      update(facturesTable).replace(entry);

  Future<int> deleteById(String id) =>
      (delete(facturesTable)..where((t) => t.id.equals(id))).go();
}
