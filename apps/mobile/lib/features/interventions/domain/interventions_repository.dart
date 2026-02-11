import '../../../domain/models/intervention.dart';

abstract class InterventionsRepository {
  Future<List<Intervention>> getAll();
  Future<Intervention> getById(String id);
  Future<Intervention> create(Intervention intervention);
  Future<Intervention> update(Intervention intervention);
  Future<void> delete(String id);
  Future<List<Intervention>> getByChantier(String chantierId);
  Future<List<Intervention>> getByDate(DateTime date);
  Future<List<Intervention>> getByDateRange(DateTime start, DateTime end);
}
