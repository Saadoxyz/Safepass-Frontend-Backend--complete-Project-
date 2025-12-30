import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type SuspiciousReportDocument = HydratedDocument<SuspiciousReport>;

@Schema({ timestamps: true })
export class SuspiciousReport {
  @Prop({ type: Types.ObjectId, ref: 'Visitor', required: true })
  visitorId: Types.ObjectId;

  @Prop({ required: true })
  visitorName: string;

  @Prop({ required: true })
  reason: string;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  reportedBy: Types.ObjectId;

  @Prop({ required: true })
  reportedByName: string;

  @Prop()
  notes?: string;

  @Prop({
    enum: ['reported', 'investigating', 'resolved', 'dismissed'],
    default: 'reported',
  })
  status: string;

  @Prop()
  resolvedAt?: Date;

  @Prop()
  resolutionNotes?: string;
}

export const SuspiciousReportSchema =
  SchemaFactory.createForClass(SuspiciousReport);
