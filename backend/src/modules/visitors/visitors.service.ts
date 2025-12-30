import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Visitor, VisitorDocument } from './schemas/visitor.schema';
import { CheckInOut, CheckInOutDocument } from './schemas/check-in-out.schema';
import {
  FlaggedVisitor,
  FlaggedVisitorDocument,
} from './schemas/flagged-visitor.schema';
import {
  SuspiciousReport,
  SuspiciousReportDocument,
} from './schemas/suspicious-report.schema';
import { CreateVisitorDto } from './dto/create-visitor.dto';
import { UpdateVisitorDto } from './dto/update-visitor.dto';
import { GatePassesService } from '../gate-passes/gate-passes.service';
import { EmailService } from '../email/email.service';
import { WebsocketGateway } from '../websocket/websocket.gateway';

// Export these interfaces
export interface TodayStats {
  total: number;
  pending: number;
  approved: number;
  checkedIn: number;
  rejected: number;
}

export interface WeeklyTrend {
  _id: number;
  count: number;
}

// Define filters interface
export interface VisitorFilters {
  status?: string;
  hostId?: string;
  date?: string;
  search?: string;
}

// Define MongoDB query interface
interface VisitorQuery {
  status?: string;
  hostId?: string;
  createdAt?: {
    $gte: Date;
    $lt: Date;
  };
  $or?: Array<{
    name?: { $regex: string; $options: string };
    email?: { $regex: string; $options: string };
    phone?: { $regex: string; $options: string };
    purpose?: { $regex: string; $options: string };
  }>;
}

@Injectable()
export class VisitorsService {
  constructor(
    @InjectModel(Visitor.name)
    private readonly visitorModel: Model<VisitorDocument>,
    @InjectModel(CheckInOut.name)
    private readonly checkInOutModel: Model<CheckInOutDocument>,
    @InjectModel(FlaggedVisitor.name)
    private readonly flaggedVisitorModel: Model<FlaggedVisitorDocument>,
    @InjectModel(SuspiciousReport.name)
    private readonly suspiciousReportModel: Model<SuspiciousReportDocument>,
    private readonly gatePassesService: GatePassesService,
    private readonly emailService: EmailService,
    private readonly websocketGateway: WebsocketGateway,
  ) {}

  async create(createVisitorDto: CreateVisitorDto): Promise<VisitorDocument> {
    // Ensure hostId is a valid ObjectId
    let hostId: Types.ObjectId | undefined;
    
    if (createVisitorDto.hostId) {
      if (Types.ObjectId.isValid(createVisitorDto.hostId)) {
        hostId = new Types.ObjectId(createVisitorDto.hostId);
      } else {
        throw new Error('Invalid hostId format');
      }
    }

    const visitorData = {
      ...createVisitorDto,
      hostId: hostId,
      status: 'pending',
    };

    const visitor = new this.visitorModel(visitorData);
    const savedVisitor = await visitor.save();

    console.log('Visitor created with hostId:', hostId?.toString());

    this.websocketGateway.notifyNewVisitorRequest(hostId?.toString() || createVisitorDto.hostId);

    await this.emailService.sendVisitorRequestEmail(
      savedVisitor.email,
      savedVisitor,
    );

    return savedVisitor;
  }

  async findAll(filters?: VisitorFilters): Promise<VisitorDocument[]> {
    // Build query from filters with proper typing
    const query: VisitorQuery = {};

    if (filters?.status) {
      query.status = filters.status;
    }

    if (filters?.hostId) {
      query.hostId = filters.hostId;
    }

    if (filters?.date) {
      const date = new Date(filters.date);
      date.setHours(0, 0, 0, 0);
      const nextDay = new Date(date);
      nextDay.setDate(date.getDate() + 1);

      query.createdAt = {
        $gte: date,
        $lt: nextDay,
      };
    }

    if (filters?.search) {
      const searchRegex = { $regex: filters.search, $options: 'i' } as const;
      query.$or = [
        { name: searchRegex },
        { email: searchRegex },
        { phone: searchRegex },
        { purpose: searchRegex },
      ];
    }

    try {
      return await this.visitorModel
        .find(query)
        .populate('hostId', 'name email')
        .exec();
    } catch (error) {
      // If there's a populate error (e.g., invalid ObjectId in hostId field),
      // return visitors without population as fallback
      console.error('Error populating hostId in findAll:', error);
      try {
        return await this.visitorModel.find(query).exec();
      } catch (fallbackError) {
        console.error('Error in findAll fallback:', fallbackError);
        return [];
      }
    }
  }

