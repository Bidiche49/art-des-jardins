import { IsOptional, IsDateString } from 'class-validator';

export class RapportFilterDto {
  @IsOptional()
  @IsDateString()
  dateDebut?: string;

  @IsOptional()
  @IsDateString()
  dateFin?: string;
}
