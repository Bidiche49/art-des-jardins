import 'package:drift/drift.dart';

class ChantiersTable extends Table {
  @override
  String get tableName => 'chantiers';

  TextColumn get id => text()();
  TextColumn get clientId => text()();
  TextColumn get adresse => text()();
  TextColumn get codePostal => text()();
  TextColumn get ville => text()();
  RealColumn get latitude => real().nullable()();
  RealColumn get longitude => real().nullable()();
  TextColumn get typePrestation => text().withDefault(const Constant('[]'))();
  TextColumn get description => text()();
  RealColumn get surface => real().nullable()();
  TextColumn get statut => text().withDefault(const Constant('lead'))();
  DateTimeColumn get dateDebut => dateTime().nullable()();
  DateTimeColumn get dateFin => dateTime().nullable()();
  TextColumn get responsableId => text().nullable()();
  TextColumn get notes => text().nullable()();
  DateTimeColumn get createdAt => dateTime()();
  DateTimeColumn get updatedAt => dateTime()();
  DateTimeColumn get syncedAt => dateTime().nullable()();

  @override
  Set<Column> get primaryKey => {id};
}
