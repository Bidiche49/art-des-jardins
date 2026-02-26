import 'package:drift/drift.dart';

import '../app_database.dart';
import '../tables/lignes_devis_table.dart';

part 'lignes_devis_dao.g.dart';

@DriftAccessor(tables: [LignesDevisTable])
class LignesDevisDao extends DatabaseAccessor<AppDatabase>
    with _$LignesDevisDaoMixin {
  LignesDevisDao(super.db);

  Future<List<LignesDevisTableData>> getByDevisId(String devisId) =>
      (select(lignesDevisTable)..where((t) => t.devisId.equals(devisId)))
          .get();

  Future<int> insertOne(LignesDevisTableCompanion entry) =>
      into(lignesDevisTable).insert(entry);

  Future<void> insertAll(List<LignesDevisTableCompanion> entries) async {
    await batch((b) => b.insertAll(lignesDevisTable, entries));
  }

  Future<bool> updateOne(LignesDevisTableCompanion entry) =>
      update(lignesDevisTable).replace(entry);

  Future<int> deleteByDevisId(String devisId) =>
      (delete(lignesDevisTable)..where((t) => t.devisId.equals(devisId))).go();

  Future<int> deleteById(String id) =>
      (delete(lignesDevisTable)..where((t) => t.id.equals(id))).go();
}
