import { Module, forwardRef } from '@nestjs/common';
import { DatabaseModule } from '../../database/database.module';
import { MailModule } from '../mail/mail.module';
import { PdfModule } from '../pdf/pdf.module';
import { DocumentArchiveModule } from '../document-archive/document-archive.module';
import { AutoSendService } from './auto-send.service';

@Module({
  imports: [
    DatabaseModule,
    MailModule,
    PdfModule,
    DocumentArchiveModule,
  ],
  providers: [AutoSendService],
  exports: [AutoSendService],
})
export class AutoSendModule {}
