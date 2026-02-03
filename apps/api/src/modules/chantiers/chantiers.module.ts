import { Module } from '@nestjs/common';
import { ChantiersController } from './chantiers.controller';
import { ChantiersService } from './chantiers.service';
import { QRCodeService } from './qrcode.service';

@Module({
  controllers: [ChantiersController],
  providers: [ChantiersService, QRCodeService],
  exports: [ChantiersService, QRCodeService],
})
export class ChantiersModule {}
