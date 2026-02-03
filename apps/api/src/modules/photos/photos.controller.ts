import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Body,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  Request,
  ParseUUIDPipe,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiResponse,
  ApiConsumes,
  ApiBody,
} from '@nestjs/swagger';
import { PhotosService } from './photos.service';
import { CreatePhotoDto, PhotoResponseDto } from './dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Photos')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller()
export class PhotosController {
  constructor(private readonly photosService: PhotosService) {}

  @Post('interventions/:interventionId/photos')
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({ summary: 'Upload une photo pour une intervention' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Photo file and metadata',
    schema: {
      type: 'object',
      required: ['file', 'type', 'takenAt'],
      properties: {
        file: {
          type: 'string',
          format: 'binary',
          description: 'Image file (JPEG, PNG, WebP, HEIC)',
        },
        type: {
          type: 'string',
          enum: ['BEFORE', 'DURING', 'AFTER'],
          description: 'Type de photo',
        },
        latitude: {
          type: 'number',
          description: 'Latitude GPS',
        },
        longitude: {
          type: 'number',
          description: 'Longitude GPS',
        },
        takenAt: {
          type: 'string',
          format: 'date-time',
          description: 'Date/heure de prise de la photo',
        },
      },
    },
  })
  @ApiResponse({ status: 201, description: 'Photo uploadee', type: PhotoResponseDto })
  @ApiResponse({ status: 400, description: 'Fichier invalide' })
  @ApiResponse({ status: 404, description: 'Intervention non trouvee' })
  async uploadPhoto(
    @Param('interventionId', ParseUUIDPipe) interventionId: string,
    @UploadedFile() file: Express.Multer.File,
    @Body() dto: CreatePhotoDto,
    @Request() req: any,
  ): Promise<PhotoResponseDto> {
    if (!file) {
      throw new BadRequestException('No file provided');
    }
    return this.photosService.uploadPhoto(interventionId, file, dto, req.user.sub);
  }

  @Get('interventions/:interventionId/photos')
  @ApiOperation({ summary: 'Lister les photos d\'une intervention' })
  @ApiResponse({
    status: 200,
    description: 'Liste des photos',
    type: [PhotoResponseDto],
  })
  @ApiResponse({ status: 404, description: 'Intervention non trouvee' })
  async getPhotosByIntervention(
    @Param('interventionId', ParseUUIDPipe) interventionId: string,
  ): Promise<PhotoResponseDto[]> {
    return this.photosService.getPhotosByIntervention(interventionId);
  }

  @Get('photos/:id')
  @ApiOperation({ summary: 'Obtenir une photo par ID' })
  @ApiResponse({ status: 200, description: 'Details de la photo', type: PhotoResponseDto })
  @ApiResponse({ status: 404, description: 'Photo non trouvee' })
  async getPhotoById(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<PhotoResponseDto> {
    return this.photosService.getPhotoById(id);
  }

  @Delete('photos/:id')
  @ApiOperation({ summary: 'Supprimer une photo' })
  @ApiResponse({ status: 200, description: 'Photo supprimee' })
  @ApiResponse({ status: 404, description: 'Photo non trouvee' })
  async deletePhoto(
    @Param('id', ParseUUIDPipe) id: string,
    @Request() req: any,
  ): Promise<{ success: boolean }> {
    await this.photosService.deletePhoto(id, req.user.sub);
    return { success: true };
  }
}
