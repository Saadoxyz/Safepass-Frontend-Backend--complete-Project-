import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  Request,
  Res,
} from '@nestjs/common';
import type { Response } from 'express';
import { ReportsService } from './reports.service';
import { ExportService } from './services/export.service';
import { CreateReportDto } from './dto/create-report.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles, UserRole } from '../../common/decorators/roles.decorator';

// Define JWT payload interface
interface JwtPayload {
  userId: string;
  email: string;
  role: UserRole;
}

@Controller('reports')
@UseGuards(JwtAuthGuard)
export class ReportsController {
  constructor(
    private readonly reportsService: ReportsService,
    private readonly exportService: ExportService,
  ) {}

  @Post()
  @Roles(UserRole.SECURITY, UserRole.ADMIN)
  @UseGuards(RolesGuard)
  async create(
    @Body() createReportDto: CreateReportDto,
    @Request() req: { user: JwtPayload },
  ) {
    return this.reportsService.create(createReportDto, req.user.userId);
  }

  @Get('export/pdf')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SECURITY)
  async exportPDF(@Res() res: Response) {
    const visitors = await this.reportsService.getAllVisitorsForExport();
    return this.exportService.exportToPDF(visitors, res);
  }

  @Get('export/excel')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SECURITY)
  async exportExcel(@Res() res: Response) {
    const visitors = await this.reportsService.getAllVisitorsForExport();
    return this.exportService.exportToExcel(visitors, res);
  }

  @Get()
  @Roles(UserRole.ADMIN, UserRole.SECURITY)
  @UseGuards(RolesGuard)
  async findAll() {
    return this.reportsService.findAll();
  }

  @Get(':id')
  @Roles(UserRole.ADMIN, UserRole.SECURITY)
  @UseGuards(RolesGuard)
  async findOne(@Param('id') id: string) {
    return this.reportsService.findById(id);
  }

  @Put(':id/status')
  @Roles(UserRole.ADMIN)
  @UseGuards(RolesGuard)
  async updateStatus(@Param('id') id: string, @Body('status') status: string) {
    return this.reportsService.updateStatus(id, status);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  @UseGuards(RolesGuard)
  async delete(@Param('id') id: string) {
    await this.reportsService.delete(id);
    return { message: 'Report deleted successfully' };
  }
}
