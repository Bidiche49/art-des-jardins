import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { TemplatesService } from './templates.service';
import { CreateTemplateDto } from './dto/create-template.dto';
import { UpdateTemplateDto } from './dto/update-template.dto';
import { QueryTemplateDto } from './dto/query-template.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole, PrestationTemplate } from '@art-et-jardin/database';

interface PaginatedResult<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

@ApiTags('Templates')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('templates')
export class TemplatesController {
  constructor(private templatesService: TemplatesService) {}

  @Get('categories')
  @ApiOperation({ summary: 'Lister les categories disponibles' })
  @ApiResponse({ status: 200, description: 'Liste des categories' })
  getCategories() {
    // TODO: implémenter la vraie logique
    return ['general', 'entretien', 'creation', 'elagage'];
  }

  @Get()
  @ApiOperation({ summary: 'Lister les templates de prestations' })
  @ApiResponse({ status: 200, description: 'Liste paginee des templates' })
  findAll(@Query() query: QueryTemplateDto): Promise<PaginatedResult<PrestationTemplate>> {
    return this.templatesService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtenir un template' })
  @ApiResponse({ status: 200, description: 'Details du template' })
  @ApiResponse({ status: 404, description: 'Template non trouve' })
  findOne(@Param('id') id: string): Promise<PrestationTemplate> {
    return this.templatesService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Creer un template' })
  @ApiResponse({ status: 201, description: 'Template cree' })
  create(@Body() createTemplateDto: CreateTemplateDto, @Request() req: any): Promise<PrestationTemplate> {
    return this.templatesService.create(createTemplateDto, req.user?.sub);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Modifier un template' })
  @ApiResponse({ status: 200, description: 'Template modifie' })
  @ApiResponse({ status: 404, description: 'Template non trouve' })
  update(@Param('id') id: string, @Body() updateTemplateDto: UpdateTemplateDto): Promise<PrestationTemplate> {
    return this.templatesService.update(id, updateTemplateDto);
  }

  @Delete(':id')
  @Roles(UserRole.patron)
  @ApiOperation({ summary: 'Supprimer un template (patron uniquement)' })
  @ApiResponse({ status: 200, description: 'Template supprime' })
  @ApiResponse({ status: 404, description: 'Template non trouve' })
  remove(@Param('id') id: string): Promise<PrestationTemplate> {
    return this.templatesService.remove(id);
  }
}
