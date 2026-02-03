import { IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ForceRelanceDto {
  @ApiProperty({
    description: 'Niveau de relance a envoyer',
    enum: ['rappel_amical', 'rappel_ferme', 'mise_en_demeure'],
    example: 'rappel_amical',
  })
  @IsEnum(['rappel_amical', 'rappel_ferme', 'mise_en_demeure'], {
    message: 'level doit etre rappel_amical, rappel_ferme ou mise_en_demeure',
  })
  level: 'rappel_amical' | 'rappel_ferme' | 'mise_en_demeure';
}
