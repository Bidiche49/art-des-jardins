import 'package:drift/drift.dart';

class InterventionsTable extends Table {
  @override
  String get tableName => 'interventions';

  TextColumn get id => text()();
  TextColumn get chantierId => text()();
  TextColumn get employeId => text()();
  DateTimeColumn get date => dateTime()();
  DateTimeColumn get heureDebut => dateTime()();
  DateTimeColumn get heureFin => dateTime().nullable()();
  IntColumn get dureeMinutes => integer().nullable()();
  TextColumn get description => text().nullable()();
  TextColumn get notes => text().nullable()();
  BoolColumn get valide => boolean().withDefault(const Constant(false))();
  DateTimeColumn get createdAt => dateTime()();
  DateTimeColumn get updatedAt => dateTime()();
  DateTimeColumn get syncedAt => dateTime().nullable()();

  @override
  Set<Column> get primaryKey => {id};
}
