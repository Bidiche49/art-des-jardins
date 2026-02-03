import { Module } from '@nestjs/common';
import { RentabiliteService } from './rentabilite.service';
import { RentabiliteController } from './rentabilite.controller';

@Module({
  controllers: [RentabiliteController],
  providers: [RentabiliteService],
  exports: [RentabiliteService],
})
export class RentabiliteModule {}
