import 'package:drift/drift.dart';

import 'devis_table.dart';

class LignesDevisTable extends Table {
  @override
  String get tableName => 'lignes_devis';

  TextColumn get id => text()();
  TextColumn get devisId => text().references(DevisTable, #id)();
  TextColumn get description => text()();
  RealColumn get quantite => real()();
  TextColumn get unite => text()();
  RealColumn get prixUnitaireHT => real()();
  RealColumn get tva => real().withDefault(const Constant(20.0))();
  RealColumn get montantHT => real()();
  RealColumn get montantTTC => real()();
  IntColumn get ordre => integer()();
  DateTimeColumn get syncedAt => dateTime().nullable()();

  @override
  Set<Column> get primaryKey => {id};
}
