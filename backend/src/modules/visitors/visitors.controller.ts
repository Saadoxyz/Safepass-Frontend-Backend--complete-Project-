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
import { VisitorsService } from './visitors.service';
import type {
  TodayStats,
  WeeklyTrend,
  VisitorFilters,
} from './visitors.service';
import { CreateVisitorDto } from './dto/create-visitor.dto';
import { UpdateVisitorDto } from './dto/update-visitor.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles, UserRole } from '../../common/decorators/roles.decorator';

// Define a proper request type
interface AuthenticatedRequest {
  user: {
    userId: string;
    email: string;
    role: string;
    sub?: string;
  };
}

@Controller('visitors')
export class VisitorsController {
  constructor(private visitorsService: VisitorsService) {}

  @Post()
  async create(@Body() createVisitorDto: CreateVisitorDto) {
    return this.visitorsService.create(createVisitorDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SECURITY)
  async findAll(@Query() filters: VisitorFilters) {
    return this.visitorsService.findAll(filters);
  }

  @Get('today-stats')
  @UseGuards(JwtAuthGuard)
  async getTodayStats(): Promise<TodayStats> {
    return this.visitorsService.getTodayStats();
  }

  @Get('weekly-trends')
  @UseGuards(JwtAuthGuard)
  async getWeeklyTrends(): Promise<WeeklyTrend[]> {
    return this.visitorsService.getWeeklyTrends();
  }

  @Get('host/pending')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.HOST)
  async getPendingForHost(@Request() req: AuthenticatedRequest) {
    const userId = req.user.userId || req.user.sub;
    return this.visitorsService.findPendingByHostId(userId!);
  }

  @Get('host/all')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.HOST)
  async getAllForHost(@Request() req: AuthenticatedRequest) {
    const userId = req.user.userId || req.user.sub;
    return this.visitorsService.findByHostId(userId!);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async findOne(@Param('id') id: string) {
    return this.visitorsService.findById(id);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  async update(
    @Param('id') id: string,
    @Body() updateVisitorDto: UpdateVisitorDto,
  ) {
    return this.visitorsService.update(id, updateVisitorDto);
  }

  @Put(':id/approve')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.HOST, UserRole.ADMIN)
  async approve(@Param('id') id: string) {
    return this.visitorsService.approve(id);
  }

  @Put(':id/reject')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.HOST, UserRole.ADMIN)
  async reject(@Param('id') id: string, @Body('reason') reason?: string) {
    return this.visitorsService.reject(id, reason);
  }

  @Put(':id/check-in')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SECURITY)
  async checkIn(@Param('id') id: string, @Body('gate') gate: string) {
    return this.visitorsService.checkIn(id, gate);
  }

  @Put(':id/check-out')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SECURITY)
  async checkOut(@Param('id') id: string) {
    return this.visitorsService.checkOut(id);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async delete(@Param('id') id: string) {
    await this.visitorsService.delete(id);
    return { message: 'Visitor deleted successfully' };
  }

  // Check-in/Check-out endpoints
  @Post(':id/check-in-record')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SECURITY)
  async recordCheckIn(
    @Param('id') visitorId: string,
    @Body() body: { cnic: string; gatePassNumber: string },
  ) {
    return this.visitorsService.recordCheckIn(
      visitorId,
      body.cnic,
      body.gatePassNumber,
    );
  }

  @Post(':id/check-out-record')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SECURITY)
  async recordCheckOut(@Param('id') visitorId: string) {
    return this.visitorsService.recordCheckOut(visitorId);
  }

  @Get('check-in-out/all')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SECURITY, UserRole.ADMIN)
  async getAllCheckInOut(@Query() filters: { status?: string; date?: string }) {
    return this.visitorsService.getAllCheckInOut(filters);
  }

  // Flagged visitors endpoints
  @Post(':id/flag')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SECURITY, UserRole.ADMIN)
  async flagVisitor(
    @Param('id') visitorId: string,
    @Body() body: { reason: string; notes?: string },
    @Request() req: AuthenticatedRequest,
  ) {
    const userId = req.user.userId || req.user.sub;
    return this.visitorsService.flagVisitor(
      visitorId,
      body.reason,
      userId!,
      body.notes,
    );
  }

  @Put('flag/:flagId/resolve')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SECURITY)
  async unflagVisitor(
    @Param('flagId') flagId: string,
    @Body('notes') notes?: string,
  ) {
    return this.visitorsService.unflagVisitor(flagId, notes);
  }

  @Get('flagged/all')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SECURITY, UserRole.ADMIN)
  async getFlaggedVisitors() {
    return this.visitorsService.getFlaggedVisitors();
  }

  // Suspicious reports endpoints
  @Post(':id/suspicious-report')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SECURITY, UserRole.ADMIN)
  async reportSuspicious(
    @Param('id') visitorId: string,
    @Body() body: { reason: string; notes?: string },
    @Request() req: AuthenticatedRequest,
  ) {
    const userId = req.user.userId || req.user.sub;
    const userName = req.user.email || 'Unknown';
    return this.visitorsService.reportSuspicious(
      visitorId,
      body.reason,
      userId!,
      userName,
      body.notes,
    );
  }

  @Get('suspicious/all')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SECURITY, UserRole.ADMIN)
  async getAllSuspiciousReports(@Query('status') status?: string) {
    return this.visitorsService.getAllSuspiciousReports({ status });
  }

  @Put('suspicious/:reportId/status')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SECURITY)
  async updateSuspiciousReportStatus(
    @Param('reportId') reportId: string,
    @Body() body: { status: string; resolutionNotes?: string },
  ) {
    return this.visitorsService.updateSuspiciousReportStatus(
      reportId,
      body.status,
      body.resolutionNotes,
    );
  }
}
