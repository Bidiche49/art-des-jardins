import 'package:drift/drift.dart';

import '../app_database.dart';
import '../tables/chantiers_table.dart';

part 'chantiers_dao.g.dart';

@DriftAccessor(tables: [ChantiersTable])
class ChantiersDao extends DatabaseAccessor<AppDatabase>
    with _$ChantiersDaoMixin {
  ChantiersDao(super.db);

  Future<List<ChantiersTableData>> getAll() => select(chantiersTable).get();

  Stream<List<ChantiersTableData>> watchAll() =>
      select(chantiersTable).watch();

  Future<ChantiersTableData?> getById(String id) =>
      (select(chantiersTable)..where((t) => t.id.equals(id)))
          .getSingleOrNull();

  Future<List<ChantiersTableData>> getByClient(String clientId) =>
      (select(chantiersTable)..where((t) => t.clientId.equals(clientId)))
          .get();

  Future<List<ChantiersTableData>> getByStatut(String statut) =>
      (select(chantiersTable)..where((t) => t.statut.equals(statut))).get();

  Future<int> insertOne(ChantiersTableCompanion entry) =>
      into(chantiersTable).insert(entry);

  Future<bool> updateOne(ChantiersTableCompanion entry) =>
      update(chantiersTable).replace(entry);

  Future<int> deleteById(String id) =>
      (delete(chantiersTable)..where((t) => t.id.equals(id))).go();
}
