import { Controller, Get, Put, Param, UseGuards, Res } from '@nestjs/common';
import express from 'express';
import { GatePassesService } from './gate-passes.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles, UserRole } from '../../common/decorators/roles.decorator';

@Controller('gate-passes')
@UseGuards(JwtAuthGuard)
export class GatePassesController {
  constructor(private gatePassesService: GatePassesService) {}

  @Get()
  @Roles(UserRole.ADMIN, UserRole.SECURITY)
  @UseGuards(RolesGuard)
  async findAll() {
    return this.gatePassesService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.gatePassesService.findById(id);
  }

  @Get('number/:gatePassNumber')
  async findByNumber(@Param('gatePassNumber') gatePassNumber: string) {
    return this.gatePassesService.findByNumber(gatePassNumber);
  }

  @Get(':gatePassNumber/download')
  async downloadPDF(
    @Param('gatePassNumber') gatePassNumber: string,
    @Res() res: express.Response,
  ) {
    return this.gatePassesService.generatePDF(gatePassNumber, res);
  }

  @Put(':id/revoke')
  @Roles(UserRole.ADMIN, UserRole.SECURITY)
  @UseGuards(RolesGuard)
  async revoke(@Param('id') id: string) {
    return this.gatePassesService.revoke(id);
  }
}
