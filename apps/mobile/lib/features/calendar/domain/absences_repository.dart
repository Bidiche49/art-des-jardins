import '../../../domain/models/absence.dart';

abstract class AbsencesRepository {
  Future<List<Absence>> getAll();
  Future<List<Absence>> getMyAbsences(String userId);
  Future<List<Absence>> getPendingAbsences();
  Future<Absence> create(Absence absence);
  Future<Absence> validate(String id);
  Future<Absence> refuse(String id);
  Future<void> delete(String id);
}
