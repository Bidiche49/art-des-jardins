import 'package:drift/drift.dart';

import '../app_database.dart';
import '../tables/clients_table.dart';

part 'clients_dao.g.dart';

@DriftAccessor(tables: [ClientsTable])
class ClientsDao extends DatabaseAccessor<AppDatabase>
    with _$ClientsDaoMixin {
  ClientsDao(super.db);

  Future<List<ClientsTableData>> getAll() => select(clientsTable).get();

  Stream<List<ClientsTableData>> watchAll() => select(clientsTable).watch();

  Future<ClientsTableData?> getById(String id) =>
      (select(clientsTable)..where((t) => t.id.equals(id)))
          .getSingleOrNull();

  Future<List<ClientsTableData>> getByType(String type) =>
      (select(clientsTable)..where((t) => t.type.equals(type))).get();

  Future<int> insertOne(ClientsTableCompanion entry) =>
      into(clientsTable).insert(entry);

  Future<bool> updateOne(ClientsTableCompanion entry) =>
      update(clientsTable).replace(entry);

  Future<int> deleteById(String id) =>
      (delete(clientsTable)..where((t) => t.id.equals(id))).go();
}
