// src/settings/settings.controller.ts
import { Controller, Get, Put, Body, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles, UserRole } from '../common/decorators/roles.decorator';
import { UpdateVisitingHoursDto } from './dto/update-visiting-hours.dto';
import { SettingsService } from './settings.service';

@Controller('settings')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) {}

  @Get('visiting-hours')
  async getVisitingHours() {
    return this.settingsService.getVisitingHours();
  }

  @Put('visiting-hours')
  async updateVisitingHours(@Body() data: UpdateVisitingHoursDto) {
    return this.settingsService.updateVisitingHours(data);
  }
}
