import {
  Controller,
  Post,
  Body,
  Req,
  UseInterceptors,
  UploadedFiles,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { Throttle } from '@nestjs/throttler';
import { ApiTags, ApiOperation, ApiConsumes, ApiBody } from '@nestjs/swagger';
import { Request } from 'express';
import { ContactService } from './contact.service';
import { CreateContactDto } from './dto/create-contact.dto';

@ApiTags('Contact')
@Controller('contact')
export class ContactController {
  constructor(private contactService: ContactService) {}

  @Post()
  @Throttle({ default: { limit: 5, ttl: 60000 } })
  @UseInterceptors(FilesInterceptor('photos', 3))
  @ApiOperation({ summary: 'Soumettre une demande de contact (public)' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      required: ['name', 'email', 'message'],
      properties: {
        name: { type: 'string' },
        email: { type: 'string', format: 'email' },
        phone: { type: 'string' },
        city: { type: 'string' },
        service: { type: 'string' },
        message: { type: 'string' },
        honeypot: { type: 'string' },
        photos: {
          type: 'array',
          items: { type: 'string', format: 'binary' },
          maxItems: 3,
        },
      },
    },
  })
  async submitContact(
    @Body() dto: CreateContactDto,
    @UploadedFiles() files: Express.Multer.File[],
    @Req() req: Request,
  ) {
    const ip = req.ip || req.socket?.remoteAddress;
    const userAgent = req.headers['user-agent'];
    return this.contactService.submitContact(dto, files, ip, userAgent);
  }
}
