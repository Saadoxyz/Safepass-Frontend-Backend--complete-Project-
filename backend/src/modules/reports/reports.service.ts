// src/modules/reports/reports.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Report, ReportDocument } from './schemas/report.schema';
import { CreateReportDto } from './dto/create-report.dto';

@Injectable()
export class ReportsService {
  constructor(
    @InjectModel(Report.name) private reportModel: Model<ReportDocument>,
    @InjectModel('Visitor') private visitorModel: Model<any>,
  ) {}

  async create(
    createReportDto: CreateReportDto,
    reporterId: string,
  ): Promise<Report> {
    const report = new this.reportModel({
      ...createReportDto,
      reporterId,
    });
    return report.save();
  }

  async findAll(): Promise<Report[]> {
    return this.reportModel
      .find()
      .populate('visitorId', 'name cnic')
      .populate('reporterId', 'name email')
      .exec();
  }

  async getAllVisitorsForExport(): Promise<any[]> {
    return this.visitorModel
      .find()
      .populate('hostId', 'name')
      .sort({ createdAt: -1 })
      .exec();
  }

  async findById(id: string): Promise<Report> {
    const report = await this.reportModel
      .findById(id)
      .populate('visitorId')
      .populate('reporterId')
      .exec();
    if (!report) {
      throw new NotFoundException('Report not found');
    }
    return report;
  }

  async updateStatus(id: string, status: string): Promise<Report> {
    const report = await this.reportModel
      .findByIdAndUpdate(id, { status }, { new: true })
      .exec();
    if (!report) {
      throw new NotFoundException('Report not found');
    }
    return report;
  }

  async delete(id: string): Promise<void> {
    const result = await this.reportModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException('Report not found');
    }
  }
}
