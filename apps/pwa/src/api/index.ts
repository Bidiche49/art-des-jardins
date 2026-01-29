export { default as apiClient } from './client';
export { default as authApi } from './auth';
export { default as clientsApi } from './clients';
export { default as chantiersApi } from './chantiers';
export { default as devisApi } from './devis';
export { default as facturesApi } from './factures';
export { default as interventionsApi } from './interventions';
export { default as uploadApi } from './upload';
export { default as statsApi } from './stats';
export { default as notificationsApi } from './notifications';
export { default as absencesApi } from './absences';

export type { DevisFilters } from './devis';
export type { FactureFilters } from './factures';
export type {
  Intervention,
  CreateInterventionDto,
  UpdateInterventionDto,
  InterventionFilters,
  InterventionStatut,
} from './interventions';
export type { UploadResponse } from './upload';
export type {
  DashboardStats,
  ChiffreAffairesMensuel,
  InterventionAVenir,
} from './stats';
export type {
  Absence,
  CreateAbsenceDto,
  UpdateAbsenceDto,
  AbsenceFilters,
  AbsenceType,
} from './absences';
