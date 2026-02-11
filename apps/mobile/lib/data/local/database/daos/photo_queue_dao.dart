import 'package:drift/drift.dart';

import '../app_database.dart';
import '../tables/photo_queue_table.dart';

part 'photo_queue_dao.g.dart';

@DriftAccessor(tables: [PhotoQueueTable])
class PhotoQueueDao extends DatabaseAccessor<AppDatabase>
    with _$PhotoQueueDaoMixin {
  PhotoQueueDao(super.db);

  Future<List<PhotoQueueTableData>> getAll() => select(photoQueueTable).get();

  Future<List<PhotoQueueTableData>> getPending() =>
      (select(photoQueueTable)..where((t) => t.status.equals('pending')))
          .get();

  Future<List<PhotoQueueTableData>> getByIntervention(
          String interventionId) =>
      (select(photoQueueTable)
            ..where((t) => t.interventionId.equals(interventionId)))
          .get();

  Future<int> insertOne(PhotoQueueTableCompanion entry) =>
      into(photoQueueTable).insert(entry);

  Future<bool> updateOne(PhotoQueueTableData entry) =>
      update(photoQueueTable).replace(entry);

  Future<int> deleteById(int id) =>
      (delete(photoQueueTable)..where((t) => t.id.equals(id))).go();
}
