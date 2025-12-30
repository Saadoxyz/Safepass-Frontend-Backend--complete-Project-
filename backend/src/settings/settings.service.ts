// src/settings/settings.service.ts
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  VisitingHours,
  VisitingHoursDocument,
} from './schemas/visiting-hours.schema';
import { UpdateVisitingHoursDto } from './dto/update-visiting-hours.dto';

@Injectable()
export class SettingsService {
  constructor(
    @InjectModel(VisitingHours.name)
    private visitingHoursModel: Model<VisitingHoursDocument>,
  ) {}

  async getVisitingHours(): Promise<VisitingHoursDocument> {
    // Get existing or create default
    let visitingHours = await this.visitingHoursModel.findOne().exec();
    if (!visitingHours) {
      visitingHours = new this.visitingHoursModel({
        startTime: '09:00',
        endTime: '17:00',
        days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
      });
      await visitingHours.save();
    }

    return visitingHours;
  }

  async updateVisitingHours(
    data: UpdateVisitingHoursDto,
  ): Promise<VisitingHoursDocument> {
    let visitingHours = await this.visitingHoursModel.findOne().exec();

    if (!visitingHours) {
      visitingHours = new this.visitingHoursModel(data);
    } else {
      visitingHours.startTime = data.startTime;
      visitingHours.endTime = data.endTime;
      visitingHours.days = data.days;
    }

    return visitingHours.save();
  }
}
