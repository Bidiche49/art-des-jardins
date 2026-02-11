import 'package:drift/drift.dart';

import '../app_database.dart';
import '../tables/devis_table.dart';

part 'devis_dao.g.dart';

@DriftAccessor(tables: [DevisTable])
class DevisDao extends DatabaseAccessor<AppDatabase> with _$DevisDaoMixin {
  DevisDao(super.db);

  Future<List<DevisTableData>> getAll() => select(devisTable).get();

  Future<DevisTableData?> getById(String id) =>
      (select(devisTable)..where((t) => t.id.equals(id))).getSingleOrNull();

  Future<List<DevisTableData>> getByChantier(String chantierId) =>
      (select(devisTable)..where((t) => t.chantierId.equals(chantierId)))
          .get();

  Future<List<DevisTableData>> getByStatut(String statut) =>
      (select(devisTable)..where((t) => t.statut.equals(statut))).get();

  Future<int> insertOne(DevisTableCompanion entry) =>
      into(devisTable).insert(entry);

  Future<bool> updateOne(DevisTableCompanion entry) =>
      update(devisTable).replace(entry);

  Future<int> deleteById(String id) =>
      (delete(devisTable)..where((t) => t.id.equals(id))).go();
}
