import 'package:drift/drift.dart';

import 'daos/absences_dao.dart';
import 'daos/chantiers_dao.dart';
import 'daos/clients_dao.dart';
import 'daos/devis_dao.dart';
import 'daos/factures_dao.dart';
import 'daos/interventions_dao.dart';
import 'daos/photo_queue_dao.dart';
import 'daos/sync_meta_dao.dart';
import 'daos/sync_queue_dao.dart';
import 'tables/absences_table.dart';
import 'tables/chantiers_table.dart';
import 'tables/clients_table.dart';
import 'tables/devis_table.dart';
import 'tables/factures_table.dart';
import 'tables/interventions_table.dart';
import 'tables/photo_queue_table.dart';
import 'tables/sync_meta_table.dart';
import 'tables/sync_queue_table.dart';

part 'app_database.g.dart';

@DriftDatabase(
  tables: [
    ClientsTable,
    ChantiersTable,
    InterventionsTable,
    DevisTable,
    FacturesTable,
    AbsencesTable,
    SyncQueueTable,
    SyncMetaTable,
    PhotoQueueTable,
  ],
  daos: [
    ClientsDao,
    ChantiersDao,
    InterventionsDao,
    DevisDao,
    FacturesDao,
    AbsencesDao,
    SyncQueueDao,
    SyncMetaDao,
    PhotoQueueDao,
  ],
)
class AppDatabase extends _$AppDatabase {
  AppDatabase(super.e);

  @override
  int get schemaVersion => 1;
}
