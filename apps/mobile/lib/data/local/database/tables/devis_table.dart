import 'package:drift/drift.dart';

class DevisTable extends Table {
  @override
  String get tableName => 'devis';

  TextColumn get id => text()();
  TextColumn get chantierId => text()();
  TextColumn get numero => text()();
  DateTimeColumn get dateEmission => dateTime()();
  DateTimeColumn get dateValidite => dateTime()();
  RealColumn get totalHT => real()();
  RealColumn get totalTVA => real()();
  RealColumn get totalTTC => real()();
  TextColumn get statut => text().withDefault(const Constant('brouillon'))();
  TextColumn get pdfUrl => text().nullable()();
  TextColumn get notes => text().nullable()();
  DateTimeColumn get createdAt => dateTime()();
  DateTimeColumn get updatedAt => dateTime()();
  DateTimeColumn get syncedAt => dateTime().nullable()();

  @override
  Set<Column> get primaryKey => {id};
}
