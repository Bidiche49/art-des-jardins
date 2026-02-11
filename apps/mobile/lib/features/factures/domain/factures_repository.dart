import '../../../domain/enums/facture_statut.dart';
import '../../../domain/models/facture.dart';

abstract class FacturesRepository {
  Future<List<Facture>> getAll();
  Future<Facture> getById(String id);
  Future<List<Facture>> getByStatut(FactureStatut statut);
  Future<List<Facture>> getEnRetard();
  Future<String> getPdfUrl(String id);
}
