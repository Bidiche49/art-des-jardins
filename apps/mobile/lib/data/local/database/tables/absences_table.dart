import 'package:drift/drift.dart';

class AbsencesTable extends Table {
  @override
  String get tableName => 'absences';

  TextColumn get id => text()();
  TextColumn get userId => text()();
  DateTimeColumn get dateDebut => dateTime()();
  DateTimeColumn get dateFin => dateTime()();
  TextColumn get type => text()();
  TextColumn get motif => text().nullable()();
  BoolColumn get validee => boolean().withDefault(const Constant(false))();
  DateTimeColumn get createdAt => dateTime()();
  DateTimeColumn get updatedAt => dateTime()();
  DateTimeColumn get syncedAt => dateTime().nullable()();

  @override
  Set<Column> get primaryKey => {id};
}
