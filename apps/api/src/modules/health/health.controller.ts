import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { HealthService } from './health.service';

@ApiTags('Health')
@Controller('health')
export class HealthController {
  constructor(private healthService: HealthService) {}

  @Get()
  @ApiOperation({ summary: 'Basic health check' })
  @ApiResponse({ status: 200, description: 'API is healthy' })
  check() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    };
  }

  @Get('live')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Liveness probe for Kubernetes' })
  @ApiResponse({ status: 200, description: 'Application is alive' })
  async liveness() {
    return this.healthService.checkLiveness();
  }

  @Get('ready')
  @ApiOperation({ summary: 'Readiness probe for Kubernetes' })
  @ApiResponse({ status: 200, description: 'Application is ready to receive traffic' })
  @ApiResponse({ status: 503, description: 'Application is not ready' })
  async readiness() {
    const result = await this.healthService.checkReadiness();
    return result;
  }

  @Get('detailed')
  @ApiOperation({ summary: 'Detailed health status of all services' })
  @ApiResponse({ status: 200, description: 'Detailed health status' })
  async detailed() {
    return this.healthService.getDetailedHealth();
  }
}
