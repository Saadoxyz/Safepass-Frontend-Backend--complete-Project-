// src/settings/settings.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SettingsController } from './settings.controller';
import { SettingsService } from './settings.service';
import {
  VisitingHours,
  VisitingHoursSchema,
} from './schemas/visiting-hours.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: VisitingHours.name, schema: VisitingHoursSchema },
    ]),
  ],
  controllers: [SettingsController],
  providers: [SettingsService],
})
export class SettingsModule {}
