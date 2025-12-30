// src/settings/schemas/visiting-hours.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type VisitingHoursDocument = VisitingHours & Document;

@Schema({ timestamps: true })
export class VisitingHours {
  @Prop({ required: true, default: '09:00' })
  startTime: string;

  @Prop({ required: true, default: '17:00' })
  endTime: string;

  @Prop({
    type: [String],
    required: true,
    default: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
  })
  days: string[];

  @Prop()
  specialHours?: Array<{
    date: Date;
    startTime: string;
    endTime: string;
    reason: string;
  }>;
}

export const VisitingHoursSchema = SchemaFactory.createForClass(VisitingHours);
