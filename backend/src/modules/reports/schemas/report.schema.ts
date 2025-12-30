import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ReportDocument = Report & Document;

@Schema({ timestamps: true })
export class Report {
  @Prop({ type: Types.ObjectId, ref: 'Visitor', required: true })
  visitorId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  reporterId: Types.ObjectId;

  @Prop({ required: true })
  reason: string;

  @Prop()
  notes: string;

  @Prop({ required: true })
  incidentDate: Date;

  @Prop({ enum: ['pending', 'reviewed', 'resolved'], default: 'pending' })
  status: string;

  @Prop()
  visitorName: string;

  @Prop()
  reporterName: string;
}

export const ReportSchema = SchemaFactory.createForClass(Report);
