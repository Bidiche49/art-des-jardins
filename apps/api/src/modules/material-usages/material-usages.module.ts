import { Module } from '@nestjs/common';
import { MaterialUsagesController } from './material-usages.controller';
import { MaterialUsagesService } from './material-usages.service';

@Module({
  controllers: [MaterialUsagesController],
  providers: [MaterialUsagesService],
  exports: [MaterialUsagesService],
})
export class MaterialUsagesModule {}
