import { PartialType } from '@nestjs/swagger';
import { CreateMaterialUsageDto } from './create-material-usage.dto';

export class UpdateMaterialUsageDto extends PartialType(CreateMaterialUsageDto) {}
