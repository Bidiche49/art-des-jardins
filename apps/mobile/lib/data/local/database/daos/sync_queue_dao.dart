import 'package:drift/drift.dart';

import '../app_database.dart';
import '../tables/sync_queue_table.dart';

part 'sync_queue_dao.g.dart';

@DriftAccessor(tables: [SyncQueueTable])
class SyncQueueDao extends DatabaseAccessor<AppDatabase>
    with _$SyncQueueDaoMixin {
  SyncQueueDao(super.db);

  Future<List<SyncQueueTableData>> getAll() => select(syncQueueTable).get();

  Stream<List<SyncQueueTableData>> watchAll() =>
      select(syncQueueTable).watch();

  Future<List<SyncQueueTableData>> getPending() =>
      (select(syncQueueTable)
            ..where((t) => t.status.equals('pending'))
            ..orderBy([(t) => OrderingTerm.asc(t.timestamp)]))
          .get();

  Future<List<SyncQueueTableData>> getFailed() =>
      (select(syncQueueTable)..where((t) => t.status.equals('failed'))).get();

  Future<List<SyncQueueTableData>> getByEntity(String entity) =>
      (select(syncQueueTable)..where((t) => t.entity.equals(entity))).get();

  Future<int> insertOne(SyncQueueTableCompanion entry) =>
      into(syncQueueTable).insert(entry);

  Future<bool> updateOne(SyncQueueTableData entry) =>
      update(syncQueueTable).replace(entry);

  Future<int> deleteById(int id) =>
      (delete(syncQueueTable)..where((t) => t.id.equals(id))).go();

  Future<void> incrementRetryCount(int id) async {
    await customStatement(
      'UPDATE sync_queue SET retry_count = retry_count + 1 WHERE id = ?',
      [id],
    );
  }
}