  async findById(id: string): Promise<VisitorDocument> {
    try {
      const visitor = await this.visitorModel
        .findById(id)
        .populate('hostId', 'name email')
        .exec();

      if (!visitor) {
        throw new NotFoundException('Visitor not found');
      }

      return visitor;
    } catch (error) {
      // If it's a NotFoundException, re-throw it
      if (error instanceof NotFoundException) {
        throw error;
      }
      
      // For other errors (like populate errors), try without population
      console.error('Error populating hostId in findById:', error);
      try {
        const visitor = await this.visitorModel.findById(id).exec();
        if (!visitor) {
          throw new NotFoundException('Visitor not found');
        }
        return visitor;
      } catch (fallbackError) {
        throw new NotFoundException('Visitor not found');
      }
    }
  }

  async findByHostId(hostId: string): Promise<VisitorDocument[]> {
    // Validate that hostId is a valid MongoDB ObjectId
    if (!hostId || hostId.trim() === '' || !Types.ObjectId.isValid(hostId)) {
      return [];
    }
    
    try {
      return await this.visitorModel.find({ hostId: new Types.ObjectId(hostId) }).exec();
    } catch (error) {
      console.error('Error finding visitors by hostId:', error);
      return [];
    }
  }

  async findPendingByHostId(hostId: string): Promise<VisitorDocument[]> {
    // Validate that hostId is a valid MongoDB ObjectId
    if (!hostId || hostId.trim() === '' || !Types.ObjectId.isValid(hostId)) {
      return [];
    }
    
    try {
      return await this.visitorModel.find({ hostId: new Types.ObjectId(hostId), status: 'pending' }).exec();
    } catch (error) {
      console.error('Error finding pending visitors by hostId:', error);
      return [];
    }
  }

  async update(
    id: string,
    updateVisitorDto: UpdateVisitorDto,
  ): Promise<VisitorDocument> {
    const visitor = await this.visitorModel
      .findByIdAndUpdate(id, updateVisitorDto, { new: true })
      .exec();

    if (!visitor) {
      throw new NotFoundException('Visitor not found');
    }

    this.websocketGateway.notifyVisitorStatusUpdate(visitor);

    return visitor;
  }

  async approve(id: string): Promise<VisitorDocument> {
    const visitor = await this.findById(id);

    const gatePass = await this.gatePassesService.create({
      visitorId: visitor._id.toString(),
    });

    visitor.status = 'approved';
    visitor.gatePassNumber = gatePass.gatePassNumber;
    visitor.qrCode = gatePass.qrCode;
    await visitor.save();

    await this.emailService.sendVisitorApprovalEmail(
      visitor.email,
      visitor,
      gatePass,
    );

    this.websocketGateway.notifyVisitorApproved(visitor);

    return visitor;
  }

  async reject(id: string, reason?: string): Promise<VisitorDocument> {
    const visitor = await this.visitorModel
      .findByIdAndUpdate(
        id,
        { status: 'rejected', notes: reason },
        { new: true },
      )
      .exec();

    if (!visitor) {
      throw new NotFoundException('Visitor not found');
    }

    await this.emailService.sendVisitorRejectionEmail(visitor.email, visitor);

    this.websocketGateway.notifyVisitorRejected(visitor);

    return visitor;
  }

  async checkIn(id: string, gate: string): Promise<VisitorDocument> {
    const visitor = await this.visitorModel
      .findByIdAndUpdate(
        id,
        { status: 'checked-in', checkInTime: new Date() },
        { new: true },
      )
      .exec();

    if (!visitor) {
      throw new NotFoundException('Visitor not found');
    }

    await this.gatePassesService.updateCheckIn(visitor._id.toString(), gate);

    this.websocketGateway.notifyVisitorCheckIn(visitor);

    return visitor;
  }

  async checkOut(id: string): Promise<VisitorDocument> {
    const visitor = await this.visitorModel
      .findByIdAndUpdate(
        id,
        { status: 'checked-out', checkOutTime: new Date() },
        { new: true },
      )
      .exec();

    if (!visitor) {
      throw new NotFoundException('Visitor not found');
    }

    await this.gatePassesService.updateCheckOut(visitor._id.toString());

    this.websocketGateway.notifyVisitorCheckOut(visitor);

    return visitor;
  }

  async delete(id: string): Promise<void> {
    const result = await this.visitorModel.findByIdAndDelete(id).exec();

    if (!result) {
      throw new NotFoundException('Visitor not found');
    }
  }

  async getTodayStats(): Promise<TodayStats> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const baseQuery = { createdAt: { $gte: today } };

