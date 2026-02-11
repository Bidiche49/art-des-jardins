import 'package:drift/drift.dart';

class PhotoQueueTable extends Table {
  @override
  String get tableName => 'photo_queue';

  IntColumn get id => integer().autoIncrement()();
  TextColumn get interventionId => text()();
  TextColumn get type => text()();
  TextColumn get filePath => text()();
  TextColumn get mimeType => text()();
  IntColumn get fileSize => integer()();
  RealColumn get latitude => real().nullable()();
  RealColumn get longitude => real().nullable()();
  DateTimeColumn get takenAt => dateTime()();
  IntColumn get attempts => integer().withDefault(const Constant(0))();
  TextColumn get lastError => text().nullable()();
  TextColumn get status => text().withDefault(const Constant('pending'))();
}
