import '../../../domain/enums/chantier_statut.dart';
import '../../../domain/models/chantier.dart';

abstract class ChantiersRepository {
  Future<List<Chantier>> getAll();
  Future<Chantier> getById(String id);
  Future<Chantier> create(Chantier chantier);
  Future<Chantier> update(Chantier chantier);
  Future<void> delete(String id);
  Future<List<Chantier>> searchByAddress(String query);
  Future<List<Chantier>> getByStatut(ChantierStatut statut);
  Future<List<Chantier>> getByClient(String clientId);
}
