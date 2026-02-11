import 'package:drift/drift.dart';

class SyncMetaTable extends Table {
  @override
  String get tableName => 'sync_meta';

  TextColumn get entity => text()();
  DateTimeColumn get lastSyncAt => dateTime().nullable()();
  TextColumn get lastSyncCursor => text().nullable()();
  IntColumn get totalSynced => integer().withDefault(const Constant(0))();

  @override
  Set<Column> get primaryKey => {entity};
}
