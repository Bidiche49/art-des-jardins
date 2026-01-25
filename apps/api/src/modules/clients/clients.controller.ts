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
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { ClientsService } from './clients.service';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { ClientFiltersDto } from './dto/client-filters.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '@art-et-jardin/database';

@ApiTags('Clients')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('clients')
export class ClientsController {
  constructor(private clientsService: ClientsService) {}

  @Get()
  @ApiOperation({ summary: 'Lister les clients' })
  @ApiResponse({ status: 200, description: 'Liste paginee des clients' })
  findAll(@Query() filters: ClientFiltersDto) {
    return this.clientsService.findAll(filters);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtenir un client' })
  @ApiResponse({ status: 200, description: 'Details du client' })
  @ApiResponse({ status: 404, description: 'Client non trouve' })
  findOne(@Param('id') id: string) {
    return this.clientsService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Creer un client' })
  @ApiResponse({ status: 201, description: 'Client cree' })
  create(@Body() createClientDto: CreateClientDto) {
    return this.clientsService.create(createClientDto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Modifier un client' })
  @ApiResponse({ status: 200, description: 'Client modifie' })
  @ApiResponse({ status: 404, description: 'Client non trouve' })
  update(@Param('id') id: string, @Body() updateClientDto: UpdateClientDto) {
    return this.clientsService.update(id, updateClientDto);
  }

  @Delete(':id')
  @Roles(UserRole.patron)
  @ApiOperation({ summary: 'Supprimer un client (patron uniquement)' })
  @ApiResponse({ status: 200, description: 'Client supprime' })
  @ApiResponse({ status: 404, description: 'Client non trouve' })
  remove(@Param('id') id: string) {
    return this.clientsService.remove(id);
  }
}
