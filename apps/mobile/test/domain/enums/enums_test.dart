import 'package:art_et_jardin/domain/enums/enums.dart';
import 'package:flutter_test/flutter_test.dart';

void main() {
  // ===== ClientType =====
  group('ClientType', () {
    test('serialization: enum -> value string', () {
      expect(ClientType.particulier.value, 'particulier');
      expect(ClientType.professionnel.value, 'professionnel');
      expect(ClientType.syndic.value, 'syndic');
    });

    test('deserialization: value string -> enum', () {
      for (final e in ClientType.values) {
        final found = ClientType.values.firstWhere((v) => v.value == e.value);
        expect(found, e);
      }
    });
  });

  // ===== UserRole =====
  group('UserRole', () {
    test('serialization: enum -> value string', () {
      expect(UserRole.patron.value, 'patron');
      expect(UserRole.employe.value, 'employe');
    });

    test('deserialization: value string -> enum', () {
      for (final e in UserRole.values) {
        final found = UserRole.values.firstWhere((v) => v.value == e.value);
        expect(found, e);
      }
    });
  });

  // ===== ChantierStatut =====
  group('ChantierStatut', () {
    test('serialization: enum -> value string', () {
      expect(ChantierStatut.lead.value, 'lead');
      expect(ChantierStatut.visitePlanifiee.value, 'visite_planifiee');
      expect(ChantierStatut.devisEnvoye.value, 'devis_envoye');
      expect(ChantierStatut.accepte.value, 'accepte');
      expect(ChantierStatut.planifie.value, 'planifie');
      expect(ChantierStatut.enCours.value, 'en_cours');
      expect(ChantierStatut.termine.value, 'termine');
      expect(ChantierStatut.facture.value, 'facture');
      expect(ChantierStatut.annule.value, 'annule');
    });

    test('deserialization: value string -> enum', () {
      for (final e in ChantierStatut.values) {
        final found =
            ChantierStatut.values.firstWhere((v) => v.value == e.value);
        expect(found, e);
      }
    });

    test('has exactly 9 values', () {
      expect(ChantierStatut.values.length, 9);
    });
  });

  // ===== TypePrestation =====
  group('TypePrestation', () {
    test('serialization: enum -> value string', () {
      expect(TypePrestation.paysagisme.value, 'paysagisme');
      expect(TypePrestation.entretien.value, 'entretien');
      expect(TypePrestation.elagage.value, 'elagage');
      expect(TypePrestation.abattage.value, 'abattage');
      expect(TypePrestation.tonte.value, 'tonte');
      expect(TypePrestation.taille.value, 'taille');
      expect(TypePrestation.autre.value, 'autre');
    });

    test('deserialization: value string -> enum', () {
      for (final e in TypePrestation.values) {
        final found =
            TypePrestation.values.firstWhere((v) => v.value == e.value);
        expect(found, e);
      }
    });

    test('has exactly 7 values', () {
      expect(TypePrestation.values.length, 7);
    });
  });

  // ===== DevisStatut =====
  group('DevisStatut', () {
    test('serialization: enum -> value string', () {
      expect(DevisStatut.brouillon.value, 'brouillon');
      expect(DevisStatut.envoye.value, 'envoye');
      expect(DevisStatut.signe.value, 'signe');
      expect(DevisStatut.accepte.value, 'accepte');
      expect(DevisStatut.refuse.value, 'refuse');
      expect(DevisStatut.expire.value, 'expire');
    });

    test('deserialization: value string -> enum', () {
      for (final e in DevisStatut.values) {
        final found = DevisStatut.values.firstWhere((v) => v.value == e.value);
        expect(found, e);
      }
    });

    test('has exactly 6 values', () {
      expect(DevisStatut.values.length, 6);
    });
  });

  // ===== FactureStatut =====
  group('FactureStatut', () {
    test('serialization: enum -> value string', () {
      expect(FactureStatut.brouillon.value, 'brouillon');
      expect(FactureStatut.envoyee.value, 'envoyee');
      expect(FactureStatut.payee.value, 'payee');
      expect(FactureStatut.annulee.value, 'annulee');
    });

    test('deserialization: value string -> enum', () {
      for (final e in FactureStatut.values) {
        final found =
            FactureStatut.values.firstWhere((v) => v.value == e.value);
        expect(found, e);
      }
    });
  });

  // ===== ModePaiement =====
  group('ModePaiement', () {
    test('serialization: enum -> value string', () {
      expect(ModePaiement.virement.value, 'virement');
      expect(ModePaiement.cheque.value, 'cheque');
      expect(ModePaiement.especes.value, 'especes');
      expect(ModePaiement.carte.value, 'carte');
    });

    test('deserialization: value string -> enum', () {
      for (final e in ModePaiement.values) {
        final found =
            ModePaiement.values.firstWhere((v) => v.value == e.value);
        expect(found, e);
      }
    });
  });

  // ===== AbsenceType =====
  group('AbsenceType', () {
    test('serialization: enum -> value string', () {
      expect(AbsenceType.conge.value, 'conge');
      expect(AbsenceType.maladie.value, 'maladie');
      expect(AbsenceType.formation.value, 'formation');
      expect(AbsenceType.autre.value, 'autre');
    });

    test('deserialization: value string -> enum', () {
      for (final e in AbsenceType.values) {
        final found = AbsenceType.values.firstWhere((v) => v.value == e.value);
        expect(found, e);
      }
    });
  });

  // ===== PhotoType =====
  group('PhotoType', () {
    test('serialization: enum -> value string', () {
      expect(PhotoType.before.value, 'BEFORE');
      expect(PhotoType.during.value, 'DURING');
      expect(PhotoType.after.value, 'AFTER');
    });

    test('deserialization: value string -> enum', () {
      for (final e in PhotoType.values) {
        final found = PhotoType.values.firstWhere((v) => v.value == e.value);
        expect(found, e);
      }
    });
  });

  // ===== SenderType =====
  group('SenderType', () {
    test('serialization: enum -> value string', () {
      expect(SenderType.client.value, 'client');
      expect(SenderType.entreprise.value, 'entreprise');
    });

    test('deserialization: value string -> enum', () {
      for (final e in SenderType.values) {
        final found = SenderType.values.firstWhere((v) => v.value == e.value);
        expect(found, e);
      }
    });
  });

  // ===== NotificationType =====
  group('NotificationType', () {
    test('serialization: enum -> value string', () {
      expect(NotificationType.info.value, 'info');
      expect(NotificationType.warning.value, 'warning');
      expect(NotificationType.success.value, 'success');
      expect(NotificationType.actionRequired.value, 'action_required');
    });

    test('deserialization: value string -> enum', () {
      for (final e in NotificationType.values) {
        final found =
            NotificationType.values.firstWhere((v) => v.value == e.value);
        expect(found, e);
      }
    });
  });

  // ===== SyncStatus =====
  group('SyncStatus', () {
    test('serialization: enum -> value string', () {
      expect(SyncStatus.pending.value, 'pending');
      expect(SyncStatus.syncing.value, 'syncing');
      expect(SyncStatus.synced.value, 'synced');
      expect(SyncStatus.failed.value, 'failed');
      expect(SyncStatus.conflict.value, 'conflict');
    });

    test('deserialization: value string -> enum', () {
      for (final e in SyncStatus.values) {
        final found = SyncStatus.values.firstWhere((v) => v.value == e.value);
        expect(found, e);
      }
    });
  });

  // ===== DocumentType =====
  group('DocumentType', () {
    test('serialization: enum -> value string', () {
      expect(DocumentType.devis.value, 'devis');
      expect(DocumentType.devisSigne.value, 'devis_signe');
      expect(DocumentType.facture.value, 'facture');
      expect(DocumentType.relance.value, 'relance');
    });

    test('deserialization: value string -> enum', () {
      for (final e in DocumentType.values) {
        final found =
            DocumentType.values.firstWhere((v) => v.value == e.value);
        expect(found, e);
      }
    });
  });

  // ===== CalendarProvider =====
  group('CalendarProvider', () {
    test('serialization: enum -> value string', () {
      expect(CalendarProvider.google.value, 'google');
      expect(CalendarProvider.microsoft.value, 'microsoft');
    });

    test('deserialization: value string -> enum', () {
      for (final e in CalendarProvider.values) {
        final found =
            CalendarProvider.values.firstWhere((v) => v.value == e.value);
        expect(found, e);
      }
    });
  });

  // ===== Label FR spot checks =====
  group('Label FR', () {
    test('ChantierStatut labels are in French', () {
      expect(ChantierStatut.visitePlanifiee.label, 'Visite planifiée');
      expect(ChantierStatut.enCours.label, 'En cours');
    });

    test('TypePrestation labels are in French', () {
      expect(TypePrestation.elagage.label, 'Élagage');
      expect(TypePrestation.paysagisme.label, 'Paysagisme');
    });

    test('FactureStatut labels are in French', () {
      expect(FactureStatut.envoyee.label, 'Envoyée');
      expect(FactureStatut.annulee.label, 'Annulée');
    });

    test('AbsenceType labels are in French', () {
      expect(AbsenceType.conge.label, 'Congé');
      expect(AbsenceType.maladie.label, 'Maladie');
    });

    test('PhotoType labels are in French', () {
      expect(PhotoType.before.label, 'Avant');
      expect(PhotoType.during.label, 'Pendant');
      expect(PhotoType.after.label, 'Après');
    });

    test('NotificationType labels are in French', () {
      expect(NotificationType.actionRequired.label, 'Action requise');
      expect(NotificationType.warning.label, 'Avertissement');
    });

    test('SyncStatus labels are in French', () {
      expect(SyncStatus.pending.label, 'En attente');
      expect(SyncStatus.conflict.label, 'Conflit');
    });

    test('DocumentType labels are in French', () {
      expect(DocumentType.devisSigne.label, 'Devis signé');
      expect(DocumentType.relance.label, 'Relance');
    });
  });
}
