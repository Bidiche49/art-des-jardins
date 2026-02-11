import '../../../domain/enums/client_type.dart';
import '../../../domain/models/client.dart';

abstract class ClientsRepository {
  Future<List<Client>> getAll();
  Future<Client> getById(String id);
  Future<Client> create(Client client);
  Future<Client> update(Client client);
  Future<void> delete(String id);
  Future<List<Client>> searchByName(String query);
  Future<List<Client>> getByType(ClientType type);
}
