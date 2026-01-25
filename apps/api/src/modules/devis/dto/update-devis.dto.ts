import { PartialType, OmitType } from '@nestjs/swagger';
import { CreateDevisDto } from './create-devis.dto';

export class UpdateDevisDto extends PartialType(OmitType(CreateDevisDto, ['chantierId'] as const)) {}
