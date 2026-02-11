import 'package:drift/drift.dart';

class ClientsTable extends Table {
  @override
  String get tableName => 'clients';

  TextColumn get id => text()();
  TextColumn get type => text()();
  TextColumn get nom => text()();
  TextColumn get prenom => text().nullable()();
  TextColumn get raisonSociale => text().nullable()();
  TextColumn get email => text()();
  TextColumn get telephone => text()();
  TextColumn get telephoneSecondaire => text().nullable()();
  TextColumn get adresse => text()();
  TextColumn get codePostal => text()();
  TextColumn get ville => text()();
  TextColumn get notes => text().nullable()();
  TextColumn get tags => text().withDefault(const Constant('[]'))();
  DateTimeColumn get createdAt => dateTime()();
  DateTimeColumn get updatedAt => dateTime()();
  DateTimeColumn get syncedAt => dateTime().nullable()();

  @override
  Set<Column> get primaryKey => {id};
}
