import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Patch,
  Body,
  Param,
  Query,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse, ApiProduces } from '@nestjs/swagger';
import { Response } from 'express';
import { ChantiersService } from './chantiers.service';
import { QRCodeService } from './qrcode.service';
import { CreateChantierDto } from './dto/create-chantier.dto';
import { UpdateChantierDto } from './dto/update-chantier.dto';
import { ChantierFiltersDto } from './dto/chantier-filters.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '@art-et-jardin/database';

@ApiTags('Chantiers')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('chantiers')
export class ChantiersController {
  constructor(
    private chantiersService: ChantiersService,
    private qrcodeService: QRCodeService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Lister les chantiers' })
  @ApiResponse({ status: 200, description: 'Liste paginee des chantiers' })
  findAll(@Query() filters: ChantierFiltersDto) {
    return this.chantiersService.findAll(filters);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtenir un chantier' })
  @ApiResponse({ status: 200, description: 'Details du chantier' })
  @ApiResponse({ status: 404, description: 'Chantier non trouve' })
  findOne(@Param('id') id: string) {
    return this.chantiersService.findOne(id);
  }

  @Get(':id/qrcode')
  @ApiOperation({ summary: 'Obtenir le QR code du chantier (PNG)' })
  @ApiProduces('image/png')
  @ApiResponse({ status: 200, description: 'QR code PNG' })
  @ApiResponse({ status: 404, description: 'Chantier non trouve' })
  async getQRCode(@Param('id') id: string, @Res() res: Response) {
    await this.chantiersService.findOne(id);
    const buffer = await this.qrcodeService.generateChantierQR(id);
    res.set({
      'Content-Type': 'image/png',
      'Content-Disposition': `inline; filename="chantier-${id}-qrcode.png"`,
    });
    res.send(buffer);
  }

  @Get(':id/qrcode/svg')
  @ApiOperation({ summary: 'Obtenir le QR code du chantier (SVG)' })
  @ApiProduces('image/svg+xml')
  @ApiResponse({ status: 200, description: 'QR code SVG' })
  @ApiResponse({ status: 404, description: 'Chantier non trouve' })
  async getQRCodeSVG(@Param('id') id: string, @Res() res: Response) {
    await this.chantiersService.findOne(id);
    const svg = await this.qrcodeService.generateChantierQRSVG(id);
    res.set({
      'Content-Type': 'image/svg+xml',
      'Content-Disposition': `inline; filename="chantier-${id}-qrcode.svg"`,
    });
    res.send(svg);
  }

  @Get(':id/qrcode/dataurl')
  @ApiOperation({ summary: 'Obtenir le QR code du chantier (Data URL base64)' })
  @ApiResponse({ status: 200, description: 'QR code Data URL' })
  @ApiResponse({ status: 404, description: 'Chantier non trouve' })
  async getQRCodeDataURL(@Param('id') id: string) {
    await this.chantiersService.findOne(id);
    const dataUrl = await this.qrcodeService.generateChantierQRDataURL(id);
    return { dataUrl };
  }

  @Post()
  @ApiOperation({ summary: 'Creer un chantier' })
  @ApiResponse({ status: 201, description: 'Chantier cree' })
  create(@Body() createChantierDto: CreateChantierDto) {
    return this.chantiersService.create(createChantierDto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Modifier un chantier' })
  @ApiResponse({ status: 200, description: 'Chantier modifie' })
  @ApiResponse({ status: 404, description: 'Chantier non trouve' })
  update(@Param('id') id: string, @Body() updateChantierDto: UpdateChantierDto) {
    return this.chantiersService.update(id, updateChantierDto);
  }

  @Patch(':id/statut')
  @ApiOperation({ summary: 'Changer le statut du chantier' })
  @ApiResponse({ status: 200, description: 'Statut mis a jour' })
  updateStatut(@Param('id') id: string, @Body('statut') statut: string) {
    return this.chantiersService.updateStatut(id, statut);
  }

  @Delete(':id')
  @Roles(UserRole.patron)
  @ApiOperation({ summary: 'Supprimer un chantier (patron uniquement)' })
  @ApiResponse({ status: 200, description: 'Chantier supprime' })
  @ApiResponse({ status: 404, description: 'Chantier non trouve' })
  remove(@Param('id') id: string) {
    return this.chantiersService.remove(id);
  }
}
