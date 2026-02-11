import 'package:drift/drift.dart';

class FacturesTable extends Table {
  @override
  String get tableName => 'factures';

  TextColumn get id => text()();
  TextColumn get devisId => text()();
  TextColumn get numero => text()();
  DateTimeColumn get dateEmission => dateTime()();
  DateTimeColumn get dateEcheance => dateTime()();
  DateTimeColumn get datePaiement => dateTime().nullable()();
  RealColumn get totalHT => real()();
  RealColumn get totalTVA => real()();
  RealColumn get totalTTC => real()();
  TextColumn get statut => text().withDefault(const Constant('brouillon'))();
  TextColumn get modePaiement => text().nullable()();
  TextColumn get pdfUrl => text().nullable()();
  TextColumn get notes => text().nullable()();
  DateTimeColumn get createdAt => dateTime()();
  DateTimeColumn get updatedAt => dateTime()();
  DateTimeColumn get syncedAt => dateTime().nullable()();

  @override
  Set<Column> get primaryKey => {id};
}
