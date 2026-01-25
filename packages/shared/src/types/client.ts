import { BaseEntity, UUID } from './common';

export type ClientType = 'particulier' | 'professionnel' | 'syndic';

export interface Client extends BaseEntity {
  type: ClientType;
  // Identite
  nom: string;
  prenom?: string;
  raisonSociale?: string;
  // Contact
  email: string;
  telephone: string;
  telephoneSecondaire?: string;
  // Adresse
  adresse: string;
  codePostal: string;
  ville: string;
  // Metadata
  notes?: string;
  tags?: string[];
}

export interface CreateClientDto {
  type: ClientType;
  nom: string;
  prenom?: string;
  raisonSociale?: string;
  email: string;
  telephone: string;
  telephoneSecondaire?: string;
  adresse: string;
  codePostal: string;
  ville: string;
  notes?: string;
  tags?: string[];
}

export interface UpdateClientDto extends Partial<CreateClientDto> {}

export interface ClientFilters {
  type?: ClientType;
  ville?: string;
  search?: string;
  tags?: string[];
}
