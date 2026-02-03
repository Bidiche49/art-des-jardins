import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Query,
  UseGuards,
  Request,
  ParseIntPipe,
  DefaultValuePipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { TrashService } from './trash.service';
import { SoftDeleteEntity } from './trash.types';

@ApiTags('admin/trash')
@Controller('admin/trash')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class TrashController {
  constructor(private trashService: TrashService) {}

  @Get('stats')
  @Roles('patron')
  @ApiOperation({ summary: 'Statistiques de la corbeille' })
  @ApiResponse({ status: 200, description: 'Stats retournees' })
  async getStats() {
    return this.trashService.getStats();
  }

  @Get(':entity')
  @Roles('patron')
  @ApiOperation({ summary: 'Liste les elements supprimes d\'une entite' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiResponse({ status: 200, description: 'Liste retournee' })
  async listDeleted(
    @Param('entity') entity: SoftDeleteEntity,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit: number,
  ) {
    return this.trashService.listDeleted(entity, page, limit);
  }

  @Get(':entity/:id')
  @Roles('patron')
  @ApiOperation({ summary: 'Recupere un element supprime' })
  @ApiResponse({ status: 200, description: 'Element retourne' })
  @ApiResponse({ status: 404, description: 'Element non trouve' })
  async getDeleted(
    @Param('entity') entity: SoftDeleteEntity,
    @Param('id') id: string,
  ) {
    return this.trashService.getDeleted(entity, id);
  }

  @Post(':entity/:id/restore')
  @Roles('patron')
  @ApiOperation({ summary: 'Restaure un element supprime' })
  @ApiResponse({ status: 200, description: 'Element restaure' })
  @ApiResponse({ status: 404, description: 'Element non trouve' })
  async restore(
    @Param('entity') entity: SoftDeleteEntity,
    @Param('id') id: string,
    @Request() req: any,
  ) {
    return this.trashService.restore(entity, id, req.user.sub);
  }

  @Delete(':entity/:id/purge')
  @Roles('patron')
  @ApiOperation({ summary: 'Supprime definitivement un element (irreversible)' })
  @ApiResponse({ status: 200, description: 'Element supprime definitivement' })
  @ApiResponse({ status: 404, description: 'Element non trouve' })
  async purge(
    @Param('entity') entity: SoftDeleteEntity,
    @Param('id') id: string,
    @Request() req: any,
  ) {
    await this.trashService.purge(entity, id, req.user.sub);
    return { success: true, message: `Element ${entity}/${id} supprime definitivement` };
  }

  @Post('auto-purge')
  @Roles('patron')
  @ApiOperation({ summary: 'Declenche manuellement la purge automatique' })
  @ApiResponse({ status: 200, description: 'Purge effectuee' })
  async triggerAutoPurge() {
    return this.trashService.autoPurge();
  }
}
