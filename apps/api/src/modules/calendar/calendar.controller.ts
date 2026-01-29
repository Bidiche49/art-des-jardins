import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Query,
  UseGuards,
  Request,
  Res,
  Header,
} from '@nestjs/common';
import { Response } from 'express';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { CalendarService } from './calendar.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Calendar')
@Controller('calendar')
export class CalendarController {
  constructor(private calendarService: CalendarService) {}

  // Public endpoint - accessed via token in URL
  @Get('ical')
  @ApiOperation({ summary: 'Obtenir le flux iCal (authentification par token)' })
  @ApiResponse({ status: 200, description: 'Flux iCal' })
  @ApiResponse({ status: 404, description: 'Token invalide' })
  @Header('Content-Type', 'text/calendar; charset=utf-8')
  async getIcalFeed(@Query('token') token: string, @Res() res: Response) {
    const user = await this.calendarService.getUserByIcalToken(token);
    const calendar = await this.calendarService.generateIcalFeed(user.id);

    res.setHeader(
      'Content-Disposition',
      `attachment; filename="art-jardin-${user.prenom.toLowerCase()}.ics"`,
    );
    res.send(calendar.toString());
  }

  // Protected endpoints
  @Get('ical/token')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Obtenir mon token iCal actuel' })
  @ApiResponse({ status: 200, description: 'Token iCal' })
  async getMyIcalToken(@Request() req: any) {
    const token = await this.calendarService.getIcalToken(req.user.sub);
    return { token };
  }

  @Post('ical/token')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Generer un nouveau token iCal' })
  @ApiResponse({ status: 201, description: 'Nouveau token genere' })
  async generateIcalToken(@Request() req: any) {
    const token = await this.calendarService.generateIcalToken(req.user.sub);
    return { token };
  }

  @Delete('ical/token')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Revoquer mon token iCal' })
  @ApiResponse({ status: 200, description: 'Token revoque' })
  async revokeIcalToken(@Request() req: any) {
    await this.calendarService.revokeIcalToken(req.user.sub);
    return { message: 'Token revoque' };
  }

  @Get('ical/download')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Telecharger mon calendrier iCal (ponctuel)' })
  @ApiResponse({ status: 200, description: 'Fichier ICS' })
  @Header('Content-Type', 'text/calendar; charset=utf-8')
  async downloadIcal(@Request() req: any, @Res() res: Response) {
    const calendar = await this.calendarService.generateIcalFeed(req.user.sub);

    res.setHeader(
      'Content-Disposition',
      'attachment; filename="art-jardin-interventions.ics"',
    );
    res.send(calendar.toString());
  }
}
