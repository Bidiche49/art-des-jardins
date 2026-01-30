import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { FinanceReportsService } from './finance-reports.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@ApiTags('Finance Reports')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('patron')
@Controller('analytics/finance')
export class FinanceReportsController {
  constructor(private readonly financeService: FinanceReportsService) {}

  @Get('summary')
  @ApiOperation({ summary: 'Resume financier' })
  @ApiQuery({ name: 'year', required: false, type: Number })
  async getSummary(@Query('year') year?: string) {
    const y = year ? parseInt(year, 10) : new Date().getFullYear();
    return this.financeService.getFinancialSummary(y);
  }

  @Get('revenue-by-period')
  @ApiOperation({ summary: 'CA par periode' })
  @ApiQuery({ name: 'year', required: false, type: Number })
  async getRevenueByPeriod(@Query('year') year?: string) {
    const y = year ? parseInt(year, 10) : new Date().getFullYear();
    return this.financeService.getRevenueByPeriod(y);
  }

  @Get('revenue-by-client')
  @ApiOperation({ summary: 'CA par client' })
  @ApiQuery({ name: 'year', required: false, type: Number })
  async getRevenueByClient(@Query('year') year?: string) {
    const y = year ? parseInt(year, 10) : new Date().getFullYear();
    return this.financeService.getRevenueByClient(y);
  }

  @Get('revenue-by-prestation')
  @ApiOperation({ summary: 'CA par type de prestation' })
  @ApiQuery({ name: 'year', required: false, type: Number })
  async getRevenueByPrestation(@Query('year') year?: string) {
    const y = year ? parseInt(year, 10) : new Date().getFullYear();
    return this.financeService.getRevenueByPrestation(y);
  }

  @Get('unpaid')
  @ApiOperation({ summary: 'Factures impayes en retard' })
  async getUnpaidInvoices() {
    return this.financeService.getUnpaidInvoices();
  }

  @Get('forecast')
  @ApiOperation({ summary: 'Previsionnel (devis acceptes non factures)' })
  async getForecast() {
    return this.financeService.getForecast();
  }
}
