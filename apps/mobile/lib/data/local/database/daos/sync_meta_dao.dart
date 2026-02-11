import 'package:drift/drift.dart';

import '../app_database.dart';
import '../tables/sync_meta_table.dart';

part 'sync_meta_dao.g.dart';

@DriftAccessor(tables: [SyncMetaTable])
class SyncMetaDao extends DatabaseAccessor<AppDatabase>
    with _$SyncMetaDaoMixin {
  SyncMetaDao(super.db);

  Future<List<SyncMetaTableData>> getAll() => select(syncMetaTable).get();

  Future<SyncMetaTableData?> getByEntity(String entity) =>
      (select(syncMetaTable)..where((t) => t.entity.equals(entity)))
          .getSingleOrNull();

  Future<int> insertOne(SyncMetaTableCompanion entry) =>
      into(syncMetaTable).insert(entry);

  Future<bool> updateOne(SyncMetaTableCompanion entry) =>
      update(syncMetaTable).replace(entry);

  Future<int> deleteByEntity(String entity) =>
      (delete(syncMetaTable)..where((t) => t.entity.equals(entity))).go();
}