    return {
      total: await this.visitorModel.countDocuments(baseQuery),
      pending: await this.visitorModel.countDocuments({
        ...baseQuery,
        status: 'pending',
      }),
      approved: await this.visitorModel.countDocuments({
        ...baseQuery,
        status: 'approved',
      }),
      checkedIn: await this.visitorModel.countDocuments({
        ...baseQuery,
        status: 'checked-in',
      }),
      rejected: await this.visitorModel.countDocuments({
        ...baseQuery,
        status: 'rejected',
      }),
    };
  }

  async getWeeklyTrends(): Promise<WeeklyTrend[]> {
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);

    return this.visitorModel.aggregate<WeeklyTrend>([
      { $match: { createdAt: { $gte: weekAgo } } },
      {
        $group: {
          _id: { $dayOfWeek: '$createdAt' },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);
  }

  // Check-in/Check-out management
  async recordCheckIn(
    visitorId: string,
    cnic: string,
    gatePassNumber: string,
  ): Promise<CheckInOutDocument> {
    const visitor = await this.findById(visitorId);

    const checkInRecord = new this.checkInOutModel({
      visitorId,
      visitorName: visitor.name,
      cnic,
      gatePassNumber,
      checkInTime: new Date(),
      status: 'checked-in',
    });

    const saved = await checkInRecord.save();
    await this.checkIn(visitorId, gatePassNumber);

    return saved;
  }

  async recordCheckOut(visitorId: string): Promise<CheckInOutDocument> {
    const checkInRecord = await this.checkInOutModel.findOne({
      visitorId,
      status: 'checked-in',
    });

    if (!checkInRecord) {
      throw new NotFoundException('No active check-in found');
    }

    checkInRecord.checkOutTime = new Date();
    checkInRecord.status = 'checked-out';
    const saved = await checkInRecord.save();

    await this.checkOut(visitorId);

    return saved;
  }

  async getAllCheckInOut(filters?: {
    status?: string;
    date?: string;
  }): Promise<CheckInOutDocument[]> {
    const query: Record<string, any> = {};

    if (filters?.status) {
      query.status = filters.status;
    }

    if (filters?.date) {
      const date = new Date(filters.date);
      date.setHours(0, 0, 0, 0);
      const nextDay = new Date(date);
      nextDay.setDate(date.getDate() + 1);

      query.createdAt = {
        $gte: date,
        $lt: nextDay,
      };
    }

    return this.checkInOutModel.find(query).sort({ checkInTime: -1 }).exec();
  }

  // Flagged visitors management
  async flagVisitor(
    visitorId: string,
    reason: string,
    userId: string,
    notes?: string,
  ): Promise<FlaggedVisitorDocument> {
    const visitor = await this.findById(visitorId);

    const flaggedVisitor = new this.flaggedVisitorModel({
      visitorId,
      visitorName: visitor.name,
      reason,
      flaggedBy: userId,
      notes,
      status: 'flagged',
    });

    const saved = await flaggedVisitor.save();
    // Notify flagged visitor via websocket
    try {
      this.websocketGateway.notifyVisitorFlagged(visitor);
    } catch (err) {
      // Log error but don't fail the operation
      console.error('WebSocket notification error:', err);
    }

    return saved;
  }

  async unflagVisitor(
    flagId: string,
    notes?: string,
  ): Promise<FlaggedVisitorDocument> {
    const flagged = await this.flaggedVisitorModel.findByIdAndUpdate(
      flagId,
      {
        status: 'resolved',
        resolvedAt: new Date(),
        resolvedNotes: notes,
      },
      { new: true },
    );

    if (!flagged) {
      throw new NotFoundException('Flagged visitor record not found');
    }

    return flagged;
  }

  async getFlaggedVisitors(): Promise<FlaggedVisitorDocument[]> {
    return this.flaggedVisitorModel
      .find({ status: 'flagged' })
      .populate('visitorId')
      .populate('flaggedBy', 'name email')
      .sort({ createdAt: -1 });
  }

  // Suspicious reports management
  async reportSuspicious(
    visitorId: string,
    reason: string,
    userId: string,
    userName: string,
    notes?: string,
  ): Promise<SuspiciousReportDocument> {
    const visitor = await this.findById(visitorId);

    const report = new this.suspiciousReportModel({
      visitorId,
      visitorName: visitor.name,
      reason,
      reportedBy: userId,
      reportedByName: userName,
      notes,
      status: 'reported',
    });

    const saved = await report.save();
    // Notify suspicious report via websocket
    try {
      this.websocketGateway.notifySuspiciousReport(visitor);
    } catch (err) {
      // Log error but don't fail the operation
      console.error('WebSocket notification error:', err);
    }

    return saved;
  }

  async getAllSuspiciousReports(filters?: {
    status?: string;
  }): Promise<SuspiciousReportDocument[]> {
    const query: { status?: string } = {};

    if (filters?.status) {
      query.status = filters.status;
    }

    return this.suspiciousReportModel
      .find(query)
      .populate('visitorId')
      .populate('reportedBy', 'name email')
      .sort({ createdAt: -1 });
  }

  async updateSuspiciousReportStatus(
    reportId: string,
    status: string,
    resolutionNotes?: string,
  ): Promise<SuspiciousReportDocument> {
    const report = await this.suspiciousReportModel.findByIdAndUpdate(
      reportId,
      {
        status,
        resolvedAt: status === 'resolved' ? new Date() : undefined,
        resolutionNotes,
      },
      { new: true },
    );

    if (!report) {
      throw new NotFoundException('Suspicious report not found');
    }

    return report;
  }
}
