import '../../../domain/models/rentabilite_data.dart';

class RentabiliteCalculator {
  const RentabiliteCalculator._();

  static const double tauxHoraire = 35.0;

  static double computeCA(List<double> devisAcceptesTTC) {
    return _round(devisAcceptesTTC.fold(0.0, (sum, ttc) => sum + ttc));
  }

  static double computeCouts(int totalMinutes) {
    return _round((totalMinutes / 60.0) * tauxHoraire);
  }

  static double computeMarge(double ca, double couts) {
    return _round(ca - couts);
  }

  static double computeMargePercent(double marge, double ca) {
    if (ca <= 0) return 0.0;
    return _round((marge / ca) * 100);
  }

  static RentabiliteData computeAll({
    required String chantierId,
    required List<double> devisAcceptesTTC,
    required int totalMinutes,
  }) {
    final ca = computeCA(devisAcceptesTTC);
    final rawHeures = totalMinutes / 60.0;
    final totalHeures = _round(rawHeures);
    final coutMainOeuvre = computeCouts(totalMinutes);
    final marge = computeMarge(ca, coutMainOeuvre);
    final margePercent = computeMargePercent(marge, ca);

    return RentabiliteData(
      chantierId: chantierId,
      totalHeures: totalHeures,
      coutMainOeuvre: coutMainOeuvre,
      totalMateriel: 0.0,
      totalDevis: ca,
      marge: marge,
      margePercent: margePercent,
    );
  }

  static double _round(double value) {
    return double.parse(value.toStringAsFixed(2));
  }
}
