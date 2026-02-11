import 'package:flutter_test/flutter_test.dart';

import 'package:art_et_jardin/features/chantiers/domain/rentabilite_calculator.dart';

void main() {
  group('RentabiliteCalculator', () {
    test('CA = somme devis acceptes', () {
      final ca =
          RentabiliteCalculator.computeCA([1000.0, 2000.0, 500.0]);
      expect(ca, 3500.0);
    });

    test('Couts = somme interventions (heures x taux)', () {
      // 120 minutes = 2 hours, taux = 35€/h -> 70€
      final couts = RentabiliteCalculator.computeCouts(120);
      expect(couts, 70.0);
    });

    test('Marge = CA - Couts', () {
      final marge = RentabiliteCalculator.computeMarge(3500.0, 70.0);
      expect(marge, 3430.0);
    });

    test('Taux marge = Marge / CA * 100', () {
      final margePercent =
          RentabiliteCalculator.computeMargePercent(3430.0, 3500.0);
      expect(margePercent, 98.0);
    });

    test('Chantier sans devis -> CA = 0', () {
      final ca = RentabiliteCalculator.computeCA([]);
      expect(ca, 0.0);
    });

    test('Chantier sans intervention -> Couts = 0', () {
      final couts = RentabiliteCalculator.computeCouts(0);
      expect(couts, 0.0);
    });

    test('Chantier vide -> marge 0%', () {
      final data = RentabiliteCalculator.computeAll(
        chantierId: 'ch1',
        devisAcceptesTTC: [],
        totalMinutes: 0,
      );
      expect(data.margePercent, 0.0);
      expect(data.totalDevis, 0.0);
      expect(data.coutMainOeuvre, 0.0);
      expect(data.marge, 0.0);
    });

    test('Donnees correctes pour graphique camembert', () {
      final data = RentabiliteCalculator.computeAll(
        chantierId: 'ch1',
        devisAcceptesTTC: [5000.0],
        totalMinutes: 480, // 8h
      );

      // 8h * 35€ = 280€
      expect(data.coutMainOeuvre, 280.0);
      expect(data.totalMateriel, 0.0);
      // Marge = 5000 - 280 = 4720
      expect(data.marge, 4720.0);

      // For pie chart: coutMainOeuvre + totalMateriel + marge = totalDevis
      expect(data.coutMainOeuvre + data.totalMateriel + data.marge,
          data.totalDevis);
    });

    test('Donnees correctes pour graphique barres', () {
      final data = RentabiliteCalculator.computeAll(
        chantierId: 'ch1',
        devisAcceptesTTC: [3000.0, 2000.0],
        totalMinutes: 600, // 10h
      );

      expect(data.totalDevis, 5000.0); // CA bar
      expect(data.coutMainOeuvre, 350.0); // Couts bar (10h * 35€)
      expect(data.marge, 4650.0); // Marge bar
    });

    test('Arrondi a 2 decimales', () {
      // 100 minutes = 1.6667h, * 35 = 58.3333...
      final couts = RentabiliteCalculator.computeCouts(100);
      expect(couts, 58.33);

      final data = RentabiliteCalculator.computeAll(
        chantierId: 'ch1',
        devisAcceptesTTC: [1000.0],
        totalMinutes: 100,
      );
      expect(data.totalHeures, 1.67);
      expect(data.coutMainOeuvre, 58.33); // (100/60)*35, not rounded hours * 35
      expect(data.marge, 941.67); // 1000 - 58.33
      expect(data.margePercent, 94.17); // 941.67/1000*100
    });
  });
}
