import '../../../domain/enums/devis_statut.dart';
import '../../../domain/models/devis.dart';
import '../../../domain/models/ligne_devis.dart';
import '../../../domain/models/prestation_template.dart';

abstract class DevisRepository {
  Future<List<Devis>> getAll();
  Future<Devis> getById(String id);
  Future<List<LigneDevis>> getLignes(String devisId);
  Future<Devis> create({
    required String chantierId,
    required List<LigneDevis> lignes,
    int validiteJours = 30,
    String? conditionsParticulieres,
    String? notes,
  });
  Future<Devis> update({
    required String id,
    required List<LigneDevis> lignes,
    int? validiteJours,
    String? conditionsParticulieres,
    String? notes,
  });
  Future<void> delete(String id);
  Future<List<Devis>> getByChantier(String chantierId);
  Future<List<Devis>> getByStatut(DevisStatut statut);
  Future<Devis> updateStatut(String id, DevisStatut statut);
  Future<String> getPdfUrl(String id);
  Future<List<PrestationTemplate>> getTemplates();
}
