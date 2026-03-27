import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { MonitoringService } from './monitor.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('monitoring')
export class MonitoringController {
  constructor(private readonly monitoringService: MonitoringService) {}

  @Get('ping')
  ping() {
    return {
      message: 'Service is alive',
      data: {
        timestamp: new Date().toISOString(),
      },
    };
  }

  @Post('register')
  @UseGuards(JwtAuthGuard)
  async registerMonitor(@Body('url') url: string) {
    return this.monitoringService.registerNewMonitor(url);
  }
}
